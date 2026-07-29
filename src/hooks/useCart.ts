import {useContext} from "react";
import {CartContext} from "../context/CartContext"

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart ต้องถูกเรียกใช้ภายใน <CartProvider> เท่านั้น");
  }
  return context;
}