import React, { useState } from 'react';
import { QrCode, Search, ShieldCheck, Bike, Award, Sparkles, MapPin, AlertCircle } from 'lucide-react';
import { Shop } from '../types';
import { api } from '../services/api';
import { QRScannerModal } from '../components/QRScannerModal';

interface HomeViewProps {
  onSelectShop: (shop: Shop) => void;
  onOpenAuth: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onSelectShop }) => {
  const [shopInput, setShopInput] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<Shop[] | null>(null);

  const handleFindShop = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearchError(null);
    setSearchResults(null);

    const query = shopInput.trim();
    if (!query) {
      setSearchError('Please enter a Shop ID or Shop Name (e.g. SUN123)');
      return;
    }

    try {
      setSearching(true);
      const results = await api.getShops(query);

      if (results.length === 0) {
        setSearchError('No shop found. Try another Shop ID or Shop Name (e.g. SUN123 or ROYAL456).');
        setSearchResults([]);
      } else if (results.length === 1) {
        // If exactly one match, open immediately
        onSelectShop(results[0]);
      } else {
        // Show list of matching shops
        setSearchResults(results);
      }
    } catch (err: any) {
      setSearchError(err.message || 'Error searching shops');
    } finally {
      setSearching(false);
    }
  };

  const handleQRScanned = async (qrPayload: string) => {
    setIsScannerOpen(false);
    setSearchError(null);
    try {
      setSearching(true);
      const shop = await api.getShopByQR(qrPayload);
      onSelectShop(shop);
    } catch (err: any) {
      setSearchError(err.message || 'Invalid xyz Shop QR Code');
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="pb-24 pt-2 px-4 max-w-md mx-auto space-y-5 animate-fade-in">
      {/* Hero Header matching design */}
      <div className="text-center pt-2 pb-1">
        <div className="inline-flex items-center justify-center gap-1.5 mb-1.5 px-3 py-1 bg-red-50 text-red-700 rounded-full text-[11px] font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Local Retailer Network</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight leading-tight">
          Fresh Chicken <br />
          <span className="text-red-600">From Your Trusted Shops</span>
        </h1>
        <p className="text-xs text-neutral-500 mt-2 max-w-xs mx-auto leading-relaxed">
          Scan shop QR or enter Shop ID to view fresh products and order directly.
        </p>
      </div>

      {/* Main Action Box: QR + Shop ID search (Strictly matching reference design #1) */}
      <div className="bg-white rounded-3xl p-5 shadow-xl shadow-neutral-100 border border-neutral-200/80 space-y-4">
        {/* Option 1: Scan Shop QR Code */}
        <div className="text-center space-y-3">
          <span className="text-xs font-black uppercase tracking-wider text-neutral-700 block">
            Scan Shop QR Code
          </span>

          {/* QR Viewfinder Graphic */}
          <div className="relative w-36 h-36 mx-auto bg-neutral-50 rounded-2xl flex items-center justify-center border border-neutral-200/70 p-4">
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Corner brackets */}
              <div className="absolute -top-1 -left-1 w-5 h-5 border-t-2 border-l-2 border-red-600 rounded-tl-sm" />
              <div className="absolute -top-1 -right-1 w-5 h-5 border-t-2 border-r-2 border-red-600 rounded-tr-sm" />
              <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-2 border-l-2 border-red-600 rounded-bl-sm" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-2 border-r-2 border-red-600 rounded-br-sm" />

              <QrCode className="w-16 h-16 text-neutral-800" strokeWidth={1.5} />
            </div>
          </div>

          <button
            id="btn-open-scanner"
            onClick={() => setIsScannerOpen(true)}
            className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white font-bold text-xs rounded-xl shadow-md shadow-red-200 transition-all flex items-center justify-center gap-2"
          >
            <QrCode className="w-4 h-4" />
            <span>Open Scanner</span>
          </button>
        </div>

        {/* Divider "or" */}
        <div className="relative flex items-center justify-center my-2">
          <div className="border-t border-neutral-200 w-full" />
          <span className="bg-white px-3 text-[11px] font-bold text-neutral-400 uppercase tracking-widest absolute">
            or
          </span>
        </div>

        {/* Option 2: Enter Shop ID / Shop Name */}
        <div className="space-y-2.5">
          <label className="text-xs font-black uppercase tracking-wider text-neutral-700 block text-center">
            Enter Shop ID / Name
          </label>

          <form onSubmit={handleFindShop} className="space-y-2.5">
            <div className="relative">
              <input
                id="shop-id-search-input"
                type="text"
                value={shopInput}
                onChange={e => setShopInput(e.target.value)}
                placeholder="e.g. SUN123 or Sun Chicken Shop"
                className="w-full px-4 py-3 text-xs bg-neutral-50/70 border border-neutral-200 rounded-xl text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-medium text-center sm:text-left"
              />
            </div>

            <button
              id="btn-find-shop"
              type="submit"
              disabled={searching}
              className="w-full py-3 px-4 bg-neutral-900 hover:bg-black active:scale-[0.99] text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{searching ? 'Searching Database...' : 'Find Shop'}</span>
            </button>
          </form>
        </div>

        {/* Search Error Message */}
        {searchError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-start gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">{searchError}</p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                <span className="text-[10px] text-neutral-500">Try demo shop IDs:</span>
                <button
                  onClick={() => {
                    setShopInput('SUN123');
                    api.getShops('SUN123').then(r => r.length && onSelectShop(r[0]));
                  }}
                  className="text-[10px] font-bold text-red-600 underline"
                >
                  SUN123
                </button>
                <span className="text-[10px] text-neutral-300">•</span>
                <button
                  onClick={() => {
                    setShopInput('ROYAL456');
                    api.getShops('ROYAL456').then(r => r.length && onSelectShop(r[0]));
                  }}
                  className="text-[10px] font-bold text-red-600 underline"
                >
                  ROYAL456
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search Results if multiple found */}
        {searchResults && searchResults.length > 1 && (
          <div className="space-y-2 pt-2 border-t border-neutral-100">
            <div className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider">
              Matching Shops ({searchResults.length}):
            </div>
            {searchResults.map(s => (
              <div
                key={s.id}
                onClick={() => onSelectShop(s)}
                className="p-3 bg-neutral-50 hover:bg-red-50 border border-neutral-200 hover:border-red-300 rounded-xl cursor-pointer transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-bold text-neutral-900 group-hover:text-red-600">
                    {s.shop_name}
                  </div>
                  <div className="text-[10px] text-neutral-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-2.5 h-2.5 text-red-500" />
                    <span>{s.address}</span>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Trust Badges matching reference design */}
      <div className="grid grid-cols-3 gap-2 py-2">
        <div className="flex flex-col items-center text-center p-3 bg-white rounded-2xl border border-neutral-100 shadow-xs">
          <div className="w-9 h-9 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-1.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-neutral-800 leading-tight">
            Fresh & Hygienic
          </span>
        </div>

        <div className="flex flex-col items-center text-center p-3 bg-white rounded-2xl border border-neutral-100 shadow-xs">
          <div className="w-9 h-9 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-1.5">
            <Bike className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-neutral-800 leading-tight">
            Fast Delivery
          </span>
        </div>

        <div className="flex flex-col items-center text-center p-3 bg-white rounded-2xl border border-neutral-100 shadow-xs">
          <div className="w-9 h-9 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-1.5">
            <Award className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-neutral-800 leading-tight">
            Trusted Shops
          </span>
        </div>
      </div>

      {/* QR Scanner Modal */}
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleQRScanned}
      />
    </div>
  );
};
