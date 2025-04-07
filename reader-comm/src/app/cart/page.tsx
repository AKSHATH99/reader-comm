"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CartItemBox from "@/components/CartItemBox";

interface CartItem {
  _id: string;
  BookID: string;
  BookName: string;
  BookImage: string;
  count: number;
  quantity: number;
  price: number;
}

const CartPage = () => {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [updatingItem, setUpdatingItem] = useState("");
  const [orderLoading, setOrderLoading] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const ifLoggedIn = localStorage.getItem("userId");
    if (!ifLoggedIn) {
      router.push("/login");
    } else {
      fetchCartItems();
    }
  }, []);

  // Calculate total price and quantity
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.count), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.count, 0);

  const fetchCartItems = async () => {
    try {
      setIsLoading(true);
      setError("");

      const userId = localStorage.getItem("userId");
      if (!userId) {
        router.push("/login");
        return;
      }

      const response = await fetch("/api/user/viewCartItems", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch cart items");
      }

      setCart(data.cart);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch cart items"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCartItem = async (cartItemId: string) => {
    try {
      setIsLoading(true);
      setError("");

      const userId = localStorage.getItem("userId");
      if (!userId) {
        router.push("/login");
        return;
      }

      const response = await fetch("/api/user/removeFromCart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, cartItemId }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete cart item");
      }

      fetchCartItems();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete cart item"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const updateCartItemInDB = async (itemId: string, newQuantity: number) => {
    try {
      setUpdatingItem(itemId);
      setError("");
      
      const userId = localStorage.getItem("userId");
      if (!userId) {
        router.push("/login");
        return;
      }
      
      const response = await fetch("/api/user/updateCartCount", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, cartItemId: itemId, count: newQuantity }),
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update cart item");
      }
      
      fetchCartItems();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update cart item"
      );
    } finally {
      setUpdatingItem("");
    }
  };

  const handleCheckout = async () => {
    try {
      setOrderLoading(true);
      const userId = localStorage.getItem("userId");
      
      if (!userId) {
        router.push("/login");
        return;
      }
      
      // Create a Razorpay order for the total amount
      const response = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalPrice }), 
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to create order");
      }
      
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "Book Purchase",
        description: `Purchase of ${totalItems} items`,
        order_id: data.id,
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            // Verify payment
            const verifyResponse = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });
            
            const verifyData = await verifyResponse.json();
            
            if (verifyData.success) {
              // Create orders for each book in the cart
              const orderPromises = cart.map(item => {
                return fetch("/api/orders/addOrder", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    amount: item.price * item.count,
                    currency: data.currency,
                    userId: userId,
                    bookId: item.BookID,
                    quantity: item.count,
                    status: "completed",
                    razorpayOrderId: response.razorpay_order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpaySignature: response.razorpay_signature,
                    price: item.price,
                  }),
                }).then(res => res.json());
              });
              
              const orderResults = await Promise.all(orderPromises);
              const allSuccessful = orderResults.every(result => result.success);
              
              if (allSuccessful) {
                // Clear cart after successful purchase
                // This would require an API endpoint to clear the cart
                alert("Payment successful and orders placed!");
                
                // Redirect to orders page or show success message
                router.push("/orders");
              } else {
                throw new Error("Failed to save some order details");
              }
            } else {
              alert("Payment failed!");
            }
          } catch (error) {
            console.error("Payment verification failed", error);
            alert("Payment verification failed!");
          }
        },
        theme: { color: "#3399cc" },
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        throw new Error("Razorpay SDK not loaded");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to initiate payment");
    } finally {
      setOrderLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <p className="text-3xl text-themeColor font-bold mb-6">Your Cart</p>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-themeColor"></div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            {error && <div className="text-red-500 mb-4 p-3 bg-red-50 rounded">{error}</div>}
            
            {cart.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {cart.map((item: CartItem) => (
                  <CartItemBox
                    key={item._id}
                    BookID={item.BookID}
                    BookName={item.BookName}
                    BookImage={item.BookImage}
                    count={item.count}
                    quantity={item.quantity}
                    _id={item._id}
                    price={item.price}
                    onDelete={deleteCartItem}
                    onUpdateCount={updateCartItemInDB}
                    updatingItem={updatingItem === item._id}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-500 mb-4">Your cart is empty</p>
                <button 
                  onClick={() => router.push('/')}
                  className="bg-themeColor text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>
          
          {/* Order Summary */}
          {cart.length > 0 && (
            <div className="lg:w-1/3">
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  {cart.map(item => (
                    <div key={item._id} className="flex justify-between text-sm">
                      <span>{item.BookName} x {item.count}</span>
                      <span>${(item.price * item.count).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <div className="flex justify-between font-medium">
                    <span>Total Items:</span>
                    <span>{totalItems}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold mt-2">
                    <span>Total:</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
                
                <button
                  onClick={handleCheckout}
                  disabled={orderLoading}
                  className={`w-full bg-themeColor text-white py-3 rounded-md hover:bg-opacity-90 transition-colors ${
                    orderLoading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {orderLoading ? 'Processing...' : 'Proceed to Checkout'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CartPage;