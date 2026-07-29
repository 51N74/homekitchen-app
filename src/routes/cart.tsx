import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Clock3 } from 'lucide-react'
import { toast } from 'sonner'
import { useCart } from "../hooks/useCart" // 1. ใช้ context กลางแทน state+localStorage ของตัวเอง

export const Route = createFileRoute('/cart')({
  component: CartComponent,
})

// eslint-disable-next-line react-refresh/only-export-components
function CartComponent() {
  // 2. ดึงทุกอย่างจาก context เดียวกับที่ Header และหน้า index ใช้
  const { cartItems, updateQuantity, removeItem, checkout } = useCart()

  const subtotal = cartItems.reduce((acc, item) => acc + (item.fltPrice * item.quantity), 0)
  const deliveryFee = cartItems.length > 0 ? 40 : 0
  const total = subtotal + deliveryFee

  const handleRemove = (idMeal: string) => {
    removeItem(idMeal)
    toast.success('ลบรายการออกจากตะกร้าเรียบร้อยแล้ว')
  }

  const handleCheckout = () => {
    toast.success('สั่งซื้ออาหารสำเร็จ! กำลังเตรียมจัดส่งอาหารร้อน ๆ ให้คุณ')
    checkout() // บันทึกเป็น order history + เคลียร์ตะกร้า ผ่าน context เดียวกัน
  }

  return (
    <div className="min-h-screen bg-zinc-50/50 pb-20">
      <main className="container mx-auto px-6 py-10 max-w-5xl space-y-8 text-left">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-950 tracking-tight">ตะกร้าสินค้าของคุณ</h1>
          <p className="text-zinc-500 text-sm mt-1">ตรวจสอบรายการอาหารและจำนวนที่ต้องการสั่งซื้อ</p>
        </div>

        {cartItems.length === 0 ? (
          <Card className="rounded-3xl border border-dashed py-16 text-center bg-white">
            <CardContent className="flex flex-col items-center gap-4 justify-center">
              <div className="p-4 bg-zinc-100 rounded-full text-zinc-400">
                <ShoppingBag size={32} />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-zinc-800">ไม่มีสินค้าในตะกร้าของคุณ</p>
                <p className="text-zinc-400 text-sm">ลองแวะดูเมนูอร่อย ๆ ในหน้าแรกก่อนนะ</p>
              </div>
              <Link to="/">
                <Button className="rounded-full bg-zinc-950 hover:bg-zinc-900 text-white gap-2 mt-2">
                  <ArrowLeft size={16} /> กลับไปเลือกอาหาร
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* รายการอาหารในตะกร้า */}
            <div className="lg:col-span-8 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.idMeal} className=" overflow-visible rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
                  <CardContent className="p-5 flex gap-4 items-center">
                    <img src={item.strMealThumb} alt={item.strMeal} className="w-20 h-20 rounded-xl object-cover border" />
                    
                    <div className="grow min-w-0 space-y-1">
                      <h3 className="font-extrabold text-zinc-900 truncate text-base">{item.strMeal}</h3>
                      <p className="text-xs text-zinc-400 truncate">{item.strKitchen}</p>
                      <span className="font-bold text-sm text-zinc-900 block">฿{(item.fltPrice * item.quantity).toFixed(2)}</span>
                    </div>

                    {/* ปุ่ม เพิ่ม/ลด จำนวน (ห้ามเกิน maxAvailable ที่อ้างอิงจากตอนกดใส่ตะกร้า) */}
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-3 bg-zinc-100 px-2.5 py-1 rounded-full">
                        <button
                          disabled={item.quantity <= 1}
                          onClick={() => updateQuantity(item.idMeal, -1)}
                          className="hover:text-zinc-950 p-0.5 disabled:opacity-30 disabled:hover:text-current"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="font-bold text-xs w-4 text-center">{item.quantity}</span>
                        <button
                          disabled={item.quantity >= item.maxAvailable}
                          onClick={() => updateQuantity(item.idMeal, 1)}
                          className="hover:text-zinc-950 p-0.5 disabled:opacity-30 disabled:hover:text-current"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="text-[10px] text-zinc-400">สั่งได้สูงสุด {item.maxAvailable} ที่</span>
                    </div>

                    {/* ปุ่มลบ */}
                    <Button variant="ghost" size="icon" onClick={() => handleRemove(item.idMeal)} className="text-zinc-400 hover:text-red-500 rounded-full">
                      <Trash2 size={18} />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* กล่องสรุปค่าใช้จ่าย */}
            <div className="lg:col-span-4 border border-zinc-200/80 bg-white rounded-3xl p-6 shadow-sm space-y-6">
              <h3 className="font-bold text-lg text-zinc-950 border-b pb-3">สรุปคำสั่งซื้อ</h3>
              
              <div className="space-y-3 text-sm text-zinc-600">
                <div className="flex justify-between">
                  <span>ค่าอาหารทั้งหมด</span>
                  <span className="font-semibold text-zinc-900">฿{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>ค่าส่งอาหาร</span>
                  <span className="font-semibold text-zinc-900">฿{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-base font-extrabold text-zinc-950">
                  <span>ราคารวมทั้งสิ้น</span>
                  <span>฿{total.toFixed(2)}</span>
                </div>
              </div>

              {/* ปุ่มชำระเงิน */}
              <Button onClick={handleCheckout} className="w-full bg-zinc-950 hover:bg-zinc-800 text-white rounded-full py-6 font-bold text-base">
                สั่งซื้อและชำระเงิน
              </Button>

              <p className="text-[10px] text-zinc-400 text-center flex items-center justify-center gap-1.5">
                <Clock3 size={12} /> อาหารร้อน ๆ จัดส่งถึงคุณในเวลาประมาณ 25-35 นาที
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}