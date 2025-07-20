# 💜 Secure MERN Authentication App (Cookie-Based Auth with OTP Verification)

A full-stack authentication system built with **React + Node.js + MongoDB + Zustand**, featuring robust **cookie-based authentication**, **OTP email verification**, and a beautifully styled UI using **ShadCN + TailwindCSS**.

---

## 📦 Tech Stack

| Tech                        | Role                                        |
| --------------------------- | ------------------------------------------- |
| **React.js**                | Frontend Library                            |
| **TypeScript**              | End-to-end type safety                      |
| **Zustand**                 | Lightweight global state manager            |
| **React Query**             | API data fetching, caching & syncing        |
| **Express.js**              | Backend server with RESTful APIs            |
| **Node.js**                 | Backend runtime                             |
| **MongoDB**                 | Database for user data storage              |
| **Nodemailer**              | Send secure OTPs via Email using Nodemailer |
| **ShadCN UI + TailwindCSS** | Modern & elegant UI kit                     |
| **HTTP-only Cookies + JWT** | Access & Refresh token-based Auth           |

---

## ✨ Features

- ✅ **Register / Login with Email OTP Verification**
- ✅ **Remember Me functionality**
- ✅ **Resend OTP with cooldown**
- ✅ **Forgot Password & Reset Password flows**
- ✅ **Access + Refresh Token Rotation**
- ✅ **Modular Codebase with Type Safety**
- ✅ **Fully Responsive & Styled UI**

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yokesh2584/SecureAuth.git
cd secure-auth-zustand
```

# Install frontend dependencies

```bash
cd client
yarn
#or
npm install
```

# Install backend dependencies

```bash
cd ../server
yarn
#or
npm install
```

### 🔐 Backend `.env`

- PORT=5000
- NODE_ENV="development"
- MONGODB_URI=your_mongodb_connection_string
- ACCESS_TOKEN_SECRET=your_access_token_secret
- REFRESH_TOKEN_SECRET=your_refresh_token_secret
- EMAIL_USER=your_email@example.com
- EMAIL_PASS=your_email_app_password
- CLIENT_URL=http://localhost:9000

# 🌐 Frontend (client/.env)

- VITE_API_URL=http://localhost:5000/api

⚠️ Make sure to configure CORS and cookies properly between frontend & backend.

### Run the App

# 🌀 Backend

```bash
cd server
yarn dev
#or
npm run dev
```

```
#or
```

```bash
# Build the Docker image
docker build -t secure-auth .

# Run the Docker container with your .env file
docker run -p 5000:5000 --env-file .env secure-auth

```

# 🌐 Frontend

```bash
cd client
yarn dev
#or
npm run dev
```

- Then open: http://localhost:9000

⚠️ You can configure port number for frontend in 'client/vite.config.ts' file.

---

## 📁 Project structure

```
secure-auth-zustand/
├── client/            # React + Zustand Frontend
│   ├── src/
│   │   ├── components/     # UI Components (Buttons, Inputs, etc.)
│   │   ├── pages/          # Auth pages (Login, Register, etc.)
│   │   ├── store/          # Zustand Global State Stores
│   │   ├── utils/          # Axios + API layers
│   │   ├── lib/            # Zod types for validations
│   │   └── main.tsx
│
├── server/            # Express + MongoDB Backend
│   ├── src/
│   │   ├── config/         # DB config
│   │   ├── models/         # DB Models & Schemas
│   │   ├── controllers/    # Route logic
│   │   ├── routes/         # API endpoints
│   │   ├── types/          # Global TS types
│   │   ├── utils/          # Bcrypt, JWT, Email logic
│   │   ├── middlewares/    # Auth & error handling
│   │   └── server.ts
```

---

## 🔒 Auth Flow Summary

- Register/Login → User enters email → Receives OTP
- Verify OTP → Tokens generated → Cookies set (access + refresh)
- Access Token used for protected routes
- Refresh Token stored in HttpOnly cookie → rotates on expiration
- Forgot Password → OTP flow.

---

## 🌟 UI Screens (Highlights)

- 🎨 Styled with ShadCN Components using TailwindCSS
- 📲 Responsive across devices
- 🔢 OTP Input with 6-digit split fields
- 🔄 Cooldown timer for OTP resending
- 📦 Password Inputs with toggle visibility
- 🧑‍💼 Modal for viewing all users

---

## 🧡 Crafted with Love by YOKESH (me!) ☺️

This project is a personal full-stack masterpiece to showcase real-world **secure authentication**—built with clean architecture, modern tools, and a lot of love.

If you found this helpful, feel free to **fork, star ⭐, or contribute**!

---

## 🪄 Future Enhancements

- 🔐 Role-based access (admin vs user)
- 📸 Profile Picture Upload
- 🛈 Update Info
- 📋 Form animations, page transitions
- 🚀 Deployed live link (coming soon!)

---
