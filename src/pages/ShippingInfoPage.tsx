import React, { useState, useEffect } from 'react';
import { ArrowLeft, CreditCard, ShoppingBag, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface ShippingInfoPageProps {
  onBack: () => void;
  onContinue: () => void;
  isAuthenticated?: boolean;
  userData?: {
    name?: string;
    email?: string;
    // Add other potential user fields here
  } | null;
}

export function ShippingInfoPage({ 
  onBack, 
  onContinue,
  isAuthenticated = false,
  userData = null
}: ShippingInfoPageProps) {
  const { getCartTotal } = useCart();
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    phone: ''
  });
  
  // Use effect to pre-fill form with user data when authenticated
  useEffect(() => {
    if (isAuthenticated && userData) {
      // Pre-fill email from user data if available
      if (userData.email) {
        setFormData(prev => ({
          ...prev,
          email: userData.email || ''
        }));
      }
      
      // Pre-fill name if available by splitting into first/last name
      if (userData.name) {
        const nameParts = userData.name.split(' ');
        if (nameParts.length > 0) {
          setFormData(prev => ({
            ...prev,
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || ''
          }));
        }
      }
      
      // You could add more pre-filling here if you have more user data available
    }
  }, [isAuthenticated, userData]);
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.zipCode) newErrors.zipCode = 'ZIP code is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    
    return newErrors;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors = validate();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate processing delay
    setTimeout(() => {
      setIsSubmitting(false);
      // In a real app, you would save the shipping info
      onContinue();
    }, 1000);
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl bg-[#F8F8FA]">
      {/* Navigation and Breadcrumb */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-[#70727F] hover:text-[#383A47] mb-2"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span className="text-sm">Back to checkout options</span>
        </button>
        <div className="text-sm text-[#70727F]">
          Home / Cart / Checkout / Shipping
        </div>
      </div>

      {/* Checkout Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1B1C20]">Shipping Information</h1>
        <p className="text-[#383A47] mt-1">
          {isAuthenticated 
            ? "Please confirm your shipping details" 
            : "Please enter your shipping details"}
        </p>
        {isAuthenticated && userData?.email && (
          <p className="mt-2 text-[#3D1560] font-medium">
            Signed in as {userData.email}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-8 border border-[#CDCED8]">
            <form onSubmit={handleSubmit}>
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-[#1B1C20] mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-[#383A47] font-medium mb-1">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-[#CDCED8]'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D1560]`}
                      placeholder="your@email.com"
                      readOnly={isAuthenticated && userData?.email ? true : false}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    <p className="text-[#70727F] text-sm mt-1">
                      {isAuthenticated && userData?.email 
                        ? "We'll use your account email for order confirmation" 
                        : "We'll send your receipt and order updates to this email"}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-[#1B1C20] mb-4">Shipping Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-[#383A47] font-medium mb-1">First Name *</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border ${errors.firstName ? 'border-red-500' : 'border-[#CDCED8]'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D1560]`}
                    />
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-[#383A47] font-medium mb-1">Last Name *</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border ${errors.lastName ? 'border-red-500' : 'border-[#CDCED8]'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D1560]`}
                    />
                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-[#383A47] font-medium mb-1">Address *</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border ${errors.address ? 'border-red-500' : 'border-[#CDCED8]'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D1560]`}
                      placeholder="Street address, apartment, suite, etc."
                    />
                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="city" className="block text-[#383A47] font-medium mb-1">City *</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border ${errors.city ? 'border-red-500' : 'border-[#CDCED8]'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D1560]`}
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="state" className="block text-[#383A47] font-medium mb-1">State/Province *</label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border ${errors.state ? 'border-red-500' : 'border-[#CDCED8]'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D1560]`}
                      />
                      {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="zipCode" className="block text-[#383A47] font-medium mb-1">ZIP Code *</label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border ${errors.zipCode ? 'border-red-500' : 'border-[#CDCED8]'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D1560]`}
                      />
                      {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="country" className="block text-[#383A47] font-medium mb-1">Country *</label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-[#CDCED8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D1560]"
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-[#383A47] font-medium mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border ${errors.phone ? 'border-red-500' : 'border-[#CDCED8]'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D1560]`}
                      placeholder="For delivery questions only"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#3D1560] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#6D26AB] transition-colors shadow-sm hover:shadow-md flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Truck className="w-5 h-5 mr-2" />
                      Continue to Payment
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6 lg:sticky lg:top-6 border border-[#CDCED8]">
            <h2 className="text-xl font-semibold text-[#1B1C20] mb-6">Order Summary</h2>
            
            <div className="space-y-4 border-b border-[#CDCED8] pb-4 mb-6">
              <div className="flex justify-between">
                <span className="text-[#383A47]">Subtotal</span>
                <span className="text-[#383A47]">${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#383A47]">Shipping</span>
                <span className="text-[#3D1560] font-medium">FREE</span>
              </div>
              <div className="flex justify-between font-semibold text-[#1B1C20]">
                <span>Total</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
            </div>
            
            <div className="space-y-3 pt-4">
              <div className="flex items-center text-sm text-[#70727F]">
                <Truck className="w-4 h-4 mr-2" />
                <span>Free shipping on orders over $50</span>
              </div>
              <div className="flex items-center text-sm text-[#70727F]">
                <ShoppingBag className="w-4 h-4 mr-2" />
                <span>Secure checkout with encryption</span>
              </div>
              <div className="flex items-center text-sm text-[#70727F]">
                <CreditCard className="w-4 h-4 mr-2" />
                <span>Multiple payment methods available</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 