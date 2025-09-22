"use client"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Save, User } from "lucide-react"
import axios from "axios"
import { toast } from "react-toastify"

export default function EditCustomerForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(false)
  const [customer, setCustomer] = useState(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "customer",
    isBlocked: false,
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: ""
    }
  })

  useEffect(() => {
    fetchCustomer()
  }, [id])

  const fetchCustomer = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setCustomer(response.data)
      setFormData({
        firstName: response.data.firstName || response.data.name || "",
        lastName: response.data.lastName || "",
        email: response.data.email || "",
        phone: response.data.phone || "",
        role: response.data.role || "customer",
        isBlocked: response.data.isBlocked || false,
        address: response.data.address || {
          street: "",
          city: "",
          state: "",
          zipCode: "",
          country: ""
        }
      })
    } catch (error) {
      console.error("Error fetching customer:", error)
      toast.error("Failed to fetch customer details")
      navigate("/admin/customers")
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/users/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      toast.success("Customer updated successfully")
      navigate("/admin/customers")
    } catch (error) {
      console.error("Error updating customer:", error)
      toast.error(error.response?.data?.message || "Failed to update customer")
    } finally {
      setLoading(false)
    }
  }

  if (!customer) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
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
          <h1 className="text-2xl font-bold text-white">Edit Customer</h1>
          <p className="text-slate-400">Update customer information</p>
        </div>
        <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
          <User className="h-6 w-6 text-white" />
        </div>
      </div>

      {/* Form */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-purple-800/30">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">First Name *</label>
              <input
                type="text"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-800/50 border border-purple-800/30 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Last Name *</label>
              <input
                type="text"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-800/50 border border-purple-800/30 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Email Address *</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-800/50 border border-purple-800/30 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-800/50 border border-purple-800/30 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Role *</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-800/50 border border-purple-800/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isBlocked"
                name="isBlocked"
                checked={formData.isBlocked}
                onChange={handleChange}
                className="h-4 w-4 text-pink-500 focus:ring-pink-500 border-gray-600 rounded bg-gray-700"
              />
              <label htmlFor="isBlocked" className="ml-2 block text-slate-300 text-sm">
                Block this customer
              </label>
            </div>
          </div>

          {/* Address Fields */}
          <div className="pt-6 border-t border-purple-800/30">
            <h3 className="text-lg font-semibold text-white mb-4">Address Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Street Address</label>
                <input
                  type="text"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-purple-800/30 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">City</label>
                <input
                  type="text"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-purple-800/30 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">State</label>
                <input
                  type="text"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-purple-800/30 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">ZIP Code</label>
                <input
                  type="text"
                  name="address.zipCode"
                  value={formData.address.zipCode}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-purple-800/30 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Country</label>
                <input
                  type="text"
                  name="address.country"
                  value={formData.address.country}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-purple-800/30 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={() => navigate("/admin/customers")}
              className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-colors shadow-md disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Updating..." : "Update Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}