"use client"

import { useEffect, useState } from "react"
import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom"
import {
  BarChart3,
  Box,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  Bell,
  Search,
  Sparkles,
  Heart,
  Star,
  TrendingUp,
  Gift,
  Calendar,
  Palette,
  Droplet,
  Leaf,
  Zap,
  ChevronDown,
  Menu,
  X,
} from "lucide-react"
import axios from "axios"
import { toast } from "react-toastify"

import AdminProductPage from "./admin/adminProductPage"
import AddProductForm from "./admin/addProductForm"
import EditProductForm from "./admin/editProductForm"
import AdminOrdersPage from "./admin/adminOrderPage"

export default function AdminHomePage() {
  const [user, setUser] = useState(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const userRole = localStorage.getItem("role")
  const location = useLocation()
  const path = location.pathname

  function getActiveClass(name) {
    if (path.includes(name)) {
      return "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg border-r-4 border-rose-300"
    }
    return "text-slate-300 hover:bg-gradient-to-r hover:from-pink-500/20 hover:to-purple-600/20 hover:text-white hover:shadow-md"
  }

  useEffect(() => {
    // Check if user is authenticated and has admin role
    if (!token || userRole !== "admin") {
      toast.error("Unauthorized access")
      navigate("/login")
      return
    }

    // Optionally fetch current user data (if needed for display)
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        console.log("Current user:", response.data)
        setUser(response.data)
      } catch (err) {
        console.error("Fetch user error:", err)
        toast.error("Failed to fetch user data")
        navigate("/login")
      }
    }

    fetchUser()
  }, [navigate, token, userRole])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    toast.success("Logged out successfully")
    navigate("/login")
  }

  return (
    <div className="w-full h-screen flex bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900">
      {/* Mobile Menu Button */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-full bg-white/10 text-white backdrop-blur-md"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar - Mobile */}
      <div
        className={`fixed inset-0 z-40 transform ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 md:hidden`}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
        <div className="relative w-[280px] h-full bg-gradient-to-b from-purple-900 via-purple-950 to-slate-900 flex flex-col shadow-2xl border-r border-purple-800/30 overflow-y-auto">
          <SidebarContent
            user={user}
            path={path}
            getActiveClass={getActiveClass}
            handleLogout={handleLogout}
            closeMobileMenu={() => setIsMobileMenuOpen(false)}
          />
        </div>
      </div>

      {/* Sidebar - Desktop */}
      <div className="hidden md:flex w-[280px] h-screen bg-gradient-to-b from-purple-900 via-purple-950 to-slate-900 flex-col shadow-2xl border-r border-purple-800/30">
        <SidebarContent user={user} path={path} getActiveClass={getActiveClass} handleLogout={handleLogout} />
      </div>

      {/* Main Content */}
      <div className="flex-1 h-screen overflow-auto">
        {/* Top Bar */}
        <div className="bg-white/5 backdrop-blur-sm border-b border-purple-800/30 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="md:flex-1">
              <h2 className="text-white text-lg font-semibold">
                {path.includes("products")
                  ? "Beauty Products"
                  : path.includes("orders")
                    ? "Customer Orders"
                    : path.includes("customers")
                      ? "Beauty Clients"
                      : "Beauty Dashboard"}
              </h2>
              <p className="text-slate-400 text-sm">
                {user?.name ? `Welcome back, ${user.name}` : "Welcome to your beauty business dashboard"}
              </p>
            </div>

            {/* Search Bar - Hidden on mobile */}
            <div className="hidden md:flex items-center bg-white/10 rounded-full px-3 py-1.5 flex-1 max-w-md mx-4">
              <Search className="h-4 w-4 text-slate-400 mr-2" />
              <input
                type="text"
                placeholder="Search products, orders, or customers..."
                className="bg-transparent border-none text-sm text-white placeholder-slate-400 focus:outline-none w-full"
              />
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></span>
              </button>

              {/* User Menu - Desktop */}
              <div className="hidden md:block relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-1 rounded-full hover:bg-white/10 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-lg py-1 z-50 border border-purple-800/30">
                    <div className="px-4 py-2 border-b border-purple-800/30">
                      <p className="text-white text-sm font-medium">{user?.name || "Admin User"}</p>
                      <p className="text-slate-400 text-xs">{user?.email || ""}</p>
                    </div>
                    <Link
                      to="/admin/profile"
                      className="block px-4 py-2 text-sm text-slate-300 hover:bg-purple-800/30 hover:text-white"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Your Profile
                    </Link>
                    <Link
                      to="/admin/settings"
                      className="block px-4 py-2 text-sm text-slate-300 hover:bg-purple-800/30 hover:text-white"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-rose-300 hover:bg-purple-800/30 hover:text-rose-200"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {user ? (
            <Routes>
              <Route path="/" element={<BeautyDashboard user={user} />} />
              <Route path="/products" element={<AdminProductPage />} />
              <Route path="/products/addProduct" element={<AddProductForm />} />
              <Route path="/products/editProduct" element={<EditProductForm />} />
              <Route path="/orders" element={<AdminOrdersPage />} />
              <Route path="/customers" element={<CustomersPlaceholder />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          ) : (
            <div className="w-full h-full flex justify-center items-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pink-500 mx-auto mb-4"></div>
                <p className="text-slate-400">Loading your beauty dashboard...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Sidebar Content Component
function SidebarContent({ user, path, getActiveClass, handleLogout, closeMobileMenu = () => {} }) {
  return (
    <>
      {/* Header */}
      <div className="px-6 py-8 border-b border-purple-800/30">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-white text-xl font-bold">Beauty Admin</h1>
            <p className="text-slate-400 text-sm">Cosmetics Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <Link
          className={`flex items-center py-3 px-4 rounded-xl transition-all duration-300 ${getActiveClass("dashboard")}`}
          to="/admin/dashboard"
          onClick={closeMobileMenu}
        >
          <BarChart3 className="mr-3 h-5 w-5" />
          <span className="font-medium">Dashboard</span>
        </Link>

        <Link
          className={`flex items-center py-3 px-4 rounded-xl transition-all duration-300 ${getActiveClass("products")}`}
          to="/admin/products"
          onClick={closeMobileMenu}
        >
          <Palette className="mr-3 h-5 w-5" />
          <span className="font-medium">Products</span>
        </Link>

        <Link
          className={`flex items-center py-3 px-4 rounded-xl transition-all duration-300 ${getActiveClass("orders")}`}
          to="/admin/orders"
          onClick={closeMobileMenu}
        >
          <ShoppingCart className="mr-3 h-5 w-5" />
          <span className="font-medium">Orders</span>
        </Link>

        <Link
          className={`flex items-center py-3 px-4 rounded-xl transition-all duration-300 ${getActiveClass("customers")}`}
          to="/admin/customers"
          onClick={closeMobileMenu}
        >
          <Users className="mr-3 h-5 w-5" />
          <span className="font-medium">Clients</span>
        </Link>

        <div className="pt-2 pb-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-2">Beauty Management</p>
        </div>

        <Link
          className={`flex items-center py-3 px-4 rounded-xl transition-all duration-300 ${getActiveClass("categories")}`}
          to="/admin/categories"
          onClick={closeMobileMenu}
        >
          <Box className="mr-3 h-5 w-5" />
          <span className="font-medium">Categories</span>
        </Link>

        <Link
          className={`flex items-center py-3 px-4 rounded-xl transition-all duration-300 ${getActiveClass("collections")}`}
          to="/admin/collections"
          onClick={closeMobileMenu}
        >
          <Heart className="mr-3 h-5 w-5" />
          <span className="font-medium">Collections</span>
        </Link>

        <Link
          className={`flex items-center py-3 px-4 rounded-xl transition-all duration-300 ${getActiveClass("promotions")}`}
          to="/admin/promotions"
          onClick={closeMobileMenu}
        >
          <Gift className="mr-3 h-5 w-5" />
          <span className="font-medium">Promotions</span>
        </Link>

        <div className="pt-2 pb-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-2">Administration</p>
        </div>

        <Link
          className={`flex items-center py-3 px-4 rounded-xl transition-all duration-300 ${getActiveClass("settings")}`}
          to="/admin/settings"
          onClick={closeMobileMenu}
        >
          <Settings className="mr-3 h-5 w-5" />
          <span className="font-medium">Settings</span>
        </Link>
      </nav>

      {/* User Profile - Mobile Only */}
      <div className="md:hidden p-4 border-t border-purple-800/30">
        <div className="bg-gradient-to-r from-purple-800/50 to-pink-800/50 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div>
                <p className="text-white font-medium text-sm">{user?.name || "Admin User"}</p>
                <p className="text-slate-400 text-xs">{user?.email || ""}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="text-rose-300 hover:text-white transition-colors">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* User Profile - Desktop */}
      {user && (
        <div className="hidden md:block p-4 border-t border-purple-800/30">
          <div className="bg-gradient-to-r from-purple-800/50 to-pink-800/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{user.name || "Admin User"}</p>
                  <p className="text-slate-400 text-xs">{user.email || ""}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-rose-300 hover:text-white transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// Enhanced Beauty Dashboard Component
function BeautyDashboard({ user }) {
  const stats = [
    {
      title: "Total Revenue",
      value: "$45,231",
      change: "+12.5%",
      icon: <BarChart3 className="h-6 w-6" />,
      gradient: "from-pink-500 to-purple-600",
    },
    {
      title: "Products",
      value: "1,429",
      change: "+8.2%",
      icon: <Palette className="h-6 w-6" />,
      gradient: "from-purple-500 to-pink-600",
    },
    {
      title: "Orders",
      value: "856",
      change: "+23.1%",
      icon: <ShoppingCart className="h-6 w-6" />,
      gradient: "from-rose-500 to-pink-600",
    },
    {
      title: "Clients",
      value: "2,847",
      change: "+15.3%",
      icon: <Users className="h-6 w-6" />,
      gradient: "from-fuchsia-500 to-purple-600",
    },
  ]

  const topProducts = [
    {
      name: "Radiance Serum",
      category: "Skincare",
      sales: 342,
      revenue: 12680,
      rating: 4.8,
      image: "/placeholder.svg?height=48&width=48",
    },
    {
      name: "Velvet Matte Lipstick",
      category: "Makeup",
      sales: 287,
      revenue: 5740,
      rating: 4.7,
      image: "/placeholder.svg?height=48&width=48",
    },
    {
      name: "Hydrating Face Mask",
      category: "Skincare",
      sales: 254,
      revenue: 7620,
      rating: 4.9,
      image: "/placeholder.svg?height=48&width=48",
    },
    {
      name: "Volumizing Mascara",
      category: "Makeup",
      sales: 231,
      revenue: 4620,
      rating: 4.6,
      image: "/placeholder.svg?height=48&width=48",
    },
  ]

  const categories = [
    { name: "Skincare", icon: <Droplet className="h-5 w-5" />, count: 428, color: "from-blue-500 to-cyan-400" },
    { name: "Makeup", icon: <Palette className="h-5 w-5" />, count: 367, color: "from-pink-500 to-rose-400" },
    { name: "Haircare", icon: <Sparkles className="h-5 w-5" />, count: 245, color: "from-amber-500 to-yellow-400" },
    { name: "Fragrance", icon: <Zap className="h-5 w-5" />, count: 189, color: "from-purple-500 to-violet-400" },
    { name: "Natural", icon: <Leaf className="h-5 w-5" />, count: 156, color: "from-green-500 to-emerald-400" },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl p-6 md:p-8 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="text-white text-2xl md:text-3xl font-bold">Welcome to Your Beauty Dashboard</h1>
            <p className="text-purple-100 mt-2">
              Manage your cosmetics business, track sales, and grow your beauty brand
            </p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-white text-purple-700 px-4 py-2 rounded-lg font-medium hover:bg-purple-50 transition-colors shadow-md">
              View Reports
            </button>
            <button className="bg-purple-800/50 text-white px-4 py-2 rounded-lg font-medium backdrop-blur-sm hover:bg-purple-800/70 transition-colors border border-purple-500/30">
              Add Product
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-purple-800/30 hover:bg-white/10 transition-all duration-300"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-400 text-sm font-medium">{item.title}</p>
                <p className="text-white text-2xl font-bold mt-2">{item.value}</p>
                <p className="text-pink-300 text-sm mt-1 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {item.change}
                </p>
              </div>
              <div className={`bg-gradient-to-r ${item.gradient} p-3 rounded-xl text-white shadow-lg`}>{item.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Products */}
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-sm rounded-2xl border border-purple-800/30 overflow-hidden">
          <div className="p-6 border-b border-purple-800/30 flex justify-between items-center">
            <h3 className="text-white text-lg font-semibold">Top Selling Products</h3>
            <Link
              to="/admin/products"
              className="text-pink-300 hover:text-pink-200 text-sm flex items-center transition-colors"
            >
              View All <ChevronDown className="h-4 w-4 ml-1 rotate-270" />
            </Link>
          </div>
          <div className="divide-y divide-purple-800/30">
            {topProducts.map((product, index) => (
              <div key={index} className="p-4 hover:bg-white/5 transition-colors">
                <div className="flex items-center">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-12 h-12 rounded-lg object-cover mr-4 border border-purple-800/30"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium truncate">{product.name}</h4>
                    <p className="text-slate-400 text-sm">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-semibold">${(product.revenue / 100).toFixed(2)}</div>
                    <div className="flex items-center justify-end text-sm">
                      <span className="text-yellow-400 mr-1">
                        <Star className="h-3 w-3 inline" />
                      </span>
                      <span className="text-slate-300">{product.rating}</span>
                      <span className="mx-2 text-slate-600">•</span>
                      <span className="text-slate-400">{product.sales} sold</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-gradient-to-r from-purple-900/50 to-pink-900/50 text-center">
            <Link to="/admin/products" className="text-pink-300 hover:text-white text-sm font-medium transition-colors">
              View All Products
            </Link>
          </div>
        </div>

        {/* Side Panels */}
        <div className="space-y-6">
          {/* Categories */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-purple-800/30 overflow-hidden">
            <div className="p-6 border-b border-purple-800/30">
              <h3 className="text-white text-lg font-semibold">Product Categories</h3>
            </div>
            <div className="p-4 space-y-3">
              {categories.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-2 hover:bg-white/5 rounded-lg">
                  <div className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center text-white mr-3`}
                    >
                      {category.icon}
                    </div>
                    <span className="text-white">{category.name}</span>
                  </div>
                  <span className="text-slate-400 text-sm">{category.count} items</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-purple-800/30 overflow-hidden">
            <div className="p-6 border-b border-purple-800/30">
              <h3 className="text-white text-lg font-semibold">Recent Activity</h3>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-pink-500 mt-2 mr-3"></div>
                    <div>
                      <p className="text-white text-sm">
                        New order <span className="text-pink-300 font-medium">#{1000 + item}</span> received
                      </p>
                      <p className="text-slate-400 text-xs">{item * 10} minutes ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Calendar */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-purple-800/30 overflow-hidden">
            <div className="p-6 border-b border-purple-800/30 flex justify-between items-center">
              <h3 className="text-white text-lg font-semibold">Upcoming</h3>
              <Calendar className="h-5 w-5 text-slate-400" />
            </div>
            <div className="p-4">
              <div className="space-y-3">
                <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 p-3 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-pink-300 text-xs">Tomorrow, 10:00 AM</p>
                      <p className="text-white font-medium">Summer Collection Launch</p>
                    </div>
                    <span className="px-2 py-1 bg-pink-500/20 text-pink-300 text-xs rounded-full">Important</span>
                  </div>
                </div>
                <div className="bg-purple-900/30 p-3 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-slate-400 text-xs">Friday, 2:30 PM</p>
                      <p className="text-white font-medium">Inventory Restock</p>
                    </div>
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">Scheduled</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CustomersPlaceholder() {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-purple-800/30">
      <div className="text-center">
        <Users className="h-16 w-16 text-slate-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Client Management</h1>
        <p className="text-slate-400">Manage your beauty clients and their preferences.</p>
        <div className="mt-6 flex justify-center">
          <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-pink-600 hover:to-purple-700 transition-colors shadow-md">
            Add New Client
          </button>
        </div>
      </div>
    </div>
  )
}

function NotFoundPage() {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-purple-800/30 text-center">
      <h1 className="text-6xl font-bold text-transparent bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text mb-4">
        404
      </h1>
      <p className="text-xl text-slate-300 mb-2">Page Not Found</p>
      <p className="text-slate-400 mb-6">The requested beauty admin page could not be found.</p>
      <Link
        to="/admin/dashboard"
        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-colors"
      >
        Return to Dashboard
      </Link>
    </div>
  )
}
