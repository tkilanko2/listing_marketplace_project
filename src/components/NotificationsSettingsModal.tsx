import React, { useState } from 'react';
import { X, Bell, Mail } from 'lucide-react';

interface NotificationPreference {
  id: string;
  label: string;
  email: boolean;
  inApp: boolean;
}

interface NotificationsSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationsSettingsModal({ isOpen, onClose }: NotificationsSettingsModalProps) {
  const [preferences, setPreferences] = useState<NotificationPreference[]>([
    { id: 'new_booking', label: 'New Booking', email: true, inApp: true },
    { id: 'booking_reschedule', label: 'Booking Reschedule', email: true, inApp: true },
    { id: 'booking_cancellation', label: 'Booking Cancellation', email: true, inApp: true },
    { id: 'new_order', label: 'New Order', email: true, inApp: true },
    { id: 'order_update', label: 'Order Status Update', email: true, inApp: true },
    { id: 'new_message', label: 'New Message', email: true, inApp: true },
    { id: 'new_review', label: 'New Review', email: true, inApp: true },
    { id: 'payment_received', label: 'Payment Received', email: true, inApp: true },
    { id: 'payout_processed', label: 'Payout Processed', email: true, inApp: true },
    { id: 'account_updates', label: 'Account & Security Updates', email: true, inApp: false },
  ]);

  const handleToggle = (id: string, type: 'email' | 'inApp') => {
    setPreferences(prev =>
      prev.map(pref =>
        pref.id === id
          ? { ...pref, [type]: !pref[type] }
          : pref
      )
    );
  };

  const handleSave = () => {
    // TODO: Save preferences to backend
    console.log('Saving notification preferences:', preferences);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#FFFFFF] rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform-gpu"
           style={{ backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}>
        {/* Header */}
        <div className="bg-[#3D1560] text-white p-4 rounded-t-xl flex justify-between items-center sticky top-0 z-10">
          <h3 className="text-lg font-semibold flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Notification Settings
          </h3>
          <button 
            onClick={onClose}
            className="text-white hover:text-[#CDCED8] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-[#70727F] mb-6">
            Choose how you want to be notified about important events. You can receive notifications via email, in-app, or both.
          </p>

          {/* Notification Preferences Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E8E9ED]">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#1B1C20]">Notification</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-[#1B1C20]">
                    <div className="flex items-center justify-center">
                      <Mail className="w-4 h-4 mr-2 text-[#3D1560]" />
                      Email
                    </div>
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-[#1B1C20]">
                    <div className="flex items-center justify-center">
                      <Bell className="w-4 h-4 mr-2 text-[#3D1560]" />
                      In-App
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {preferences.map((pref) => (
                  <tr key={pref.id} className="border-b border-[#E8E9ED] hover:bg-[#F8F8FA] transition-colors">
                    <td className="py-4 px-4 text-sm text-[#383A47]">{pref.label}</td>
                    <td className="py-4 px-4 text-center">
                      <label className="flex items-center justify-center cursor-pointer">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={pref.email}
                            onChange={() => handleToggle(pref.id, 'email')}
                            className="sr-only peer"
                          />
                          <div className="block bg-[#E8E9ED] w-11 h-6 rounded-full peer-checked:bg-[#3D1560] transition-colors"></div>
                          <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out transform peer-checked:translate-x-5"></div>
                        </div>
                      </label>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <label className="flex items-center justify-center cursor-pointer">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={pref.inApp}
                            onChange={() => handleToggle(pref.id, 'inApp')}
                            className="sr-only peer"
                          />
                          <div className="block bg-[#E8E9ED] w-11 h-6 rounded-full peer-checked:bg-[#3D1560] transition-colors"></div>
                          <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out transform peer-checked:translate-x-5"></div>
                        </div>
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-[#E8E9ED]">
            <button
              onClick={onClose}
              className="px-6 py-2.5 border border-[#CDCED8] text-[#70727F] font-medium rounded-lg hover:border-[#70727F] hover:bg-[#E8E9ED] hover:text-[#383A47] transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-[#3D1560] text-white font-medium rounded-lg hover:bg-[#6D26AB] active:bg-[#9B53D9] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#3D1560] focus:ring-offset-2 shadow-sm"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

