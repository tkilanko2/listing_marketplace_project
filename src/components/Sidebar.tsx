import React from 'react';
import { Home, User, ShoppingBag, LayoutDashboard, Settings, Calendar, ArrowLeft, ChevronDown } from 'lucide-react';

interface SidebarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function Sidebar({ onNavigate, currentPage }: SidebarProps) {
  const menuItems = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'myOrders', label: 'My Orders', icon: ShoppingBag },
    { id: 'sellerDashboard', label: 'Seller Dashboard', icon: LayoutDashboard, subItems: [
      { id: 'sellerDashboard_overview', label: 'Overview' },
      { id: 'sellerDashboard_myShop', label: 'My Shop' },
      { id: 'sellerDashboard_orders', label: 'Orders' },
      { id: 'sellerDashboard_appointments', label: 'Appointments' },
      { id: 'sellerDashboard_finance', label: 'Finance' }
    ]},
    { id: 'settings', label: 'Settings', icon: Settings }
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
            const isActive = currentPage === item.id || (item.subItems && item.subItems.some(sub => currentPage === sub.id));
            return (
              <div key={item.id} className="mb-2">
                <button
                  onClick={() => {
                    if (item.subItems) {
                      // If it has subitems, navigate to the first subitem or overview
                      onNavigate(item.subItems[0].id);
                    } else {
                      onNavigate(item.id);
                    }
                  }}
                  className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  {Icon && <Icon className="w-5 h-5" />}
                  <span>{item.label}</span>
                  {item.subItems && <ChevronDown className="w-4 h-4 ml-auto" />}
                </button>
                {item.subItems && isActive && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.subItems.map(subItem => (
                      <button
                        key={subItem.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate(subItem.id);
                        }}
                        className={`flex items-center space-x-3 w-full px-4 py-2 rounded-lg transition-colors text-sm
                          ${currentPage === subItem.id 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'text-gray-500 hover:bg-gray-50'
                          }`}
                      >
                        <span>{subItem.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}