import { useEffect, useState, useMemo } from "react";
import { db } from "../utils/db";

const useCart = () => {
    const initialCart = () => {
        const localStorageCart = localStorage.getItem("cart");
        return localStorageCart ? JSON.parse(localStorageCart) : [];
      };
    
      const [data] = useState(db);
      const [cart, setCart] = useState(initialCart);
    
      const MAX_ITEMS = 5;
    
      useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
      }, [cart]);
    
      const addToCart = (item) => {
        const itemExist = cart.findIndex((guitar) => guitar.id === item.id);
        if (itemExist >= 0) {
          if (cart[itemExist].quantity >= MAX_ITEMS) return;
          const updatedCart = [...cart];
          updatedCart[itemExist].quantity++;
          setCart(updatedCart);
        } else {
          item.quantity = 1;
          setCart((prevCart) => [...prevCart, item]);
        }
      };
      const removeFromCart = (id) => {
        const deleteItem = cart.filter((guitar) => guitar.id !== id);
        setCart(deleteItem);
      };
      const decrement = (id) => {
        const modCart = cart.map((item) => {
          if (item.id === id && item.quantity > 1) {
            return {
              ...item,
              quantity: item.quantity - 1,
            };
          }
          return item;
        });
        setCart(modCart);
      };
      const increment = (id) => {
        const modCart = cart.map((item) => {
          if (item.id === id && item.quantity < MAX_ITEMS) {
            return {
              ...item,
              quantity: item.quantity + 1,
            };
          }
          return item;
        });
        setCart(modCart);
      };
    
      const clearCart = () => {
        setCart([]);
      };

      const isEmply = useMemo(() => cart.length === 0, [cart]);
  const cartTotal = useMemo(
    () => cart.reduce((total, item) => total + item.price * item.quantity, 0),
    [cart]
  );

      return{
        data, cart, addToCart, removeFromCart, increment, decrement, clearCart, isEmply, cartTotal
      }
}

export default useCart;