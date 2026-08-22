import React from 'react';
import { DriverProvider, useDriver } from './context/DriverContext';
import { AuthScreen } from './components/AuthScreen';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { AvailableOrdersView } from './components/AvailableOrdersView';
import { NavigationTabView } from './components/NavigationTabView';
import { EarningsView } from './components/EarningsView';
import { HistoryView } from './components/HistoryView';
import { ProfileView } from './components/ProfileView';
import { CallModal } from './components/CallModal';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { currentDriver, activeTab, callingContact, setCallingContact, notification, setNotification } = useDriver();

  if (!currentDriver) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-900 flex justify-center selection:bg-blue-500 selection:text-white">
      {/* Mobile-First Centered Container */}
      <div className="w-full max-w-md bg-slate-50 min-h-screen flex flex-col relative shadow-2xl overflow-x-hidden border-x border-slate-800/40">
        
        {/* Top Header */}
        <Header />

        {/* Global Toast Notification */}
        {notification && (
          <div className="fixed top-16 left-0 right-0 z-50 px-4 max-w-md mx-auto pointer-events-none">
            <div className="bg-slate-900/95 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center justify-between pointer-events-auto animate-bounce-subtle">
              <div className="flex items-center gap-2">
                {notification.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : notification.type === 'warning' ? (
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                ) : (
                  <Info className="w-4 h-4 text-blue-400 shrink-0" />
                )}
                <span>{notification.message}</span>
              </div>
              <button
                onClick={() => setNotification(null)}
                className="p-1 hover:text-slate-300 ml-2"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Tab Content Body */}
        <main className="flex-1 px-4 py-3 overflow-y-auto">
          {activeTab === 'home' && <DashboardView />}
          {activeTab === 'orders' && <AvailableOrdersView />}
          {activeTab === 'navigation' && <NavigationTabView />}
          {activeTab === 'earnings' && <EarningsView />}
          {activeTab === 'history' && <HistoryView />}
          {activeTab === 'profile' && <ProfileView />}
        </main>

        {/* Bottom Tab Bar */}
        <BottomNav />

        {/* Functional Phone Call Sheet */}
        {callingContact && (
          <CallModal contact={callingContact} onClose={() => setCallingContact(null)} />
        )}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <DriverProvider>
      <MainAppContent />
    </DriverProvider>
  );
}
