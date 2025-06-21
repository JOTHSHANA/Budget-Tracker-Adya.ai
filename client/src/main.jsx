import React from 'react';
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext';
import { BudgetAlertProvider } from "./context/BudgetAlertContext";
import './index.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BudgetAlertProvider>
        <App />
      </BudgetAlertProvider>
    </AuthProvider>
  </React.StrictMode>
)
