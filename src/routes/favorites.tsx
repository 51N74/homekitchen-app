import { Link } from '@tanstack/react-router'
import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Star, Heart, MapPin } from 'lucide-react'
import { toast } from 'sonner'
import { useFavorites } from '../hooks/useFavorites' // ใช้ context กลางแทน state+localStorage ของตัวเอง

export const Route = createFileRoute('/favorites')({
  component: FavoritesComponent,
})

// eslint-disable-next-line react-refresh/only-export-components
function FavoritesComponent() {
  const { favorites, removeFavorite } = useFavorites()

  const handleRemove = (idMeal: string, e: React.MouseEvent) => {
    e.preventDefault() // ป้องกันไม่ให้ลิงก์ดีดไปหน้าอื่นตอนกดลบหัวใจ
    removeFavorite(idMeal)
    toast.success('ลบออกจากรายการที่ชอบแล้ว')
  }

  return (
    <div className="min-h-screen bg-zinc-50/50 pb-20">
      <main className="container mx-auto px-6 py-10 max-w-6xl space-y-8 text-left">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-950 tracking-tight">รายการโปรดของคุณ</h1>
          <p className="text-zinc-500 text-sm mt-1">เมนูโปรดและครัวที่คุณกดบันทึกหัวใจไว้ทั้งหมด</p>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-20 text-zinc-400 border border-zinc-200 bg-white rounded-3xl flex flex-col items-center gap-4 max-w-md mx-auto">
            <Heart size={40} className="text-zinc-300" />
            <div className="space-y-1">
              <p className="font-bold text-zinc-800">ไม่มีรายการโปรด</p>
              <p className="text-zinc-400 text-xs">คุณยังไม่ได้กดชื่นชอบเมนูใด ๆ เลยในตอนนี้</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((meal) => (
              <Link key={meal.idMeal} to="/menu/$menuId" params={{ menuId: meal.idMeal }} className="block">
                <Card className="overflow-hidden rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-all cursor-pointer bg-white flex flex-col h-full relative group">
                  <div className="relative aspect-16/10 overflow-hidden">
                    <img src={meal.strMealThumb} alt={meal.strMeal} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    
                    {/* ปุ่มถอนการบันทึกรายการโปรด */}
                    <Button 
                      size="icon" 
                      onClick={(e) => handleRemove(meal.idMeal, e)} 
                      className="absolute top-3 right-3 bg-white/95 hover:bg-zinc-100 text-red-500 rounded-full shadow-md z-10"
                    >
                      <Heart size={18} fill="currentColor" />
                    </Button>
                  </div>

                  <CardHeader className="p-6 pb-4 space-y-1 grow">
                    <div className="flex items-center justify-between gap-3">
                      <CardTitle className="text-lg font-extrabold text-zinc-950 line-clamp-1">{meal.strMeal}</CardTitle>
                      <span className="font-extrabold text-xl text-zinc-950 whitespace-nowrap">฿{meal.fltPrice}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-zinc-500">
                      <MapPin size={14} className="text-amber-500" />
                      <span className="truncate">{meal.strKitchen}</span>
                    </div>
                  </CardHeader>

                  <CardContent className="px-6 pb-6  flex justify-between items-center border-t border-zinc-50 pt-4">
                    <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{meal.strCategory}</span>
                    <div className="flex items-center gap-1 text-sm font-bold text-amber-500">
                      <Star size={14} fill="currentColor" className="text-amber-400" />
                      {meal.fltRating}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}