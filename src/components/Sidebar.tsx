import React from 'react';
import { Home, User, ShoppingBag, LayoutDashboard, Settings, Calendar, ArrowLeft, ChevronDown, Package, DollarSign, BarChart2, Store } from 'lucide-react';

interface SidebarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function Sidebar({ onNavigate, currentPage }: SidebarProps) {
  const menuItems = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'myOrders', label: 'My Orders', icon: ShoppingBag },
    { id: 'sellerDashboard', label: 'Seller Dashboard', icon: LayoutDashboard, subItems: [
      { id: 'sellerDashboard_overview', label: 'Overview', icon: BarChart2 },
      { id: 'sellerDashboard_myShop', label: 'My Shop', icon: Store },
      { id: 'sellerDashboard_orders', label: 'Orders', icon: Package },
      { id: 'sellerDashboard_appointments', label: 'Bookings', icon: Calendar },
      { id: 'sellerDashboard_finance', label: 'Finance', icon: DollarSign }
    ]},
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-[#CDCED8]">
      <div className="p-4">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center text-[#70727F] hover:text-[#383A47] mb-6"
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
                      ? 'bg-[#EDD9FF] text-[#3D1560]' 
                      : 'text-[#70727F] hover:bg-[#E8E9ED]'
                    }`}
                >
                  {Icon && <Icon className="w-5 h-5 text-current" />}
                  <span>{item.label}</span>
                  {item.subItems && <ChevronDown className="w-4 h-4 ml-auto text-current" />}
                </button>
                {item.subItems && isActive && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.subItems.map(subItem => {
                      const SubIcon = subItem.icon;
                      return (
                        <button
                          key={subItem.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigate(subItem.id);
                          }}
                          className={`flex items-center space-x-3 w-full px-4 py-2 rounded-lg transition-colors text-sm
                            ${currentPage === subItem.id 
                              ? 'bg-[#EDD9FF] text-[#3D1560]' 
                              : 'text-[#70727F] hover:bg-[#E8E9ED]'
                            }`}
                        >
                          {SubIcon && <SubIcon className="w-4 h-4 text-current" />}
                          <span>{subItem.label}</span>
                        </button>
                      );
                    })}
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