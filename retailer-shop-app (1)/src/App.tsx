import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { LoginScreen } from './pages/LoginScreen';
import { DashboardScreen } from './pages/DashboardScreen';
import { OrdersListScreen } from './pages/OrdersListScreen';
import { OrderInfoScreen } from './pages/OrderInfoScreen';
import { ProductsScreen } from './pages/ProductsScreen';
import { AddProductScreen } from './pages/AddProductScreen';
import { DriverScreen } from './pages/DriverScreen';
import { SettingsScreen } from './pages/SettingsScreen';
import { PreparingScreen } from './pages/PreparingScreen';
import { ReadyScreen } from './pages/ReadyScreen';
import { AssignDeliveryScreen } from './pages/AssignDeliveryScreen';
import { OwnDeliveryBoyScreen } from './pages/OwnDeliveryBoyScreen';
import { DeliveryAssignedScreen } from './pages/DeliveryAssignedScreen';
import { OrderStatusScreen } from './pages/OrderStatusScreen';
import { BottomNav } from './components/common/BottomNav';
import { Toast } from './components/common/Toast';
import { CurrentScreen } from './types';

const MainAppContent: React.FC = () => {
  const { currentScreen } = useShop();

  const renderActiveScreen = (screen: CurrentScreen = currentScreen) => {
    switch (screen) {
      case 'login':
        return <LoginScreen />;
      case 'dashboard':
        return <DashboardScreen />;
      case 'orders':
      case 'orders_list':
        return <OrdersListScreen />;
      case 'order_info':
      case 'order_details':
        return <OrderInfoScreen />;
      case 'products':
        return <ProductsScreen />;
      case 'add_product':
        return <AddProductScreen />;
      case 'drivers':
      case 'delivery':
        return <DriverScreen />;
      case 'more':
      case 'settings':
        return <SettingsScreen />;
      // Sub-workflow states
      case 'preparing':
        return <PreparingScreen />;
      case 'ready':
        return <ReadyScreen />;
      case 'assign_delivery':
        return <AssignDeliveryScreen />;
      case 'own_delivery_boy':
        return <OwnDeliveryBoyScreen />;
      case 'delivery_assigned':
        return <DeliveryAssignedScreen />;
      case 'order_status':
        return <OrderStatusScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  const showBottomNav =
    currentScreen === 'dashboard' ||
    currentScreen === 'orders' ||
    currentScreen === 'orders_list' ||
    currentScreen === 'products' ||
    currentScreen === 'drivers' ||
    currentScreen === 'delivery' ||
    currentScreen === 'more' ||
    currentScreen === 'settings';

  return (
    <div className="min-h-screen bg-[#EDEBF5] flex flex-col items-center justify-center text-gray-900 font-sans p-0 sm:p-4">
      <Toast />

      {/* Interactive Mobile Phone Container */}
      <div className="w-full max-w-[420px] h-screen sm:h-[840px] sm:max-h-[90vh] bg-white sm:rounded-[36px] sm:shadow-[0_16px_48px_rgba(88,44,147,0.12)] sm:border sm:border-purple-100 relative flex flex-col overflow-hidden">
        {/* Scrollable Screen Content Viewport */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col">
          {renderActiveScreen()}
        </div>

        {/* Fixed Bottom Navigation Bar */}
        {showBottomNav && <BottomNav />}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <MainAppContent />
    </ShopProvider>
  );
}
