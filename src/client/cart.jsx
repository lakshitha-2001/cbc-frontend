import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

/**
 * Cart Item Type
 * @typedef {Object} CartItem
 * @property {string} productId - The ID of the product
 * @property {number} qty - The quantity of the product
 * @property {string} [name] - The name of the product
 * @property {string} [image] - The image URL of the product
 * @property {number} [price] - The current price of the product
 * @property {number} [labelledPrice] - The original price if discounted
 */

/**
 * Loads the cart from localStorage
 * @returns {CartItem[]} The cart array
 */
function loadCart() {
  try {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error("Error loading cart:", error);
    return [];
  }
}

/**
 * Saves the cart to localStorage and dispatches update event
 * @param {CartItem[]} cart - The cart array to save
 */
function saveCart(cart) {
  try {
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
  } catch (error) {
    console.error("Error saving cart:", error);
  }
}

/**
 * Removes an item from the cart
 * @param {string} productId - The ID of the product to remove
 * @returns {CartItem[]} The updated cart
 */
function deleteItem(productId) {
  const cart = loadCart();
  const filteredCart = cart.filter(item => item.productId !== productId);
  
  if (filteredCart.length !== cart.length) {
    saveCart(filteredCart);
  }

  return filteredCart;
}

/**
 * Updates the quantity of a specific item in the cart
 * @param {string} productId - The ID of the product
 * @param {number} newQty - The new quantity
 * @returns {CartItem[]} The updated cart
 */
function updateItemQuantity(productId, newQty) {
  const cart = loadCart();
  const index = cart.findIndex(item => item.productId === productId);

  if (index !== -1) {
    if (newQty <= 0) {
      cart.splice(index, 1);
    } else {
      cart[index].qty = newQty;
    }
    saveCart(cart);
  }

  return cart;
}

/**
 * Gets the total number of items in the cart
 * @returns {number} Total quantity of all items
 */
function getCartItemCount() {
  const cart = loadCart();
  return cart.reduce((total, item) => total + item.qty, 0);
}

/**
 * Gets the total price of all items in the cart
 * @returns {number} Total price
 */
function getCartTotal() {
  const cart = loadCart();
  return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
}

export default function Cart() {
  const [cart, setCart] = useState(loadCart());
  const [isUpdating, setIsUpdating] = useState(false);

  // Refresh cart when localStorage changes or cartUpdated event is dispatched
  useEffect(() => {
    const handleStorageChange = () => {
      setCart(loadCart());
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleStorageChange);
    };
  }, []);

  const updateQuantity = (productId, newQty) => {
    setIsUpdating(true);
    const updatedCart = updateItemQuantity(productId, newQty);
    setCart(updatedCart);
    setIsUpdating(false);
  };

  const removeItem = (productId) => {
    setIsUpdating(true);
    const updatedCart = deleteItem(productId);
    setCart(updatedCart);
    toast.success("Item removed from cart", {
      position: "top-center",
      autoClose: 3000,
    });
    setIsUpdating(false);
  };

  const clearCart = () => {
    setIsUpdating(true);
    localStorage.removeItem("cart");
    window.dispatchEvent(new Event('cartUpdated'));
    toast.success("Cart cleared successfully", {
      position: "top-center",
      autoClose: 3000,
    });
    setCart([]);
    setIsUpdating(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
      
      {cart.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">Your cart is empty</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="mt-4 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cart.map((item) => (
              <div key={item.productId} className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg">
                {/* Product Image */}
                <div className="w-full sm:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img 
                    src={item.image || '/placeholder-product.png'} 
                    alt={item.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.src = '/placeholder-product.png';
                    }}
                  />
                </div>
                
                {/* Product Info */}
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <button 
                      onClick={() => removeItem(item.productId)}
                      className="text-gray-500 hover:text-red-500 transition"
                      aria-label="Remove item"
                      disabled={isUpdating}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <p className="text-gray-600 mt-1">
                    {item.labelledPrice && item.labelledPrice > item.price ? (
                      <>
                        <span className="text-red-600 font-semibold">${item.price?.toFixed(2)}</span>
                        <span className="ml-2 text-sm line-through">${item.labelledPrice?.toFixed(2)}</span>
                      </>
                    ) : (
                      <span className="font-semibold">${item.price?.toFixed(2)}</span>
                    )}
                  </p>
                  
                  {/* Quantity Controls */}
                  <div className="mt-4 flex items-center gap-4">
                    <button 
                      onClick={() => updateQuantity(item.productId, item.qty - 1)}
                      disabled={isUpdating || item.qty <= 1}
                      className="p-2 border rounded-md hover:bg-gray-50 disabled:opacity-50"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    
                    <span className="w-8 text-center">{item.qty}</span>
                    
                    <button 
                      onClick={() => updateQuantity(item.productId, item.qty + 1)}
                      disabled={isUpdating}
                      className="p-2 border rounded-md hover:bg-gray-50 disabled:opacity-50"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="flex justify-end mt-4">
              <button 
                onClick={clearCart}
                className="text-red-600 hover:text-red-800 flex items-center gap-2 transition"
                disabled={isUpdating}
              >
                <Trash2 className="h-5 w-5" />
                Clear Cart
              </button>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="bg-gray-50 p-6 rounded-lg h-fit sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal ({getCartItemCount()} {getCartItemCount() === 1 ? 'item' : 'items'})</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
            <Link to = "/checkout" state={{ cart : cart }}>
            <button 
              className="w-full bg-black hover:bg-gray-800 text-white py-3 px-6 rounded-lg font-medium mt-6 transition"
              disabled={isUpdating || cart.length === 0}
            >
              Proceed to Checkout
            </button>
            </Link>
            
            <div className="mt-4 text-sm text-gray-500">
              <p>or</p>
              <button 
                onClick={() => window.location.href = '/'}
                className="text-blue-600 hover:underline mt-2"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}