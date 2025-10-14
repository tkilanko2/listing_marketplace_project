import React, { useState, useRef } from 'react';
import { UserCircle, LogOut, User, ShoppingBag, LayoutDashboard, UserPlus, Settings, ShoppingCart, Bell, Menu, X } from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  isAuthenticated: boolean;
  user: { 
    name: string; 
    email: string;
    imageUrl?: string;
    status?: 'online' | 'offline' | 'away';
    userId: string;
  } | null;
  onLogin: (email: string, password: string) => void;
  onSignup: (email: string, password: string) => void;
  onLogout: () => void;
  onHomeClick: () => void;
  onLanguageChange: (language: string) => void;
  selectedLanguage: string;
  onListingSelect: (listing: Product) => void;
  onSellNowClick: () => void;
  onNavigateTo: (page: string) => void;
}

export function Navbar({ 
  isAuthenticated, 
  user, 
  onLogin, 
  onSignup, 
  onLogout, 
  onHomeClick,
  onLanguageChange,
  selectedLanguage,
  onListingSelect,
  onSellNowClick,
  onNavigateTo
}: NavbarProps) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { getCartCount } = useCart();

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
    setShowLoginModal(false);
    setEmail('');
    setPassword('');
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignup(email, password);
    setShowSignupModal(false);
    setEmail('');
    setPassword('');
  };

  const AuthModal = ({ 
    isOpen, 
    onClose, 
    title, 
    onSubmit 
  }: { 
    isOpen: boolean; 
    onClose: () => void; 
    title: string; 
    onSubmit: (e: React.FormEvent) => void;
  }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">{title}</h2>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#3D1560] text-white px-4 py-2 rounded-md hover:bg-[#6D26AB]"
              >
                {title}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div 
              className="flex-shrink-0 flex items-center cursor-pointer hover:opacity-80 transition-opacity"
              onClick={onHomeClick}
            >
              <h1 className="text-xl md:text-2xl font-bold text-[#3D1560]">ExpaTray</h1>
            </div>
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={onSellNowClick}
              className="px-4 py-2 bg-[#3D1560] hover:bg-[#6D26AB] text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
            >
              List and Earn
            </button>

            <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
                3
              </div>
              <Bell className="w-6 h-6 text-gray-700" />
            </button>

            <button 
              className="relative p-2 hover:bg-gray-100 rounded-full"
              onClick={() => onNavigateTo('cart')}
            >
              <div className="absolute -top-1 -right-1 bg-[#3D1560] text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
                {getCartCount()}
              </div>
              <ShoppingCart className="w-6 h-6 text-gray-700" />
            </button>

            {isAuthenticated ? (
              <div className="relative group">
                <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-full group-hover:pr-3">
                  <div className="relative">
                    {user?.imageUrl ? (
                      <img 
                        src={user.imageUrl} 
                        alt={user.name} 
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <UserCircle className="w-8 h-8 text-[#3D1560]" />
                    )}
                    <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                      user?.status === 'online' ? 'bg-green-500' :
                      user?.status === 'away' ? 'bg-yellow-500' :
                      'bg-gray-500'
                    }`} />
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden group-hover:block">{user?.userId || 'CM7by141boza'}</span>
                </div>
                
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-100 transform transition-all duration-200 ease-out origin-top-right opacity-0 invisible group-hover:opacity-100 group-hover:visible">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      {user?.imageUrl ? (
                        <img 
                          src={user.imageUrl} 
                          alt={user.name} 
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <UserCircle className="w-10 h-10 text-[#3D1560]" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user?.userId || 'CM7by141boza'}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                        <p className="text-xs text-gray-500 flex items-center">
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            user?.status === 'online' ? 'bg-green-500' :
                            user?.status === 'away' ? 'bg-yellow-500' :
                            'bg-gray-500'
                          }`} />
                          {user?.status || 'offline'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="py-1">
                    <button 
                      onClick={() => onNavigateTo('profile')}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 group"
                    >
                      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-50 group-hover:bg-blue-100 mr-3">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <span>My Profile</span>
                    </button>
                    <button 
                      onClick={() => onNavigateTo('myOrders')}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 group"
                    >
                      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-50 group-hover:bg-purple-100 mr-3">
                        <ShoppingBag className="w-4 h-4 text-purple-600" />
                      </div>
                      <span>My Orders</span>
                    </button>
                    <button 
                      onClick={() => onNavigateTo('sellerDashboard')}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 group"
                    >
                      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-50 group-hover:bg-green-100 mr-3">
                        <LayoutDashboard className="w-4 h-4 text-green-600" />
                      </div>
                      <span>Seller Dashboard</span>
                    </button>
                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 group">
                      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-50 group-hover:bg-yellow-100 mr-3">
                        <UserPlus className="w-4 h-4 text-yellow-600" />
                      </div>
                      <span>Invite Friends</span>
                    </button>
                    <button 
                      onClick={() => onNavigateTo('settings')}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 group"
                    >
                      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 group-hover:bg-gray-100 mr-3">
                        <Settings className="w-4 h-4 text-gray-600" />
                      </div>
                      <span>Settings</span>
                    </button>
                  </div>
                  <div className="border-t border-gray-100">
                    <button 
                      onClick={onLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50 group"
                    >
                      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 group-hover:bg-red-100 mr-3">
                        <LogOut className="w-4 h-4 text-red-600" />
                      </div>
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-sm">
                <button 
                  onClick={() => onNavigateTo('signin')} 
                  className="text-gray-700 hover:text-[#3D1560]"
                >
                  Login
                </button>
                <span className="text-[#CDCED8]">|</span>
                <button 
                  onClick={() => onNavigateTo('signup')} 
                  className="text-gray-700 hover:text-[#3D1560]"
                >
                  Signup
                </button>
              </div>
            )}

            <LanguageSelector onLanguageChange={onLanguageChange} />
          </div>
        </div>
      </div>

      <div className={`md:hidden ${showMobileMenu ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 border-t">
          <button
            onClick={onSellNowClick}
            className="w-full text-left px-3 py-2 text-base font-medium text-[#3D1560] hover:bg-[#EDD9FF] rounded-md"
          >
            List and Earn
          </button>

          {!isAuthenticated && (
            <div className="space-y-2">
              <button
                onClick={() => {
                  onNavigateTo('signin');
                  setShowMobileMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md"
              >
                Login
              </button>
              <button
                onClick={() => {
                  onNavigateTo('signup');
                  setShowMobileMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md"
              >
                Signup
              </button>
            </div>
          )}

          <div className="px-3 py-2 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-full">
                <Bell className="w-6 h-6 text-gray-700" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
                  3
                </span>
              </button>

              <button className="relative p-2 hover:bg-gray-100 rounded-full">
                <ShoppingCart className="w-6 h-6 text-gray-700" />
                <span className="absolute -top-1 -right-1 bg-[#3D1560] text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
                  {getCartCount()}
                </span>
              </button>
            </div>

            <LanguageSelector onLanguageChange={onLanguageChange} />
          </div>

          {isAuthenticated && (
            <div className="border-t pt-4 pb-3">
              <div className="px-3 flex items-center">
                {user?.imageUrl ? (
                  <img 
                    src={user.imageUrl} 
                    alt={user.name} 
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <UserCircle className="w-10 h-10 text-blue-600" />
                )}
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{user?.userId}</div>
                  <div className="text-sm font-medium text-gray-500">{user?.email}</div>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-1">
                <button 
                  onClick={() => {
                    onNavigateTo('profile');
                    setShowMobileMenu(false);
                  }}
                  className="w-full flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  <User className="w-5 h-5 mr-3 text-gray-400" />
                  Profile
                </button>
                <button 
                  onClick={() => {
                    onNavigateTo('myOrders');
                    setShowMobileMenu(false);
                  }}
                  className="w-full flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  <ShoppingBag className="w-5 h-5 mr-3 text-gray-400" />
                  Orders
                </button>
                <button 
                  onClick={() => {
                    onNavigateTo('myReviews');
                    setShowMobileMenu(false);
                  }}
                  className="w-full flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  <User className="w-5 h-5 mr-3 text-gray-400" />
                  My Reviews
                </button>
                <button 
                  onClick={() => {
                    onNavigateTo('settings');
                    setShowMobileMenu(false);
                  }}
                  className="w-full flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  <Settings className="w-5 h-5 mr-3 text-gray-400" />
                  Settings
                </button>
                <button 
                  onClick={() => {
                    onLogout();
                    setShowMobileMenu(false);
                  }}
                  className="w-full flex items-center px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md"
                >
                  <LogOut className="w-5 h-5 mr-3 text-red-500" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Auth modals kept for future use but not shown via Navbar actions */}
    </nav>
  );
}