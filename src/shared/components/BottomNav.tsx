import React from 'react';
import { View } from '../types/navigation';
import { HomeIcon } from './icons/HomeIcon';
import { PackageIcon } from './icons/PackageIcon';
import { CubeIcon } from './icons/CubeIcon';
import { StoreIcon } from './icons/StoreIcon';

interface BottomNavProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const NavItem: React.FC<{
  view: View;
  label: string;
  isActive: boolean;
  onClick: (view: View) => void;
  children: React.ReactNode;
  notificationCount?: number;
}> = ({ view, label, isActive, onClick, children, notificationCount }) => {
  const activeClass = isActive ? 'text-emerald-600' : 'text-gray-500';
  return (
    <button
      onClick={() => onClick(view)}
      className={`relative flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors hover:text-emerald-500 ${activeClass}`}
    >
      {notificationCount && notificationCount > 0 && (
         <span className="absolute top-1 right-1/2 -mr-5 px-1.5 py-0.5 text-xs font-semibold text-white bg-red-500 rounded-full">
            {notificationCount}
         </span>
      )}
      {children}
      <span className="text-xs mt-1">{label}</span>
    </button>
  );
};

const BottomNav: React.FC<BottomNavProps> = ({ activeView, setActiveView }) => {
  const navItems = [
    { view: View.Dashboard, label: 'Báo cáo', icon: <HomeIcon className="h-6 w-6" />, notificationCount: 0 },
    { view: View.Orders, label: 'Đơn hàng', icon: <PackageIcon className="h-6 w-6" />, notificationCount: 2 },
    { view: View.Products, label: 'Sản phẩm', icon: <CubeIcon className="h-6 w-6" />, notificationCount: 0 },
    { view: View.Store, label: 'Cửa hàng', icon: <StoreIcon className="h-6 w-6" />, notificationCount: 0 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 shadow-t-md flex md:max-w-lg md:mx-auto md:rounded-b-2xl">
      {navItems.map(item => (
        <NavItem
          key={item.view}
          view={item.view}
          label={item.label}
          isActive={activeView === item.view}
          onClick={setActiveView}
          notificationCount={item.notificationCount}
        >
          {item.icon}
        </NavItem>
      ))}
    </nav>
  );
};

export default BottomNav;