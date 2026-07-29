import { createContext, useState, useEffect, type ReactNode } from "react";

import { toast } from "sonner";

export interface FavoriteItem {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string;
  strKitchen: string;
  fltPrice: string;
  fltRating: string;
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  isFavorite: (idMeal: string) => boolean;
  toggleFavorite: (item: FavoriteItem) => void;
  removeFavorite: (idMeal: string) => void;
}
// eslint-disable-next-line react-refresh/only-export-components
export const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);
const STORAGE_KEY = "homekitchen_favorites";

function loadFromStorage(): FavoriteItem[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => loadFromStorage());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const isFavorite = (idMeal: string) => favorites.some((f) => f.idMeal === idMeal);

  // กดหัวใจซ้ำที่เมนูเดิม = ถอนออกจากรายการโปรด (toggle)
  const toggleFavorite = (item: FavoriteItem) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.idMeal === item.idMeal);
      if (exists) {
        toast.success("ลบออกจากรายการที่ชอบแล้ว");
        return prev.filter((f) => f.idMeal !== item.idMeal);
      }
      toast.success("เพิ่มลงในรายการโปรดแล้ว");
      return [...prev, item];
    });
  };

  const removeFavorite = (idMeal: string) => {
    setFavorites((prev) => prev.filter((f) => f.idMeal !== idMeal));
  };

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

