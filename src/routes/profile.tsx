import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent,   } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { UserCircle2, MapPin, Phone, Mail, Clock, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import { useCart } from '../hooks/useCart'

export const Route = createFileRoute('/profile')({
  component: ProfileComponent,
})
// eslint-disable-next-line react-refresh/only-export-components
function ProfileComponent() {
  const { orders } = useCart() // ดึงประวัติการสั่งซื้อจริงจาก context เดียวกับหน้า cart
  const [name, setName] = useState('Developer Student')
  const [email, setEmail] = useState('student@devbootcamp.com')
  const [phone, setPhone] = useState('089-123-4567')
  const [address, setAddress] = useState('123 Phraeksa, Samut Prakan, Thailand')
  const [isEditing, setIsEditing] = useState(false)

  const handleSave = () => {
    setIsEditing(false)
    toast.success('อัปเดตข้อมูลโปรไฟล์เรียบร้อยแล้ว!')
  }

  return (
    <div className="min-h-screen bg-zinc-50/50 pb-20">
      <main className="container mx-auto px-6 py-10 max-w-4xl space-y-8 text-left">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-950 tracking-tight">โปรไฟล์ของฉัน</h1>
          <p className="text-zinc-500 text-sm mt-1">จัดการประวัติ ข้อมูลติดต่อ และดูบันทึกประวัติการสั่งซื้ออาหาร</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* ข้อมูลโปรไฟล์ทั่วไป */}
          <Card className="md:col-span-5 rounded-3xl border border-zinc-200/80 bg-white shadow-sm overflow-hidden">
            <div className="h-24 bg-zinc-950 flex items-end justify-center pb-4 relative">
              <div className="w-20 h-20 bg-zinc-100 border-4 border-white rounded-full flex items-center justify-center text-zinc-600 absolute -bottom-10 shadow-sm">
                <UserCircle2 size={48} />
              </div>
            </div>
            
            <CardContent className="pt-14 px-6 pb-6 text-center space-y-4">
              {isEditing ? (
                <div className="space-y-3 text-left">
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="ชื่อ นามสกุล" className="rounded-xl" />
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="อีเมล" className="rounded-xl" />
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="เบอร์โทรศัพท์" className="rounded-xl" />
                  <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="ที่อยู่จัดส่ง" className="rounded-xl" />
                  <div className="flex gap-2 pt-2">
                    <Button onClick={handleSave} className="flex-1 rounded-full bg-zinc-950 text-white">บันทึก</Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1 rounded-full">ยกเลิก</Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div>
                    <h2 className="font-extrabold text-xl text-zinc-900">{name}</h2>
                    <div className="flex items-center justify-center gap-1.5 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full w-fit mx-auto mt-1 border border-emerald-100">
                      <ShieldCheck size={12} /> Verified Member
                    </div>
                  </div>

                  <div className="space-y-3 text-sm text-zinc-600 border-t pt-4 text-left">
                    <div className="flex items-center gap-2.5">
                      <Mail size={16} className="text-zinc-400" />
                      <span className="truncate">{email}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Phone size={16} className="text-zinc-400" />
                      <span>{phone}</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <MapPin size={16} className="text-zinc-400 mt-0.5 shrink-0" />
                      <span className="line-clamp-2">{address}</span>
                    </div>
                  </div>

                  <Button onClick={() => setIsEditing(true)} variant="outline" className="w-full rounded-full border-zinc-200">
                    แก้ไขข้อมูลส่วนตัว
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ประวัติการสั่งซื้อ */}
          <div className="md:col-span-7 space-y-4">
            <h3 className="font-bold text-lg text-zinc-900 flex items-center gap-2">
              <Clock size={18} className="text-zinc-400" /> ประวัติการทำรายการสั่งซื้อ
            </h3>

            {orders.length === 0 ? (
              <Card className="rounded-2xl border border-dashed border-zinc-200 bg-white">
                <CardContent className="py-10 text-center text-zinc-400 text-sm">
                  ยังไม่มีประวัติการสั่งซื้อ ลองไปเลือกเมนูที่หน้าแรกดูสิ
                </CardContent>
              </Card>
            ) : (
              orders.map((order) => (
                <Card key={order.id} className="rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
                  <CardContent className="p-5 flex justify-between items-center gap-4">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-zinc-900">{order.id}</span>
                        <span className="text-xs text-zinc-400">{order.date}</span>
                      </div>
                      <p className="text-sm text-zinc-600 font-medium truncate">
                        {order.items.map((item) => `${item.strMeal} x ${item.quantity}`).join(', ')}
                      </p>
                      <span className="text-xs font-bold text-zinc-900 block pt-0.5">
                        ยอดรวม: ฿{order.total.toFixed(2)}
                      </span>
                    </div>
                    <Badge className="bg-emerald-50 hover:bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full font-bold whitespace-nowrap">
                      {order.status}
                    </Badge>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}