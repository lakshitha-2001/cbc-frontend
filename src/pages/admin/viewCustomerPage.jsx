"use client"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Edit, Mail, Phone, MapPin, Calendar, User, ShoppingBag } from "lucide-react"
import axios from "axios"
import { toast } from "react-toastify"

export default function ViewCustomerPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [customer, setCustomer] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCustomerData()
  }, [id])

  const fetchCustomerData = async () => {
    try {
      const token = localStorage.getItem("token")
      const customerResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      
      setCustomer(customerResponse.data)
      
      // Try to fetch orders, but handle the case where the endpoint might not exist
      try {
        const ordersResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders/user/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setOrders(ordersResponse.data)
      } catch (orderError) {
        console.log("Orders endpoint not available, continuing without order data")
        setOrders([])
      }
      
      setLoading(false)
    } catch (error) {
      console.error("Error fetching customer data:", error)
      toast.error("Failed to fetch customer details")
      navigate("/admin/customers")
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="text-center py-12">
        <User className="h-16 w-16 text-slate-400 mx-auto mb-4" />
        <p className="text-slate-400">Customer not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate("/admin/customers")}
            className="flex items-center text-slate-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Customers
          </button>
          <h1 className="text-2xl font-bold text-white">Customer Details</h1>
          <p className="text-slate-400">View and manage customer information</p>
        </div>
        <button
          onClick={() => navigate(`/admin/customers/edit/${id}`)}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-colors shadow-md"
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Customer
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-purple-800/30">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                {customer.firstName ? customer.firstName.charAt(0).toUpperCase() : customer.name ? customer.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {customer.firstName && customer.lastName 
                    ? `${customer.firstName} ${customer.lastName}` 
                    : customer.name || "Unknown User"
                  }
                </h2>
                <p className="text-slate-400">Customer since {new Date(customer.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="text-slate-300 font-medium mb-3">Contact Information</h3>
                <div className="flex items-center text-slate-400">
                  <Mail className="h-4 w-4 mr-3" />
                  <span>{customer.email}</span>
                </div>
                {customer.phone && (
                  <div className="flex items-center text-slate-400">
                    <Phone className="h-4 w-4 mr-3" />
                    <span>{customer.phone}</span>
                  </div>
                )}
                <div className="flex items-center text-slate-400">
                  <User className="h-4 w-4 mr-3" />
                  <span className="capitalize">{customer.role}</span>
                </div>
              </div>

              {customer.address && (
                <div className="space-y-2">
                  <h3 className="text-slate-300 font-medium mb-3">Address</h3>
                  <div className="flex items-start text-slate-400">
                    <MapPin className="h-4 w-4 mr-3 mt-1" />
                    <div>
                      <p>{customer.address.street}</p>
                      <p>{customer.address.city}, {customer.address.state} {customer.address.zipCode}</p>
                      <p>{customer.address.country}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Orders */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-purple-800/30 overflow-hidden">
            <div className="p-6 border-b border-purple-800/30 flex justify-between items-center">
              <h3 className="text-white text-lg font-semibold">Order History</h3>
              <span className="text-slate-400 text-sm">{orders.length} orders</span>
            </div>
            <div className="divide-y divide-purple-800/30">
              {orders.map((order) => (
                <div key={order._id} className="p-6 hover:bg-white/5 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-white font-medium">Order #{order.orderNumber || order._id.substring(0, 8)}</h4>
                      <p className="text-slate-400 text-sm">
                        <Calendar className="h-3 w-3 inline mr-1" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'delivered' 
                          ? 'bg-green-500/20 text-green-300' 
                          : order.status === 'processing'
                          ? 'bg-yellow-500/20 text-yellow-300'
                          : 'bg-blue-500/20 text-blue-300'
                      }`}
                    >
                      {order.status || 'pending'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-slate-400 text-sm">
                      {order.items ? order.items.length : 0} items • ${order.totalAmount || 0}
                    </div>
                    <button
                      onClick={() => navigate(`/admin/orders/view/${order._id}`)}
                      className="text-pink-300 hover:text-pink-200 text-sm transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {orders.length === 0 && (
              <div className="text-center py-12">
                <ShoppingBag className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-400">No orders found</p>
                <p className="text-slate-500 text-sm mt-2">
                  Order tracking might not be configured yet
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          {/* Statistics */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-purple-800/30">
            <h3 className="text-white font-medium mb-4">Customer Statistics</h3>
            <div className="space-y-4">
              <div>
                <p className="text-slate-400 text-sm">Total Orders</p>
                <p className="text-white text-2xl font-bold">{orders.length}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Total Spent</p>
                <p className="text-white text-2xl font-bold">
                  ${orders.reduce((total, order) => total + (order.totalAmount || 0), 0).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Average Order</p>
                <p className="text-white text-2xl font-bold">
                  ${orders.length > 0 ? (orders.reduce((total, order) => total + (order.totalAmount || 0), 0) / orders.length).toFixed(2) : '0.00'}
                </p>
              </div>
            </div>
          </div>

          {/* Account Status */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-purple-800/30">
            <h3 className="text-white font-medium mb-4">Account Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Status</span>
                <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded-full text-xs">
                  {customer.isBlocked ? 'Blocked' : 'Active'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Email Verified</span>
                <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded-full text-xs">Verified</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Last Login</span>
                <span className="text-slate-300 text-sm">
                  {customer.lastLogin ? new Date(customer.lastLogin).toLocaleDateString() : 'Never'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}