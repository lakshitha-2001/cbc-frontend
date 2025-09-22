import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Home, Download, Truck, Calendar, CreditCard, User, MapPin, Phone, Mail } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOrderData = async () => {
      try {
        console.log("Trying to fetch order:", orderId);
        
        // FIRST: Try to get order data from localStorage (saved during checkout)
        const savedOrderData = localStorage.getItem(`order_${orderId}`);
        if (savedOrderData) {
          console.log("Found order data in localStorage");
          const orderData = JSON.parse(savedOrderData);
          setOrder(orderData);
          setLoading(false);
          return;
        }
        
        // SECOND: If not in localStorage, try API call
        const token = localStorage.getItem("token");
        if (token) {
          try {
            console.log("Trying API call for order data");
            const response = await axios.get(
              `${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}`,
              {
                headers: {
                  'Authorization': `Bearer ${token}`
                },
                timeout: 5000
              }
            );
            
            if (response.data.order) {
              console.log("Real order data found from API:", response.data.order);
              setOrder(response.data.order);
              setLoading(false);
              return;
            }
          } catch (apiError) {
            console.log("API call failed:", apiError.message);
          }
        }
        
        // THIRD: If both fail, use mock data but show error
        console.log("Using mock order data as fallback");
        setError("Could not load order details from server. Showing demo data.");
        
        const mockOrder = {
          orderId: orderId || "CBC00012",
          status: "confirmed",
          createdAt: new Date().toISOString(),
          name: "Customer Name",
          email: "customer@example.com",
          phone: "+1234567890",
          address: "Shipping Address",
          city: "City",
          country: "Country",
          zip: "ZIP Code",
          subtotal: 0,
          shippingCost: 0,
          discount: 0,
          total: 0,
          paymentInfo: {
            method: "credit_card"
          },
          products: [
            {
              name: "Product information not available",
              price: 0,
              qty: 1,
              image: "/placeholder-product.png"
            }
          ]
        };
        
        setOrder(mockOrder);
        
      } catch (err) {
        console.error("Error loading order:", err);
        setError("Failed to load order details. Please contact support.");
      } finally {
        setLoading(false);
      }
    };

    loadOrderData();
  }, [orderId, navigate]);

  const generatePDF = () => {
    if (!order) return;
    
    // Create new jsPDF instance
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.text('Order Confirmation', 105, 15, { align: 'center' });
    
    // Order Details
    doc.setFontSize(12);
    doc.text(`Order ID: ${order.orderId}`, 14, 25);
    doc.text(`Order Date: ${new Date(order.createdAt).toLocaleDateString()}`, 14, 32);
    doc.text(`Status: ${order.status}`, 14, 39);
    
    // Customer Information
    doc.text('Customer Information:', 14, 50);
    doc.text(`Name: ${order.name}`, 14, 57);
    doc.text(`Email: ${order.email}`, 14, 64);
    doc.text(`Phone: ${order.phone}`, 14, 71);
    doc.text(`Address: ${order.address}, ${order.city}, ${order.country} ${order.zip}`, 14, 78);
    
    // Products Table - Manual table creation
    let yPosition = 90;
    
    // Table headers
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('Product', 14, yPosition);
    doc.text('Qty', 100, yPosition);
    doc.text('Price', 130, yPosition);
    doc.text('Total', 160, yPosition);
    
    doc.setFont(undefined, 'normal');
    yPosition += 7;
    
    // Draw line under headers
    doc.line(14, yPosition - 2, 190, yPosition - 2);
    yPosition += 5;
    
    // Products rows
    order.products.forEach((item, index) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      // Product name (truncate if too long)
      const productName = item.name.length > 30 ? item.name.substring(0, 27) + '...' : item.name;
      doc.text(productName, 14, yPosition);
      doc.text(item.qty.toString(), 100, yPosition);
      doc.text(`Rs. ${item.price.toFixed(2)}`, 130, yPosition);
      doc.text(`Rs. ${(item.price * item.qty).toFixed(2)}`, 160, yPosition);
      
      yPosition += 7;
      
      // Add separator line every few items
      if (index < order.products.length - 1) {
        doc.line(14, yPosition - 2, 190, yPosition - 2);
        yPosition += 3;
      }
    });
    
    // Totals
    yPosition += 10;
    doc.line(14, yPosition - 5, 190, yPosition - 5);
    
    doc.text('Subtotal:', 120, yPosition);
    doc.text(`Rs. ${order.subtotal?.toFixed(2) || '0.00'}`, 160, yPosition);
    yPosition += 7;
    
    doc.text('Shipping:', 120, yPosition);
    doc.text(`Rs. ${order.shippingCost?.toFixed(2) || '0.00'}`, 160, yPosition);
    yPosition += 7;
    
    if (order.discount > 0) {
      doc.text('Discount:', 120, yPosition);
      doc.text(`-Rs. ${order.discount.toFixed(2)}`, 160, yPosition);
      yPosition += 7;
    }
    
    doc.setFont(undefined, 'bold');
    doc.text('Total:', 120, yPosition);
    doc.text(`Rs. ${order.total?.toFixed(2) || '0.00'}`, 160, yPosition);
    
    // Save the PDF
    doc.save(`order-${order.orderId}.pdf`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mx-auto max-w-md">
            <p>{error || "Order not found"}</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="mt-6 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Success Header */}
      <div className="text-center mb-8">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-gray-600 mb-4">
          Thank you for your purchase. Your order has been confirmed and is being processed.
        </p>
        {error && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded mx-auto max-w-md mt-4">
            <p className="text-sm">{error}</p>
          </div>
        )}
        <p className="text-sm text-gray-500">
          Order ID: {order.orderId}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Order Summary
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Order ID:</span>
                <p className="font-medium">{order.orderId}</p>
              </div>
              <div>
                <span className="text-gray-600">Order Date:</span>
                <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <p className="font-medium capitalize text-green-600">{order.status}</p>
              </div>
              <div>
                <span className="text-gray-600">Payment Method:</span>
                <p className="font-medium capitalize">
                  {order.paymentInfo.method.replace('_', ' ')}
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Truck className="h-5 w-5 mr-2" />
              Shipping Information
            </h2>
            <div className="space-y-2 text-sm">
              <p className="font-medium">{order.name}</p>
              <p>{order.address}</p>
              <p>{order.city}, {order.country} {order.zip}</p>
              <p className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                {order.phone}
              </p>
              <p className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                {order.email}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.products.map((item, index) => (
                <div key={index} className="flex justify-between items-center border-b pb-4 last:border-b-0 last:pb-0">
                  <div className="flex items-center">
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
                      <p className="text-sm text-gray-600">Quantity: {item.qty}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Rs. {(item.price * item.qty).toFixed(2)}</p>
                    <p className="text-sm text-gray-600">Rs. {item.price.toFixed(2)} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Total & Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Order Total</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rs. {order.subtotal?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Rs. {order.shippingCost?.toFixed(2) || '0.00'}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-Rs. {order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>Rs. {order.total?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={generatePDF}
                className="w-full bg-gray-300 hover:bg-gray-200 text-gray-900 py-3 px-4 rounded-sm font-medium flex items-center justify-center transition"
              >
                <Download className="h-5 w-5 mr-2" />
                Download Invoice
              </button>
              
              <Link to="/">
                <button className="w-full bg-black hover:bg-gray-800 text-white py-3 px-4 rounded-sm font-medium flex items-center justify-center transition">
                  <Home className="h-5 w-5 mr-2" />
                  Continue Shopping
                </button>
              </Link>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-md">
              <h3 className="font-semibold mb-2">What's Next?</h3>
              <p className="text-sm text-blue-700">
                You will receive an email confirmation shortly. 
                We'll notify you when your order has shipped.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}