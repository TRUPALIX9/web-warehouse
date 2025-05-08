Here's the full and final `README.md` file for your **Warehouse Management System** GitHub repository. It includes all instructions, including the `dbScript.ts` execution command, MongoDB Atlas setup info, project structure, and feature overview:

---

````markdown
# 🏭 Warehouse Management System

A full-stack inventory and purchase order management system built using **Next.js 15 (App Router)**, **MongoDB Atlas**, **Mongoose**, **Tailwind CSS**, and **Material UI**. This system supports managing warehouse storage locations, inventory items, parties (vendors/suppliers), and purchase orders with dynamic pallets and real-time dashboard analytics.

---

## 📦 Features

- Add, update, and delete inventory items
- Assign items to a structured warehouse layout (unit > row > column)
- Create purchase orders with embedded pallets
- Differentiate between Vendor and Supplier transactions
- 3D item preview using **Three.js**
- Dashboard analytics using **ApexCharts**
- Role-ready architecture (Admin, Manager, Employee)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/warehouse-management-system.git
cd warehouse-management-system
````

### 2. Install All Dependencies

```bash
npm install
```

> All required packages are listed in `package.json` including `mongoose`, `@faker-js/faker`, `three`, `@mui/material`, `tailwindcss`, and `ts-node`.

### 3. Set Up MongoDB Atlas

Create a `.env.local` file and add your MongoDB URI:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/web-warehouse?retryWrites=true&w=majority
```

> Replace with your MongoDB Atlas credentials. The project is already configured to connect to the cloud database using this URI.

---

## 🧪 Optional: Seed the Database

To populate the database with mock data (items, parties, warehouse layout, and purchase orders):

```bash
npx ts-node --compiler-options '{"module":"commonjs","moduleResolution":"node"}' dbScript.ts
```

> This will insert:
>
> * 6 Parties (3 vendors + 3 suppliers)
> * 1 Warehouse with 3 Units > 3 Rows > 3 Columns
> * 50 Items with randomized storage and dimensions
> * 10 Purchase Orders with pallet embedding

---

## 🔧 Run the Development Server

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/                # All API routes (items, parties, POs)
│   ├── items/              # CRUD UI for inventory items
│   ├── purchase-orders/    # PO creation and completion views
│   ├── parties/            # Vendors and suppliers
│   ├── warehouse/          # Visual hierarchy browser
│   └── dashboard/          # Charts & analytics
├── components/             # Reusable UI components
├── context/                # Global loading/spinner state
├── lib/                    # MongoDB connection config
├── models/                 # Mongoose schemas (Item, Warehouse, Party, PO)
├── styles/                 # Tailwind & custom CSS
dbScript.ts                 # Seeder script for populating data
```

---

## 📄 System Pages

* **`/items/[id]`** – View and update item details and see 3D box preview
* **`/parties/[id]`** – View and edit supplier or vendor info
* **`/warehouse`** – Navigate warehouse structure (unit > row > column)
* **`/purchase-orders`** – View all POs categorized by vendor/supplier
* **`/purchase-orders/[id]`** – Inspect and complete individual POs
* **`/dashboard`** – Visual summary of stock, movement, and trends

---

## 📘 Learn More

* [Next.js Documentation](https://nextjs.org/docs)
* [MongoDB Atlas](https://www.mongodb.com/atlas)
* [Mongoose](https://mongoosejs.com/)
* [Tailwind CSS](https://tailwindcss.com/)
* [Material UI](https://mui.com/)
* [Three.js](https://threejs.org/)

---

## ☁️ Deploying on Vercel

Deploy your project instantly using [Vercel](https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app-readme).

---

## 👨‍💻 Author

**Trupal Patel**
M.S. Computer Science — CSU Channel Islands
📧 [trupal.work@gmail.com](mailto:trupal.work@gmail.com)

---

## 📄 License

This project is for educational and demonstration use. Contact the author for commercial licensing.

```

---

Let me know if you want me to generate this file directly in your project directory structure or export it as a `.md` file for download.
```
