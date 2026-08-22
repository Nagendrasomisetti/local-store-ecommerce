import React, { useState } from 'react';
import { useDriver } from '../context/DriverContext';
import { VehicleType } from '../types';
import { 
  Bike, 
  Car, 
  CheckCircle2, 
  XCircle, 
  Lock, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight, 
  Eye, 
  EyeOff,
  ShieldCheck,
  Zap,
  Sparkles
} from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const { login, signup, checkUsernameAvailable, registeredDrivers } = useDriver();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  
  // Login Form State
  const [loginUsername, setLoginUsername] = useState('ramesh123');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Signup Form State
  const [fullName, setFullName] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [city, setCity] = useState('Rajahmundry');
  const [vehicleType, setVehicleType] = useState<VehicleType>('Bike');
  const [signupError, setSignupError] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Live username availability state
  const usernameCheck = signupUsername.trim() 
    ? checkUsernameAvailable(signupUsername) 
    : null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!loginUsername.trim()) {
      setLoginError('Please enter your username');
      return;
    }
    const res = login(loginUsername, loginPassword);
    if (!res.success) {
      setLoginError(res.message);
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');
    
    if (!fullName.trim() || !signupUsername.trim() || !mobile.trim() || !email.trim()) {
      setSignupError('Please fill in all required fields');
      return;
    }

    if (!usernameCheck?.available) {
      setSignupError(usernameCheck?.message || 'Username is not available');
      return;
    }

    if (signupPassword && confirmPassword && signupPassword !== confirmPassword) {
      setSignupError('Passwords do not match');
      return;
    }

    const res = signup({
      full_name: fullName,
      username: signupUsername,
      mobile,
      email,
      password: signupPassword,
      city,
      vehicle_type: vehicleType,
    });

    if (!res.success) {
      setSignupError(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center px-4 py-8 max-w-md mx-auto relative overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-2xl relative z-10 border border-slate-100">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white font-extrabold text-2xl shadow-lg shadow-blue-600/30 mb-3">
            XYZ
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            XYZ Delivery
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            "Deliver orders. Earn money."
          </p>
        </div>

        {/* Tab Switcher: Login / Sign Up */}
        <div className="flex bg-slate-100 p-1 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => {
              setAuthMode('login');
              setLoginError('');
              setSignupError('');
            }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
              authMode === 'login'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('signup');
              setLoginError('');
              setSignupError('');
            }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
              authMode === 'signup'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* ===================== LOGIN FORM ===================== */}
        {authMode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {loginError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                <XCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Username */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold text-sm">
                  @
                </span>
                <input
                  type="text"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="ramesh123"
                  className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold rounded-xl shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 text-base transition-all mt-2 cursor-pointer"
            >
              <span>Login</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Quick Demo Logins for instant evaluation */}
            <div className="pt-4 border-t border-slate-100">
              <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider text-center mb-2.5">
                ⚡ Quick Demo Accounts
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setLoginUsername('ramesh123');
                    setLoginPassword('password123');
                    login('ramesh123', 'password123');
                  }}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/50 text-left transition-all"
                >
                  <p className="text-xs font-bold text-slate-900 truncate">Ramesh Kumar</p>
                  <p className="text-[11px] text-blue-600 font-medium">@ramesh123 (Bike)</p>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginUsername('suresh_rider');
                    setLoginPassword('password123');
                    login('suresh_rider', 'password123');
                  }}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/50 text-left transition-all"
                >
                  <p className="text-xs font-bold text-slate-900 truncate">Suresh Varma</p>
                  <p className="text-[11px] text-blue-600 font-medium">@suresh_rider</p>
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* ===================== SIGN UP FORM ===================== */
          <form onSubmit={handleSignupSubmit} className="space-y-3.5">
            {signupError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                <XCircle className="w-4 h-4 shrink-0" />
                <span>{signupError}</span>
              </div>
            )}

            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  required
                />
              </div>
            </div>

            {/* Username with Live Instagram-like uniqueness check */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Username *
                </label>
                {usernameCheck && (
                  <span className={`text-[11px] font-bold flex items-center gap-1 ${
                    usernameCheck.available ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {usernameCheck.available ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Username available.</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" />
                        <span>This username is already taken.</span>
                      </>
                    )}
                  </span>
                )}
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold text-sm">
                  @
                </span>
                <input
                  type="text"
                  value={signupUsername}
                  onChange={(e) => setSignupUsername(e.target.value.toLowerCase())}
                  placeholder="ramesh123"
                  className={`w-full pl-8 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                    usernameCheck
                      ? usernameCheck.available
                        ? 'border-emerald-400 focus:ring-emerald-500 bg-emerald-50/20'
                        : 'border-rose-400 focus:ring-rose-500 bg-rose-50/20'
                      : 'border-slate-200 focus:ring-blue-500'
                  }`}
                  required
                />
              </div>
              <p className="text-[10px] text-slate-600 mt-0.5">
                Must be unique. Example: @ramesh123
              </p>
            </div>

            {/* Mobile & Email Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Mobile Number *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="+91 98450 12345"
                    className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="driver@xyz.com"
                    className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* City & Vehicle Type Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  City *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <MapPin className="w-3.5 h-3.5" />
                  </span>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full pl-8 pr-2 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Rajahmundry">Rajahmundry</option>
                    <option value="Visakhapatnam">Visakhapatnam</option>
                    <option value="Vijayawada">Vijayawada</option>
                    <option value="Hyderabad">Hyderabad</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Vehicle Type *
                </label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value as VehicleType)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Bike">🏍️ Bike</option>
                  <option value="Scooter">🛵 Scooter</option>
                  <option value="Other">🚗 Other</option>
                </select>
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={usernameCheck ? !usernameCheck.available : false}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 text-sm transition-all mt-3 cursor-pointer"
            >
              <span>Register & Go to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Reset Password</h3>
            <p className="text-xs text-slate-500 mb-4">
              For this prototype, use the default password <span className="font-mono font-bold text-slate-800">password123</span> or use the quick 1-click login buttons.
            </p>
            <button
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-xl text-sm"
            >
              Back to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
