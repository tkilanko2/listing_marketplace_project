import React from 'react';
import { X, AlertTriangle, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'success' | 'info';
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'warning'
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      icon: AlertTriangle,
      iconBg: 'bg-[#FFEBEE]',
      iconColor: 'text-[#F44336]',
      confirmBg: 'bg-[#F44336] hover:bg-[#D32F2F] active:bg-[#C62828]'
    },
    warning: {
      icon: AlertCircle,
      iconBg: 'bg-[#FFF4E5]',
      iconColor: 'text-[#FF9800]',
      confirmBg: 'bg-[#FF9800] hover:bg-[#F57C00] active:bg-[#E65100]'
    },
    success: {
      icon: CheckCircle,
      iconBg: 'bg-[#E8F5E9]',
      iconColor: 'text-[#4CAF50]',
      confirmBg: 'bg-[#4CAF50] hover:bg-[#388E3C] active:bg-[#2E7D32]'
    },
    info: {
      icon: Info,
      iconBg: 'bg-[#E3F2FD]',
      iconColor: 'text-[#2196F3]',
      confirmBg: 'bg-[#3D1560] hover:bg-[#6D26AB] active:bg-[#9B53D9]'
    }
  };

  const style = variantStyles[variant];
  const IconComponent = style.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E8E9ED]">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#1B1C20]">{title}</h2>
            <button
              onClick={onClose}
              className="text-[#70727F] hover:text-[#3D1560] p-2 rounded-full hover:bg-[#F8F8FA] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${style.iconBg}`}>
              <IconComponent className={`w-6 h-6 ${style.iconColor}`} />
            </div>
            <div className="flex-1">
              <p className="text-[#383A47] text-base leading-relaxed">{message}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-6 py-4 border-t border-[#E8E9ED] bg-[#F8F8FA]">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border-2 border-[#E8E9ED] text-[#383A47] rounded-lg hover:bg-white hover:border-[#CDCED8] transition-colors font-medium"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 px-4 py-2.5 text-white rounded-lg transition-all font-semibold shadow-sm ${style.confirmBg}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
