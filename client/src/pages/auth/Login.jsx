// /* eslint-disable no-unused-vars */
// // src/pages/auth/Login.jsx
// import React, { useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { useForm } from 'react-hook-form';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'sonner';
// import { Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
// import LoadingSpinner from '../../utils/LoadingSpinner';
// import { loginAsync } from '../../store/slices/userSlice';
// import { Link } from 'react-router-dom';

// const PRIMARY_500 = '#3B82F6';  // Blue from image/design
// const PRIMARY_700 = '#1D4ED8';  // Darker blue
// const GREEN_ACCENT = '#10B981';  // Green curve accent

// const Login = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { loading, error, user, token } = useSelector((state) => state.user);
//   localStorage.setItem('token', token);
//   const { register, handleSubmit, formState: { errors }, reset } = useForm();

//   const onSubmit = async (data) => {
//     dispatch(loginAsync(data));
//   };

//   useEffect(() => {
//     if (token && user) {
//       localStorage.setItem('token', token);
//       localStorage.setItem('user', JSON.stringify(user));
//       localStorage.setItem('userId', user.id);
//       console.log('User logged in:', user.id);
//       toast.success('Welcome Back!', {
//         description: 'Logged in to edrivers. Redirecting...',
//         duration: 2500,
//         style: { background: PRIMARY_500, color: 'white' },
//       });
//       navigate('/dashboard');
//     }
//   }, [token, user, navigate]);

//   useEffect(() => {
//     if (error) {
//       toast.error('Login Failed', {
//         description: error,
//         duration: 5000,
//         style: { background: '#EF4444', color: 'white' },
//       });
//     }
//   }, [error]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center p-4" style={{ background: `linear-gradient(135deg, ${PRIMARY_500}10 0%, #f9fafb 100%)` }}>
//         <LoadingSpinner message="Signing you in..." size="lg" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen relative flex items-center justify-center px-4 py-8" style={{ background: `linear-gradient(135deg, ${PRIMARY_500}10 0%, #f9fafb 100%)` }}>
//       {/* Curved Background Element (from image) */}
//       <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-blue-100 to-green-100 rounded-full opacity-50 blur-xl"></div>
//       <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-tr from-green-100 to-blue-100 rounded-full opacity-50 blur-xl"></div>

//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="w-full max-w-md relative z-10"
//       >
//         {/* Header: Clean title with icon */}
//         <motion.header className="text-center space-y-3 mb-8">
//           <div className="mx-auto w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-md" style={{ background: `linear-gradient(135deg, ${PRIMARY_500}, ${PRIMARY_700})` }}>
//             <Lock className="w-6 h-6 text-white" />
//           </div>
//           <h1 className="text-3xl font-bold text-gray-900">Log in to edrivers</h1>
//           <p className="text-gray-600 text-sm">Enter your details to continue.</p>
//         </motion.header>

//         {/* Form: Rounded card with focus states */}
//         <motion.section
//           initial={{ y: 10, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ delay: 0.2 }}
//           className="bg-white rounded-2xl shadow-lg p-6 space-y-5 border border-gray-100"
//           style={{ boxShadow: `0 10px 25px rgba(0,0,0,0.05)` }}
//         >
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//             {/* Email */}
//             <div className="relative">
//               <div className="absolute left-3 top-3 pointer-events-none">
//                 <Mail className="h-4 w-4 text-gray-400" />
//               </div>
//               <input
//                 {...register('email', { 
//                   required: 'Email required',
//                   pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
//                 })}
//                 type="email"
//                 className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all duration-200 placeholder:text-gray-400"
//                 placeholder="audrey.weimann@anissa.org"
//                 style={{ borderColor: errors.email ? '#EF4444' : '#E5E7EB' }}
//               />
//               {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
//             </div>

//             {/* Password */}
//             <div className="relative">
//               <div className="absolute left-3 top-3 pointer-events-none">
//                 <Lock className="h-4 w-4 text-gray-400" />
//               </div>
//               <input
//                 {...register('password', { required: 'Password required' })}
//                 type="password"
//                 className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all duration-200 placeholder:text-gray-400"
//                 placeholder="••••••••"
//                 style={{ borderColor: errors.password ? '#EF4444' : '#E5E7EB' }}
//               />
//               {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
//             </div>

//             {/* Submit Button */}
//             <motion.button
//               type="submit"
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               className="w-full py-3 rounded-lg font-semibold text-white transition-all duration-200 shadow-md flex items-center justify-center space-x-2"
//               style={{ 
//                 background: `linear-gradient(135deg, ${PRIMARY_500}, ${PRIMARY_700})`,
//                 boxShadow: `0 4px 14px 0 rgba(59, 130, 246, 0.4)`
//               }}
//               disabled={loading}
//             >
//               <span>Login</span>
//               <ArrowRight className="h-4 w-4" />
//             </motion.button>
//           </form>
//         </motion.section>

//         {/* Forgot Password */}
//         <motion.div
//           className="text-center mt-4"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.3 }}
//         >
//           <Link 
//             to="/forgot-password" 
//             className="text-sm text-primary-600 hover:text-primary-700 transition-colors"
//             style={{ color: PRIMARY_500 }}
//           >
//             Forgot password?
//           </Link>
//         </motion.div>

