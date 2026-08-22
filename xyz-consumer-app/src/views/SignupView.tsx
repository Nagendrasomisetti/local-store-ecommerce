import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Phone, Mail, User, Sparkles, ArrowRight, ShieldCheck, Bike, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SignupViewProps {
  onAuthSuccess: () => void;
}

export const SignupView: React.FC<SignupViewProps> = ({ onAuthSuccess }) => {
  const { login, signup } = useAuth();

  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sign up fields
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Login fields
  const [loginIdentifier, setLoginIdentifier] = useState('9876543210');
  const [loginPassword, setLoginPassword] = useState('password123');

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      return setError('Please enter your full name');
    }
    if (!mobile.trim() || mobile.length !== 10) {
      return setError('Please enter a valid 10-digit mobile number');
    }
    if (!password || password.length < 6) {
      return setError('Password must be at least 6 characters');
    }
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setLoading(true);
      await signup({
        name,
        mobile,
        email: email.trim() || undefined,
        password,
        confirmPassword,
      });
      onAuthSuccess();
    } catch (err: any) {
      setError(err.message || 'Sign up failed. Please check your information.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!loginIdentifier.trim()) {
      return setError('Please enter your mobile number or email');
    }
    if (!loginPassword) {
      return setError('Please enter your password');
    }

    try {
      setLoading(true);
      await login(loginIdentifier, loginPassword);
      onAuthSuccess();
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = () => {
    setMode('login');
    setLoginIdentifier('9876543210');
    setLoginPassword('password123');
  };

  return (
    <div className="min-h-screen py-8 px-4 max-w-md mx-auto flex flex-col justify-between space-y-6 animate-fade-in">
      <div className="space-y-5">
        {/* Brand Hero Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="inline-flex items-center justify-center gap-2 mb-1">
            <div className="w-11 h-11 rounded-2xl bg-red-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-red-200">
              xyz
            </div>
            <span className="text-2xl font-black text-neutral-900 tracking-tight">
              xyz<span className="text-red-600">.com</span>
            </span>
          </div>

          <h1 className="text-2xl font-black text-neutral-900 tracking-tight leading-snug">
            {mode === 'signup' ? 'Create Your Account' : 'Welcome Back'}
          </h1>
          <p className="text-xs text-neutral-500 max-w-xs mx-auto leading-relaxed">
            {mode === 'signup'
              ? 'Sign up to order fresh, hygienic chicken cuts from your local trusted shops.'
              : 'Login to access your saved addresses and track live deliveries.'}
          </p>
        </div>

        {/* Main Authentication Box */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xl shadow-neutral-100 border border-neutral-200/80 space-y-4">
          {/* Toggle between Sign Up and Login */}
          <div className="flex bg-neutral-100 p-1 rounded-2xl">
            <button
              id="tab-view-signup"
              type="button"
              onClick={() => {
                setMode('signup');
                setError(null);
              }}
              className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all ${
                mode === 'signup'
                  ? 'bg-red-600 text-white shadow-md shadow-red-100'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Sign Up
            </button>
            <button
              id="tab-view-login"
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
              }}
              className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all ${
                mode === 'login'
                  ? 'bg-red-600 text-white shadow-md shadow-red-100'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Login
            </button>
          </div>

          {/* Error Notification */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-medium animate-shake flex items-start gap-2">
              <span className="font-bold text-red-600">!</span>
              <span>{error}</span>
            </div>
          )}

          {/* SIGN UP FORM */}
          {mode === 'signup' ? (
            <form onSubmit={handleSignupSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-neutral-700 block mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="page-signup-name-input"
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-3 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 font-medium transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-700 block mb-1">
                  Mobile Number (10 digits) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="page-signup-mobile-input"
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="9876543210"
                    value={mobile}
                    onChange={e => setMobile(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-10 pr-3.5 py-3 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 font-medium transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-700 block mb-1">
                  Email Address <span className="text-neutral-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="page-signup-email-input"
                    type="email"
                    placeholder="ramesh@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-3 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 font-medium transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-700 block mb-1">
                  Password (min 6 characters) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="page-signup-password-input"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Create a secure password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 font-medium transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-700 block mb-1">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="page-signup-confirm-input"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 font-medium transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                id="btn-page-signup-submit"
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 mt-2 bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white font-black text-xs rounded-2xl shadow-xl shadow-red-200 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? 'Creating Your Account...' : 'Sign Up & Continue'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          ) : (
            /* LOGIN FORM */
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-bold text-neutral-700 block mb-1">
                  Mobile Number or Email
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="page-login-identifier-input"
                    type="text"
                    required
                    placeholder="e.g. 9876543210 or email"
                    value={loginIdentifier}
                    onChange={e => setLoginIdentifier(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-3 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 font-medium transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-700 block mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="page-login-password-input"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 font-medium transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                id="btn-page-login-submit"
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white font-black text-xs rounded-2xl shadow-xl shadow-red-200 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? 'Logging in...' : 'Login & Continue'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>

              {/* Quick Demo Fill Helper */}
              <div className="pt-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={fillDemoAccount}
                  className="w-full py-2.5 px-3 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded-xl text-left flex items-center justify-between text-xs text-amber-900 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span className="font-bold text-[11px]">Quick Demo Account (Ravi Teja)</span>
                  </div>
                  <span className="text-[10px] font-extrabold text-amber-700 underline">Auto-fill</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-2 pb-2">
        <div className="flex flex-col items-center text-center p-2.5 bg-white rounded-2xl border border-neutral-100 shadow-xs">
          <div className="w-7 h-7 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-bold text-neutral-800 leading-tight">
            Fresh & Hygienic
          </span>
        </div>

        <div className="flex flex-col items-center text-center p-2.5 bg-white rounded-2xl border border-neutral-100 shadow-xs">
          <div className="w-7 h-7 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-1">
            <Bike className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-bold text-neutral-800 leading-tight">
            Fast Delivery
          </span>
        </div>

        <div className="flex flex-col items-center text-center p-2.5 bg-white rounded-2xl border border-neutral-100 shadow-xs">
          <div className="w-7 h-7 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-1">
            <Award className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-bold text-neutral-800 leading-tight">
            Trusted Shops
          </span>
        </div>
      </div>
    </div>
  );
};
