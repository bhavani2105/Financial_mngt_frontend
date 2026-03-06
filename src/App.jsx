import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { FinanceProvider } from "./context/FinanceContext";
import PrivateRoute from "./components/common/PrivateRoute";
import Layout from "./components/common/Layout";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import Investments from "./pages/Investments";
import Liabilities from "./pages/Liabilities";
import Auth from "./pages/Auth";

function App() {
  return (
    <Router>
      <AuthProvider>
        <FinanceProvider>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Auth type="login" />} />
            <Route path="/register" element={<Auth type="register" />} />

            <Route element={<PrivateRoute />}>
              <Route element={<Layout />}>

                {/* <Route
                  path="/"
                  element={<Navigate to="/dashboard" replace />}
                /> */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/budgets" element={<Budgets />} />
                <Route path="/investments" element={<Investments />} />
                <Route path="/liabilities" element={<Liabilities />} />
              </Route>
            </Route>
          </Routes>
        </FinanceProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
