"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { count } from "console";
import CartItemBox from "@/components/CartItemBox";


interface CartItem {
  _id: string;
  BookID: string;
  BookName: string;
  BookImage: string;
  count: number;
  quantity: number;
}

const page = () => {
  const router = useRouter();
  useEffect(() => {
    const ifLoggedIn = localStorage.getItem("userId");

    if (!ifLoggedIn) {
      router.push("/login");
    }
  }, []);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [updatingItem, setUpdatingItem] = useState("");

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCart(prevCart => 
      prevCart.map(item => 
        item._id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
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

      setCart(data.cart);
      setIsLoading(false);
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
      console.log(data);
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

  useEffect(() => {
    fetchCartItems();
  }, []);
  return (
    <div>
      Cart page
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {error && <div className="text-red-500">{error}</div>}
          {cart.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 p-4">
              {cart.map((item: CartItem) => (
                <CartItemBox
                  key={item._id}
                  BookID={item.BookID}
                  BookName={item.BookName}
                  BookImage={item.BookImage}
                  count={item.count}
                  quantity={item.quantity}
                  _id={item._id}
                  onRefresh={fetchCartItems}
                />
              ))}
            </div>
          ) : (
            <p>No items in cart</p>
          )}
        </div>
      )}
    </div>
  );
};

export default page;
