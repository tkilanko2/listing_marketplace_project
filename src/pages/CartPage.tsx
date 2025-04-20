import React, { useState } from 'react';
import { ShoppingCart, Trash2, CreditCard, Truck, Shield, RotateCcw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Product } from '../types';

interface CartPageProps {
  onNavigateTo?: (page: string) => void;
}

export function CartPage({ onNavigateTo }: CartPageProps = {}) {
  const { cartItems, removeFromCart, updateQuantity, getCartCount, getCartTotal } = useCart();
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleNavigateHome = () => {
    if (onNavigateTo) {
      onNavigateTo('landing');
    } else {
      // Fallback if onNavigateTo is not provided
      window.location.href = '/';
    }
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedItems(cartItems.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (productId: string) => {
    if (selectedItems.includes(productId)) {
      setSelectedItems(selectedItems.filter(id => id !== productId));
      setSelectAll(false);
    } else {
      setSelectedItems([...selectedItems, productId]);
      if (selectedItems.length + 1 === cartItems.length) {
        setSelectAll(true);
      }
    }
  };

  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
    setSelectedItems(selectedItems.filter(id => id !== productId));
    if (selectedItems.length - 1 === 0) {
      setSelectAll(false);
    }
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckoutSelected = () => {
    // Placeholder for checkout logic for selected items
    console.log('Checkout for selected items:', selectedItems);
  };

  const handleCheckoutAll = () => {
    // Placeholder for checkout logic for all items
    console.log('Checkout for all items');
    setSelectedItems(cartItems.map(item => item.id));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl bg-[#F8F8FA]">
      <div className="flex items-center mb-6">
        <ShoppingCart className="w-8 h-8 text-[#3D1560] mr-3" />
        <h1 className="text-3xl font-bold text-[#1B1C20]">Your Cart</h1>
      </div>

      {cartItems.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-[#CDCED8]">
          <ShoppingCart className="w-16 h-16 text-[#CDCED8] mx-auto mb-4" />
          <p className="text-[#383A47] text-lg mb-4">Your cart is empty</p>
          <button
            onClick={handleNavigateHome}
            className="bg-[#3D1560] text-[#FFFFFF] px-6 py-3 rounded-lg font-medium hover:bg-[#6D26AB] transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8 border border-[#CDCED8]">
              <div className="p-6 border-b border-[#CDCED8]">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-[#1B1C20]">Cart Items ({getCartCount()})</h2>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="w-5 h-5 text-[#3D1560] rounded focus:ring-[#3D1560] mr-2"
                    />
                    <span className="text-[#383A47]">Select All</span>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-[#CDCED8]">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-6 flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleSelectItem(item.id)}
                        className="w-5 h-5 text-[#3D1560] rounded focus:ring-[#3D1560] mr-4"
                      />
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg mr-4"
                      />
                      <div>
                        <h3 className="font-semibold text-[#1B1C20]">{item.name}</h3>
                        <p className="text-[#70727F] text-sm">{item.shortDescription || 'No description available'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 flex-wrap">
                      <div className="flex items-center border border-[#CDCED8] rounded-lg overflow-hidden bg-[#F8F8FA] shadow-sm">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="px-3 py-2 text-[#383A47] hover:bg-[#E8E9ED] disabled:text-[#CDCED8] disabled:cursor-not-allowed transition-colors duration-200"
                        >
                          -
                        </button>
                        <span className="px-4 py-2 text-[#383A47] font-medium">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          disabled={item.quantity >= (item.availableQuantity || Infinity)}
                          className="px-3 py-2 text-[#383A47] hover:bg-[#E8E9ED] disabled:text-[#CDCED8] disabled:cursor-not-allowed transition-colors duration-200"
                        >
                          +
                        </button>
                      </div>

                      <p className="text-[#3D1560] font-semibold">${(item.price * item.quantity).toFixed(2)}</p>

                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-[#DF678C] hover:text-[#D84773]"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 lg:sticky lg:top-6 border border-[#CDCED8]">
              <h2 className="text-xl font-semibold text-[#1B1C20] mb-6">Order Summary</h2>

              <div className="space-y-4 border-b border-[#CDCED8] pb-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-[#383A47]">Subtotal ({getCartCount()} items)</span>
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

              <div className="flex flex-col gap-3 mb-6">
                <button
                  onClick={handleCheckoutAll}
                  className="bg-[#3D1560] text-[#FFFFFF] px-6 py-3 rounded-lg font-medium hover:bg-[#6D26AB] transition-colors duration-200 shadow-sm hover:shadow-md flex items-center justify-center"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Checkout All
                </button>

                {selectedItems.length > 0 && (
                  <button
                    onClick={handleCheckoutSelected}
                    className="bg-[#F8F8FA] text-[#383A47] border border-[#CDCED8] px-6 py-3 rounded-lg font-medium hover:bg-[#E8E9ED] transition-colors duration-200 shadow-sm flex items-center justify-center"
                  >
                    Checkout Selected ({selectedItems.length})
                  </button>
                )}
              </div>

              <div className="space-y-3 pt-4 border-t border-[#CDCED8]">
                <div className="flex items-center text-sm text-[#70727F]">
                  <Truck className="w-4 h-4 mr-2" />
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center text-sm text-[#70727F]">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  <span>30-day return policy</span>
                </div>
                <div className="flex items-center text-sm text-[#70727F]">
                  <Shield className="w-4 h-4 mr-2" />
                  <span>Secure checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 