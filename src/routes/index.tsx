import { useState, useEffect } from "react";
import { createFileRoute, useSearch } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Clock3,
  Star,
  MapPin,
  Sparkles,
  ChevronDown,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useCart } from "../hooks/useCart"; 

interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string;
  strKitchen: string;
  fltPrice: string;
  fltRating: string;
  intPrepareMin: number;
  intAvailableLeft: number;
}

export const Route = createFileRoute("/")({
  component: function HomeComponent() {
    // ดึงค่าค้นหาจาก URL (ทำงานร่วมกับระบบ Debounce ใน Header)
    const search = useSearch({ from: "/" }) as { q?: string };
    const searchQuery = search.q || "";

    const [meals, setMeals] = useState<Meal[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [priceFilter, setPriceFilter] = useState<string>("all"); // 'all', 'under-150', '150-200', 'over-200'
    const [showAvailableOnly, setShowAvailableOnly] = useState<boolean>(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false); // สำหรับจำลองควบคุม Dropdown ราคาแบบง่าย

    // 2. ดึง action addToCart จาก Context กลาง (ตัวเดียวกับที่ Header อ่าน itemCount)
    const { addToCart } = useCart();

    // 1. ตั้งค่าเริ่มต้นที่ 'All' ตั้งแต่เปิดแอป
    const [selectedCategory, setSelectedCategory] = useState<string>("All");

    // รายชื่อหมวดหมู่ที่ใช้งานได้จริงจาก API (TheMealDB)
    const categories = [
      "All",
      "Beef",
      "Chicken",
      "Vegetarian",
      "Seafood",
      "Pasta",
      "Dessert",
    ];

    const getPriceFromId = (idMeal: string): number => {
      const numId = parseInt(idMeal) || 50000;
      return 120 + (numId % 11) * 15; // จะได้ราคาคงที่ระหว่าง 120 - 270 บาท
    };

    // 2. ฟังก์ชันดึงข้อมูลจาก API
    const fetchMeals = async (category: string) => {
      try {
        setLoading(true);
        let mealsData: Meal[] = [];

        if (category === "All") {
          // ดึง 3 หมวดหมู่หลักพร้อมกันเมื่อเลือก All
          const categoriesToFetch = ["Seafood", "Chicken", "Beef"];

          const promises = categoriesToFetch.map((cat) =>
            fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`)
              .then((res) => res.json())
              .then((data) => {
                return data.meals
                  ? data.meals.map((m: Meal) => ({ ...m, strCategory: cat }))
                  : [];
              }),
          );

          const results = await Promise.all(promises);
          // รวมทุกอาร์เรย์เข้าด้วยกัน แล้วจำกัดไว้ที่ 9 รายการแรก
          mealsData = results.flat().slice(0, 9);
        } else {
          // ดึงข้อมูลตรง ๆ ตามหมวดหมู่ที่เลือก (รวมถึง Vegetarian ด้วย เพราะมีจริงใน API)
          const response = await fetch(
            `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`,
          );
          const data = await response.json();
          mealsData = data.meals
            ? data.meals.map((m: Meal) => ({ ...m, strCategory: category }))
            : [];
        }

        // จำลองข้อมูลเสริม (Rating, เวลาเตรียมอาหาร, ราคา) สไตล์แอปส่งอาหาร
        const mealsWithMockData = mealsData.map((m: Meal, index: number) => {
          const calculatedPrice = getPriceFromId(m.idMeal).toFixed(2); // คำนวณราคาจาก ID ตรงๆ
          const calculatedStock = parseInt(m.idMeal) % 6;

          return {
            idMeal: m.idMeal,
            strMeal: m.strMeal,
            strMealThumb: m.strMealThumb,
            strCategory: m.strCategory,
            strKitchen: `${m.strMeal.split(" ")[0]}'s Kitchen`,
            fltPrice: calculatedPrice,
            fltRating: (4.5 + (index % 5) / 10).toFixed(1),
            intPrepareMin: 15 + (index % 4) * 5,
            intAvailableLeft: calculatedStock,
          };
        });
        setMeals(mealsWithMockData);
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลอาหาร:", error);
      } finally {
        setLoading(false);
      }
    };

    // เรียก API ใหม่ทุกครั้งที่หมวดหมู่เปลี่ยน
    useEffect(() => {
      fetchMeals(selectedCategory);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCategory]);

    const filteredMeals = meals.filter((meal) => {
      // 1. กรองด้วย Search Keyword (เดิม)
      const matchesSearch = meal.strMeal
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      // 2. กรองด้วยสถานะสต็อกคงเหลือ (อิงจากค่าจริงในวัตถุอาหาร)
      const matchesStock = !showAvailableOnly || meal.intAvailableLeft > 0;

      // 3. กรองด้วยช่วงราคา
      const price = parseFloat(meal.fltPrice);
      let matchesPrice = true;
      if (priceFilter === "under-150") matchesPrice = price < 150;
      else if (priceFilter === "150-200")
        matchesPrice = price >= 150 && price <= 200;
      else if (priceFilter === "over-200") matchesPrice = price > 200;

      return matchesSearch && matchesStock && matchesPrice;
    });

    return (
      <div className="min-h-screen bg-zinc-50/50 pb-16">
        <main className="container mx-auto px-6 py-10 space-y-10">
          {/* --- SECTION 1: HERO BANNER --- */}
          <div className="bg-zinc-950 text-white rounded-3xl px-12 py-10 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-lg">
            <div className="space-y-6 max-w-xl text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2 text-zinc-400 text-xs uppercase tracking-widest">
                <Sparkles size={14} className="text-amber-400" />
                DISCOVER TODAY
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.1]">
                Home-cooked meals, delivered fresh.
              </h1>
              
            </div>
            {/* Image Box */}
            <Skeleton className="w-full lg:w-[320px] h-55 rounded-3xl bg-zinc-800/50 flex items-center justify-center text-zinc-600 border border-zinc-800">
              <span className="font-mono text-xs uppercase tracking-widest">
                IMAGE
              </span>
            </Skeleton>
          </div>

          {/* --- SECTION 2: FILTER BAR  --- */}
          <Card className="rounded-3xl border border-zinc-200 shadow-sm overflow-visible">
            <CardContent className="px-7 py-6 flex flex-col items-start gap-4 overflow-visible">
              {/* ปุ่มหมวดหมู่สลับไปมาได้อย่างอิสระ */}
              <div className="flex items-center gap-2 flex-wrap justify-start">
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant="ghost"
                    onClick={() => {
                      setSelectedCategory(cat); // เซ็ต State ตรงไปตรงมา ไม่มีสับขาหลอก
                    }}
                    className={`rounded-full px-5 py-5 text-sm font-medium transition-all ${
                      selectedCategory === cat
                        ? "bg-zinc-900 text-white hover:bg-zinc-800"
                        : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
                    }`}
                  >
                    {cat}
                  </Button>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-start gap-6">
                {/* ตัวเลือกช่วงราคาแบบ Dropdown */}
                <div className="relative inline-block">
                  <Button
                    variant="outline"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="rounded-full px-4 py-5 text-sm text-zinc-600 border-zinc-200 gap-2 font-medium bg-white shadow-sm min-w-37.5 flex justify-between items-center"
                  >
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal size={16} className="text-zinc-400" />
                      <span className="text-zinc-700">
                        {priceFilter === "all" && "All Prices"}
                        {priceFilter === "under-150" && "Under ฿150"}
                        {priceFilter === "150-200" && "฿150 – ฿200"}
                        {priceFilter === "over-200" && "฿200+"}
                      </span>
                    </div>
                    <ChevronDown
                      size={16}
                      className="text-zinc-400 shrink-0"
                    />
                  </Button>

                  {/* Dropdown Menu - ลอยอิสระลงมาด้านล่างและเปลี่ยนโทนสีเป็นสีม่วง */}
                  {isDropdownOpen && (
                    <>
                      {/* Backdrop สำหรับคลิกพื้นที่ด้านนอกเพื่อปิดเมนู */}
                      <div
                        className="fixed inset-0 z-45"
                        onClick={() => setIsDropdownOpen(false)}
                      />

                      <div className="absolute left-0 mt-1 w-full min-w-40 bg-white border border-zinc-200 rounded-xl shadow-xl py-1 z-50 text-left overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
                        {[
                          { label: "All Prices", value: "all" },
                          { label: "Under ฿150", value: "under-150" },
                          { label: "฿150 – ฿200", value: "150-200" },
                          { label: "฿200+", value: "over-200" },
                        ].map((item) => (
                          <button
                            key={item.value}
                            onClick={() => {
                              setPriceFilter(item.value);
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full px-4 py-2 text-sm transition-colors text-left block font-medium ${
                              priceFilter === item.value
                                ? "bg-[#9b59b6] hover:bg-[#8e44ad] text-white" // สีม่วงตามแบบในรูปเมื่อเลือก Active
                                : "text-zinc-700 hover:bg-zinc-50"
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <div className="h-6 w-px bg-zinc-200" />

                {/* ส่วนเปิด-ปิด กรองเฉพาะสินค้าพร้อมส่ง */}
                <div className="flex items-center gap-3">
                  <Switch
                    id="available-only"
                    checked={showAvailableOnly}
                    onCheckedChange={(checked) => setShowAvailableOnly(checked)}
                    className="data-[state=checked]:bg-zinc-900"
                  />
                  <div className="flex flex-col text-left">
                    <Label
                      htmlFor="available-only"
                      className="font-bold text-zinc-800 text-sm cursor-pointer select-none"
                    >
                      Show Available Only
                    </Label>
                    <span className="text-[10px] text-zinc-400 font-medium">
                      แสดงเฉพาะที่ยังมีสต็อก
                    </span>
                  </div>
                </div>

                {/* แสดงจำนวนผลลัพธ์ที่ตรงกับฟิลเตอร์จริง */}
                <div className="text-sm text-zinc-500 font-semibold whitespace-nowrap ml-2">
                  <span className="font-extrabold text-zinc-900 mr-1">
                    {filteredMeals.length}
                  </span>
                  dishes found
                </div>
              </div>
            </CardContent>
          </Card>

          {/* --- SECTION 3: ALL DISHES & MAPPING --- */}
          <div className="space-y-6">
            <div className="text-left">
              <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900">
                All Dishes
              </h2>
              <CardDescription className="text-base text-zinc-500 mt-1">
                Freshly prepared by home chefs near you
              </CardDescription>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Skeleton
                    key={i}
                    className="h-112.5 w-full rounded-2xl bg-zinc-200"
                  />
                ))}
              </div>
            ) : filteredMeals.length === 0 ? (
              <div className="text-center py-16 text-zinc-400 border border-zinc-200 bg-white rounded-2xl flex flex-col items-center gap-4">
                <Search size={40} strokeWidth={1} />❌
                ไม่พบเมนูอาหารในหมวดหมู่นี้หรือจากคำค้นหาของคุณ
              </div>
            ) : (
              /* การ์ดอาหารที่ Redesign ตาม image_6.png */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMeals.map((meal) => (
                  <Link
                    key={meal.idMeal}
                    to="/menu/$menuId"
                    params={{ menuId: meal.idMeal }} // ส่งไอดีอาหารเข้าไปใน Dynamic route
                    className="block text-left"
                  >
                    <Card
                      key={meal.idMeal}
                      className="overflow-hidden rounded-2xl border border-zinc-200 shadow-sm group bg-white flex flex-col h-full"
                    >
                      {/* ส่วนของรูปภาพและแท็กซ้อนบนรูป */}
                      <div className="relative aspect-16/10 overflow-hidden">
                        <img
                          src={meal.strMealThumb}
                          alt={meal.strMeal}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        {/* แท็กบอกเวลาเตรียมอาหาร (ขวาบน) */}
                        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-xs font-semibold text-zinc-700 shadow-sm border border-zinc-100">
                          <Clock3 size={14} className="text-zinc-500" />
                          {meal.intPrepareMin} min
                        </div>

                        {/* แท็กบอกของเหลือ (ซ้ายบน) — เปลี่ยนข้อความ/สีตอนของหมด */}
                        <Badge
                          className={`absolute top-3 left-3 rounded-full px-3 py-1 font-semibold flex items-center gap-1.5 border ${
                            meal.intAvailableLeft > 0
                              ? "bg-red-100 text-red-600 hover:bg-red-100 border-red-200"
                              : "bg-zinc-200 text-zinc-500 hover:bg-zinc-200 border-zinc-300"
                          }`}
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              meal.intAvailableLeft > 0 ? "bg-red-600 animate-pulse" : "bg-zinc-400"
                            }`}
                          />
                          {meal.intAvailableLeft > 0
                            ? `เหลืออีก ${meal.intAvailableLeft} ที่`
                            : "สินค้าหมด"}
                        </Badge>
                      </div>

                      <CardHeader className="p-6 pb-4 space-y-1 grow text-left">
                        <div className="flex items-center justify-between gap-3">
                          <CardTitle className="text-xl font-extrabold text-zinc-950 line-clamp-1">
                            {meal.strMeal}
                          </CardTitle>
                          <span className="font-extrabold text-2xl text-zinc-950 whitespace-nowrap flex items-end">
                            <span className="text-lg font-bold mr-0.5">฿</span>
                            {meal.fltPrice}
                          </span>
                        </div>
                        <div className="flex items-center gap-2.5 text-sm text-zinc-500">
                          <MapPin
                            size={14}
                            className="text-amber-500 shrink-0"
                          />
                          <span className="line-clamp-1">
                            {meal.strKitchen}
                          </span>
                        </div>
                      </CardHeader>

                      <CardContent className="px-6 pb-6 pt-0 space-y-5">
                        {/* ส่วนแสดงคะแนนรีวิว */}
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <Star
                                key={i}
                                size={16}
                                fill={i <= 4 ? "#fbbf24" : "none"}
                                className={
                                  i <= 4 ? "text-amber-400" : "text-zinc-200"
                                }
                                strokeWidth={1.5}
                              />
                            ))}
                          </div>
                          <span className="text-base font-bold text-amber-500 whitespace-nowrap">
                            {meal.fltRating} / 5
                          </span>
                        </div>

                        {/* ปุ่มสั่งซื้อ */}
                        <Button
                          disabled={meal.intAvailableLeft === 0}
                          onClick={(e) => {
                            // ป้องกันไม่ให้คลิกปุ่มนี้แล้วโดน Link ทั้งการ์ดพาไปหน้า detail
                            e.preventDefault();
                            e.stopPropagation();
                            addToCart({
                              idMeal: meal.idMeal,
                              strMeal: meal.strMeal,
                              strMealThumb: meal.strMealThumb,
                              fltPrice: parseFloat(meal.fltPrice),
                              strKitchen: meal.strKitchen,
                              maxAvailable: meal.intAvailableLeft,
                            });
                          }}
                          className="w-full bg-zinc-950 hover:bg-zinc-800 text-white rounded-full py-6 font-semibold text-base gap-2 disabled:bg-zinc-300 disabled:cursor-not-allowed"
                        >
                          <Sparkles size={18} className="text-amber-400" />
                          {meal.intAvailableLeft === 0 ? "สินค้าหมด" : "Add to Cart"}
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    );
  },
});