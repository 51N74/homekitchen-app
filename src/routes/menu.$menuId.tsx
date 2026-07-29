import { useState, useEffect } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Clock3, Star, Heart, Check, ChefHat, 
  BookOpen, Plus, Minus, BadgeCheck, AlertCircle 
} from 'lucide-react'
import { useCart } from '../hooks/useCart'
import { useFavorites } from '../hooks/useFavorites'
import { toast } from 'sonner'

// ฟังก์ชันคำนวณราคาคงที่จาก ID เพื่อให้ตรงกับหน้าแรก 100%
const getPriceFromId = (idMeal: string): number => {
  const numId = parseInt(idMeal) || 50000
  return 120 + ((numId % 11) * 15)
}

// ฟังก์ชันดึงจำนวนสต็อกคงเหลือจาก ID (ใช้สูตรเดียวกับหน้าแรกเป๊ะ ๆ เพื่อให้ตัวเลขตรงกันเสมอ)
const getStockFromId = (idMeal: string): number => {
  const numId = parseInt(idMeal) || 50000
  return numId % 6 // ผลลัพธ์ 0-5 ที่ (0 = สินค้าหมด) ตรงกับสูตรที่หน้าแรกใช้
}

export const Route = createFileRoute('/menu/$menuId')({
  component: MenuDetailComponent,
})

interface DetailedMeal {
  idMeal: string
  strMeal: string
  strMealThumb: string
  strCategory: string
  strArea: string
  strInstructions: string
  strKitchen: string
  fltPrice: number
  fltRating: string
  intPrepareMin: number
  intAvailableLeft: number
  ingredients: { name: string; measure: string }[]
}

