import { Toaster } from "sonner";
import "./App.css";
import { Button } from "./components/ui/button";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import { Layout } from "./components/Layout";
import Transactions from "./pages/Transactions";
import Alerts from "./pages/Alerts";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";
import UserDashboard from "./pages/UserDashboard";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
// import UserDashboard from "./components/UserDashboard";

function App() {
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" 
            element = {
              <Layout>
                <Dashboard />
              </Layout>
            }
          />
          <Route
            path="/transactions"
            element={
              <Layout>
                <Transactions />
              </Layout>
            }
          />
          <Route 
            path="/login"
            element={
              <Login />
            }
          />
          <Route
            path="/alerts"
            element={
              <Layout>
                <Alerts />
              </Layout>
            }
          />
          <Route
            path="/analytics"
            element={
              <Layout>
                <Analytics />
              </Layout>
            }
          />
          <Route
            path="/user"
            element={
              // <Layout>
                <UserDashboard />
              // </Layout>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
