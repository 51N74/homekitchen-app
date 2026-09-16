# HomeKitchen

A frontend product prototype exploring a food marketplace designed around a constraint that traditional food-delivery platforms often overlook: **home kitchens have limited production capacity.**

Instead of treating a kitchen as an unlimited food source, HomeKitchen explores what happens when **capacity, availability, and inventory become first-class parts of the ordering experience.**

> **Status:** Frontend prototype / product concept

## Why HomeKitchen?

Home-based food businesses operate differently from restaurants and large food chains.

A home kitchen may have a limited number of portions it can prepare in a day. When demand exceeds that capacity, the result can be over-ordering, ingredient shortages, delayed orders, or cancellations.

HomeKitchen was built to explore a simple product question:

**What would a food marketplace look like if kitchen capacity was part of the product model from the beginning?**

This project was originally built as a frontend project after completing the frontend portion of a full-stack development program.

## Product Concept

The prototype models a simplified relationship between:

```text
Kitchen Capacity
       ↓
Available Portions
       ↓
Availability
       ↓
Order Limits
       ↓
Cart
```

The goal is not to simulate a production marketplace, but to explore how a capacity-constrained food business could be represented through product design and frontend logic.

## What Works

* Dynamic food discovery using an external API
* Category-based browsing
* Client-side search and filtering
* Price and availability filters
* Product detail pages
* Shopping cart
* Quantity limits based on simulated availability
* Favorites
* Local persistence for cart and favorites
* Mock checkout flow
* Responsive interface
* Loading, empty, and unavailable states
* Toast notifications

## Capacity-Aware Ordering

One of the main ideas explored in the prototype is preventing customers from ordering beyond the available capacity.

The available quantity is simulated from the source data and enforced in the frontend.

For example:

```text
Available: 3 portions

Customer attempts:
1 → ✓
2 → ✓
3 → ✓
4 → ✕
```

This demonstrates the product logic behind a capacity-constrained marketplace, even though the underlying inventory is not connected to a real backend.

## Data

HomeKitchen uses [TheMealDB](https://www.themealdb.com/) as a source for recipe and meal information.

The project intentionally separates external data from simulated marketplace attributes.

| Data                       | Source                       |
| -------------------------- | ---------------------------- |
| Meal name                  | TheMealDB                    |
| Image                      | TheMealDB                    |
| Category                   | TheMealDB                    |
| Description / instructions | TheMealDB                    |
| Price                      | Simulated                    |
| Rating                     | Simulated                    |
| Stock / capacity           | Simulated                    |
| Availability               | Derived from simulated stock |
| Kitchen name               | Simulated                    |

This allows the frontend to demonstrate a realistic marketplace experience without requiring a backend or proprietary food database.

## Architecture

HomeKitchen is a **frontend-only application**.

```text
┌─────────────────────────────┐
│          React App          │
│                             │
│  Pages / Components / UI    │
│             │               │
│     ┌───────┴────────┐      │
│     ↓                ↓      │
│ TheMealDB        Local State│
│     │                │      │
│     ↓                ↓      │
│ Meal Data      Cart/Favorites│
│                      │      │
│                      ↓      │
│                  localStorage│
└─────────────────────────────┘
```

There is currently no:

* Backend API
* Database
* Authentication system
* Real payment processing
* Real inventory service
* Server-side order management

## Tech Stack

* React 19
* TypeScript
* Vite
* TanStack Router
* Tailwind CSS
* shadcn/ui
* Lucide React
* React Context API
* TheMealDB API
* Browser `localStorage`

## Key Frontend Architecture

### State Management

Global application state is handled with React Context:

* `CartContext` — cart and mock order state
* `FavoritesContext` — favorite items

Persistent client-side state is stored using `localStorage`.

### Routing

TanStack Router is used for application routing:

```text
/                  Home / Discovery
/menu/$menuId      Product Detail
/cart              Cart
/favorites         Favorites
/profile           Profile
/orders            Order History
```

### Data Fetching

Meal data is retrieved from TheMealDB using the native `fetch` API.

Category selection triggers a new API request, while search, price, and stock filtering are performed client-side over the fetched dataset.

## Important Prototype Limitations

This project is intentionally a frontend prototype, so several marketplace capabilities are simulated.

### Simulated Inventory

Stock and capacity are generated locally rather than retrieved from a real inventory system.

### Mock Checkout

Checkout creates a local mock order and clears the cart. It does not process a real transaction.

### Local User Profile

Profile information is managed in frontend state and is not connected to authentication or a user database.

### No Backend

There is no server-side business logic, database, authentication, payment system, or persistent order management.

### No Automated Tests

The current prototype does not include an automated test suite.

These limitations are part of the current scope rather than claims of production readiness.

## What I Wanted to Explore

The main purpose of this project was not simply to build another food-ordering interface.

I wanted to explore how a **business constraint could shape product design.**

For a home kitchen, the question is not only:

> "What food can customers order?"

It can also be:

> "How many orders can this kitchen realistically fulfill?"

HomeKitchen is an early exploration of that idea through frontend implementation.

## Future Direction

If developed beyond the prototype, the concept could evolve toward a real marketplace with:

* Kitchen accounts and profiles
* Real inventory and daily capacity
* Order lifecycle management
* Kitchen-level availability
* Customer accounts
* Payment processing
* Backend APIs and database
* Capacity-aware scheduling
* Notifications when capacity is reached
* Analytics for kitchen operators

These are potential directions rather than implemented features.

## Getting Started

Clone the repository and install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## Project Status

**Frontend prototype — completed**

The current version focuses on exploring the product concept and implementing the core customer-facing experience on the frontend.

It is not intended to represent a production-ready food marketplace.

## Author

Built as a frontend development project while exploring the intersection of **software development, product thinking, and real-world business constraints.**
