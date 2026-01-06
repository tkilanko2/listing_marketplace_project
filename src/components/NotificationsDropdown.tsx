import React from 'react';
import { X, Bell, CheckCircle, AlertCircle, Info, DollarSign, ShoppingBag, Calendar, MessageCircle } from 'lucide-react';

interface Notification {
  id: string;
  type: 'booking' | 'payment' | 'message' | 'review' | 'system';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onNotificationClick?: (notification: Notification) => void;
  onMarkAllAsRead?: () => void;
}

export function NotificationsDropdown({
  isOpen,
  onClose,
  notifications,
  onNotificationClick,
  onMarkAllAsRead
}: NotificationsDropdownProps) {
  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return Calendar;
      case 'payment':
        return DollarSign;
      case 'message':
        return MessageCircle;
      case 'review':
        return CheckCircle;
      case 'system':
        return Info;
      default:
        return Bell;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'booking':
        return 'bg-[#E3F2FD] text-[#2196F3]';
      case 'payment':
        return 'bg-[#E8F5E9] text-[#4CAF50]';
      case 'message':
        return 'bg-[#F5EDFF] text-[#6D26AB]';
      case 'review':
        return 'bg-[#FFF4E5] text-[#FF9800]';
      case 'system':
        return 'bg-[#F8F8FA] text-[#70727F]';
      default:
        return 'bg-[#F8F8FA] text-[#70727F]';
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      {/* Dropdown - Positioned to align with bell icon */}
      <div className="absolute top-full left-0 mt-2 w-[380px] sm:w-[420px] bg-white rounded-xl shadow-xl border border-[#E8E9ED] z-50 overflow-hidden">
        {/* Header */}
        <div className="px-4 sm:px-5 py-3.5 border-b border-[#E8E9ED]">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-base sm:text-lg text-[#1B1C20]">Notifications</h3>
            <button
              onClick={onClose}
              className="text-[#70727F] hover:text-[#1B1C20] transition-colors p-1 rounded-lg hover:bg-[#F8F8FA]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Action Buttons Row */}
          <div className="flex items-center justify-between">
            {unreadCount > 0 ? (
              <>
                <span className="text-xs text-[#70727F] font-medium">
                  {unreadCount} unread
                </span>
                <button
                  onClick={onMarkAllAsRead}
                  className="text-xs text-[#3D1560] hover:text-[#6D26AB] font-semibold transition-colors"
                >
                  Mark all as read
                </button>
              </>
            ) : (
              <span className="text-xs text-[#70727F] font-medium">
                All caught up
              </span>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-[480px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#F8F8FA] rounded-full flex items-center justify-center">
                <Bell className="w-8 h-8 text-[#CDCED8]" />
              </div>
              <p className="text-[#383A47] font-semibold">No notifications</p>
              <p className="text-sm text-[#70727F] mt-1">You're all caught up!</p>
            </div>
          ) : (
            <div>
              {notifications.map((notification, index) => {
                const IconComponent = getIcon(notification.type);
                const iconColorClass = getIconColor(notification.type);

                return (
                  <button
                    key={notification.id}
                    onClick={() => onNotificationClick?.(notification)}
                    className={`w-full text-left px-4 sm:px-5 py-3.5 hover:bg-[#FAFAFA] transition-all duration-150 border-b border-[#F0F0F0] last:border-b-0 ${
                      !notification.isRead ? 'bg-[#FAFBFF]' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${iconColorClass}`}>
                        <IconComponent className="w-[18px] h-[18px]" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-0.5">
                          <h4 className={`font-semibold text-sm leading-snug ${
                            !notification.isRead ? 'text-[#1B1C20]' : 'text-[#383A47]'
                          }`}>
                            {notification.title}
                          </h4>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-[#3D1560] rounded-full flex-shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-[13px] text-[#70727F] leading-relaxed line-clamp-2 mb-1.5">
                          {notification.message}
                        </p>
                        <p className="text-[11px] text-[#9CA3AF] font-medium">{notification.timestamp}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="px-4 sm:px-5 py-3 bg-[#FAFAFA] border-t border-[#E8E9ED] text-center">
            <button className="text-sm text-[#3D1560] hover:text-[#6D26AB] font-semibold transition-colors hover:underline">
              View all notifications
            </button>
          </div>
        )}
      </div>
    </>
  );
}
