import { createContext,  useState, useEffect, type ReactNode } from "react";
import { toast } from "sonner";

export interface CartItem {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  fltPrice: number;
  quantity: number;
  strKitchen: string;
  maxAvailable: number; // จำนวนสต็อกสูงสุดที่สั่งได้ อ้างอิงจากตอนกดเพิ่มลงตะกร้า (มาจากหน้า Product Detail / หน้าแรก)
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: string;
}

interface CartContextType {
  cartItems: CartItem[];
  itemCount: number;
  orders: Order[];
  addToCart: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  updateQuantity: (idMeal: string, delta: number) => void;
  removeItem: (idMeal: string) => void;
  clearCart: () => void;
  checkout: () => void; // เคลียร์ตะกร้า + บันทึกเป็น order history
}

// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_STORAGE_KEY = "homekitchen_cart";
const ORDERS_STORAGE_KEY = "homekitchen_orders";

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() =>
    loadFromStorage(CART_STORAGE_KEY, []),
  );
  const [orders, setOrders] = useState<Order[]>(() =>
    loadFromStorage(ORDERS_STORAGE_KEY, []),
  )

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  // เพิ่มของลงตะกร้า โดยจำนวนรวมของเมนูนั้นจะไม่มีวันเกิน maxAvailable
  const addToCart = (item: Omit<CartItem, "quantity">, qty: number = 1) => {
    if (item.maxAvailable <= 0) {
      toast.error(`${item.strMeal} สินค้าหมดแล้ว`);
      return;
    }

    setCartItems((prev) => {
      const existing = prev.find((i) => i.idMeal === item.idMeal);

      if (existing) {
        const nextQty = Math.min(existing.quantity + qty, item.maxAvailable);
        if (nextQty === existing.quantity) {
          toast.error(`${item.strMeal} มีจำนวนครบตามสต็อกที่สั่งได้แล้ว`);
          return prev;
        }
        return prev.map((i) =>
          i.idMeal === item.idMeal ? { ...i, quantity: nextQty, maxAvailable: item.maxAvailable } : i,
        );
      }

      const initialQty = Math.min(qty, item.maxAvailable);
      return [...prev, { ...item, quantity: initialQty }];
    });
  };

  // ปรับจำนวนในหน้าตะกร้า (+/-) ห้ามเกิน maxAvailable ของรายการนั้น
  const updateQuantity = (idMeal: string, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.idMeal !== idMeal) return item;

        const nextQty = item.quantity + delta;

        if (delta > 0 && nextQty > item.maxAvailable) {
          toast.error(`${item.strMeal} สั่งได้สูงสุด ${item.maxAvailable} ที่`);
          return item;
        }

        return { ...item, quantity: Math.max(1, nextQty) };
      }),
    );
  };

  const removeItem = (idMeal: string) => {
    setCartItems((prev) => prev.filter((item) => item.idMeal !== idMeal));
  };

  const clearCart = () => setCartItems([]);

  // ยืนยันคำสั่งซื้อ: บันทึกลง order history แล้วค่อยเคลียร์ตะกร้า
  const checkout = () => {
    if (cartItems.length === 0) return;

    const total =
      cartItems.reduce((acc, item) => acc + item.fltPrice * item.quantity, 0) + 40; // รวมค่าส่ง

    const newOrder: Order = {
      id: `HK-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleDateString("th-TH", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      items: cartItems,
      total,
      status: "กำลังจัดส่ง",
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
  };

  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        itemCount,
        orders,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

