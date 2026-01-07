import React, { useState } from 'react';
import { X, Download, AlertTriangle, Trash2, AlertCircle, ChevronLeft, Settings } from 'lucide-react';

interface ManageAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownloadData: () => void;
  onDeactivateAccount: (password: string) => void;
  onDeleteAccount: (password: string, reason: string, exportData: boolean) => void;
}

type ViewType = 'overview' | 'download' | 'deactivate' | 'delete';

const deleteReasons = [
  'I no longer need this service',
  'Privacy concerns',
  'Too many emails/notifications',
  'Found a better alternative',
  'Difficult to use',
  'Other',
];

export function ManageAccountModal({
  isOpen,
  onClose,
  onDownloadData,
  onDeactivateAccount,
  onDeleteAccount,
}: ManageAccountModalProps) {
  const [currentView, setCurrentView] = useState<ViewType>('overview');
  const [password, setPassword] = useState('');
  const [selectedReason, setSelectedReason] = useState('');
  const [exportData, setExportData] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  if (!isOpen) return null;

  const handleClose = () => {
    setCurrentView('overview');
    setPassword('');
    setSelectedReason('');
    setExportData(false);
    setConfirmText('');
    onClose();
  };

  const handleBack = () => {
    setCurrentView('overview');
    setPassword('');
    setSelectedReason('');
    setExportData(false);
    setConfirmText('');
  };

  const handleDownloadConfirm = () => {
    onDownloadData();
    handleClose();
  };

  const handleDeactivateConfirm = () => {
    if (password.trim()) {
      onDeactivateAccount(password);
      handleClose();
    }
  };

  const handleDeleteConfirm = () => {
    if (password.trim() && confirmText === 'DELETE') {
      onDeleteAccount(password, selectedReason, exportData);
      handleClose();
    }
  };

  // Overview View
  const OverviewView = () => (
    <>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Settings className="w-5 h-5 text-[#3D1560]" />
          <h2 className="text-lg font-semibold text-[#1B1C20]">Manage Account</h2>
        </div>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <p className="text-sm text-[#70727F]">
          Manage your account data and settings. Choose from the options below:
        </p>

        {/* Download Data Option */}
        <button
          onClick={() => setCurrentView('download')}
          className="w-full text-left p-4 bg-white border-2 border-[#E8E9ED] rounded-lg hover:border-[#3D1560] hover:bg-[#F5EDFF] transition-all group"
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-[#F5EDFF] rounded-lg flex items-center justify-center group-hover:bg-[#3D1560] transition-colors">
              <Download className="w-5 h-5 text-[#3D1560] group-hover:text-white transition-colors" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-[#1B1C20] mb-1">Download My Data</h3>
              <p className="text-xs text-[#70727F]">
                Get a copy of your profile, bookings, messages, and transaction history
              </p>
            </div>
          </div>
        </button>

        {/* Deactivate Account Option */}
        <button
          onClick={() => setCurrentView('deactivate')}
          className="w-full text-left p-4 bg-white border-2 border-[#E8E9ED] rounded-lg hover:border-orange-600 hover:bg-orange-50 transition-all group"
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-600 transition-colors">
              <AlertTriangle className="w-5 h-5 text-orange-600 group-hover:text-white transition-colors" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-[#1B1C20] mb-1">Deactivate Account</h3>
              <p className="text-xs text-[#70727F]">
                Temporarily close your account. You can reactivate anytime by signing in
              </p>
            </div>
          </div>
        </button>

        {/* Delete Account Option */}
        <button
          onClick={() => setCurrentView('delete')}
          className="w-full text-left p-4 bg-white border-2 border-[#E8E9ED] rounded-lg hover:border-red-600 hover:bg-red-50 transition-all group"
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-600 transition-colors">
              <Trash2 className="w-5 h-5 text-red-600 group-hover:text-white transition-colors" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-[#1B1C20] mb-1">Delete Account</h3>
              <p className="text-xs text-[#70727F]">
                Permanently delete your account and all data after 30-day grace period
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Footer */}
      <div className="p-4 bg-gray-50 rounded-b-lg border-t border-gray-200">
        <p className="text-xs text-[#70727F] text-center">
          Need help? Contact our support team for assistance
        </p>
      </div>
    </>
  );

  // Download Data View
  const DownloadView = () => (
    <>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleBack}
            className="text-gray-400 hover:text-gray-600 transition-colors mr-2"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <Download className="w-5 h-5 text-[#3D1560]" />
          <h2 className="text-lg font-semibold text-[#1B1C20]">Download My Data</h2>
        </div>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <p className="text-sm text-[#383A47]">
          We'll prepare a copy of your data including:
        </p>
        <ul className="text-sm text-[#70727F] space-y-2 ml-4 list-disc">
          <li>Profile information and account details</li>
          <li>Your bookings and orders</li>
          <li>Messages and communication history</li>
          <li>Transaction records and payment information</li>
        </ul>
        <p className="text-sm text-[#70727F]">
          This process may take a few minutes to several hours depending on the amount of data.
          You'll receive an email at your registered address when your data export is ready to download.
        </p>
        <p className="text-sm text-[#70727F]">
          The download link will be valid for 7 days.
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 p-4 bg-gray-50 rounded-b-lg">
        <button
          onClick={handleBack}
          className="px-4 py-2 text-sm font-medium text-[#383A47] bg-white border border-[#CDCED8] rounded-md hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleDownloadConfirm}
          className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#3D1560] to-[#6D26AB] rounded-md hover:shadow-lg transition-all"
        >
          Request Data Export
        </button>
      </div>
    </>
  );

  // Deactivate Account View
  const DeactivateView = () => (
    <>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleBack}
            className="text-gray-400 hover:text-gray-600 transition-colors mr-2"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          <h2 className="text-lg font-semibold text-[#1B1C20]">Deactivate Account</h2>
        </div>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <p className="text-sm font-medium text-[#383A47]">
          Are you sure you want to deactivate your account?
        </p>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 space-y-2">
          <p className="text-sm text-orange-900 font-medium">What happens when you deactivate:</p>
          <ul className="text-sm text-orange-800 space-y-1 ml-4 list-disc">
            <li>Your account will be temporarily closed</li>
            <li>Your profile will be hidden from other users</li>
            <li>You won't receive notifications or messages</li>
            <li>Your data will be preserved and can be restored</li>
          </ul>
        </div>

        <p className="text-sm text-[#70727F]">
          You can reactivate your account at any time by signing in again. All your data and history will be restored.
        </p>

        <div>
          <label className="block text-sm font-medium text-[#383A47] mb-2">
            Enter your password to confirm
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            className="w-full px-3 py-2 border border-[#CDCED8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6D26AB] focus:border-transparent"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && password.trim()) {
                handleDeactivateConfirm();
              }
            }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 p-4 bg-gray-50 rounded-b-lg">
        <button
          onClick={handleBack}
          className="px-4 py-2 text-sm font-medium text-[#383A47] bg-white border border-[#CDCED8] rounded-md hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleDeactivateConfirm}
          disabled={!password.trim()}
          className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-all ${
            password.trim()
              ? 'bg-orange-600 hover:bg-orange-700 hover:shadow-lg'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          Deactivate Account
        </button>
      </div>
    </>
  );

  // Delete Account View
  const DeleteView = () => {
    const isValid = password.trim() && confirmText === 'DELETE';

    return (
      <>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleBack}
              className="text-gray-400 hover:text-gray-600 transition-colors mr-2"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <Trash2 className="w-5 h-5 text-red-600" />
            <h2 className="text-lg font-semibold text-[#1B1C20]">Delete Account</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          {/* Warning Box */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="text-sm text-red-900 font-semibold">
                  This action is permanent and cannot be undone
                </p>
                <p className="text-sm text-red-800">
                  After 30 days, all your data will be permanently deleted including:
                </p>
                <ul className="text-sm text-red-800 space-y-1 ml-4 list-disc">
                  <li>Profile and account information</li>
                  <li>Your reviews and ratings</li>
                  <li>Booking history and messages</li>
                  <li>Payment and transaction records</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 30-day Grace Period */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-900">
              <span className="font-medium">30-day grace period:</span> You can cancel the deletion request and recover your account within 30 days. After that, deletion is final.
            </p>
          </div>

          {/* Export Data Option */}
          <div className="space-y-2">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={exportData}
                onChange={(e) => setExportData(e.target.checked)}
                className="mt-1 rounded border-[#CDCED8]"
              />
              <div>
                <p className="text-sm font-medium text-[#383A47]">
                  Export my data before deletion
                </p>
                <p className="text-xs text-[#70727F]">
                  We'll email you a copy of your data before starting the deletion process
                </p>
              </div>
            </label>
          </div>

          {/* Reason Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#383A47]">
              Why are you leaving? (Optional)
            </label>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="w-full px-3 py-2 border border-[#CDCED8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6D26AB] focus:border-transparent text-sm"
            >
              <option value="">Select a reason...</option>
              {deleteReasons.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
          </div>

          {/* Password Confirmation */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#383A47]">
              Enter your password to confirm
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              className="w-full px-3 py-2 border border-[#CDCED8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6D26AB] focus:border-transparent"
            />
          </div>

          {/* Type DELETE Confirmation */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#383A47]">
              Type <span className="font-mono font-bold text-red-600">DELETE</span> to confirm
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
              placeholder="DELETE"
              className="w-full px-3 py-2 border border-[#CDCED8] rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent font-mono"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 p-4 bg-gray-50 rounded-b-lg sticky bottom-0">
          <button
            onClick={handleBack}
            className="px-4 py-2 text-sm font-medium text-[#383A47] bg-white border border-[#CDCED8] rounded-md hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleDeleteConfirm}
            disabled={!isValid}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-all ${
              isValid
                ? 'bg-red-600 hover:bg-red-700 hover:shadow-lg'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Delete My Account
          </button>
        </div>
      </>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden">
        {currentView === 'overview' && <OverviewView />}
        {currentView === 'download' && <DownloadView />}
        {currentView === 'deactivate' && <DeactivateView />}
        {currentView === 'delete' && <DeleteView />}
      </div>
    </div>
  );
}

export default ManageAccountModal;
