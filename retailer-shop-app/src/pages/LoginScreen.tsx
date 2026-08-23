import React, { useState } from 'react';
import { Store, Lock, Eye, EyeOff, ShieldCheck, Globe, ChevronDown, LogIn, Phone } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const LoginScreen: React.FC = () => {
  const { login, isActionLoading } = useShop();
  const [shopId, setShopId] = useState('CS123456');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [language, setLanguage] = useState('English');
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpPhone, setOtpPhone] = useState('9876543210');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [forgotModal, setForgotModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const res = await login(shopId, password);
    if (!res.success && res.error) {
      setErrorMsg(res.error);
    }
  };

  const handleSendOtp = () => {
    if (otpPhone.length >= 10) {
      setOtpSent(true);
      setOtpCode('1234');
    }
  };

  const handleVerifyOtp = async () => {
    await login('CS123456', 'otp-login');
    setShowOtpModal(false);
  };

  return (
    <div className="min-h-full bg-[#F7F5FD] flex flex-col justify-between relative overflow-hidden font-sans select-none pt-3">

      {/* Decorative Chicken Outline Watermarks */}
      <svg
        className="absolute top-16 left-6 w-12 h-12 text-purple-200/40 pointer-events-none stroke-current fill-none"
        viewBox="0 0 24 24"
        strokeWidth="1.2"
      >
        <path d="M12 2a5 5 0 0 0-5 5c0 2 1 3.5 2 4.5l-4 8a1 1 0 0 0 1 1.5h12a1 1 0 0 0 1-1.5l-4-8c1-1 2-2.5 2-4.5a5 5 0 0 0-5-5z" />
      </svg>
      <svg
        className="absolute top-20 right-8 w-14 h-14 text-purple-200/40 pointer-events-none stroke-current fill-none rotate-12"
        viewBox="0 0 24 24"
        strokeWidth="1.2"
      >
        <path d="M12 2a5 5 0 0 0-5 5c0 2 1 3.5 2 4.5l-4 8a1 1 0 0 0 1 1.5h12a1 1 0 0 0 1-1.5l-4-8c1-1 2-2.5 2-4.5a5 5 0 0 0-5-5z" />
      </svg>

      {/* Flanking Food Imagery */}
      <div className="absolute top-28 -left-6 w-32 h-32 pointer-events-none rounded-2xl overflow-hidden shadow-xs border border-white/60">
        <img
          src="https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=300&auto=format&fit=crop&q=80"
          alt="Fresh Chicken Cuts"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute top-32 -right-6 w-32 h-32 pointer-events-none rounded-2xl overflow-hidden shadow-xs border border-white/60">
        <img
          src="https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=300&auto=format&fit=crop&q=80"
          alt="Chicken Diced Dish"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Top Language Selector */}
      <div className="px-6 py-1 flex items-center justify-end relative z-20">
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowLangDropdown(!showLangDropdown)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-purple-100 text-xs font-semibold text-[#4F1990] shadow-2xs cursor-pointer hover:bg-purple-50/50 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-[#4F1990]" />
            <span>{language}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#4F1990]" />
          </button>

          {showLangDropdown && (
            <div className="absolute right-0 mt-1.5 w-36 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-30">
              {['English', 'తెలుగు (Telugu)', 'हिंदी (Hindi)', 'தமிழ் (Tamil)'].map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => {
                    setLanguage(lang.split(' ')[0]);
                    setShowLangDropdown(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-purple-50 hover:text-[#4F1990] transition-colors"
                >
                  {lang}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Brand Header */}
      <div className="px-6 pt-1 pb-4 text-center flex flex-col items-center relative z-10">
        <div className="w-18 h-18 rounded-full bg-white shadow-sm border border-purple-100/80 flex items-center justify-center mb-3">
          <Store className="w-8 h-8 text-[#4F1990] stroke-[1.8]" />
        </div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Retailer Shop</h1>
        <p className="text-xs text-gray-500 mt-1 max-w-[240px] leading-snug">
          Manage your shop, orders and deliveries all in one place
        </p>
      </div>

      {/* Form Card */}
      <div className="px-4 pb-4 relative z-10 flex-1 flex flex-col justify-end">
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-purple-50/60">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900">Welcome Back!</h2>
            <p className="text-xs text-gray-400 mt-0.5 font-medium">Login to continue to your dashboard</p>
          </div>

          {errorMsg && (
            <div className="mb-3 p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-3.5">
            {/* Store ID / Store Username */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1.5">Username (Mobile / Email)</label>
              <div className="relative flex items-center">
                <Store className="w-4 h-4 text-[#4F1990] absolute left-3.5 pointer-events-none stroke-[1.8]" />
                <input
                  type="text"
                  value={shopId}
                  onChange={(e) => setShopId(e.target.value)}
                  placeholder="Enter your mobile or email"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:border-[#4F1990] focus:ring-1 focus:ring-[#4F1990] transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1.5">Password</label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-[#4F1990] absolute left-3.5 pointer-events-none stroke-[1.8]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:border-[#4F1990] focus:ring-1 focus:ring-[#4F1990] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex justify-end mt-1.5">
                <button
                  type="button"
                  onClick={() => setForgotModal(true)}
                  className="text-xs font-semibold text-[#4F1990] hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isActionLoading}
              className="w-full py-3.5 px-4 bg-[#4F1990] hover:bg-[#3E1174] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer active:scale-[0.99]"
            >
              <LogIn className="w-4 h-4" />
              <span>{isActionLoading ? 'Logging in...' : 'Login'}</span>
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2.5 text-gray-400 font-medium">or</span>
            </div>
          </div>

          {/* Login with OTP */}
          <button
            type="button"
            onClick={() => setShowOtpModal(true)}
            className="w-full py-3 px-4 bg-white border border-[#8B5CF6]/60 text-[#4F1990] hover:bg-purple-50/60 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99]"
          >
            <Phone className="w-4 h-4" />
            <span>Login with OTP</span>
          </button>
        </div>

        {/* Security Badge */}
        <div className="mt-4 flex items-center gap-3 bg-white/80 p-3 rounded-2xl border border-purple-100/60 shadow-2xs">
          <div className="w-9 h-9 rounded-xl bg-purple-100/80 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-[#4F1990]" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-900">Secure & Safe</h4>
            <p className="text-[11px] text-gray-500 font-medium">Your data is encrypted and secure with us.</p>
          </div>
        </div>

        {/* App Version */}
        <div className="text-center mt-3 mb-1">
          <span className="text-[11px] text-gray-400 font-medium">Version 1.0.0</span>
        </div>
      </div>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">Login with OTP</h3>
              <button
                type="button"
                onClick={() => setShowOtpModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-gray-500">Enter your registered mobile number to receive a one-time password.</p>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Mobile Number</label>
              <input
                type="tel"
                value={otpPhone}
                onChange={(e) => setOtpPhone(e.target.value)}
                placeholder="10-digit mobile number"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm font-medium"
              />
            </div>

            {!otpSent ? (
              <button
                type="button"
                onClick={handleSendOtp}
                className="w-full py-2.5 bg-[#4F1990] text-white font-bold text-sm rounded-xl hover:bg-[#3E1174] cursor-pointer"
              >
                Send OTP
              </button>
            ) : (
              <div className="space-y-3">
                <div className="p-2 rounded-lg bg-green-50 text-green-700 text-xs font-medium">
                  OTP sent to {otpPhone} (Demo OTP: 1234)
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Enter 4-digit OTP</label>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="1234"
                    maxLength={4}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm font-bold tracking-widest text-center"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  className="w-full py-2.5 bg-[#4F1990] text-white font-bold text-sm rounded-xl hover:bg-[#3E1174] cursor-pointer"
                >
                  Verify & Continue
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {forgotModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl space-y-4">
            <h3 className="text-base font-bold text-gray-900">Reset Password</h3>
            <p className="text-xs text-gray-500">
              A password reset link will be sent to the owner phone number linked with Shop ID {shopId}.
            </p>
            <button
              type="button"
              onClick={() => setForgotModal(false)}
              className="w-full py-2.5 bg-[#4F1990] text-white font-bold text-sm rounded-xl cursor-pointer"
            >
              Send Reset SMS
            </button>
            <button
              type="button"
              onClick={() => setForgotModal(false)}
              className="w-full py-2 text-xs text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

