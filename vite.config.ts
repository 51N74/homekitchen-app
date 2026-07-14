
import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'; // แก้เครื่องหมายคอมมาตรงนี้เป็นเซมิโคลอน
import path from 'path';
import { fileURLToPath } from 'url'; // เพิ่มตัวนี้เข้ามาเพื่อช่วยหาพาทปัจจุบัน

// จำลองค่า __dirname สำหรับโปรเจกต์ที่เป็น ESM module เพื่อให้หาโฟลเดอร์ src เจอชัวร์ๆ
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite(),
    react(),
    tailwindcss(),
    tsconfigPaths(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // บังคับฝังพาทจำลองให้ชี้เข้าโฟลเดอร์ src ตรงๆ ตัว
    },
  },
});