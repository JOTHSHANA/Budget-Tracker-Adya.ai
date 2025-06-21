import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import Reports from './pages/Reports';
import AddTransactionForm from './pages/Transactions';
import { useEffect, useState, useContext } from "react";
import BudgetFix from './pages/BudgetFix';
import MoneyAssistant from "./pages/MoneyAssistant";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <AppLayout><Dashboard /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <AppLayout><Dashboard /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reports" element={<AppLayout><Reports /></AppLayout>} />
        <Route path="/transactions" element={<AppLayout><AddTransactionForm /></AppLayout>} />
        <Route path="/budget-fix" element={<AppLayout><BudgetFix /></AppLayout>} />
        <Route path="/assistant" element={<AppLayout><MoneyAssistant /></AppLayout>} />
      </Routes>
    </Router>
  );
}

export default App;
