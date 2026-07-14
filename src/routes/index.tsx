import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/')({
  component: () => (
    <div className="py-8 text-center">
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle>🍳 ยินดีต้อนรับสู่ HomeKitchen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-zinc-500">ระบบตั้งค่าเสร็จสมบูรณ์แล้ว ลองกดปุ่มด้านล่างดูครับ</p>
          <Button onClick={() => alert('ใช้งานได้ปกติครับ!')}>
            ทดสอบปุ่ม Shadcn
          </Button>
        </CardContent>
      </Card>
    </div>
  ),
})