//         {/* Divider & Sign Up */}
//         <motion.div
//           className="text-center space-y-4 mt-8"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.4 }}
//         >
//           <div className="flex items-center space-x-2 text-sm text-gray-500">
//             <div className="flex-1 h-px bg-gray-200"></div>
//             <span>or</span>
//             <div className="flex-1 h-px bg-gray-200"></div>
//           </div>
//           <Link
//             to="/signup"
//             className="block w-full py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors text-center"
//             style={{ borderColor: '#D1D5DB' }}
//           >
//             Sign Up
//           </Link>
//         </motion.div>

//         {/* Arrow Icon (from image) */}
//         <motion.div
//           className="absolute bottom-8 left-4 text-gray-400"
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 0.5, x: 0 }}
//           transition={{ delay: 0.5 }}
//         >
//           <ArrowLeft className="h-6 w-6" />
//         </motion.div>
//         </motion.div>
//       </div>
   
//   );
// };

// export default Login;
















































/* eslint-disable no-unused-vars */
// src/pages/auth/Login.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Mail, Lock, ArrowRight, ArrowLeft, X } from 'lucide-react';
import LoadingSpinner from '../../utils/LoadingSpinner';
import { loginAsync, authloginAsync } from '../../store/slices/userSlice'; // ← added authloginAsync
import { Link } from 'react-router-dom';

const PRIMARY_500 = '#3B82F6';
const PRIMARY_700 = '#1D4ED8';
const GREEN_ACCENT = '#10B981';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user, token } = useSelector((state) => state.user);

  const [showEAuthModal, setShowEAuthModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset: resetMainForm,
  } = useForm();

  // ── Form for normal email + password login ──
  const onSubmitNormal = async (data) => {
    dispatch(loginAsync(data));
  };

  // ── Form for e-Auth (only email) ──
  const {
    register: registerEAuth,
    handleSubmit: handleEAuthSubmit,
    formState: { errors: eAuthErrors },
    reset: resetEAuth,
  } = useForm();

  const onSubmitEAuth = async (data) => {
    dispatch(authloginAsync({ email: data.email }));
    // Modal will close on success via useEffect below
  };

  // Shared success / redirect logic
  useEffect(() => {
    if (token && user) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userId', user.id);
      toast.success('Welcome Back!', {
        description: 'Logged in to edrivers. Redirecting...',
        duration: 2500,
        style: { background: PRIMARY_500, color: 'white' },
      });
      navigate('/dashboard');
      setShowEAuthModal(false); // close modal if open
      resetMainForm();
      resetEAuth();
    }
  }, [token, user, navigate, resetMainForm, resetEAuth]);

  useEffect(() => {
    if (error) {
      toast.error('Login Failed', {
        description: error,
        duration: 5000,
        style: { background: '#EF4444', color: 'white' },
      });
    }
  }, [error]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: `linear-gradient(135deg, ${PRIMARY_500}10 0%, #f9fafb 100%)` }}>
        <LoadingSpinner message="Signing you in..." size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-8" style={{ background: `linear-gradient(135deg, ${PRIMARY_500}10 0%, #f9fafb 100%)` }}>
      {/* Curved backgrounds ... (unchanged) */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-blue-100 to-green-100 rounded-full opacity-50 blur-xl"></div>
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-tr from-green-100 to-blue-100 rounded-full opacity-50 blur-xl"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Header (unchanged) */}
        <motion.header className="text-center space-y-3 mb-8">
          <div className="mx-auto w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-md" style={{ background: `linear-gradient(135deg, ${PRIMARY_500}, ${PRIMARY_700})` }}>
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
                  required: 'Email required',
                  pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' },
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
                {...register('password', { required: 'Password required' })}
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
              className="w-full py-3 rounded-lg font-semibold text-white transition-all duration-200 shadow-md flex items-center justify-center space-x-2"
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

          {/* ── New: Login with e-Auth button ── */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowEAuthModal(true)}
              className="w-full py-3 bg-purple-100 rounded-lg font-medium text-primary-600 border border-primary-200 hover:bg-purple-100 transition-colors"
              style={{ borderColor: PRIMARY_500 + '40' }}
              disabled={loading}
            >
              Login with e-Auth 
            </button>
          </div>
        </motion.section>

        {/* Forgot password + Sign up section (unchanged) */}
        <motion.div className="text-center mt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700 transition-colors" style={{ color: PRIMARY_500 }}>
            Forgot password?
          </Link>
        </motion.div>

        <motion.div className="text-center space-y-4 mt-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span>or</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>
          <Link
            to="/signup"
            className="block w-full py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors text-center"
            style={{ borderColor: '#D1D5DB' }}
          >
            Sign Up
          </Link>
        </motion.div>

        {/* Arrow icon (unchanged) */}
        <motion.div className="absolute bottom-8 left-4 text-gray-400" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 0.5, x: 0 }} transition={{ delay: 0.5 }}>
          <ArrowLeft className="h-6 w-6" />
        </motion.div>
      </motion.div>

      {/* ────────────────────────────────────────────────
          E-AUTH MODAL
      ──────────────────────────────────────────────── */}
      {showEAuthModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
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
              <p className="text-gray-600 text-sm mt-1">Just enter your email address</p>
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
                className="w-full py-3 rounded-lg font-semibold text-white transition-all shadow-md flex items-center justify-center space-x-2"
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