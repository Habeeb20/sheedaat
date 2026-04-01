// src/pages/auth/Login.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Mail, Lock, ArrowRight, ArrowLeft, X } from 'lucide-react';
import LoadingSpinner from '../../utils/LoadingSpinner';
import { Link } from 'react-router-dom';

const PRIMARY_500 = '#3B82F6';
const PRIMARY_700 = '#1D4ED8';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Main Login Form (Email + Password)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset: resetMainForm,
  } = useForm();

  // e-Auth Modal Form (Email only)
  const {
    register: registerEAuth,
    handleSubmit: handleEAuthSubmit,
    formState: { errors: eAuthErrors },
    reset: resetEAuth,
  } = useForm();

  const [showEAuthModal, setShowEAuthModal] = useState(false);

  // Normal Login Handler
  const onSubmitNormal = async (data) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Invalid credentials');
      }

      // Save token
      localStorage.setItem('token', result.token);
      localStorage.setItem('adminToken', result.token);

      toast.success('Welcome Back!', {
        description: 'Logged in to edrivers. Redirecting...',
        duration: 2500,
        style: { background: PRIMARY_500, color: 'white' },
      });

      resetMainForm();
      navigate('/admin/dashboard');

    } catch (err) {
      setError(err.message);
      toast.error('Login Failed', {
        description: err.message,
        duration: 5000,
        style: { background: '#EF4444', color: 'white' },
      });
    } finally {
      setLoading(false);
    }
  };

  // e-Auth Login Handler (if you still want to keep it)
  const onSubmitEAuth = async (data) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          // You can send a flag if backend supports e-Auth differently
          // eAuth: true
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'e-Auth login failed');
      }

      localStorage.setItem('token', result.token);
      localStorage.setItem('adminToken', result.token);

      toast.success('Welcome Back!', {
        description: 'Logged in with e-Auth. Redirecting...',
        duration: 2500,
        style: { background: PRIMARY_500, color: 'white' },
      });

      setShowEAuthModal(false);
      resetEAuth();
      navigate('/admin/dashboard');

    } catch (err) {
      toast.error('e-Auth Failed', {
        description: err.message,
        duration: 5000,
        style: { background: '#EF4444', color: 'white' },
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" 
           style={{ background: `linear-gradient(135deg, ${PRIMARY_500}10 0%, #f9fafb 100%)` }}>
        <LoadingSpinner message="Signing you in..." size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-8" 
         style={{ background: `linear-gradient(135deg, ${PRIMARY_500}10 0%, #f9fafb 100%)` }}>
      
      {/* Background blobs */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-blue-100 to-green-100 rounded-full opacity-50 blur-xl"></div>
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-tr from-green-100 to-blue-100 rounded-full opacity-50 blur-xl"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Header */}
        <motion.header className="text-center space-y-3 mb-8">
          <div className="mx-auto w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-md"
               style={{ background: `linear-gradient(135deg, ${PRIMARY_500}, ${PRIMARY_700})` }}>
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Log in to edrivers</h1>
          <p className="text-gray-600 text-sm">Enter your details to continue.</p>
        </motion.header>

        {/* Main Login Form */}
        <motion.section
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 space-y-5 border border-gray-100"
          style={{ boxShadow: `0 10px 25px rgba(0,0,0,0.05)` }}
        >
          <form onSubmit={handleSubmit(onSubmitNormal)} className="space-y-4">
            {/* Email */}
            <div className="relative">
              <div className="absolute left-3 top-3 pointer-events-none">
                <Mail className="h-4 w-4 text-gray-400" />
              </div>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
                })}
                type="email"
                className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all duration-200 placeholder:text-gray-400"
                placeholder="audrey.weimann@anissa.org"
                style={{ borderColor: errors.email ? '#EF4444' : '#E5E7EB' }}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="relative">
              <div className="absolute left-3 top-3 pointer-events-none">
                <Lock className="h-4 w-4 text-gray-400" />
              </div>
              <input
                {...register('password', { required: 'Password is required' })}
                type="password"
                className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all duration-200 placeholder:text-gray-400"
                placeholder="••••••••"
                style={{ borderColor: errors.password ? '#EF4444' : '#E5E7EB' }}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-lg font-semibold text-white transition-all duration-200 shadow-md flex items-center justify-center space-x-2 disabled:opacity-70"
              style={{
                background: `linear-gradient(135deg, ${PRIMARY_500}, ${PRIMARY_700})`,
                boxShadow: `0 4px 14px 0 rgba(59, 130, 246, 0.4)`,
              }}
              disabled={loading}
            >
              <span>Login</span>
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </form>

          {/* e-Auth Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowEAuthModal(true)}
              className="w-full py-3 bg-purple-100 rounded-lg font-medium text-primary-600 border border-primary-200 hover:bg-purple-200 transition-colors"
              style={{ borderColor: PRIMARY_500 + '40' }}
              disabled={loading}
            >
              Login with e-Auth
            </button>
          </div>
        </motion.section>

        {/* Forgot Password */}
        <motion.div className="text-center mt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700 transition-colors" style={{ color: PRIMARY_500 }}>
            Forgot password?
          </Link>
        </motion.div>

        {/* Sign Up */}
        <motion.div className="text-center space-y-4 mt-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span>or</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>
          <Link
            to="/signup"
            className="block w-full py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors text-center"
          >
            Sign Up
          </Link>
        </motion.div>

        <motion.div className="absolute bottom-8 left-4 text-gray-400" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 0.5, x: 0 }} transition={{ delay: 0.5 }}>
          <ArrowLeft className="h-6 w-6" />
        </motion.div>
      </motion.div>

      {/* ====================== E-AUTH MODAL ====================== */}
      {showEAuthModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 relative"
          >
            <button
              onClick={() => {
                setShowEAuthModal(false);
                resetEAuth();
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Login with e-Auth</h2>
              <p className="text-gray-600 text-sm mt-1">Enter your email address</p>
            </div>

            <form onSubmit={handleEAuthSubmit(onSubmitEAuth)} className="space-y-5">
              <div className="relative">
                <div className="absolute left-3 top-3 pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  {...registerEAuth('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' },
                  })}
                  type="email"
                  className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all placeholder:text-gray-400"
                  placeholder="your.email@example.com"
                  style={{ borderColor: eAuthErrors.email ? '#EF4444' : '#E5E7EB' }}
                  autoFocus
                />
                {eAuthErrors.email && <p className="text-red-500 text-xs mt-1">{eAuthErrors.email.message}</p>}
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-lg font-semibold text-white transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-70"
                style={{
                  background: `linear-gradient(135deg, ${PRIMARY_500}, ${PRIMARY_700})`,
                  boxShadow: `0 4px 14px 0 rgba(59, 130, 246, 0.4)`,
                }}
                disabled={loading}
              >
                <span>Continue with e-Auth</span>
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Login;