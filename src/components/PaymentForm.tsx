import React, { useState } from 'react';
import { CreditCard, Calendar, Lock } from 'lucide-react';
import { Service } from '../types';

interface PaymentFormProps {
  service: Service;
  amount: number;
  onSubmit: (data: {
    cardNumber: string;
    cardholderName: string;
    expiryDate: string;
    cvv: string;
  }) => void;
  onCancel: () => void;
}

export function PaymentForm({ service, amount, onSubmit, onCancel }: PaymentFormProps) {
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateCardNumber = (number: string) => {
    const regex = /^[0-9]{16}$/;
    return regex.test(number.replace(/\s/g, ''));
  };

  const validateExpiryDate = (date: string) => {
    const regex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!regex.test(date)) return false;
    
    const [month, year] = date.split('/');
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    
    const expiryYear = parseInt(year, 10);
    const expiryMonth = parseInt(month, 10);
    
    if (expiryYear < currentYear) return false;
    if (expiryYear === currentYear && expiryMonth < currentMonth) return false;
    
    return true;
  };

  const validateCVV = (cvv: string) => {
    const regex = /^[0-9]{3,4}$/;
    return regex.test(cvv);
  };

  const formatCardNumber = (input: string) => {
    const numbers = input.replace(/\D/g, '');
    const groups = [];
    
    for (let i = 0; i < numbers.length; i += 4) {
      groups.push(numbers.slice(i, i + 4));
    }
    
    return groups.join(' ').substring(0, 19);
  };

  const formatExpiryDate = (input: string) => {
    const numbers = input.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    return `${numbers.substring(0, 2)}/${numbers.substring(2, 4)}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    // Format inputs as needed
    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (name === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
    }
    
    setPaymentData({
      ...paymentData,
      [name]: formattedValue
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: Record<string, string> = {};
    
    if (!paymentData.cardholderName.trim()) {
      newErrors.cardholderName = 'Cardholder name is required';
    }
    
    if (!validateCardNumber(paymentData.cardNumber)) {
      newErrors.cardNumber = 'Enter a valid 16-digit card number';
    }
    
    if (!validateExpiryDate(paymentData.expiryDate)) {
      newErrors.expiryDate = 'Enter a valid expiry date (MM/YY)';
    }
    
    if (!validateCVV(paymentData.cvv)) {
      newErrors.cvv = 'Enter a valid CVV code';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Submit payment data
    onSubmit(paymentData);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Payment Details</h2>
        <div className="text-lg font-medium text-blue-600">${amount.toFixed(2)}</div>
      </div>
      
      <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-100">
        <p className="text-sm text-blue-800">
          <span className="font-medium">Secure Payment:</span> Your payment information is encrypted and secure. We do not store your full card details.
        </p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cardholder Name
            </label>
            <input
              type="text"
              name="cardholderName"
              value={paymentData.cardholderName}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border ${errors.cardholderName ? 'border-red-500' : 'border-gray-300'} rounded-md`}
              placeholder="Name on card"
            />
            {errors.cardholderName && (
              <p className="mt-1 text-xs text-red-500">{errors.cardholderName}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Card Number
            </label>
            <div className="relative">
              <input
                type="text"
                name="cardNumber"
                value={paymentData.cardNumber}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-3 py-2 border ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            {errors.cardNumber && (
              <p className="mt-1 text-xs text-red-500">{errors.cardNumber}</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="expiryDate"
                  value={paymentData.expiryDate}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-3 py-2 border ${errors.expiryDate ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                  placeholder="MM/YY"
                  maxLength={5}
                />
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              {errors.expiryDate && (
                <p className="mt-1 text-xs text-red-500">{errors.expiryDate}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CVV
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="cvv"
                  value={paymentData.cvv}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-3 py-2 border ${errors.cvv ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                  placeholder="123"
                  maxLength={4}
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              {errors.cvv && (
                <p className="mt-1 text-xs text-red-500">{errors.cvv}</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Pay ${amount.toFixed(2)}
          </button>
        </div>
        
        <div className="mt-6 flex justify-center">
          <div className="flex items-center space-x-4">
            <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/visa.svg" alt="Visa" className="h-6 w-6" />
            <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/mastercard.svg" alt="Mastercard" className="h-6 w-6" />
            <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/americanexpress.svg" alt="American Express" className="h-6 w-6" />
          </div>
        </div>
      </form>
    </div>
  );
} 