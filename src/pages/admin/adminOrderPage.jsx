"use client"

import axios from "axios"
import { useEffect, useState, useRef } from "react"
import { toast } from "react-toastify"
import { jsPDF } from "jspdf"
import {
  Eye,
  Edit,
  Trash2,
  Download,
  Printer,
  Package,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Truck,
} from "lucide-react"

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [updateModalVisible, setUpdateModalVisible] = useState(false)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [updateData, setUpdateData] = useState({ status: "pending", notes: "" })
  const modalRef = useRef(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Please login to view orders")
      return
    }

    const fetchOrders = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setOrders(res.data)
      } catch (err) {
        if (err.response?.status === 401) {
          toast.error("Session expired. Please login again.")
        } else {
          toast.error("Failed to fetch orders. Please try again.")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModals()
      }
    }

    if (detailModalVisible || updateModalVisible || deleteModalVisible) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [detailModalVisible, updateModalVisible, deleteModalVisible])

  const calculateTotal = (products) => {
    return products.reduce((total, item) => total + item.productInfo.price * item.quantity, 0)
  }

  const handleViewDetails = (order) => {
    setSelectedOrder(order)
    setDetailModalVisible(true)
  }

  const handleUpdateOrder = (order) => {
    setSelectedOrder(order)
    setUpdateData({
      status: order.status,
      notes: order.notes || "",
    })
    setUpdateModalVisible(true)
  }

  const handleDeleteOrder = (order) => {
    setSelectedOrder(order)
    setDeleteModalVisible(true)
  }

  const closeModals = () => {
    setSelectedOrder(null)
    setUpdateModalVisible(false)
    setDetailModalVisible(false)
    setDeleteModalVisible(false)
  }

  const handleUpdate = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Unauthorized. Please login.")
      return
    }

    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${selectedOrder.orderId}`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      })

      toast.success("Order updated successfully.")
      setOrders(orders.map((order) => (order.orderId === selectedOrder.orderId ? { ...order, ...updateData } : order)))
      closeModals()
    } catch (err) {
      toast.error("Failed to update order. Please try again.")
    }
  }

  const handleDelete = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Unauthorized. Please login.")
      return
    }

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${selectedOrder.orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      toast.success("Order deleted successfully.")
      setOrders(orders.filter((order) => order.orderId !== selectedOrder.orderId))
      closeModals()
    } catch (err) {
      toast.error("Failed to delete order. Please try again.")
    }
  }

  const generatePDF = () => {
    const doc = new jsPDF()

    // Add title
    doc.setFontSize(18)
    doc.text(`Order #${selectedOrder.orderId}`, 14, 20)

    // Add customer info
    doc.setFontSize(12)
    doc.text(`Customer: ${selectedOrder.name}`, 14, 30)
    doc.text(`Email: ${selectedOrder.email}`, 14, 36)
    doc.text(`Phone: ${selectedOrder.phone}`, 14, 42)
    doc.text(`Address: ${selectedOrder.address}`, 14, 48)

    // Add order details
    doc.text(`Order Date: ${new Date(selectedOrder.createdAt).toLocaleString()}`, 14, 58)
    doc.text(`Status: ${selectedOrder.status}`, 14, 64)
    doc.text(`Payment Method: ${selectedOrder.paymentMethod}`, 14, 70)
    doc.text(`Shipping Method: ${selectedOrder.shippingMethod}`, 14, 76)

    // Add order items header
    doc.setFontSize(14)
    doc.text("Order Items:", 14, 86)

    // Add order items
    let yPosition = 94
    doc.setFontSize(12)
    doc.text("Product", 14, yPosition)
    doc.text("Price", 60, yPosition)
    doc.text("Qty", 100, yPosition)
    doc.text("Subtotal", 140, yPosition)

    yPosition += 8
    doc.setFontSize(10)

    selectedOrder.products.forEach((item) => {
      doc.text(item.productInfo.name, 14, yPosition)
      doc.text(`LKR ${item.productInfo.price.toFixed(2)}`, 60, yPosition)
      doc.text(item.quantity.toString(), 100, yPosition)
      doc.text(`LKR ${(item.productInfo.price * item.quantity).toFixed(2)}`, 140, yPosition)
      yPosition += 8

      // Add page break if needed
      if (yPosition > 280) {
        doc.addPage()
        yPosition = 20
      }
    })

    // Add total
    doc.setFontSize(14)
    doc.text(`Total: LKR ${calculateTotal(selectedOrder.products).toFixed(2)}`, 14, yPosition + 10)

    // Save the PDF
    doc.save(`order_${selectedOrder.orderId}.pdf`)
  }

  const printOrder = () => {
    const printContent = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
        <h1 style="text-align: center; font-size: 24px; margin-bottom: 20px;">Order #${selectedOrder.orderId}</h1>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
          <div>
            <h2 style="font-size: 18px; margin-bottom: 10px;">Customer Information</h2>
            <p><strong>Name:</strong> ${selectedOrder.name}</p>
            <p><strong>Email:</strong> ${selectedOrder.email}</p>
            <p><strong>Phone:</strong> ${selectedOrder.phone}</p>
            <p><strong>Address:</strong> ${selectedOrder.address}</p>
          </div>
          
          <div>
            <h2 style="font-size: 18px; margin-bottom: 10px;">Order Information</h2>
            <p><strong>Date:</strong> ${new Date(selectedOrder.createdAt).toLocaleString()}</p>
            <p><strong>Status:</strong> ${selectedOrder.status}</p>
            <p><strong>Payment:</strong> ${selectedOrder.paymentMethod}</p>
            <p><strong>Shipping:</strong> ${selectedOrder.shippingMethod}</p>
          </div>
        </div>
        
        <h2 style="font-size: 18px; margin-bottom: 10px;">Order Items</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Product</th>
              <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">Price</th>
              <th style="padding: 8px; border: 1px solid #ddd; text-align: center;">Qty</th>
              <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${selectedOrder.products
              .map(
                (item) => `
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;">${item.productInfo.name}</td>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">LKR ${item.productInfo.price.toFixed(2)}</td>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">LKR ${(item.productInfo.price * item.quantity).toFixed(2)}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
        
        <div style="text-align: right; font-size: 18px; font-weight: bold;">
          Total: LKR ${calculateTotal(selectedOrder.products).toFixed(2)}
        </div>
      </div>
    `

    const printWindow = window.open("", "_blank")
    printWindow.document.write(`
      <html>
        <head>
          <title>Order #${selectedOrder.orderId}</title>
          <style>
            @media print {
              @page { margin: 0; }
              body { margin: 1.6cm; }
            }
          </style>
        </head>
        <body>
          ${printContent}
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.close();
              }, 100);
            };
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "shipped":
        return "bg-blue-100 text-blue-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-full mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-8 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800">Admin Orders</h1>
          <p className="text-gray-600 mt-2">Manage customer orders and track deliveries</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 animate-spin rounded-full"></div>
              <p className="text-gray-500 text-sm">Loading orders...</p>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500 mb-6">Orders will appear here when customers place them.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order, index) => (
                  <tr
                    key={order.orderId}
                    className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-25"}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono align-top">
                      #{order.orderId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap align-top">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 align-top">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium align-top">
                      <div className="max-w-xs" title={order.name}>
                        {order.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 align-top">
                      <div className="max-w-xs truncate" title={order.email}>
                        {order.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 align-top">{order.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold align-top">
                      LKR {calculateTotal(order.products).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium align-top">
                      <div className="flex items-start space-x-2 pt-2">
                        <button
                          onClick={() => handleViewDetails(order)}
                          className="inline-flex items-center justify-center w-9 h-9 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors duration-200 border border-blue-200 hover:border-blue-300"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleUpdateOrder(order)}
                          className="inline-flex items-center justify-center w-9 h-9 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-lg transition-colors duration-200 border border-green-200 hover:border-green-300"
                          title="Edit Order"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order)}
                          className="inline-flex items-center justify-center w-9 h-9 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors duration-200 border border-red-200 hover:border-red-300"
                          title="Delete Order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {detailModalVisible && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div ref={modalRef} className="bg-white w-full max-w-5xl rounded-xl shadow-2xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
                  <p className="text-gray-600 mt-1">Order #{selectedOrder.orderId}</p>
                </div>
                <button
                  onClick={closeModals}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-200 rounded-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <User className="w-5 h-5 text-blue-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-800">Customer Information</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <User className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-gray-600 w-16">Name:</span>
                      <span className="font-medium text-gray-900">{selectedOrder.name}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-gray-600 w-16">Email:</span>
                      <span className="font-medium text-gray-900">{selectedOrder.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-gray-600 w-16">Phone:</span>
                      <span className="font-medium text-gray-900">{selectedOrder.phone}</span>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 text-gray-400 mr-3 mt-0.5" />
                      <span className="text-gray-600 w-16">Address:</span>
                      <span className="font-medium text-gray-900">{selectedOrder.address}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Package className="w-5 h-5 text-green-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-800">Order Information</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-4 h-4 mr-3"></div>
                      <span className="text-gray-600 w-20">Status:</span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(selectedOrder.status)}`}
                      >
                        {selectedOrder.status}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-gray-600 w-20">Date:</span>
                      <span className="font-medium text-gray-900">
                        {new Date(selectedOrder.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <CreditCard className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-gray-600 w-20">Payment:</span>
                      <span className="font-medium text-gray-900">{selectedOrder.paymentMethod}</span>
                    </div>
                    <div className="flex items-center">
                      <Truck className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-gray-600 w-20">Shipping:</span>
                      <span className="font-medium text-gray-900">{selectedOrder.shippingMethod}</span>
                    </div>
                    {selectedOrder.notes && (
                      <div className="flex items-start">
                        <div className="w-4 h-4 mr-3 mt-0.5"></div>
                        <span className="text-gray-600 w-20">Notes:</span>
                        <span className="font-medium text-gray-900">{selectedOrder.notes}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800">Order Items</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {selectedOrder.products.map((item, index) => (
                    <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start space-x-4">
                        {item.productInfo.images?.[0] && (
                          <img
                            src={item.productInfo.images[0] || "/placeholder.svg"}
                            alt={item.productInfo.name}
                            className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200"
                            onError={(e) => {
                              e.target.src = "/placeholder.svg?height=80&width=80"
                            }}
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">{item.productInfo.name}</h4>
                          {item.productInfo.description && (
                            <p className="text-sm text-gray-600 mb-3">{item.productInfo.description}</p>
                          )}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <span className="text-sm text-gray-500">Price:</span>
                              <div className="font-semibold text-gray-900">
                                LKR {item.productInfo.price.toFixed(2)}
                                {item.productInfo.labeledPrice > 0 && (
                                  <span className="ml-2 text-sm text-gray-500 line-through">
                                    LKR {item.productInfo.labeledPrice.toFixed(2)}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div>
                              <span className="text-sm text-gray-500">Quantity:</span>
                              <div className="font-semibold text-gray-900">{item.quantity}</div>
                            </div>
                            <div>
                              <span className="text-sm text-gray-500">Subtotal:</span>
                              <div className="font-semibold text-gray-900">
                                LKR {(item.productInfo.price * item.quantity).toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 bg-gray-50 rounded-lg p-6">
                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold text-gray-900">
                    Total: LKR {calculateTotal(selectedOrder.products).toFixed(2)}
                  </div>
                  <div className="flex space-x-3">
                    <button
                      className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      onClick={generatePDF}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </button>
                    <button
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      onClick={printOrder}
                    >
                      <Printer className="w-4 h-4 mr-2" />
                      Print
                    </button>
                    <button
                      className="inline-flex items-center px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                      onClick={closeModals}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {updateModalVisible && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div ref={modalRef} className="bg-white w-full max-w-md rounded-xl shadow-2xl">
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Update Order</h2>
                  <p className="text-gray-600 mt-1">Order #{selectedOrder.orderId}</p>
                </div>
                <button
                  onClick={closeModals}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-200 rounded-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                  <select
                    value={updateData.status}
                    onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Notes</label>
                  <textarea
                    value={updateData.notes}
                    onChange={(e) => setUpdateData({ ...updateData, notes: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    rows="4"
                    placeholder="Any additional notes..."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-8">
                <button
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  onClick={closeModals}
                >
                  Cancel
                </button>
                <button
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={handleUpdate}
                >
                  Update Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalVisible && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div ref={modalRef} className="bg-white w-full max-w-md rounded-xl shadow-2xl">
            <div className="p-6 border-b border-gray-200 bg-red-50">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-red-800">Confirm Deletion</h2>
                  <p className="text-red-600 mt-1">This action cannot be undone</p>
                </div>
                <button
                  onClick={closeModals}
                  className="text-red-400 hover:text-red-600 transition-colors p-2 hover:bg-red-100 rounded-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-gray-900 font-medium">Delete Order #{selectedOrder.orderId}?</p>
                  <p className="text-gray-600 text-sm">This will permanently remove the order from your system.</p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  onClick={closeModals}
                >
                  Cancel
                </button>
                <button
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  onClick={handleDelete}
                >
                  Delete Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
