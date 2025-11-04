
import React from 'react';
import { View } from '../types';
import { LogoutIcon } from './icons/LogoutIcon';

interface HeaderProps {
  activeView: View;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeView, onLogout }) => {
  return (
    <header className="sticky top-0 bg-white shadow-sm p-4 z-10 flex justify-between items-center md:rounded-t-2xl">
      <h1 className="text-xl font-bold text-gray-800">{activeView}</h1>
      <button onClick={onLogout} className="text-gray-500 hover:text-red-600 transition-colors">
        <LogoutIcon className="h-6 w-6" />
      </button>
    </header>
  );
};

export default Header;
