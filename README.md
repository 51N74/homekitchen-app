<div align="center">

# 🍽️ HomeKitchen

**[🇹🇭 ภาษาไทย](#-ภาษาไทย) | [🇬🇧 English](#-english)**

---

</div>

---

## 🇹🇭 ภาษาไทย

<div align="center">

### HomeKitchen — สั่งอาหารโฮมเมดจากครัวใกล้บ้าน

แอปสั่งอาหารโฮมคุกที่ช่วยเชื่อมต่อผู้คนกับอาหารทำมือจากครัวในชุมชน  
สร้างด้วย **React 19**, **TypeScript**, **TailwindCSS v4**, และ **TanStack** ecosystem

</div>

---

### 📋 สารบัญ

- [ฟีเจอร์หลัก](#-ฟีเจอร์หลัก)
- [Tech Stack](#-tech-stack-th)
- [โครงสร้างโปรเจกต์](#-โครงสร้างโปรเจกต์)
- [การติดตั้งและรันโปรเจกต์](#-การติดตั้งและรันโปรเจกต์)
- [หน้าต่าง ๆ ในแอป](#-หน้าต่าง-ๆ-ในแอป)

---

### ✨ ฟีเจอร์หลัก

| ฟีเจอร์ | รายละเอียด |
|---|---|
| 🔍 **ค้นหาเมนู** | ค้นหาแบบ Real-time พร้อม Debounce 300ms ผ่าน URL Search Params |
| 🗂️ **กรองหมวดหมู่** | กรองเมนูตามหมวดหมู่ (Beef, Chicken, Vegetarian, Seafood, Pasta, Dessert) |
| 💰 **กรองราคา** | กรองตามช่วงราคา (ต่ำกว่า 150 / 150-200 / สูงกว่า 200 บาท) |
| 📦 **กรองสต็อก** | แสดงเฉพาะเมนูที่ยังมีพร้อมเสิร์ฟ |
| 🛒 **ตะกร้าสินค้า** | เพิ่ม/ลด/ลบรายการ พร้อมคำนวณราคารวมและค่าจัดส่ง |
| ❤️ **รายการโปรด** | กดบันทึกเมนูที่ชื่นชอบ ดูได้ทุกเมื่อ |
| 📄 **รายละเอียดเมนู** | ดูส่วนผสม วิธีทำ เรตติ้ง เวลาเตรียม และสต็อกแบบ Real-time |
| 👤 **โปรไฟล์** | แก้ไขข้อมูลส่วนตัว ดูประวัติการสั่งซื้อ |
| 📜 **ประวัติคำสั่งซื้อ** | บันทึกคำสั่งซื้อทั้งหมดหลัง Checkout |

---

### 🛠️ Tech Stack (TH)

**Frontend Core**
- [React 19](https://react.dev/) — UI Library พร้อม React Compiler
- [TypeScript ~6.0](https://www.typescriptlang.org/) — Type-safe JavaScript
- [Vite 8](https://vitejs.dev/) — Build tool และ Dev Server

**Routing & Data Fetching**
- [TanStack Router v1](https://tanstack.com/router) — Type-safe File-based Routing
- [TanStack Query v5](https://tanstack.com/query) — Server State Management

**UI & Styling**
- [TailwindCSS v4](https://tailwindcss.com/) — Utility-first CSS
- [shadcn/ui](https://ui.shadcn.com/) — Component Library (Base UI)
- [Lucide React](https://lucide.dev/) — Icon Library
- [Sonner](https://sonner.emilkowal.ski/) — Toast Notifications
- [Inter Variable Font](https://rsms.me/inter/) — Typography

**Form & Validation**
- [React Hook Form v7](https://react-hook-form.com/) — Form Management
- [Zod v4](https://zod.dev/) — Schema Validation

**State Management**
- React Context API — CartContext, FavoritesContext

---

### 📁 โครงสร้างโปรเจกต์

```
homekitchen-app/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   └── Header.tsx        # Header พร้อม Search Debounce + Cart Badge
│   │   └── ui/                   # shadcn/ui Components
│   ├── context/
│   │   ├── CartContext.tsx        # Global Cart State + Order History
│   │   └── FavoritesContext.tsx  # Global Favorites State
│   ├── hooks/
│   │   ├── useCart.ts            # Hook สำหรับ CartContext
│   │   └── useFavorites.ts       # Hook สำหรับ FavoritesContext
│   ├── lib/
│   │   └── queryClient.ts        # TanStack Query Client Config
│   ├── routes/
│   │   ├── __root.tsx            # Root Layout (Header + Providers)
│   │   ├── index.tsx             # หน้าแรก — รายการเมนูทั้งหมด
│   │   ├── menu.$menuId.tsx      # หน้ารายละเอียดเมนู (Dynamic Route)
│   │   ├── cart.tsx              # หน้าตะกร้าสินค้า
│   │   ├── favorites.tsx         # หน้ารายการโปรด
│   │   ├── profile.tsx           # หน้าโปรไฟล์และประวัติคำสั่งซื้อ
│   │   └── orders.tsx            # หน้าประวัติคำสั่งซื้อ
│   ├── routeTree.gen.ts          # Auto-generated Route Tree
│   ├── index.css                 # Global Styles
│   └── main.tsx                  # App Entry Point
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

### 🚀 การติดตั้งและรันโปรเจกต์

**ความต้องการของระบบ**
- Node.js >= 18
- pnpm (แนะนำ) หรือ npm

**ขั้นตอน**

```bash
# 1. Clone โปรเจกต์
git clone <repository-url>
cd homekitchen-app

# 2. ติดตั้ง Dependencies
pnpm install

# 3. รัน Development Server
pnpm dev
```

เปิดเบราว์เซอร์แล้วไปที่ `http://localhost:5173`

**คำสั่งอื่น ๆ**

```bash
pnpm build      # Build สำหรับ Production
pnpm preview    # Preview Production Build
pnpm lint       # ตรวจสอบ Code ด้วย ESLint
```

---

### 📱 หน้าต่าง ๆ ในแอป

| Route | หน้า | คำอธิบาย |
|---|---|---|
| `/` | หน้าแรก | แสดงเมนูทั้งหมด พร้อมค้นหาและกรอง |
| `/menu/:menuId` | รายละเอียดเมนู | ส่วนผสม วิธีทำ และเพิ่มลงตะกร้า |
| `/cart` | ตะกร้าสินค้า | จัดการรายการและ Checkout |
| `/favorites` | รายการโปรด | เมนูที่บันทึกไว้ |
| `/profile` | โปรไฟล์ | ข้อมูลส่วนตัวและประวัติคำสั่งซื้อ |

---

### 🗒️ หมายเหตุ

> ข้อมูลเมนูอาหารดึงมาจาก [TheMealDB API](https://www.themealdb.com/) (Open Source)  
> ราคา, เรตติ้ง และสต็อกสินค้าเป็นค่าจำลอง (Simulated) ที่คำนวณจาก Meal ID เพื่อให้ข้อมูลสอดคล้องกันทั้งแอป

---

<br/>

---

## 🇬🇧 English

<div align="center">

### HomeKitchen — Order Home-Cooked Meals from Local Kitchens

A food ordering app connecting people with home-cooked meals from community kitchens.  
Built with **React 19**, **TypeScript**, **TailwindCSS v4**, and the **TanStack** ecosystem.

</div>

---

### 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack-en)
- [Project Structure](#-project-structure)
- [Installation & Running](#-installation--running)
- [App Pages & Routes](#-app-pages--routes)

---

### ✨ Features

| Feature | Description |
|---|---|
| 🔍 **Real-time Search** | Instant search with 300ms debounce synced to URL Search Params |
| 🗂️ **Category Filter** | Filter meals by category (Beef, Chicken, Vegetarian, Seafood, Pasta, Dessert) |
| 💰 **Price Filter** | Filter by price range (Under ฿150 / ฿150–200 / Over ฿200) |
| 📦 **Stock Filter** | Show only currently available meals |
| 🛒 **Shopping Cart** | Add / adjust / remove items with auto-calculated subtotal and delivery fee |
| ❤️ **Favorites** | Save your favorite meals and access them anytime |
| 📄 **Meal Detail** | View ingredients, cooking instructions, rating, prep time, and live stock |
| 👤 **Profile** | Edit personal information and view order history |
| 📜 **Order History** | All past orders recorded after checkout |

---

### 🛠️ Tech Stack (EN)

**Frontend Core**
- [React 19](https://react.dev/) — UI Library with React Compiler enabled
- [TypeScript ~6.0](https://www.typescriptlang.org/) — Type-safe JavaScript
- [Vite 8](https://vitejs.dev/) — Lightning-fast build tool & dev server

**Routing & Data Fetching**
- [TanStack Router v1](https://tanstack.com/router) — Type-safe file-based routing
- [TanStack Query v5](https://tanstack.com/query) — Server state management & caching

**UI & Styling**
- [TailwindCSS v4](https://tailwindcss.com/) — Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) — Accessible component library (powered by Base UI)
- [Lucide React](https://lucide.dev/) — Beautiful open-source icons
- [Sonner](https://sonner.emilkowal.ski/) — Toast notification system
- [Inter Variable Font](https://rsms.me/inter/) — Modern typography

**Forms & Validation**
- [React Hook Form v7](https://react-hook-form.com/) — Performant form management
- [Zod v4](https://zod.dev/) — TypeScript-first schema validation

**State Management**
- React Context API — `CartContext` (cart + order history), `FavoritesContext`

---

### 📁 Project Structure

```
homekitchen-app/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   └── Header.tsx        # Sticky header with debounced search & cart badge
│   │   └── ui/                   # shadcn/ui components
│   ├── context/
│   │   ├── CartContext.tsx        # Global cart state + order history
│   │   └── FavoritesContext.tsx  # Global favorites state
│   ├── hooks/
│   │   ├── useCart.ts            # Consumer hook for CartContext
│   │   └── useFavorites.ts       # Consumer hook for FavoritesContext
│   ├── lib/
│   │   └── queryClient.ts        # TanStack Query client configuration
│   ├── routes/
│   │   ├── __root.tsx            # Root layout (Header + all Providers)
│   │   ├── index.tsx             # Home — full meal listing with filters
│   │   ├── menu.$menuId.tsx      # Meal detail page (dynamic route)
│   │   ├── cart.tsx              # Shopping cart & checkout
│   │   ├── favorites.tsx         # Saved favorites
│   │   ├── profile.tsx           # User profile & order history
│   │   └── orders.tsx            # Orders page
│   ├── routeTree.gen.ts          # Auto-generated route tree (TanStack Router)
│   ├── index.css                 # Global styles
│   └── main.tsx                  # Application entry point
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

### 🚀 Installation & Running

**Prerequisites**
- Node.js >= 18
- pnpm (recommended) or npm

**Steps**

```bash
# 1. Clone the repository
git clone <repository-url>
cd homekitchen-app

# 2. Install dependencies
pnpm install

# 3. Start the development server
pnpm dev
```

Open your browser and navigate to `http://localhost:5173`

**Other Commands**

```bash
pnpm build      # Build for production
pnpm preview    # Preview the production build locally
pnpm lint       # Lint the codebase with ESLint
```

---

### 📱 App Pages & Routes

| Route | Page | Description |
|---|---|---|
| `/` | Home | Browse all meals with search & filters |
| `/menu/:menuId` | Meal Detail | Ingredients, instructions & add-to-cart |
| `/cart` | Shopping Cart | Manage items & proceed to checkout |
| `/favorites` | Favorites | All saved favorite meals |
| `/profile` | Profile | Personal info & purchase history |

---

### 🗒️ Notes

> Meal data is fetched from [TheMealDB API](https://www.themealdb.com/) (Open Source).  
> Pricing, ratings, and stock levels are **simulated values** derived deterministically from each Meal ID to ensure data consistency across all pages.

---

<div align="center">

Made with ❤️ &nbsp;·&nbsp; HomeKitchen 2026

</div>
