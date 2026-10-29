# 🛒 RentKart — Peer-to-Peer Rental Marketplace

RentKart is a full-stack peer-to-peer rental marketplace application that allows users to discover, list, and rent items (cameras, tools, gaming consoles, bikes, event wear, electronics, and more) locally.

---

## 🌐 Live Deployment Links

> 💡 *Update these links once deployed to Vercel and Render:*

- **Frontend App**: [https://rentkart.vercel.app](https://rentkart.vercel.app) *(Deploy on Vercel)*
- **Backend API**: [https://rentkart-api.onrender.com/api/health](https://rentkart-api.onrender.com/api/health) *(Deploy on Render)*
- **Database**: MongoDB Atlas Cloud Cluster

---

## 🚀 Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Lucide Icons, Axios, React Router v6
- **Backend**: Node.js, Express, Prisma ORM, JWT, Bcrypt, Multer, Helmet
- **Database**: MongoDB Atlas Cloud Database
- **Storage & Mail**: Cloudinary (Image uploads), Nodemailer (OTP verification)

---

## 📁 Repository Structure

```
├── client/          # Frontend application (React + Vite + Tailwind CSS)
│   ├── src/
│   ├── index.html
│   ├── vercel.json  # SPA client routing rewrite rules
│   └── package.json
├── server/          # Backend REST API (Node.js + Express + Prisma)
│   ├── prisma/      # Prisma MongoDB schema & realistic seed scripts
│   ├── src/         # Controllers, services, routes, middleware
│   └── package.json
└── README.md
```

---

## 🔑 Demo Accounts (Pre-Seeded)

All demo accounts share the password: **`Demo@1234`**

| Role | Email |
| :--- | :--- |
| **Admin** | `admin@rentkart.com` |
| **Owner** | `owner1@rentkart.com` |
| **Renter** | `renter1@rentkart.com` |

---

## 🛠️ Local Development

### 1. Backend Setup
```bash
cd server
npm install
npx prisma generate
npm run dev
```

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.
