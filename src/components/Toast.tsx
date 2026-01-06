import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export interface ToastProps {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: (id: string) => void;
}

export function Toast({ id, message, type, duration = 30000, onClose }: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const typeStyles = {
    success: {
      icon: CheckCircle,
      bg: 'bg-[#E8F5E9]',
      border: 'border-[#4CAF50]',
      iconColor: 'text-[#4CAF50]',
      textColor: 'text-[#1B5E20]'
    },
    error: {
      icon: XCircle,
      bg: 'bg-[#FFEBEE]',
      border: 'border-[#F44336]',
      iconColor: 'text-[#F44336]',
      textColor: 'text-[#B71C1C]'
    },
    warning: {
      icon: AlertCircle,
      bg: 'bg-[#FFF9F0]',
      border: 'border-[#FF9800]',
      iconColor: 'text-[#FF9800]',
      textColor: 'text-[#E65100]'
    },
    info: {
      icon: Info,
      bg: 'bg-[#F5EDFF]',
      border: 'border-[#9B53D9]',
      iconColor: 'text-[#6D26AB]',
      textColor: 'text-[#3D1560]'
    }
  };

  const style = typeStyles[type];
  const IconComponent = style.icon;

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border-2 ${style.bg} ${style.border} shadow-lg min-w-[320px] max-w-md animate-slideIn`}
    >
      <IconComponent className={`w-5 h-5 ${style.iconColor} flex-shrink-0 mt-0.5`} />
      <p className={`flex-1 text-sm font-medium ${style.textColor}`}>{message}</p>
      <button
        onClick={() => onClose(id)}
        className={`${style.iconColor} hover:opacity-70 transition-opacity flex-shrink-0`}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export interface ToastContainerProps {
  toasts: Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
  }>;
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-[70] flex flex-col gap-3">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={onClose}
        />
      ))}
    </div>
  );
}
