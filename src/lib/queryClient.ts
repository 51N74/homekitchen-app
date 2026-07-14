// src/lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // ปิดไว้ก่อนจะได้ไม่ยิง API ซ้ำซ้อนตอนสลับหน้าจอ
      staleTime: 1000 * 60 * 5,    // เก็บข้อมูลไว้เป็นสถานะ "สดใหม่" 5 นาที
    },
  },
})