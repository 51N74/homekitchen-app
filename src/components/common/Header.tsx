import { useState, useEffect } from "react"; // 1. เพิ่ม useState และ useEffect
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { Home, Search, Heart, UserCircle2, ShoppingCart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "../../hooks/useCart"; // 4. ใช้ Context แทน Zustand

export function Header() {
  const navigate = useNavigate();
  const search = useSearch({ from: "__root__" }) as { q?: string };

  // 1. อ่านจำนวนสินค้าจาก Context กลาง
  const { itemCount } = useCart();

  // 2. อ่านค่า URL Search Params
  const urlSearch = search.q || "";

  // 3. สร้าง Local State และบันทึกค่า URL Search ครั้งก่อนหน้าไว้เปรียบเทียบ
  const [localSearch, setLocalSearch] = useState(urlSearch);
  const [prevUrlSearch, setPrevUrlSearch] = useState(urlSearch);

  // 4. ซิงค์ค่าจาก URL กลับมาที่ช่องพิมพ์แบบ Render Phase Adjustment (ไม่ต้องใช้ useEffect)
  if (urlSearch !== prevUrlSearch) {
    setPrevUrlSearch(urlSearch);
    setLocalSearch(urlSearch);
  }

  // 5. ใช้ useEffect ทำระบบ Debounce ส่งค่าไปเปลี่ยน URL เมื่อผู้ใช้หยุดพิมพ์ 300ms
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      // อัปเดต URL เฉพาะเมื่อค่า localSearch ไม่ตรงกับ urlSearch ปัจจุบัน
      if (localSearch !== urlSearch) {
        navigate({
          to: "/",
          search: (old: Record<string, unknown>) => ({
            ...old,
            q: localSearch || undefined,
          }),
          replace: true,
        });
      }
    }, 300); // หน่วงเวลา 300ms

    return () => clearTimeout(delayDebounceFn);
  }, [localSearch, urlSearch, navigate]);

  return (
    <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between h-16">
        {/* Logo & Navigation */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-zinc-950 text-white rounded-xl group-hover:bg-orange-500 transition-colors">
              <Home size={20} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col hidden sm:flex">
              <span className="font-bold text-lg leading-tight text-zinc-900">
                HomeKitchen
              </span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-wide">
                HOME-COOKED MEALS
              </span>
            </div>
          </Link>
        </div>

        {/* Search Bar (ปรับมาผูกกับ localSearch แทน) */}
        <div className="relative w-full max-w-md mx-4 grow sm:flex-initial">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
            size={16}
          />
          <Input
            type="text"
            placeholder="Search recipes or kitchens..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)} // พิมพ์ปุ๊บเปลี่ยนแค่ State ในนี้ ไม่ทำหน้าจอค้าง
            className="pl-10 pr-4 py-5 rounded-full bg-zinc-100 border-zinc-200 focus:ring-zinc-300 focus:border-zinc-300 text-sm"
          />
        </div>

        {/* User Actions */}

        <div className="flex items-center gap-2 text-zinc-600">
          {/* ปุ่มโปรไฟล์ */}
          <Link to="/profile">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-zinc-600"
            >
              <UserCircle2 size={24} />
            </Button>
          </Link>

          {/* ปุ่มรายการโปรด (รูปหัวใจ) */}
          <Link to="/favorites">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-zinc-600"
            >
              <Heart size={24} />
            </Button>
          </Link>

          {/* ปุ่มตะกร้า */}
          <Link to="/cart" className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-zinc-600"
            >
              <ShoppingCart size={24} />
            </Button>
            {/* 6. โชว์ badge เฉพาะตอนมีของในตะกร้าแล้วเท่านั้น */}
            {itemCount > 0 && (
              <Badge className="absolute -top-1 -right-1 bg-zinc-900 text-white rounded-full px-1.5 py-0.5 text-[10px]">
                {itemCount}
              </Badge>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}