// eslint-disable-next-line react-refresh/only-export-components
function MenuDetailComponent() {
  const { menuId } = Route.useParams()
  const { addToCart } = useCart()
  const { isFavorite, toggleFavorite } = useFavorites()
  const [meal, setMeal] = useState<DetailedMeal | null>(null)
  const [loading, setLoading] = useState(true)
  
  const [quantity, setQuantity] = useState(1)
  // ปรับให้ activeTab เริ่มต้นเป็น null (เพื่อซ่อนทั้งส่วนผสมและวิธีทำไว้ก่อน)
  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions' | null>(null)
  
  // จัดการ Dynamic Stock จำลองแบบ Realtime 
  const [currentStock, setCurrentStock] = useState(1)

  useEffect(() => {
    const fetchMealDetail = async () => {
      try {
        setLoading(true)
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${menuId}`)
        const data = await response.json()
        
        if (data.meals && data.meals[0]) {
          const m = data.meals[0]
          
          const ingredientsList = []
          for (let i = 1; i <= 20; i++) {
            const ingredient = m[`strIngredient${i}`]
            const measure = m[`strMeasure${i}`]
            if (ingredient && ingredient.trim() !== '') {
              ingredientsList.push({
                name: ingredient,
                measure: measure || 'to taste'
              })
            }
          }

          const calculatedPrice = getPriceFromId(m.idMeal)
          const initialStock = getStockFromId(m.idMeal)

          setMeal({
            idMeal: m.idMeal,
            strMeal: m.strMeal,
            strMealThumb: m.strMealThumb,
            strCategory: m.strCategory,
            strArea: m.strArea || 'International',
            strInstructions: m.strInstructions,
            strKitchen: `${m.strMeal.split(' ')[0]}'s Kitchen`,
            fltPrice: calculatedPrice,
            fltRating: '4.8',
            intPrepareMin: 25,
            intAvailableLeft: initialStock,
            ingredients: ingredientsList
          })

          setCurrentStock(initialStock)
        }
      } catch (error) {
        console.error('Error fetching meal detail:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMealDetail()
  }, [menuId])

  // แกล้งจำลอง Realtime Stock: หลังจากเปิดหน้านี้มา 5 วินาที สต็อกมีโอกาสลดลง 1 ชิ้น (ถ้าของมีมากกว่า 1)
  useEffect(() => {
    if (currentStock > 1) {
      const timer = setTimeout(() => {
        // สุ่มแบบมีชั้นเชิง ให้ดูเหมือนมีคนแย่งซื้อจริง ๆ ณ เวลานั้น
        setCurrentStock(prev => {
          const nextStock = prev - 1
          // ถ้าจำนวนที่เรากดเลือกซื้ออยู่มากกว่าสต็อกที่เหลือปัจจุบัน ให้ลดจำนวนสั่งซื้อลงมาเท่าสต็อกทันที
          if (quantity > nextStock) {
            setQuantity(nextStock)
          }
          return nextStock
        })
      }, 5000) // 5 วินาทีผ่านไป สต็อกหายไป 1 ชิ้น!

      return () => clearTimeout(timer)
    }
  }, [currentStock, quantity])

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-10 max-w-6xl space-y-8 animate-pulse">
        <Skeleton className="h-6 w-48 rounded-md" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Skeleton className="aspect-square rounded-3xl" />
          <div className="space-y-6">
            <Skeleton className="h-12 w-3/4 rounded-md" />
            <Skeleton className="h-6 w-1/4 rounded-md" />
            <Skeleton className="h-24 w-full rounded-md" />
          </div>
        </div>
      </div>
    )
  }

  if (!meal) {
    return (
      <div className="text-center py-20">
        <p className="text-zinc-500 text-lg">ไม่พบข้อมูลอาหารจานนี้</p>
        <Link to="/" className="text-orange-500 hover:underline mt-4 inline-block">กลับหน้าแรก</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50/50 pb-20">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-6 pt-6 max-w-6xl">
        <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
          <Link to="/" className="hover:text-zinc-600">Home</Link>
          <span>&gt;</span>
          <span className="hover:text-zinc-600">Explore</span>
          <span>&gt;</span>
          <span className="text-zinc-900 truncate">{meal.strMeal}</span>
        </div>
      </div>

      <main className="container mx-auto px-6 py-8 max-w-6xl space-y-10">
        {/* TOP LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* ฝั่งซ้าย: รูปภาพหลักเพียงรูปเดียว  */}
          <div className="lg:col-span-6">
            <div className="relative aspect-4/3 rounded-3xl overflow-hidden border border-zinc-200 bg-white shadow-sm">
              <img 
                src={meal.strMealThumb} 
                alt={meal.strMeal} 
                className="w-full h-full object-cover" 
              />
              <Button
                size="icon"
                onClick={() =>
                  toggleFavorite({
                    idMeal: meal.idMeal,
                    strMeal: meal.strMeal,
                    strMealThumb: meal.strMealThumb,
                    strCategory: meal.strCategory,
                    strKitchen: meal.strKitchen,
                    fltPrice: meal.fltPrice.toFixed(2),
                    fltRating: meal.fltRating,
                  })
                }
                className="absolute top-4 right-4 bg-white hover:bg-zinc-100 text-zinc-600 rounded-full shadow-md"
              >
                <Heart
                  size={20}
                  className={isFavorite(meal.idMeal) ? "text-red-500" : "text-zinc-400 hover:text-red-500 transition-colors"}
                  fill={isFavorite(meal.idMeal) ? "currentColor" : "none"}
                />
              </Button>
              <div className="absolute bottom-4 left-4 bg-black/60 text-white text-[10px] px-3 py-1 rounded-full font-mono">
                strMealThumb · TheMealDB API
              </div>
            </div>
          </div>

          {/* ฝั่งขวา: รายละเอียดเมนูและตัวเลือกซื้อ */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6 text-left">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Badge className="bg-zinc-900 hover:bg-zinc-950 text-white rounded-full px-3.5 py-1 text-xs">
                    {meal.strCategory}
                  </Badge>
                  {meal.strArea && (
                    <Badge variant="outline" className="text-zinc-500 rounded-full px-3.5 py-1 text-xs">
                      {meal.strArea}
                    </Badge>
                  )}
                </div>
                <span className="text-[10px] text-zinc-400 font-mono">/menu/{meal.idMeal}</span>
              </div>

              <div>
                <h1 className="text-4xl font-extrabold text-zinc-950 tracking-tight">{meal.strMeal}</h1>
                <p className="text-zinc-500 text-sm mt-1">{meal.strKitchen}</p>
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-zinc-500 pt-1 font-medium">
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={15} fill={i <= 4 ? "#fbbf24" : "none"} className={i <= 4 ? "text-amber-400" : "text-zinc-200"} strokeWidth={1.5} />
                  ))}
                  <span className="ml-1 text-zinc-800">{meal.fltRating}</span>
                  <span className="text-zinc-400 font-normal text-xs">(124 reviews)</span>
                </div>
                <span className="text-zinc-300">|</span>
                <div className="flex items-center gap-1">
                  <Clock3 size={15} className="text-zinc-400" />
                  {meal.intPrepareMin} min
                </div>
                <span className="text-zinc-300">|</span>
                <div className="flex items-center gap-1 text-blue-500 font-semibold">
                  <BadgeCheck size={16} />
                  Verified Kitchen
                </div>
              </div>

              <p className="text-zinc-600 text-sm leading-relaxed pt-2">
                A classic {(meal.strArea || 'international').toLowerCase()} street-food favourite — prepared with fresh ingredients, 
                blending sour, sweet, and savory elements into a delicious home-cooked experience.
              </p>
            </div>

            {/* กล่องควบคุมการสั่งซื้อ */}
            <div className="border border-zinc-200/80 bg-white rounded-3xl p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-4xl font-black text-zinc-950">{(meal.fltPrice * quantity).toFixed(0)}</span>
                  <span className="text-zinc-400 text-sm font-bold ml-1">บาท</span>
                </div>
                
                {/* สถานะสต็อกจำลอง */}
                <Badge className={`rounded-full px-3 py-1 font-bold flex items-center gap-1.5 border transition-all duration-500 ${
                  currentStock > 1 
                    ? 'bg-amber-50 text-amber-600 border-amber-200' 
                    : 'bg-red-50 text-red-600 border-red-200 animate-pulse'
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${currentStock > 1 ? 'bg-amber-500' : 'bg-red-600'}`} />
                  {currentStock > 0 ? `เหลืออีก ${currentStock} ที่` : 'สินค้าหมดชั่วคราว'}
                </Badge>
              </div>

              {/* ตัวบวก/ลบจำนวน (ถูกควบคุมโดยจำนวนสต็อกจริง ณ ขณะนั้น) */}
              <div className="flex items-center justify-between border-t border-b py-3 text-zinc-600">
                <span className="text-sm font-bold">จำนวน</span>
                <div className="flex items-center gap-4 bg-zinc-100 px-3 py-1.5 rounded-full">
                  <button 
                    disabled={quantity <= 1 || currentStock === 0}
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="hover:text-zinc-950 p-1 transition-colors disabled:opacity-30"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="font-bold text-sm w-4 text-center">
                    {currentStock === 0 ? 0 : quantity}
                  </span>
                  <button 
                    disabled={quantity >= currentStock || currentStock === 0}
                    onClick={() => setQuantity(q => q + 1)}
                    className="hover:text-zinc-950 p-1 transition-colors disabled:opacity-30"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* ปุ่มใส่ตะกร้า */}
              <div className="space-y-3">
                <Button 
                  disabled={currentStock === 0}
                  onClick={() => {
                    addToCart(
                      {
                        idMeal: meal.idMeal,
                        strMeal: meal.strMeal,
                        strMealThumb: meal.strMealThumb,
                        fltPrice: meal.fltPrice,
                        strKitchen: meal.strKitchen,
                        maxAvailable: currentStock, // จำกัดจำนวนในตะกร้าตามสต็อก ณ ขณะที่กดใส่ตะกร้า
                      },
                      quantity,
                    )
                    toast.success(`เพิ่ม ${meal.strMeal} x${quantity} ลงตะกร้าแล้ว`)
                  }}
                  className="w-full bg-zinc-950 hover:bg-zinc-800 text-white rounded-full py-6 font-bold text-base flex justify-between px-6 disabled:bg-zinc-300"
                >
                  <span>{currentStock === 0 ? 'สินค้าหมด' : 'ใส่ตะกร้า'}</span>
                  {currentStock > 0 && <span>฿{(meal.fltPrice * quantity).toFixed(2)}</span>}
                </Button>
                <p className="text-[10px] text-zinc-400 text-center flex items-center justify-center gap-1.5">
                  <Clock3 size={12} /> สต็อกจะถูกบล็อกไว้ 15 นาทีหลังจากกดใส่ตะกร้า
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* BOTTOM LAYOUT: แท็บส่วนผสม VS วิธีทำด้านล่าง */}
        <div className="border border-zinc-200 rounded-3xl bg-white overflow-hidden shadow-sm">
          <div className="flex border-b bg-zinc-50/30">
            <button 
              onClick={() => setActiveTab(activeTab === 'ingredients' ? null : 'ingredients')}
              className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${
                activeTab === 'ingredients' 
                  ? 'border-zinc-900 text-zinc-900 bg-white' 
                  : 'border-transparent text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50/50'
              }`}
            >
              <ChefHat size={18} />
              ส่วนผสม <span className="text-xs font-normal">/ Ingredients</span>
            </button>
            <button 
              onClick={() => setActiveTab(activeTab === 'instructions' ? null : 'instructions')}
              className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${
                activeTab === 'instructions' 
                  ? 'border-zinc-900 text-zinc-900 bg-white' 
                  : 'border-transparent text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50/50'
              }`}
            >
              <BookOpen size={18} />
              วิธีทำย่อ ๆ <span className="text-xs font-normal">/ Quick Instructions</span>
            </button>
          </div>

          {/* จัดการสลับเปิด/ปิดเนื้อหาของแท็บ (Collapse/Expand) */}
          <div className={`transition-all duration-300 ease-in-out ${activeTab ? 'max-h-250 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
            {activeTab && (
              <div className="p-8 text-left border-t border-zinc-100">
                {activeTab === 'ingredients' ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-zinc-700 text-lg">{meal.ingredients.length} ingredients</span>
                      <span className="text-[10px] text-zinc-400 font-mono">TheMealDB · strIngredient + strMeasure</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {meal.ingredients.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                          <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-zinc-200/50 rounded-full text-zinc-500">
                              <Check size={14} />
                            </div>
                            <span className="font-semibold text-sm text-zinc-800">{item.name}</span>
                          </div>
                          <Badge variant="secondary" className="bg-white text-zinc-600 font-medium border text-xs px-3 py-1">
                            {item.measure}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <span className="font-bold text-zinc-700 text-lg flex items-center gap-2">
                      <BookOpen size={20} className="text-zinc-500" /> Instructions
                    </span>
                    <p className="text-zinc-600 leading-relaxed text-sm whitespace-pre-wrap bg-zinc-50 p-6 rounded-2xl border border-zinc-100">
                      {meal.strInstructions}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ป้ายใบ้ให้คลิกขยายเมื่อเมนูถูกย่อไว้ */}
          {!activeTab && (
            <div className="p-8 text-center text-zinc-400 text-sm flex flex-col items-center justify-center gap-2 py-12 bg-zinc-50/20">
              <AlertCircle size={20} className="text-zinc-300" />
              <span>คลิกที่แท็บด้านบนเพื่อเลือกดู ส่วนผสม หรือ วิธีทำอาหาร</span>
            </div>
          )}
        </div>

      </main>
    </div>
  )
}