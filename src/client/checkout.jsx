import React, { useState, useEffect } from 'react';
import { Plus, Minus, Trash2, ArrowLeft, CreditCard, Truck, Shield, Wallet } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Cart Utility Functions
const loadCart = () => {
  try {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error("Error loading cart:", error);
    return [];
  }
};

const saveCart = (cart) => {
  try {
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
  } catch (error) {
    console.error("Error saving cart:", error);
  }
};

const updateItemQuantity = (productId, newQty) => {
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
};

const deleteItem = (productId) => {
  const cart = loadCart().filter(item => item.productId !== productId);
  saveCart(cart);
  return cart;
};

const getCartItemCount = () => {
  const cart = loadCart();
  return cart.reduce((total, item) => total + item.qty, 0);
};

const getCartTotal = () => {
  const cart = loadCart();
  return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
};

const getTotalSavings = () => {
  const cart = loadCart();
  return cart.reduce((sum, item) => {
    if (item.labelledPrice && item.labelledPrice > item.price) {
      return sum + ((item.labelledPrice - item.price) * item.qty);
    }
    return sum;
  }, 0);
};

export default function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(loadCart());
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState('shipping');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    country: 'United States',
    state: '',
    zip: '',
    phone: '',
    saveInfo: false,
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleShippingMethodChange = (method) => {
    setShippingMethod(method);
  };

  useEffect(() => {
    const buyNowProduct = localStorage.getItem("buyNowProduct");
    if (buyNowProduct) {
      const product = JSON.parse(buyNowProduct);
      localStorage.removeItem("buyNowProduct");
      
      const existingItem = cart.find(item => item.productId === product.productId);
      if (!existingItem) {
        const updatedCart = addToCart(
          product.productId,
          product.quantity,
          {
            name: product.name,
            images: product.images,
            price: product.price,
            labelledPrice: product.labelledPrice
          }
        );
        setCart(updatedCart);
      }
    }
  }, [cart]);

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
    toast.success("Item removed from cart");
    setIsUpdating(false);
  };

  const addToCart = (productId, qty, productDetails = null) => {
    const cart = loadCart();
    const index = cart.findIndex(item => item.productId === productId);

    if (index === -1) {
      const newItem = productDetails 
        ? {
            productId,
            qty,
            name: productDetails.name,
            image: productDetails.images?.[0] || "",
            price: productDetails.price,
            labelledPrice: productDetails.labelledPrice
          }
        : { productId, qty };
      
      cart.push(newItem);
    } else {
      const newQty = cart[index].qty + qty;
      
      if (newQty <= 0) {
        cart.splice(index, 1);
      } else {
        cart[index].qty = newQty;
      }
    }

    saveCart(cart);
    return cart;
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to place an order");
        navigate("/login");
        return;
      }

      const orderData = {
        name: `${formData.firstName} ${formData.lastName}`,
        address: formData.address,
        phone: formData.phone,
        products: cart.map(item => ({
          productId: item.productId,
          qty: item.qty
        })),
        email: formData.email,
        city: formData.city,
        country: formData.country,
        zip: formData.zip,
        shippingMethod: shippingMethod,
        paymentInfo: {
          method: paymentMethod
        }
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders`,
        orderData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      localStorage.removeItem("cart");
      window.dispatchEvent(new Event('cartUpdated'));
      navigate(`/order-confirmation/${response.data.order.orderId}`);
      
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error(error.response?.data?.message || "Error placing order");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === 'shipping') {
      setActiveTab('payment');
    } else {
      handlePlaceOrder();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-gray-600 hover:text-black"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Cart
        </button>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">Your cart is empty</p>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex mb-6 border-b">
                <button
                  className={`pb-4 px-4 font-medium ${activeTab === 'shipping' ? 'text-black border-b-2 border-black' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('shipping')}
                >
                  Shipping
                </button>
                <button
                  className={`pb-4 px-4 font-medium ${activeTab === 'payment' ? 'text-black border-b-2 border-black' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('payment')}
                >
                  Payment
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                {activeTab === 'shipping' ? (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                    <div className="mb-6">
                      <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-md"
                        required
                      />
                    </div>

                    <h2 className="text-xl font-semibold mb-4 mt-8">Shipping Address</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium mb-1">First Name</label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="w-full p-3 border rounded-md"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium mb-1">Last Name</label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="w-full p-3 border rounded-md"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="address" className="block text-sm font-medium mb-1">Address</label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-md"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="apartment" className="block text-sm font-medium mb-1">Apartment, suite, etc. (optional)</label>
                      <input
                        type="text"
                        id="apartment"
                        name="apartment"
                        value={formData.apartment}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-md"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium mb-1">City</label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="w-full p-3 border rounded-md"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="country" className="block text-sm font-medium mb-1">Country</label>
                        <select
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          className="w-full p-3 border rounded-md"
                          required
                        >
                          <option value="United States">United States</option>
                          <option value="Canada">Canada</option>
                          <option value="United Kingdom">United Kingdom</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="zip" className="block text-sm font-medium mb-1">ZIP Code</label>
                        <input
                          type="text"
                          id="zip"
                          name="zip"
                          value={formData.zip}
                          onChange={handleChange}
                          className="w-full p-3 border rounded-md"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-md"
                        required
                      />
                    </div>

                    <div className="flex items-center mt-4">
                      <input
                        type="checkbox"
                        id="saveInfo"
                        name="saveInfo"
                        checked={formData.saveInfo}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      <label htmlFor="saveInfo" className="text-sm">Save this information for next time</label>
                    </div>

                    <div className="mt-8">
                      <h2 className="text-xl font-semibold mb-4">Shipping Method</h2>
                      <div className="space-y-3">
                        <label className="flex items-center p-4 border rounded-md cursor-pointer">
                          <input
                            type="radio"
                            name="shippingMethod"
                            value="standard"
                            checked={shippingMethod === 'standard'}
                            onChange={() => handleShippingMethodChange('standard')}
                            className="mr-3"
                          />
                          <div className="flex-grow">
                            <div className="flex justify-between">
                              <span className="font-medium">Standard Shipping</span>
                              <span className="font-medium">Free</span>
                            </div>
                            <p className="text-sm text-gray-600">3-5 business days</p>
                          </div>
                        </label>
                        <label className="flex items-center p-4 border rounded-md cursor-pointer">
                          <input
                            type="radio"
                            name="shippingMethod"
                            value="express"
                            checked={shippingMethod === 'express'}
                            onChange={() => handleShippingMethodChange('express')}
                            className="mr-3"
                          />
                          <div className="flex-grow">
                            <div className="flex justify-between">
                              <span className="font-medium">Express Shipping</span>
                              <span className="font-medium">$9.99</span>
                            </div>
                            <p className="text-sm text-gray-600">1-2 business days</p>
                          </div>
                        </label>
                        <label className="flex items-center p-4 border rounded-md cursor-pointer">
                          <input
                            type="radio"
                            name="shippingMethod"
                            value="express"
                            checked={formData.shippingMethod === 'express'}
                            onChange={handleChange}
                            className="mr-3"
                          />
                          <div className="flex-grow">
                            <div className="flex justify-between">
                              <span className="font-medium">Express Shipping</span>
                              <span className="font-medium">$9.99</span>
                            </div>
                            <p className="text-sm text-gray-600">1-2 business days</p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                    
                    <div className="space-y-3 mb-6">
                      <label className="flex items-center p-4 border rounded-md cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="credit_card"
                          checked={paymentMethod === 'credit_card'}
                          onChange={() => setPaymentMethod('credit_card')}
                          className="mr-3"
                        />
                        <div className="flex-grow">
                          <div className="flex items-center">
                            <CreditCard className="h-5 w-5 mr-2" />
                            <span className="font-medium">Credit/Debit Card</span>
                          </div>
                        </div>
                      </label>
                      
                      <label className="flex items-center p-4 border rounded-md cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="paypal"
                          checked={paymentMethod === 'paypal'}
                          onChange={() => setPaymentMethod('paypal')}
                          className="mr-3"
                        />
                        <div className="flex-grow">
                          <div className="flex items-center">
                            <Wallet className="h-5 w-5 mr-2" />
                            <span className="font-medium">PayPal</span>
                          </div>
                        </div>
                      </label>
                      
                      <label className="flex items-center p-4 border rounded-md cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cash_on_delivery"
                          checked={paymentMethod === 'cash_on_delivery'}
                          onChange={() => setPaymentMethod('cash_on_delivery')}
                          className="mr-3"
                        />
                        <div className="flex-grow">
                          <div className="flex items-center">
                            <Truck className="h-5 w-5 mr-2" />
                            <span className="font-medium">Cash on Delivery</span>
                          </div>
                        </div>
                      </label>
                    </div>

                    {paymentMethod === 'credit_card' && (
                      <div className="p-4 border rounded-md bg-gray-50">
                        <div className="mb-4">
                          <label htmlFor="cardNumber" className="block text-sm font-medium mb-1">Card Number</label>
                          <input
                            type="text"
                            id="cardNumber"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleChange}
                            placeholder="1234 5678 9012 3456"
                            className="w-full p-3 border rounded-md"
                            required
                          />
                        </div>
                        
                        <div className="mb-4">
                          <label htmlFor="cardName" className="block text-sm font-medium mb-1">Name on Card</label>
                          <input
                            type="text"
                            id="cardName"
                            name="cardName"
                            value={formData.cardName}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-md"
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="expiry" className="block text-sm font-medium mb-1">Expiration Date</label>
                            <input
                              type="text"
                              id="expiry"
                              name="expiry"
                              value={formData.expiry}
                              onChange={handleChange}
                              placeholder="MM/YY"
                              className="w-full p-3 border rounded-md"
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor="cvv" className="block text-sm font-medium mb-1">CVV</label>
                            <input
                              type="text"
                              id="cvv"
                              name="cvv"
                              value={formData.cvv}
                              onChange={handleChange}
                              placeholder="123"
                              className="w-full p-3 border rounded-md"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'paypal' && (
                      <div className="p-4 border rounded-md bg-gray-50">
                        <p className="text-sm text-gray-600">You will be redirected to PayPal to complete your payment</p>
                      </div>
                    )}

                    {paymentMethod === 'cash_on_delivery' && (
                      <div className="p-4 border rounded-md bg-gray-50">
                        <p className="text-sm text-gray-600">Pay with cash when your order is delivered</p>
                      </div>
                    )}
                    
                    <div className="mt-6">
                      <h2 className="text-xl font-semibold mb-4">Billing Address</h2>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="sameAsShipping"
                          className="mr-2"
                          defaultChecked
                        />
                        <label htmlFor="sameAsShipping">Same as shipping address</label>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between mt-8">
                  {activeTab === 'payment' ? (
                    <button
                      type="button"
                      onClick={() => setActiveTab('shipping')}
                      className="text-gray-600 hover:text-black flex items-center"
                    >
                      <ArrowLeft className="h-5 w-5 mr-2" />
                      Back to Shipping
                    </button>
                  ) : (
                    <div></div>
                  )}
                  <button
                    type="submit"
                    className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-md font-medium"
                    disabled={isUpdating || isSubmitting}
                  >
                    {isSubmitting ? 'Processing...' : 
                      activeTab === 'shipping' ? 'Continue to Payment' : 'Place Order'}
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.productId} className="flex justify-between items-start">
                    <div className="flex items-start">
                      <div className="w-16 h-16 bg-gray-100 rounded-md mr-4 overflow-hidden">
                        <img 
                          src={item.image || '/placeholder-product.png'} 
                          alt={item.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.src = '/placeholder-product.png';
                          }}
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-600">Qty: {item.qty}</p>
                        <button 
                          onClick={() => removeItem(item.productId)}
                          className="text-red-500 text-sm mt-1 flex items-center"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${(item.price * item.qty).toFixed(2)}</p>
                      {item.labelledPrice && item.labelledPrice > item.price && (
                        <p className="text-sm text-gray-500 line-through">${(item.labelledPrice * item.qty).toFixed(2)}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t mt-6 pt-6 space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal ({getCartItemCount()} {getCartItemCount() === 1 ? 'item' : 'items'})</span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{formData.shippingMethod === 'standard' ? 'Free' : '$9.99'}</span>
                </div>
                {getTotalSavings() > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discounts</span>
                    <span>-${getTotalSavings().toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-4">
                  <span>Total</span>
                  <span>
                    ${(formData.shippingMethod === 'standard' 
                      ? getCartTotal() 
                      : getCartTotal() + 9.99
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.productId} className="flex justify-between items-start">
                    <div className="flex items-start">
                      <div className="w-16 h-16 bg-gray-100 rounded-md mr-4 overflow-hidden">
                        <img 
                          src={item.image || '/placeholder-product.png'} 
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-600">Qty: {item.qty}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${(item.price * item.qty).toFixed(2)}</p>
                      {item.labelledPrice && item.labelledPrice > item.price && (
                        <p className="text-sm text-gray-500 line-through">${(item.labelledPrice * item.qty).toFixed(2)}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t mt-6 pt-6 space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{formData.shippingMethod === 'standard' ? 'Free' : '$9.99'}</span>
                </div>
                {getTotalSavings() > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discounts</span>
                    <span>-${getTotalSavings().toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-4">
                  <span>Total</span>
                  <span>
                    ${(formData.shippingMethod === 'standard' 
                      ? getCartTotal() 
                      : getCartTotal() + 9.99
                    ).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Truck className="h-5 w-5 mr-2" />
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Shield className="h-5 w-5 mr-2" />
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