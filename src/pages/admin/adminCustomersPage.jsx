"use client"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Edit, Trash2, Eye, Plus, Search, Filter, Users, Mail, Phone, Calendar } from "lucide-react"
import axios from "axios"
import { toast } from "react-toastify"

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setCustomers(response.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching customers:", error)
      if (error.response?.status === 403) {
        toast.error("Admin access required")
      } else {
        toast.error("Failed to fetch customers")
      }
      setLoading(false)
    }
  }

  const handleDeleteCustomer = async (customerId) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return

    try {
      const token = localStorage.getItem("token")
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/users/${customerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      toast.success("Customer deleted successfully")
      fetchCustomers() // Refresh the list
    } catch (error) {
      console.error("Error deleting customer:", error)
      if (error.response?.status === 403) {
        toast.error("Admin access required")
      } else {
        toast.error("Failed to delete customer")
      }
    }
  }

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = customer.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === "all" || customer.role === filterRole
    return matchesSearch && matchesRole
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Customer Management</h1>
          <p className="text-slate-400">Manage your beauty clients and their accounts</p>
        </div>
        <Link
          to="/admin/customers/add"
          className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-colors shadow-md"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Customer
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-purple-800/30">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search customers..."
              className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-purple-800/30 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <select
              className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-purple-800/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500 appearance-none"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="customer">Customers</option>
              <option value="admin">Admins</option>
            </select>
          </div>

          <div className="text-slate-400 flex items-center">
            <Users className="h-4 w-4 mr-2" />
            {filteredCustomers.length} {filteredCustomers.length === 1 ? 'customer' : 'customers'} found
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-purple-800/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-purple-800/30">
                <th className="px-6 py-4 text-left text-slate-400 font-medium">Customer</th>
                <th className="px-6 py-4 text-left text-slate-400 font-medium">Contact</th>
                <th className="px-6 py-4 text-left text-slate-400 font-medium">Role</th>
                <th className="px-6 py-4 text-left text-slate-400 font-medium">Joined</th>
                <th className="px-6 py-4 text-left text-slate-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-800/30">
              {filteredCustomers.map((customer) => (
                <tr key={customer._id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm mr-3">
                        {customer.firstName ? customer.firstName.charAt(0).toUpperCase() : "U"}
                      </div>
                      <div>
                        <div className="text-white font-medium">{customer.firstName} {customer.lastName}</div>
                        <div className="text-slate-400 text-sm">ID: {customer._id?.substring(0, 8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-slate-300">
                        <Mail className="h-3 w-3 mr-2" />
                        <span className="text-sm">{customer.email}</span>
                      </div>
                      {customer.phone && (
                        <div className="flex items-center text-slate-400">
                          <Phone className="h-3 w-3 mr-2" />
                          <span className="text-sm">{customer.phone}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        customer.role === "admin"
                          ? "bg-purple-500/20 text-purple-300"
                          : "bg-pink-500/20 text-pink-300"
                      }`}
                    >
                      {customer.role || "customer"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-slate-400">
                      <Calendar className="h-3 w-3 mr-2" />
                      <span className="text-sm">
                        {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : "Unknown"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <Link
                        to={`/admin/customers/view/${customer._id}`}
                        className="p-2 bg-slate-700/50 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        to={`/admin/customers/edit/${customer._id}`}
                        className="p-2 bg-blue-500/20 rounded-lg text-blue-300 hover:text-white hover:bg-blue-500/30 transition-colors"
                        title="Edit Customer"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteCustomer(customer._id)}
                        className="p-2 bg-rose-500/20 rounded-lg text-rose-300 hover:text-white hover:bg-rose-500/30 transition-colors"
                        title="Delete Customer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-400">No customers found</p>
            {searchTerm && (
              <p className="text-slate-500 text-sm mt-2">
                Try adjusting your search or filter criteria
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}