import React, { useState } from 'react';
import {
  CheckCircle2,
  Copy,
  Check,
  Download,
  Store,
  ArrowRight,
  Headphones,
  QrCode,
  Smartphone,
  Layers,
  ShoppingBag,
  Lock,
  Sparkles,
} from 'lucide-react';
import { ShopIllustration } from '../components/ShopIllustration';
import { RetailerRegistrationResponse } from '../types';

interface SuccessPageProps {
  data: RetailerRegistrationResponse;
  onGoToRetailerApp: () => void;
  onContactSupport: () => void;
}

export const SuccessPage: React.FC<SuccessPageProps> = ({
  data,
  onGoToRetailerApp,
  onContactSupport,
}) => {
  const [copiedStoreName, setCopiedStoreName] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Copy helpers
  const copyText = (text: string, type: 'name' | 'password' | 'link') => {
    navigator.clipboard.writeText(text);
    if (type === 'name') {
      setCopiedStoreName(true);
      setTimeout(() => setCopiedStoreName(false), 2000);
    } else if (type === 'password') {
      setCopiedPassword(true);
      setTimeout(() => setCopiedPassword(false), 2000);
    } else if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Download high-resolution branded QR card
  const downloadQrCode = () => {
    setIsDownloading(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 750;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Background
      ctx.fillStyle = '#FAF9FF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Card Container
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#E0E7FF';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(30, 30, 540, 690, 24);
      ctx.fill();
      ctx.stroke();

      // Header Bar
      ctx.fillStyle = '#4F46E5';
      ctx.fillRect(30, 30, 540, 20);

      // Brand Title
      ctx.fillStyle = '#1E1B4B';
      ctx.font = 'bold 32px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('xyz.com', 300, 95);

      // Store Name
      ctx.fillStyle = '#4F46E5';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText(data.storeName || 'Local Store', 300, 135);

      // Unique Store Name Subtitle
      ctx.fillStyle = '#6B7280';
      ctx.font = '16px monospace';
      ctx.fillText(`@${data.uniqueStoreName}`, 300, 165);

      // Load and Draw QR Code
      const qrImg = new Image();
      qrImg.crossOrigin = 'anonymous';
      qrImg.onload = () => {
        ctx.drawImage(qrImg, 150, 200, 300, 300);

        // Footer details on QR
        ctx.fillStyle = '#1E1B4B';
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText('Scan to Browse & Order Online', 300, 540);

        ctx.fillStyle = '#6366F1';
        ctx.font = '16px monospace';
        ctx.fillText(data.storeLink, 300, 580);

        // Download trigger
        const a = document.createElement('a');
        a.download = `xyz-${data.uniqueStoreName}-QR.png`;
        a.href = canvas.toDataURL('image/png');
        a.click();
        setIsDownloading(false);
      };
      qrImg.src = data.qrDataUrl;
    } catch (err) {
      console.error('Download QR failed:', err);
      setIsDownloading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-12">
      {/* 1. MAIN SUCCESS & CREDENTIALS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Celebration message & illustration */}
        <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
          {/* Store Celebration Graphic with green check */}
          <div className="bg-gradient-to-b from-indigo-50/70 to-white p-6 rounded-3xl border border-indigo-100 flex items-center justify-center relative overflow-hidden">
            <ShopIllustration variant="success" className="max-w-[240px]" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E1B4B] tracking-tight">
              Registration <span className="text-indigo-600">Successful!</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Your store has been registered successfully. Here's everything you need to get started.
            </p>
          </div>

          {/* Welcome Card */}
          <div className="p-4 sm:p-5 bg-indigo-50/60 rounded-2xl border border-indigo-100/70 flex items-center gap-3.5 text-left">
            <div className="w-11 h-11 rounded-xl bg-white border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-2xs shrink-0">
              <Sparkles className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">
                Welcome to <span className="text-indigo-600">xyz.com</span>
              </h4>
              <p className="text-xs text-gray-600 mt-0.5">
                We're excited to have <strong>{data.storeName}</strong> on board.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Credentials & QR Card */}
        <div className="lg:col-span-7 space-y-4">
          {/* Green Status Banner */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 text-left shadow-2xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-emerald-900">Your Store is Ready!</h3>
              <p className="text-xs text-emerald-700 mt-0.5 leading-relaxed">
                Use the credentials below to log in to your retailer app and start managing your store.
              </p>
            </div>
          </div>

          {/* 1. Store Credentials Card */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-purple-100 shadow-xs space-y-3.5">
            <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
              <Lock className="w-4 h-4 text-indigo-600" />
              <span>Store Credentials</span>
            </div>

            <div className="bg-indigo-50/40 p-4 rounded-xl border border-indigo-100/70 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              {/* Credentials Grid */}
              <div className="grid grid-cols-2 gap-4 flex-1">
                <div>
                  <span className="text-[11px] font-semibold text-gray-500 block">Username</span>
                  <span className="text-base sm:text-lg font-extrabold text-indigo-600 tracking-wide font-mono">
                    {data.username}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-gray-500 block">Password</span>
                  <span className="text-base sm:text-lg font-extrabold text-indigo-900 tracking-wide font-mono">
                    {data.temporaryPassword}
                  </span>
                </div>
              </div>

              {/* Copy Credentials Buttons */}
              <div className="flex sm:flex-col gap-2 shrink-0">
                <button
                  id="copy-store-id-btn"
                  onClick={() => copyText(data.username, 'name')}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-700 bg-white hover:bg-indigo-50 border border-indigo-200 rounded-lg transition-colors cursor-pointer shadow-2xs"
                >
                  {copiedStoreName ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedStoreName ? 'Username Copied!' : 'Copy Username'}</span>
                </button>

                <button
                  id="copy-password-btn"
                  onClick={() => copyText(data.temporaryPassword, 'password')}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-700 bg-white hover:bg-indigo-50 border border-indigo-200 rounded-lg transition-colors cursor-pointer shadow-2xs"
                >
                  {copiedPassword ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPassword ? 'Pass Copied!' : 'Copy Pass'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* 2. Your Store QR Code Card */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-purple-100 shadow-xs">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
              <div className="space-y-1 text-center sm:text-left flex-1">
                <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-900 font-bold text-sm">
                  <QrCode className="w-4 h-4 text-indigo-600" />
                  <span>Your Store QR Code</span>
                </div>
                <p className="text-xs text-gray-500">
                  Share this QR code with your customers to let them order directly.
                </p>
                <div className="pt-2 hidden sm:block">
                  <button
                    id="download-qr-btn-desktop"
                    onClick={downloadQrCode}
                    disabled={isDownloading}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isDownloading ? 'Generating...' : 'Download QR Code'}</span>
                  </button>
                </div>
              </div>

              {/* High-res QR Display */}
              <div className="shrink-0 flex flex-col items-center gap-2">
                <div className="p-2 bg-white rounded-xl border-2 border-indigo-100 shadow-sm">
                  <img
                    src={data.qrDataUrl}
                    alt={`QR code for ${data.storeName}`}
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-lg"
                  />
                </div>
                {/* Mobile Download button */}
                <div className="sm:hidden w-full">
                  <button
                    id="download-qr-btn-mobile"
                    onClick={downloadQrCode}
                    disabled={isDownloading}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isDownloading ? 'Generating...' : 'Download QR'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Your Store Link Card */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-purple-100 shadow-xs space-y-2.5">
            <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
              <span className="text-indigo-600">🔗</span>
              <span>Your Store Link</span>
            </div>
            <p className="text-xs text-gray-500">
              Share this link with your customers on WhatsApp, SMS, or social media.
            </p>

            <div className="flex items-center gap-2 p-2 bg-indigo-50/50 rounded-xl border border-indigo-100">
              <input
                type="text"
                readOnly
                value={data.storeLink}
                className="flex-1 bg-transparent px-2 text-xs sm:text-sm font-semibold text-indigo-900 font-mono focus:outline-none select-all"
              />
              <button
                id="copy-store-link-btn"
                onClick={() => copyText(data.storeLink, 'link')}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer shrink-0 shadow-2xs"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. WHAT'S NEXT SECTION */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-xs space-y-6">
        <h2 className="text-lg sm:text-xl font-extrabold text-[#1E1B4B] text-center">
          What's Next?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-indigo-50/40 p-5 rounded-2xl border border-indigo-100/60 flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-white border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-2xs relative">
              <Smartphone className="w-6 h-6" />
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                1
              </span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Login to Retailer App</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Use your Unique Store Name and Password to login to the retailer app.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-purple-50/40 p-5 rounded-2xl border border-purple-100/60 flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-white border border-purple-100 flex items-center justify-center text-purple-600 shadow-2xs relative">
              <Layers className="w-6 h-6" />
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center">
                2
              </span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Set Up Your Store</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Add your products, set delivery settings and customize your store.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-emerald-50/40 p-5 rounded-2xl border border-emerald-100/60 flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-white border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-2xs relative">
              <ShoppingBag className="w-6 h-6" />
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                3
              </span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Start Receiving Orders</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Your store is now online. Start receiving orders from customers!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. READY TO START MANAGING & SUPPORT BAR */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Left Action: Go to Retailer App */}
        <div className="md:col-span-7 bg-white p-5 rounded-2xl border border-purple-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Ready to start managing your store?</h3>
            <p className="text-xs text-gray-500">Access your retailer console</p>
          </div>
          <button
            id="go-to-retailer-app-btn"
            onClick={onGoToRetailerApp}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl transition-all shadow-sm cursor-pointer group"
          >
            <Store className="w-4 h-4" />
            <span>Go to Retailer App</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Right Action: Need Help? Contact Support */}
        <div className="md:col-span-5 bg-white p-5 rounded-2xl border border-purple-100 shadow-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-900">Need Help?</h3>
              <p className="text-[11px] text-gray-500">We're here to help you anytime.</p>
            </div>
          </div>
          <button
            onClick={onContactSupport}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1 cursor-pointer shrink-0"
          >
            <span>Contact Support</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
