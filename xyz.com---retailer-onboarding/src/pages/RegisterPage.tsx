import React, { useState, useRef } from 'react';
import {
  Store,
  MapPin,
  User,
  Phone,
  Mail,
  Upload,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Lock,
  Headphones,
  AlertCircle,
  CheckCircle,
  X,
  Image as ImageIcon,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { ShopIllustration } from '../components/ShopIllustration';
import { RetailerRegistrationResponse } from '../types';

interface RegisterPageProps {
  onSuccess: (data: RetailerRegistrationResponse) => void;
  onContactSupport: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onSuccess,
  onContactSupport,
}) => {
  // Form fields
  const [storeName, setStoreName] = useState('');
  const [uniqueStoreName, setUniqueStoreName] = useState('');
  const [isCustomUniqueName, setIsCustomUniqueName] = useState(false);
  const [storePhoto, setStorePhoto] = useState<string | null>(null);
  const [storePhotoName, setStorePhotoName] = useState<string>('');
  const [storeAddress, setStoreAddress] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');

  // Form states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [existingStoreName, setExistingStoreName] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to convert text to clean slug
  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/&/g, '-and-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  // Auto-suggest uniqueStoreName when storeName changes (unless manually edited)
  const handleStoreNameChange = (val: string) => {
    setStoreName(val);
    if (errors.storeName) setErrors((prev) => ({ ...prev, storeName: '' }));
    if (!isCustomUniqueName) {
      setUniqueStoreName(slugify(val));
    }
  };

  const handleUniqueStoreNameChange = (val: string) => {
    setIsCustomUniqueName(true);
    const cleaned = slugify(val);
    setUniqueStoreName(cleaned);
    if (errors.uniqueStoreName) setErrors((prev) => ({ ...prev, uniqueStoreName: '' }));
  };

  // Handle Logo Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, storePhoto: 'Please upload an image file (PNG or JPG).' }));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, storePhoto: 'Image size should be less than 2MB.' }));
      return;
    }

    setStorePhotoName(file.name);
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy.storePhoto;
      return copy;
    });

    const reader = new FileReader();
    reader.onload = () => {
      setStorePhoto(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setStorePhoto(null);
    setStorePhotoName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Field validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!storeName.trim()) {
      newErrors.storeName = 'Store Name is required.';
    } else if (storeName.trim().length < 2) {
      newErrors.storeName = 'Store Name must be at least 2 characters.';
    }

    const cleanUnique = uniqueStoreName.trim();
    if (!cleanUnique) {
      newErrors.uniqueStoreName = 'Unique Store Name is required.';
    } else if (cleanUnique.length < 3) {
      newErrors.uniqueStoreName = 'Unique Store Name must be at least 3 characters.';
    }

    if (!storeAddress.trim()) {
      newErrors.storeAddress = 'Store Address is required.';
    } else if (storeAddress.trim().length < 5) {
      newErrors.storeAddress = 'Please provide a complete store address.';
    }

    if (!ownerName.trim()) {
      newErrors.ownerName = 'Owner Name is required.';
    } else if (ownerName.trim().length < 2) {
      newErrors.ownerName = 'Please enter a valid owner name.';
    }

    const cleanMobile = mobileNumber.replace(/\D/g, '');
    if (!mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile Number is required.';
    } else if (cleanMobile.length !== 10) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Email Address is required.';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setExistingStoreName(null);

    if (!validateForm()) {
      const firstErrorEl = document.querySelector('.has-error');
      if (firstErrorEl) {
        firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        storeName: storeName.trim(),
        uniqueStoreName: uniqueStoreName.trim(),
        storePhoto,
        storeAddress: storeAddress.trim(),
        ownerName: ownerName.trim(),
        countryCode,
        mobileNumber: mobileNumber.trim(),
        email: email.trim(),
      };

      const res = await fetch('/api/retailers/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || 'Failed to register store. Please try again.');
        if (data.existingStoreName) {
          setExistingStoreName(data.existingStoreName);
        }
        if (data.suggested) {
          setUniqueStoreName(data.suggested);
        }
        setIsSubmitting(false);
        return;
      }

      // Success
      setIsSubmitting(false);
      onSuccess(data);
    } catch (err) {
      console.error('Registration submission error:', err);
      setServerError('Unable to connect to registration server. Please check your network and try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* LEFT COLUMN: Benefits & Value Props */}
        <div className="lg:col-span-5 space-y-6">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold tracking-wide">
            <Store className="w-3.5 h-3.5" />
            <span>Built for Local Retailers</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E1B4B] tracking-tight leading-tight">
              Register Your Store in{' '}
              <span className="text-indigo-600">Just a Few Steps</span>
            </h1>
            <p className="text-sm text-gray-600 leading-relaxed">
              Join thousands of local retailers who are growing their business with xyz.com
            </p>
          </div>

          {/* Store Visual Illustration */}
          <div className="bg-gradient-to-b from-indigo-50/60 to-white p-4 rounded-2xl border border-indigo-100/60 flex items-center justify-center">
            <ShopIllustration variant="card" className="max-w-[220px]" />
          </div>

          {/* 3 Key Benefits */}
          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Quick & Easy</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Provide basic details and get your store online in minutes.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Grow Your Business</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Reach more local customers and increase your repeat sales.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Secure & Trusted</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Your information is protected with industry-standard encryption.
                </p>
              </div>
            </div>
          </div>

          {/* Need Help Box */}
          <div className="p-4 bg-white rounded-2xl border border-purple-100 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">Need Help?</h4>
                <p className="text-[11px] text-gray-500">We're here to help you anytime.</p>
              </div>
            </div>
            <button
              onClick={onContactSupport}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Contact Support</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Registration Form Card */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-sm">
            <div className="border-b border-purple-50 pb-5 mb-6">
              <h2 className="text-2xl font-extrabold text-[#1E1B4B]">Register Your Store</h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Enter a few details to get started
              </p>
            </div>

            {/* Server Error Alert */}
            {serverError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 animate-in fade-in">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="text-xs text-red-800">
                  <p className="font-bold">Registration Alert</p>
                  <p className="mt-0.5 leading-relaxed">{serverError}</p>
                  {existingStoreName && (
                    <p className="mt-2 font-mono text-[11px] text-red-900 bg-red-100 px-2.5 py-1 rounded-md inline-block">
                      Store: {existingStoreName}
                    </p>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* SECTION 1: STORE INFORMATION */}
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 pb-1 border-b border-gray-100">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                    1
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">Store Information</h3>
                </div>

                {/* Store Name */}
                <div className={errors.storeName ? 'has-error' : ''}>
                  <label htmlFor="storeName" className="block text-xs font-bold text-gray-700 mb-1.5">
                    Store Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative rounded-xl shadow-2xs">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Store className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      id="storeName"
                      value={storeName}
                      onChange={(e) => handleStoreNameChange(e.target.value)}
                      placeholder="Enter your store name (e.g. Metro Supermarket)"
                      className={`block w-full pl-10 pr-3.5 py-3 text-sm rounded-xl border bg-white focus:outline-none transition-colors ${
                        errors.storeName
                          ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                          : 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                      }`}
                    />
                  </div>
                  {errors.storeName && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.storeName}</span>
                    </p>
                  )}
                </div>

                {/* Unique Store Name (Store Handle / Link) */}
                <div className={errors.uniqueStoreName ? 'has-error' : ''}>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="uniqueStoreName" className="block text-xs font-bold text-gray-700">
                      Unique Store Name <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[11px] text-gray-400">Used for your link & login</span>
                  </div>

                  <div className="flex rounded-xl shadow-2xs">
                    <span className="inline-flex items-center px-3 text-xs font-medium text-gray-500 bg-gray-50 border border-r-0 border-gray-200 rounded-l-xl select-none">
                      xyz.com/store/
                    </span>
                    <input
                      type="text"
                      id="uniqueStoreName"
                      value={uniqueStoreName}
                      onChange={(e) => handleUniqueStoreNameChange(e.target.value)}
                      placeholder="your-unique-store-name"
                      className={`block w-full px-3.5 py-3 text-sm font-semibold text-indigo-900 font-mono rounded-r-xl border bg-white focus:outline-none transition-colors ${
                        errors.uniqueStoreName
                          ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                          : 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                      }`}
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-gray-400">
                    This is your unique store identifier. Lowercase letters, numbers, and hyphens only.
                  </p>
                  {errors.uniqueStoreName && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.uniqueStoreName}</span>
                    </p>
                  )}
                </div>

                {/* Store Photo / Logo (Optional) */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Store Photo / Logo <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                    id="storePhotoInput"
                  />

                  {!storePhoto ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-purple-200 hover:border-indigo-400 rounded-2xl p-4 sm:p-5 text-center cursor-pointer transition-colors bg-purple-50/20 hover:bg-purple-50/50 flex flex-col sm:flex-row items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3.5 text-left">
                        <div className="w-11 h-11 rounded-xl bg-white border border-purple-100 flex items-center justify-center text-indigo-600 shadow-2xs shrink-0">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-800">Upload store logo or photo</p>
                          <p className="text-[11px] text-gray-400">PNG, JPG up to 2MB</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-indigo-700 bg-white border border-indigo-200 hover:bg-indigo-50 rounded-xl transition-colors shrink-0 shadow-2xs cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Choose File</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <img
                          src={storePhoto}
                          alt="Store preview"
                          className="w-12 h-12 rounded-lg object-cover border border-indigo-200 shrink-0"
                        />
                        <div className="truncate text-left">
                          <p className="text-xs font-bold text-gray-900 truncate">
                            {storePhotoName || 'Store Image Selected'}
                          </p>
                          <p className="text-[11px] text-emerald-600 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            <span>Ready to upload</span>
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={removePhoto}
                        className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                        aria-label="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {errors.storePhoto && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.storePhoto}</span>
                    </p>
                  )}
                </div>

                {/* Store Address */}
                <div className={errors.storeAddress ? 'has-error' : ''}>
                  <label htmlFor="storeAddress" className="block text-xs font-bold text-gray-700 mb-1.5">
                    Store Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative rounded-xl shadow-2xs">
                    <div className="absolute top-3.5 left-0 pl-3.5 flex items-start pointer-events-none text-gray-400">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <textarea
                      id="storeAddress"
                      rows={2}
                      value={storeAddress}
                      onChange={(e) => {
                        setStoreAddress(e.target.value);
                        if (errors.storeAddress) setErrors((prev) => ({ ...prev, storeAddress: '' }));
                      }}
                      placeholder="Enter your store address (Store No., Street, Area, Landmark, City, Pincode)"
                      className={`block w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border bg-white focus:outline-none transition-colors ${
                        errors.storeAddress
                          ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                          : 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                      }`}
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-gray-400">
                    Provide complete address for accurate delivery & customer reach.
                  </p>
                  {errors.storeAddress && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.storeAddress}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* SECTION 2: OWNER INFORMATION */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2.5 pb-1 border-b border-gray-100">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                    2
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">Owner Information</h3>
                </div>

                {/* Owner Name */}
                <div className={errors.ownerName ? 'has-error' : ''}>
                  <label htmlFor="ownerName" className="block text-xs font-bold text-gray-700 mb-1.5">
                    Owner Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative rounded-xl shadow-2xs">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      id="ownerName"
                      value={ownerName}
                      onChange={(e) => {
                        setOwnerName(e.target.value);
                        if (errors.ownerName) setErrors((prev) => ({ ...prev, ownerName: '' }));
                      }}
                      placeholder="Enter owner full name"
                      className={`block w-full pl-10 pr-3.5 py-3 text-sm rounded-xl border bg-white focus:outline-none transition-colors ${
                        errors.ownerName
                          ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                          : 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                      }`}
                    />
                  </div>
                  {errors.ownerName && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.ownerName}</span>
                    </p>
                  )}
                </div>

                {/* Mobile Number & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Mobile Number */}
                  <div className={errors.mobileNumber ? 'has-error' : ''}>
                    <label htmlFor="mobileNumber" className="block text-xs font-bold text-gray-700 mb-1.5">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <div className="flex rounded-xl shadow-2xs">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="px-2.5 py-3 bg-gray-50 border border-r-0 border-gray-200 rounded-l-xl text-xs font-bold text-gray-700 focus:outline-none cursor-pointer"
                      >
                        <option value="+91">+91 (IN)</option>
                        <option value="+1">+1 (US)</option>
                        <option value="+44">+44 (UK)</option>
                        <option value="+971">+971 (UAE)</option>
                      </select>

                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <Phone className="w-4 h-4" />
                        </div>
                        <input
                          type="tel"
                          id="mobileNumber"
                          maxLength={15}
                          value={mobileNumber}
                          onChange={(e) => {
                            setMobileNumber(e.target.value);
                            if (errors.mobileNumber) setErrors((prev) => ({ ...prev, mobileNumber: '' }));
                          }}
                          placeholder="Enter mobile number"
                          className={`block w-full pl-9 pr-3.5 py-3 text-sm rounded-r-xl border bg-white focus:outline-none transition-colors ${
                            errors.mobileNumber
                              ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                              : 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                          }`}
                        />
                      </div>
                    </div>
                    {errors.mobileNumber && (
                      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{errors.mobileNumber}</span>
                      </p>
                    )}
                  </div>

                  {/* Email Address */}
                  <div className={errors.email ? 'has-error' : ''}>
                    <label htmlFor="email" className="block text-xs font-bold text-gray-700 mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative rounded-xl shadow-2xs">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                        }}
                        placeholder="Enter email address"
                        className={`block w-full pl-10 pr-3.5 py-3 text-sm rounded-xl border bg-white focus:outline-none transition-colors ${
                          errors.email
                            ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                            : 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  id="submit-register-store-btn"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-75 disabled:cursor-not-allowed rounded-xl transition-all shadow-md hover:shadow-indigo-200 cursor-pointer group"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Creating Your Store & Generating Credentials...</span>
                    </>
                  ) : (
                    <>
                      <span>Register My Store</span>
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>

                {/* Footnote */}
                <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-gray-500">
                  <Lock className="w-3.5 h-3.5 text-gray-400" />
                  <span>Your information is secure and will never be shared.</span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
