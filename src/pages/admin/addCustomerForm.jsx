"use client"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Save, UserPlus } from "lucide-react"
import axios from "axios"
import { toast } from "react-toastify"

export default function AddCustomerForm() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    role: "customer",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/register`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      toast.success("Customer created successfully")
      navigate("/admin/customers")
    } catch (error) {
      console.error("Error creating customer:", error)
      toast.error(error.response?.data?.message || "Failed to create customer")
    } finally {
      setLoading(false)
    }
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
          <h1 className="text-2xl font-bold text-white">Add New Customer</h1>
          <p className="text-slate-400">Create a new customer account</p>
        </div>
        <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
          <UserPlus className="h-6 w-6 text-white" />
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
                placeholder="Enter first name"
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
                placeholder="Enter last name"
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
                placeholder="Enter email address"
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
              <label className="block text-slate-300 text-sm font-medium mb-2">Password *</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-800/50 border border-purple-800/30 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Enter password"
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
              {loading ? "Creating..." : "Create Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}