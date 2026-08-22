import React from 'react';
import { ChevronLeft, Menu, Bell } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  showMenu?: boolean;
  onMenuClick?: () => void;
  showNotifications?: boolean;
  onNotificationClick?: () => void;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'Dashboard',
  showBack = false,
  onBack,
  showMenu = false,
  onMenuClick,
  showNotifications = false,
  onNotificationClick,
  rightAction,
}) => {
  const { goBack } = useShop();

  const handleBack = () => {
    if (onBack) onBack();
    else goBack();
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100 px-4 py-3.5 flex items-center justify-between min-h-[56px]">
      {/* Left Slot: Back button or Menu */}
      <div className="flex items-center w-8">
        {showBack ? (
          <button
            onClick={handleBack}
            id="header-back-button"
            className="p-1 -ml-1 text-gray-800 hover:text-gray-950 transition-colors cursor-pointer"
            aria-label="Go back"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
          </button>
        ) : showMenu ? (
          <button
            onClick={onMenuClick}
            id="header-menu-button"
            className="p-1 -ml-1 text-gray-800 hover:text-gray-950 transition-colors cursor-pointer"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5 stroke-[2.2]" />
          </button>
        ) : null}
      </div>

      {/* Center: Exact Title */}
      <div className="flex-1 text-center">
        <h1 className="text-[15px] sm:text-base font-bold text-gray-900 tracking-tight">
          {title}
        </h1>
      </div>

      {/* Right Slot: Notification or custom action */}
      <div className="flex items-center justify-end w-8">
        {rightAction ? (
          rightAction
        ) : showNotifications ? (
          <button
            onClick={onNotificationClick}
            id="header-notification-button"
            className="p-1 -mr-1 text-gray-800 hover:text-gray-950 transition-colors cursor-pointer relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 stroke-[2]" />
          </button>
        ) : null}
      </div>
    </header>
  );
};
