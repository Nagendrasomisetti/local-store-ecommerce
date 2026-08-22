import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SupportModal } from './components/SupportModal';
import { RetailerAppModal } from './components/RetailerAppModal';
import { HomePage } from './pages/HomePage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { RegisterPage } from './pages/RegisterPage';
import { SuccessPage } from './pages/SuccessPage';
import { StorePublicPage } from './pages/StorePublicPage';
import { RetailerRegistrationResponse } from './types';

export default function App() {
  // Navigation Path
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  // Registered Data state
  const [registrationData, setRegistrationData] = useState<RetailerRegistrationResponse | null>(() => {
    const cached = sessionStorage.getItem('xyz_last_registration');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        return null;
      }
    }
    return null;
  });

  // Modal visibility
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isRetailerAppModalOpen, setIsRetailerAppModalOpen] = useState(false);

  // Sync browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Programmatic navigation
  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle successful registration
  const handleRegistrationSuccess = (data: RetailerRegistrationResponse) => {
    setRegistrationData(data);
    sessionStorage.setItem('xyz_last_registration', JSON.stringify(data));
    navigate('/registration-success');
  };

  // Render active page based on current route
  const renderCurrentPage = () => {
    // 1. Store Public Profile route: /store/:uniqueStoreName (or legacy /shop/:name)
    if (currentPath.startsWith('/store/')) {
      const uniqueStoreName = currentPath.replace('/store/', '').trim();
      return (
        <StorePublicPage
          uniqueStoreName={uniqueStoreName}
          onBackToHome={() => navigate('/')}
        />
      );
    }
    if (currentPath.startsWith('/shop/')) {
      const uniqueStoreName = currentPath.replace('/shop/', '').trim();
      return (
        <StorePublicPage
          uniqueStoreName={uniqueStoreName}
          onBackToHome={() => navigate('/')}
        />
      );
    }

    // 2. Success Page
    if (currentPath === '/registration-success') {
      if (registrationData) {
        return (
          <SuccessPage
            data={registrationData}
            onGoToRetailerApp={() => setIsRetailerAppModalOpen(true)}
            onContactSupport={() => setIsSupportModalOpen(true)}
          />
        );
      } else {
        return (
          <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
            <h2 className="text-xl font-bold text-gray-900">No Active Registration Found</h2>
            <p className="text-xs text-gray-500">
              Please complete the registration form to receive your store credentials.
            </p>
            <button
              onClick={() => navigate('/register')}
              className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors cursor-pointer"
            >
              Register Your Store Now
            </button>
          </div>
        );
      }
    }

    // 3. Register Page
    if (currentPath === '/register') {
      return (
        <RegisterPage
          onSuccess={handleRegistrationSuccess}
          onContactSupport={() => setIsSupportModalOpen(true)}
        />
      );
    }

    // 4. How It Works Page
    if (currentPath === '/how-it-works') {
      return <HowItWorksPage onNavigate={navigate} />;
    }

    // 5. Default: Home Page
    return <HomePage onNavigate={navigate} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9FF] text-[#1E1B4B]">
      {/* Top Navbar */}
      <Navbar currentPath={currentPath} onNavigate={navigate} />

      {/* Main Content Area */}
      <main className="flex-1">{renderCurrentPage()}</main>

      {/* Footer */}
      <Footer onContactSupport={() => setIsSupportModalOpen(true)} />

      {/* Support Dialog */}
      <SupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />

      {/* Retailer App Next Steps Dialog */}
      <RetailerAppModal
        isOpen={isRetailerAppModalOpen}
        onClose={() => setIsRetailerAppModalOpen(false)}
        uniqueStoreName={registrationData?.uniqueStoreName}
        storeName={registrationData?.storeName}
        temporaryPassword={registrationData?.temporaryPassword}
      />
    </div>
  );
}
