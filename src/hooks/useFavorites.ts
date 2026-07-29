import { useContext } from "react";
import {FavoritesContext} from "../context/FavoritesContext"

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites ต้องถูกเรียกใช้ภายใน <FavoritesProvider> เท่านั้น");
  }
  return context;
}