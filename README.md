# Developer Information
Jothshana S M
Computer Science & Engineering Student
Passionate about fullstack development, product design, and impactful software!
contact: jothshana123@gmail.com

## 💸 Budget Tracker Application – Fullstack Project (React + Node + MongoDB)

Welcome to the **Budget Tracker App**, a full-fledged web application designed to help users **track, analyze, and manage their income and expenses** effectively. Built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js), it provides powerful features including:

✅ Expense category control
✅ Budget limits  
✅ Monthly and yearly analytics  
✅ Export reports (PDF, Excel)  
✅ Static chatbot financial assistant  

---

## 🌍 Live URLs (Dev)

- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000/api`

---

## 🧠 Core Features

- 🔐 **Authentication** (Register/Login using JWT)
- 🧾 **Transaction Management**: Add income/expense with date, amount, category, and note
- 📁 **Category Budgeting**: Fix expense category limits in %
- 📊 **Dashboard Analytics**:
  - Yearly and Monthly Income vs Expense
  - Pie Charts for category-wise spending
  - Line/Bar charts using Recharts
- 📤 **Reports**:
  - Export transaction data as PDF or Excel
  - View category/income/expense comparisons
- 🤖 **AI Assistant**:
  - Static chatbot to assist in budgeting and saving

---

## 🧾 Pages Overview (Frontend)

| Page           | Route            | Description |
|----------------|------------------|-------------|
| **Login**      | `/login`         | User login page |
| **Register**   | `/register`      | Create new account |
| **Dashboard**  | `/dashboard`     | Monthly/yearly summary with charts and tables |
| **Transactions** | `/transactions` | Add/view/edit/delete income/expense records |
| **Budget Fix** | `/budget-fix`    | Add/edit/delete categories and set percentage limits |
| **Reports**    | `/reports`       | Generate and export PDF/Excel reports |
| **Assistant**  | `/assistant`     | Static chatbot giving financial advice |

---

## 🗂️ Folder Structure

```
📁 root
├── 📁client # React Frontend
│ ├── 📁pages
│ ├── 📁components
│ ├── 📁context
│ └── main.jsx, App.jsx, etc.
│
├── 📁server # Express Backend
│ ├── 📁routes
│ ├── 📁controllers
│ ├── 📁models
│ ├── 📁middleware
│ └── server.js, .env

```

---

## 🧰 Tech Stack
### 🔹 Frontend

- React.js
- Tailwind CSS
- Material UI
- React Router
- Recharts
- Axios
- jsPDF & autoTable
- XLSX

---

### 🔹 Backend

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs
- dotenv, cors

---

## 📦 Backend API Overview
### 🔐 Auth API

| Method | Endpoint          | Description      |
|--------|-------------------|------------------|
| POST   | `/api/auth/register` | Register user |
| POST   | `/api/auth/login`    | Login user    |

---

### 💰 Transactions API

| Method | Endpoint                                      | Description                        |
|--------|-----------------------------------------------|------------------------------------|
| POST   | `/api/transactions`                           | Create a new transaction           |
| GET    | `/api/transactions`                           | Get all transactions               |
| GET    | `/api/transactions/by-month?month=YYYY-MM`   | Get transactions by month          |
| GET    | `/api/transactions/income`                   | Get income transactions            |
| GET    | `/api/transactions/expense`                  | Get expense transactions           |
| GET    | `/api/transactions/yearly-summary?year=YYYY` | Get income/expense summary         |

---

### 📁 Budget Categories API

| Method | Endpoint                       | Description                             |
|--------|--------------------------------|-----------------------------------------|
| POST   | `/api/budget-category`         | Add category (income/expense)           |
| GET    | `/api/budget-category/:type`   | Get categories by type                  |
| PUT    | `/api/budget-category/:id`     | Update category                         |
| DELETE | `/api/budget-category/:id`     | Delete category                         |

---

### 🧠 AI Chatbot API

| Method | Endpoint        | Description                    |
|--------|-----------------|--------------------------------|
| POST   | `/api/ai/chat`  | Get a static money-saving tip  |

---


