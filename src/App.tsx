import React, { useState, useCallback } from 'react';
import Login from './features/auth/Login';
import Dashboard from './features/dashboard/Dashboard';
import Orders from './features/orders/Orders';
import Products from './features/products/Products';
import Store from './features/store/Store';
import BottomNav from './shared/components/BottomNav';
import Header from './shared/components/Header';
import { View } from './shared/types/navigation';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeView, setActiveView] = useState<View>(View.Dashboard);

  const handleLogin = useCallback(() => {
    setIsLoggedIn(true);
  }, []);

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    setActiveView(View.Dashboard);
  }, []);

  const renderActiveView = () => {
    switch (activeView) {
      case View.Dashboard:
        return <Dashboard />;
      case View.Orders:
        return <Orders />;
      case View.Products:
        return <Products />;
      case View.Store:
        return <Store />;
      default:
        return <Dashboard />;
    }
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col justify-between md:max-w-lg md:mx-auto md:shadow-2xl">
      <Header onLogout={handleLogout} />
      <main className="flex-grow p-4 pb-20 overflow-y-auto bg-gray-50/50">
        {renderActiveView()}
      </main>
      <BottomNav activeView={activeView} setActiveView={setActiveView} />
    </div>
  );
};

export default App;