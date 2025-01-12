import React from 'react';
import { Home, User, Calendar, ArrowLeft } from 'lucide-react';

interface SidebarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function Sidebar({ onNavigate, currentPage }: SidebarProps) {
  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'bookings', label: 'My Bookings', icon: Calendar },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r">
      <div className="p-4">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </button>
        
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors
                  ${currentPage === item.id 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}