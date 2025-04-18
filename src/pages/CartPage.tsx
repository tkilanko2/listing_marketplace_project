import React, { useState } from 'react';
import { Trash2, ArrowLeft, ShoppingCart, CheckCircle } from 'lucide-react';
import { useCart, CartItem } from '../context/CartContext';

interface CartPageProps {
  onBack: () => void;
  onViewProduct: (productId: string) => void;
  onCheckout: () => void;
}

export function CartPage({ onBack, onViewProduct, onCheckout }: CartPageProps) {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [processingCheckout, setProcessingCheckout] = useState(false);

  // Toggle selection of an item
  const toggleSelectItem = (productId: string) => {
    setSelectedItems(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Toggle selection of all items
  const toggleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map(item => item.id));
    }
  };

  // Calculate total for selected items
  const getSelectedTotal = () => {
    return cartItems
      .filter(item => selectedItems.includes(item.id))
      .reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Buy selected items
  const handleBuySelected = () => {
    if (selectedItems.length === 0) {
      // Use a more user-friendly approach than alert
      // Could show an inline error message instead
      return;
    }
    setProcessingCheckout(true);
    // Simulate a brief processing delay
    setTimeout(() => {
      setProcessingCheckout(false);
      onCheckout();
    }, 500);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Navigation and Breadcrumb */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-2"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span className="text-sm">Back to shopping</span>
        </button>
        <div className="text-sm text-gray-500">
          Home / Shopping Cart
        </div>
      </div>

      {/* Cart Title and Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
        <div className="flex-1">
          <div className="mb-4 flex items-center">
            <ShoppingCart className="w-6 h-6 text-blue-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-900">Your Shopping Cart</h1>
          </div>
          <p className="text-gray-600">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart</p>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-16 text-center">
          <div className="flex justify-center mb-4">
            <ShoppingCart className="w-16 h-16 text-gray-300" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't added any products to your cart yet.</p>
          <button
            onClick={onBack}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b">
                <div className="flex items-center">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === cartItems.length}
                      onChange={toggleSelectAll}
                      className="h-5 w-5 rounded text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700 font-medium">Select All</span>
                  </label>
                </div>
              </div>

              {/* Cart Items List */}
              <div className="divide-y">
                {cartItems.map((item) => (
                  <CartItemRow 
                    key={item.id} 
                    item={item}
                    isSelected={selectedItems.includes(item.id)}
                    onSelect={() => toggleSelectItem(item.id)}
                    onRemove={() => removeFromCart(item.id)}
                    onQuantityChange={(quantity) => updateQuantity(item.id, quantity)}
                    onViewProduct={() => onViewProduct(item.id)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">Calculated at checkout</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">Calculated at checkout</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${getCartTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={onCheckout}
                  disabled={processingCheckout}
                  className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md flex items-center justify-center"
                >
                  {processingCheckout ? 'Processing...' : 'Checkout All Items'}
                </button>
                
                <button 
                  onClick={handleBuySelected}
                  disabled={selectedItems.length === 0 || processingCheckout}
                  className={`w-full px-4 py-3 rounded-lg font-semibold border transition-colors flex items-center justify-center ${
                    selectedItems.length > 0 && !processingCheckout
                      ? 'bg-green-600 text-white hover:bg-green-700 border-green-600' 
                      : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                  }`}
                >
                  {processingCheckout 
                    ? 'Processing...' 
                    : `Checkout Selected (${selectedItems.length})${
                        selectedItems.length > 0 ? ` $${getSelectedTotal().toFixed(2)}` : ''
                      }`
                  }
                </button>
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center text-green-600 mb-2">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">Secure Checkout</span>
                </div>
                <p className="text-xs text-gray-500">
                  All transactions are secure and encrypted. By making a purchase, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface CartItemRowProps {
  item: CartItem;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onQuantityChange: (quantity: number) => void;
  onViewProduct: () => void;
}

function CartItemRow({ 
  item, 
  isSelected, 
  onSelect, 
  onRemove, 
  onQuantityChange,
  onViewProduct
}: CartItemRowProps) {
  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-start">
        <div className="mr-4">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            className="h-5 w-5 rounded text-blue-600 border-gray-300 focus:ring-blue-500"
          />
        </div>

        <div className="flex-shrink-0 mr-4 cursor-pointer" onClick={onViewProduct}>
          <img 
            src={item.images[0]} 
            alt={item.name} 
            className="w-24 h-24 object-cover rounded-md" 
          />
        </div>

        <div className="flex-1">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <h3 
                className="text-base font-medium text-gray-900 hover:text-blue-600 cursor-pointer"
                onClick={onViewProduct}
              >
                {item.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {item.brand && `${item.brand} • `}
                {item.condition}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {item.location.city}, {item.location.country}
              </p>
            </div>

            <div className="mt-2 md:mt-0">
              <div className="text-lg font-semibold text-gray-900">${item.price.toFixed(2)}</div>
              <div className="text-sm text-gray-500">Item price</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between mt-4">
            <div className="flex items-center">
              <button 
                className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-md focus:outline-none"
                onClick={() => onQuantityChange(Math.max(1, item.quantity - 1))}
              >
                -
              </button>
              <span className="w-10 text-center">{item.quantity}</span>
              <button 
                className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-md focus:outline-none"
                onClick={() => onQuantityChange(Math.min(item.availableQuantity, item.quantity + 1))}
                disabled={item.quantity >= item.availableQuantity}
              >
                +
              </button>
              <span className="text-sm text-gray-500 ml-2">
                {item.availableQuantity} available
              </span>
            </div>

            <div className="flex items-center mt-2 md:mt-0">
              <button
                onClick={onRemove}
                className="text-red-500 hover:text-red-700 flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                <span className="text-sm">Remove</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 