import React from 'react';
import { UserIcon } from './icons/UserIcon';

interface HeaderProps {
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  return (
    <header className="sticky top-0 bg-emerald-500 p-4 z-10 flex justify-between items-center text-white md:rounded-t-2xl">
      <div>
        <p className="text-sm font-light text-white/90">Xin chào,</p>
        <h1 className="text-xl font-bold">Nguyễn Văn A</h1>
      </div>
      <button onClick={onLogout} className="text-white/90 hover:text-white transition-colors" aria-label="Tài khoản">
        <UserIcon className="h-7 w-7" />
      </button>
    </header>
  );
};

export default Header;