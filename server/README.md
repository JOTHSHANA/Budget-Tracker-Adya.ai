# 💰 Budget Tracker Backend

This is the **backend** of the Budget Tracker app built with **Node.js**, **Express.js**, and **MongoDB**.

---

## 🌐 Backend URL

- API Base: `http://localhost:5000/api`

---

## 🛠️ Key Responsibilities

- 🔐 Authentication (Register/Login with JWT)
- 🧾 Transaction CRUD (Add, View by month/year, Income/Expense)
- 📁 Category Management (Add, Edit, Delete categories, Fix % for expenses)
- 📊 Budget Analytics (Monthly/Yearly summaries)
- 🤖 Static AI Chatbot for money-saving tips

---

## 🧭 Folder Structure

```
📁server
├── 📁config
│ └── db.js
├── 📁controllers
│ ├── authController.js
│ ├── transactionController.js
│ ├── budgetCategoryController.js
│ └── aiController.js
├── 📁middleware
│ └── authMiddleware.js
├── 📁models
│ ├── User.js
│ ├── Transaction.js
│ └── BudgetCategory.js
├── 📁routes
│ ├── authRoutes.js
│ ├── transactionRoutes.js
│ ├── budgetCategoryRoutes.js
│ └── aiRoutes.js
├── server.js
```
---

## 📦 Dependencies

```json
"express", "mongoose", "dotenv", "jsonwebtoken", "cors", "bcryptjs"
```
---
## 🔐 Authentication

✅ POST /api/auth/register
- Body JSON:
```

{ "name": "...", "email": "...", "password": "..." }

```
- Response:
```

{ "_id": "...", "name": "...", "email": "...", "token": "..." }

```

✅ POST /api/auth/login
- Body JSON:
```

{ "email": "...", "password": "..." }

```
- Response
```

{ "_id": "...", "name": "...", "email": "...", "token": "..." }

```
---

## 📁 Transactions APIs

| Method | Endpoint                                     | Description                       |
| ------ | -------------------------------------------- | --------------------------------- |
| POST   | `/api/transactions`                          | Create a new transaction          |
| GET    | `/api/transactions`                          | Get all transactions              |
| GET    | `/api/transactions/by-month?month=YYYY-MM`   | Get transactions by month         |
| GET    | `/api/transactions/income`                   | Get all income transactions       |
| GET    | `/api/transactions/expense`                  | Get all expense transactions      |
| GET    | `/api/transactions/yearly-summary?year=YYYY` | Get yearly income/expense summary |

---
## 📁 Budget Category APIs

| Method | Endpoint                     | Description                             |
| ------ | ---------------------------- | --------------------------------------- |
| POST   | `/api/budget-category`       | Add new category (income or expense)    |
| GET    | `/api/budget-category/:type` | Get categories by type (income/expense) |
| PUT    | `/api/budget-category/:id`   | Update a category                       |
| DELETE | `/api/budget-category/:id`   | Delete a category                       |

---
## 🧠 AI Chatbot API

✅ POST /api/ai/chat
- Body JSON
```

{
  "message": "..."
}


```
- Response
```

{
  "reply": "..."
}

```

## 🧾 Sample JSON Structures
📥 Create Transaction

POST /api/transactions
```

{
  "type": "...",
  "category": "...",
  "amount": ...,
  "note": "...",
  "date": "...",
  "createdAt": "..."
}

```
## 📤 Get Transactions by Month
GET /api/transactions/by-month?month=YYYY-MM

Response
```
[
  {
    "_id": "...",
    "type": "...",
    "category": "...",
    "amount": ...,
    "note": "...",
    "createdAt": "...",
    "updatedAt": "..."
  }
]

```

## 📊 Yearly Summary
GET /api/transactions/yearly-summary?year=2025

Response

```
{
  "income": ...,
  "expense": ...,
  "balance": ...,
  "monthlyChartData": [
    { "month": "2025-01", "income": ..., "expense": ... },
    ...
  ]
}

```

## ✅ Authorization
All protected routes require a JWT token in the header

```

Authorization: Bearer <token>

```

## 🚀 Running the Application
🔧 Backend

```
cd server
npm install
node server.js

or nodemon server.js

```



