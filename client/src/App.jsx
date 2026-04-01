// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';  // ← Import this
import { useEffect } from 'react';

import { useLocation } from 'react-router-dom';
import Navbar from './component/Navbar';
import { Link } from 'react-router-dom';

import ForgotPassword from './pages/auth/Forgotpassword';
import ResetPassword from './pages/auth/Resetpassword';

import AdminLogin from "./pages/auth/Login"
import AdminDashboard from './pages/admin/AdminDashboardss';

import Footer from './component/Footer';

import NotFound from './component/NotFound';
import Login from './pages/auth/Login';

// Layout Component
const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

const Layout2 = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
   
    </div>
  );
};


function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top on every route change
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Router>
        {/* Toaster must be inside Router but outside Routes so it's always present */}
        <Toaster
          position="top-center"     // or "top-right", "bottom-center", etc.
          richColors                // Beautiful colors (success green, error red)
          closeButton               // Optional: adds X button
          toastOptions={{
            duration: 5000,
            style: {
              fontSize: '14px',
            },
          }}
        />
<ScrollToTop />
        <Routes>
          <Route element={<Layout />}>
     
    
            <Route path="/admin/login" element={<Login />} />
            <Route path="/login" element={<Login />} />
    
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
  

           <Route path="*" element={<NotFound />} />
          </Route>


<Route element={<Layout2 />}>

          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
          {/* You can add more admin routes later: edit, list, etc. */}


</Route>

          {/* 404 */}
          <Route path="*" element={
            <Layout>
              <div className="flex items-center justify-center min-h-screen text-gray-600 text-xl">
                404 - Page Not Found
              </div>
            </Layout>
          } />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

























