import React, { useEffect, useState } from 'react';
import { Store, MapPin, Phone, ArrowLeft, Share2, Check } from 'lucide-react';
import { StoredRetailer } from '../../server/db';

interface StorePublicPageProps {
  uniqueStoreName: string;
  onBackToHome: () => void;
}

export const StorePublicPage: React.FC<StorePublicPageProps> = ({
  uniqueStoreName,
  onBackToHome,
}) => {
  const [store, setStore] = useState<Partial<StoredRetailer> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchStore() {
      try {
        setLoading(true);
        const res = await fetch(`/api/stores/${uniqueStoreName}`);
        if (!res.ok) {
          throw new Error('Store not found');
        }
        const data = await res.json();
        setStore(data);
      } catch (err: any) {
        setError(err.message || 'Unable to load store details.');
      } finally {
        setLoading(false);
      }
    }
    if (uniqueStoreName) {
      fetchStore();
    }
  }, [uniqueStoreName]);

  const copyStoreUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />
        <p className="text-sm font-semibold text-gray-500">Loading store profile...</p>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto">
          <Store className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Store Not Found</h2>
        <p className="text-xs text-gray-500">
          We could not find an active store with name <strong>{uniqueStoreName}</strong>.
        </p>
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      {/* Back button */}
      <button
        onClick={onBackToHome}
        className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-indigo-600 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to xyz.com Home</span>
      </button>

      {/* Main Store Card */}
      <div className="bg-white rounded-3xl border border-purple-100 shadow-md overflow-hidden">
        {/* Banner Strip */}
        <div className="h-24 bg-gradient-to-r from-indigo-600 to-indigo-800 relative px-6 flex items-end">
          <div className="translate-y-8 flex items-center gap-4">
            {store.storeLogo ? (
              <img
                src={store.storeLogo}
                alt={store.storeName}
                className="w-20 h-20 rounded-2xl border-4 border-white object-cover shadow-md bg-white"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl border-4 border-white bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-md font-bold text-2xl">
                🏪
              </div>
            )}
          </div>
        </div>

        <div className="pt-12 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-extrabold text-gray-900">{store.storeName}</h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Verified Store</span>
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Unique Store Name: <strong className="font-mono text-indigo-600">@{store.uniqueStoreName}</strong>
              </p>
            </div>

            <button
              onClick={copyStoreUrl}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'Link Copied!' : 'Share Store'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Store Address</p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5">{store.storeAddress}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Owner / Contact</p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5">{store.ownerName}</p>
                  <p className="text-xs text-gray-500">{store.countryCode} {store.mobileNumber}</p>
                </div>
              </div>
            </div>

            {/* QR Card */}
            {store.qrDataUrl && (
              <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 flex items-center gap-4">
                <img
                  src={store.qrDataUrl}
                  alt="Store QR"
                  className="w-24 h-24 rounded-xl border border-indigo-200 bg-white p-1 shrink-0"
                />
                <div className="space-y-1 text-xs">
                  <p className="font-bold text-gray-900">Official Store QR</p>
                  <p className="text-gray-500 leading-relaxed">
                    Scan with any smartphone camera to visit this store on xyz.com
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
