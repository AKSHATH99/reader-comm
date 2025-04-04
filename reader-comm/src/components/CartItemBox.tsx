import React, { useState } from "react";
import { useRouter } from "next/navigation";

const CartItemBox = (item: CartItem & { onRefresh?: () => void }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [updatingItem, setUpdatingItem] = useState("");

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
      console.log(data);
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete cart item");
      }

      // Call the onRefresh callback if provided
      if (item.onRefresh) {
        item.onRefresh();
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete cart item"
      );
    } finally {
      setIsLoading(false);
    }
  };
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
      console.log(data);
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch cart items");
      }

      setIsLoading(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch cart items"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCount = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateCartItemInDB(itemId, newQuantity);
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
        body: JSON.stringify({
          userId,
          cartItemId: itemId,
          count: newQuantity,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update cart item");
      }

      // Call the onRefresh callback if provided
      if (item.onRefresh) {
        item.onRefresh();
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update cart item"
      );
    } finally {
      setUpdatingItem("");
    }
  };

  const handleBuyBook = async () => {
    try {
      const response = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 100*item.count }),
      });
      const data = await response.json();
      console.log("data in booking", data);
      if (!response.ok) {
        throw new Error(data.error || "Failed to create order");
      }
      console.log(
        "process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID",
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
      );
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "Book Purchase",
        description: `Purchase of ${item.BookName}`,
        order_id: data.id,
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const verifyResponse = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });
            const verifyData = await verifyResponse.json();
            console.log(verifyData);
            if (verifyData.success) {
              // Add order to database
              console.log("executing this hahaahahah");
              const orderResponse = await fetch("/api/orders/addOrder", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  amount: data.amount,
                  currency: data.currency,
                  userId: localStorage.getItem("userId"),
                  bookId: item.BookID,
                  status: "completed",
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                  price: 100, // You might want to get this from your book data
                }),
              });

              const orderData = await orderResponse.json();
              if (orderData.success) {
                alert("Payment successful and order placed!");
              } else {
                throw new Error("Failed to save order details");
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
    }
  };

  return (
    <div className="w-max max-w-3xl ">
      <div
        key={item._id}
        className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-md border border-gray-200"
      >
        <div className="flex flex-col items-center space-y-2">
          <img
            src={item.BookImage}
            alt={item.BookName}
            onClick={() => router.push(`/book/${item.BookID}`)}
            className="w-24 h-32 object-cover rounded-md shadow-sm cursor-pointer"
          />
          <button
            onClick={handleBuyBook}
            className="bg-blue-600 text-white px-4 py-1  rounded-md hover:bg-blue-700 transition-colors text-sm w-full"
          >
            Buy Book
          </button>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800">
            {item.BookName}
          </h3>
          <p className="text-sm text-gray-600 flex items-center gap-3 mt-2">
            Quantity:{" "}
            <button
              onClick={() => updateCartItemInDB(item._id, item.count + 1)}
              className="text-blue-500 hover:text-blue-700 bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center"
            >
              +
            </button>
            <span className="font-medium">{item.count}</span>
            <button
              onClick={() => updateCartItemInDB(item._id, item.count - 1)}
              className="text-red-500 hover:text-red-700 bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center"
            >
              -
            </button>
          </p>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => deleteCartItem(item._id)}
            className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

interface CartItem {
  _id: string;
  BookID: string;
  BookName: string;
  BookImage: string;
  count: number;
  quantity: number;
}

export default CartItemBox;
