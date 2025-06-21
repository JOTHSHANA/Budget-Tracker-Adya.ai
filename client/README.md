# 💰 Budget Tracker Frontend

This is the **frontend** of the Budget Tracker application built using **React.js** and **Tailwind CSS**. The app allows users to **track income and expenses**, **manage budget categories**, and **generate insightful reports** via charts and downloadable formats like PDF and Excel.

---

## 🌐 Project URL

- Frontend: `http://localhost:5173`

---

## 📸 Features

- 🔐 User Authentication (Login/Register)
- 📊 Dashboard with:
  - Monthly Income vs Expense
  - Category-wise Spending Pie Charts
  - Filter by Month or Year
- 🧾 Transactions Page to:
  - Add/Edit/Delete Transactions
  - Categorize by Income/Expense
- 📁 Budget Fix Page to:
  - Manage Budget Categories
  - Set Expense Limits (percentage-wise)
- 📤 Reports Page:
  - Download reports as PDF/CSV
  - Visual comparison charts
- 🤖 Static Chatbot for Savings Guidance

---

## 🧭 Pages & Routing

| Route            | Description                                                                 |
|------------------|-----------------------------------------------------------------------------|
| `/login`         | Login form for existing users                                               |
| `/register`      | Registration form for new users                                             |
| `/dashboard`     | Dashboard summary of income, expense, charts                                |
| `/transactions`  | Form to add/view transactions                                               |
| `/budget-fix`    | Manage income and expense categories, fix percentage limits                 |
| `/reports`       | Generate, visualize, and export reports                                     |
| `/assistant`     | Simple chatbot assistant for financial tips                                 |

---

## 📁 Folder Structure Overview
``` Folder structure
📁client
├── 📁public
├── 📁src
│ ├── App.jsx, App.css, main.jsx, index.css
│ ├── 📁assets
│ ├── 📁context
│ │ └── AuthContext.jsx
│ ├── 📁components
│ │ ├── 📁dashboard
│ │ ├── 📁layout
│ │ ├── 📁reports
│ │ └── ProtectedRoute.jsx
│ ├── 📁pages
│ │ ├── 📁Dashboard
│ │ ├── Login.jsx, Register.jsx
│ │ ├── BudgetFix.jsx
│ │ ├── Transactions.jsx
│ │ └── Reports.jsx
```
---
## 📦 Dependencies

```json
"@mui/material", "@mui/icons-material", "@mui/x-date-pickers", 
"@emotion/react", "@emotion/styled", "styled-components", 
"react-router-dom", "recharts", "axios", "dayjs", 
"jspdf", "jspdf-autotable", "xlsx", 
"tailwindcss", "postcss", "autoprefixer"
```
---
## 🚀 Getting Started
cd client
npm install
npm run dev

---
## 🔐 Auth Flow

- User registers and logs in.
- Token and user information gets stored.
- Protected routes used to restrict access.
---
## 📊 Dashboard Visuals

- PieChart (Expenses by Category)
- BarChart (Monthly Comparison)
- LineChart (Yearly Trends)
---
## 📁 Reports Export

- jspdf-autotable for PDF
- xlsx for Excel download
---
## 🤖 Chatbot

- A basic static chatbot (/assistant) responds to financial questions using preset advice.
