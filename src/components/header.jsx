"use client"

import { useState, useEffect } from "react"
import { Search, Menu, ShoppingCart, UserCircle, LogOut, ChevronDown, Plus, User } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

import { jwtDecode } from "jwt-decode"
import { toast } from "react-toastify"
import { getCartItemCount } from "../utils/cartFunction "

export default function Header() {
  const [isSliderOpen, setIsSliderOpen] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  // Load initial user and cart data
  useEffect(() => {
    updateUserFromToken()
    updateCartCount()

    // Listen for auth changes (login/logout)
    const handleAuthChange = () => {
      updateUserFromToken()
    }

    // Listen for cart changes
    const handleCartChange = () => {
      updateCartCount()
    }

    window.addEventListener("authChange", handleAuthChange)
    window.addEventListener("storage", handleCartChange)
    window.addEventListener("cartUpdated", handleCartChange)

    return () => {
      window.removeEventListener("authChange", handleAuthChange)
      window.removeEventListener("storage", handleCartChange)
      window.removeEventListener("cartUpdated", handleCartChange)
    }
  }, [])

  const updateUserFromToken = () => {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const decoded = jwtDecode(token)
        setUser({
          name: decoded.firstName || decoded.email.split("@")[0] || "User",
          email: decoded.email,
        })
      } catch (error) {
        console.error("Error decoding token:", error)
      }
    } else {
      setUser(null)
    }
  }

  const updateCartCount = () => {
    setCartCount(getCartItemCount())
  }

  const handleSignOut = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("firstName")
    // Dispatch event to notify other components
    window.dispatchEvent(new Event("authChange"))
    setShowUserDropdown(false)
    navigate("/login")
    toast.success("You have successfully logged out", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    })
  }

  const toggleSlider = () => setIsSliderOpen(!isSliderOpen)
  const toggleUserDropdown = () => setShowUserDropdown(!showUserDropdown)

  return (
    <>
      {/* Mobile Slider Menu */}
      {isSliderOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-60" onClick={toggleSlider}></div>
          <div className="fixed right-0 top-0 h-full w-80 bg-gradient-to-b from-gray-900 to-black shadow-2xl">
            <div className="flex flex-col gap-6 p-6 mt-8">
              <button onClick={toggleSlider} className="self-end text-gray-300 hover:text-white text-xl">
                ✕
              </button>

              <Link
                to="/"
                className="text-lg font-medium text-gray-200 hover:text-red-400 transition-colors border-b border-red-900/30 pb-3"
                onClick={toggleSlider}
              >
                Home
              </Link>
              <Link
                to="/products"
                className="text-lg font-medium text-gray-200 hover:text-red-400 transition-colors border-b border-red-900/30 pb-3"
                onClick={toggleSlider}
              >
                Products
              </Link>
              <Link
                to="/about"
                className="text-lg font-medium text-gray-200 hover:text-red-400 transition-colors border-b border-red-900/30 pb-3"
                onClick={toggleSlider}
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className="text-lg font-medium text-gray-200 hover:text-red-400 transition-colors border-b border-red-900/30 pb-3"
                onClick={toggleSlider}
              >
                Contact
              </Link>

              {user ? (
                <div className="flex flex-col gap-4 pt-4 border-t border-red-900/30">
                  <div className="text-sm text-gray-400">Welcome back,</div>
                  <div className="font-semibold text-red-400 flex items-center gap-2">
                    <UserCircle className="h-5 w-5" />
                    {user.name}
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-4 py-2 border border-red-600 text-red-400 hover:bg-red-900/20 rounded-md transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 pt-4 border-t border-red-900/30">
                  <Link to="/login">
                    <button className="w-full px-4 py-2 bg-gradient-to-r from-black to-red-900 hover:from-gray-900 hover:to-red-800 text-white rounded-md transition-all border border-red-800">
                      Sign In
                    </button>
                  </Link>
                  <Link to="/register">
                    <button className="w-full px-4 py-2 border border-red-600 text-red-400 hover:bg-red-900/20 rounded-md transition-colors">
                      Create Account
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Top ribbon */}
      <div className="bg-gradient-to-r from-gray-950 via-red-950 to-black text-white text-sm py-3 text-center font-medium shadow-lg">
        <div className="flex items-center justify-center gap-2">
          <span className="text-red-400"></span>
          <span>
            FREE SHIPPING ON ORDERS ABOVE $50 | Use Code: <span className="text-red-400 font-bold">BEAUTY20</span> for
            20% OFF
          </span>
          <span className="text-red-400"></span>
        </div>
      </div>

      <header className="bg-gradient-to-b from-white to-gray-50 w-full relative shadow-xl border-b border-gray-200">
        {/* Top utility bar */}
        <div className="flex justify-end items-center px-4 md:px-8 py-3 border-b border-gray-200 gap-4 md:gap-6">
          <div className="text-sm text-gray-700 hidden sm:block">
            Customer Service: <span className="font-bold text-black">0772077020</span>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search luxury products..."
              className="border-2 border-gray-300 rounded-full py-2 px-4 pl-10 text-sm w-40 md:w-52 focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-red-800 transition-all"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          </div>
        </div>

        {/* Main header */}
        <div className="flex justify-between items-center h-24 px-4 md:px-8">
          <div>
            <Link to="/" className="block">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-black via-red-800 to-black bg-clip-text text-transparent tracking-tight">
                CRYSTAL BEAUTY
              </h1>
              <p className="text-xs text-gray-600 mt-1 hidden md:block font-medium tracking-wide">
                LUXURY COSMETICS & PREMIUM BEAUTY
              </p>
            </Link>
          </div>

          <div className="flex items-center gap-6">
            {/* Add to Cart Icon */}
            <Link to="/cart" className="relative group">
              <button className="p-3 bg-gradient-to-r cursor-pointer from-black to-black text-white text-[2px] hover:from-gray-900 hover:to-red-700 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                <div className="relative">
                  <ShoppingCart className="h-6 w-6" />
                  {/* <Plus className="h-3 w-3 absolute -top-1 -right-1 bg-red-800 rounded-full p-0.5" /> */}
                </div>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg">
                    {cartCount}
                  </span>
                )}
              </button>
              <span className="absolute -bottom-14 left-1/2 transform -translate-x-1/2 whitespace-nowrap border border-black px-3 py-2 text-sm text-black opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-200 cursor-text">
                Add to Cart
              </span>
            </Link>

            {/* Mobile Menu */}
            <button
              onClick={toggleSlider}
              className="lg:hidden p-3 bg-black text-white hover:bg-gray-900 rounded-full transition-colors shadow-lg"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              <nav className="flex items-center gap-8">
                <Link
                  to="/"
                  className="text-gray-800 font-semibold hover:text-red-800 transition-colors text-sm relative group py-2"
                >
                  Home
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-black to-red-800 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link
                  to="/products"
                  className="text-gray-800 font-semibold hover:text-red-800 transition-colors text-sm relative group py-2"
                >
                  Products
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-black to-red-800 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link
                  to="/about"
                  className="text-gray-800 font-semibold hover:text-red-800 transition-colors text-sm relative group py-2"
                >
                  About Us
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-black to-red-800 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link
                  to="/contact"
                  className="text-gray-800 font-semibold hover:text-red-800 transition-colors text-sm relative group py-2"
                >
                  Contact
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-black to-red-800 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </nav>

              {/* User Authentication */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={toggleUserDropdown}
                    className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-full transition-all duration-300 shadow-md hover:shadow-lg border border-gray-300"
                  >
                    <div className="p-1 bg-gradient-to-r from-gray-200 to-gray-200 rounded-full">
                      <User className="h-5 w-5 text-black" />
                    </div>
                    <span className="font-semibold text-gray-800">{user.name}</span>
                    <ChevronDown className="h-4 w-4 text-gray-600" />
                  </button>

                  {showUserDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white border-2 border-gray-200 rounded-lg shadow-2xl z-50 overflow-hidden">
                      <div className="bg-gradient-to-r from-gray-900 to-gray-950 text-white px-4 py-3">
                        <div className="flex items-center gap-2">
                          <User className="h-5 w-5" />
                          <span className="font-semibold">{user.name}</span>
                        </div>
                        <div className="text-xs text-gray-300 mt-1">{user.email}</div>
                      </div>

                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-red-800 transition-colors"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <UserCircle className="h-4 w-4" />
                        My Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-red-800 transition-colors"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        My Orders
                      </Link>
                      <hr className="border-gray-200" />
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 w-full text-left transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link to="/login">
                    <button className="px-6 py-2 text-gray-800 font-semibold hover:text-red-800 hover:bg-gray-100 rounded-full transition-all duration-300">
                      Sign In
                    </button>
                  </Link>
                  <Link to="/register">
                    <button className="px-6 py-2 bg-gradient-to-r from-black to-red-900 hover:from-gray-900 hover:to-red-800 text-white rounded-full transition-all duration-300 shadow-lg hover:shadow-xl font-semibold">
                      Create Account
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
