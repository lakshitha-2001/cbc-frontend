"use client"
import { useState, useEffect } from "react"
import { Search, Menu, ShoppingCart, UserCircle, LogOut, ChevronDown, User } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import { toast } from "react-toastify"
import { getCartItemCount } from "../utils/cartFunction "
import WishlistIcon from "./wishlist/WishlistIcon"

export default function Header() {
  const [isSliderOpen, setIsSliderOpen] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [user, setUser] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate()
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    updateUserFromToken()
    updateCartCount()
    const handleAuthChange = () => {
      updateUserFromToken()
    }
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

  const handleSearch = (e) => {
    e.preventDefault()
    const trimmedQuery = searchQuery.trim()

    if (trimmedQuery) {
      setIsSearching(true)
      navigate(`/search/${encodeURIComponent(trimmedQuery)}`)
      setSearchQuery("")
      setIsSearching(false) // Reset searching state
    } else {
      toast.warning("Please enter a search term", {
        position: "top-right",
        autoClose: 3000,
      })
    }
  }

  return (
    <>
      {/* Mobile Slider Menu */}
      {isSliderOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-60" onClick={toggleSlider}></div>
          <div className="fixed right-0 top-0 h-full w-80 bg-gradient-to-b from-purple-900 to-pink-900 shadow-2xl">
            <div className="flex flex-col gap-6 p-6 mt-8">
              <button onClick={toggleSlider} className="self-end text-pink-200 hover:text-white text-xl">
                ✕
              </button>
              <Link
                to="/"
                className="text-lg font-medium text-pink-100 hover:text-rose-300 transition-colors border-b border-rose-400/30 pb-3"
                onClick={toggleSlider}
              >
                Home
              </Link>
              <Link
                to="/products"
                className="text-lg font-medium text-pink-100 hover:text-rose-300 transition-colors border-b border-rose-400/30 pb-3"
                onClick={toggleSlider}
              >
                Products
              </Link>
              <Link
                to="/about"
                className="text-lg font-medium text-pink-100 hover:text-rose-300 transition-colors border-b border-rose-400/30 pb-3"
                onClick={toggleSlider}
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className="text-lg font-medium text-pink-100 hover:text-rose-300 transition-colors border-b border-rose-400/30 pb-3"
                onClick={toggleSlider}
              >
                Contact
              </Link>
              {user ? (
                <div className="flex flex-col gap-4 pt-4 border-t border-rose-400/30">
                  <div className="text-sm text-pink-200">Welcome back,</div>
                  <div className="font-semibold text-rose-300 flex items-center gap-2">
                    <UserCircle className="h-5 w-5" />
                    {user.name}
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-4 py-2 border border-rose-400 text-rose-300 hover:bg-rose-400/20 rounded-md transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 pt-4 border-t border-rose-400/30">
                  <Link to="/login">
                    <button className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-md transition-all border border-rose-400">
                      Sign In
                    </button>
                  </Link>
                  <Link to="/register">
                    <button className="w-full px-4 py-2 border border-rose-400 text-rose-300 hover:bg-rose-400/20 rounded-md transition-colors">
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
      <div className="bg-accent text-white text-sm py-3 text-center font-medium shadow-lg">
        <div className="flex items-center justify-center gap-2">
          <span className="text-rose-300"></span>
          <span>
            FREE SHIPPING ON ORDERS ABOVE $50 | Use Code: <span className="text-rose-300 font-bold">BEAUTY20</span> for
            20% OFF
          </span>
          <span className="text-rose-300"></span>
        </div>
      </div>

      <header className="bg-gradient-to-b w-full relative shadow-xl border-b border-pink-200">
        {/* Top utility bar */}
        <div className="flex justify-end items-center px-4 md:px-8 py-3 border-b border-pink-200 gap-4 md:gap-6">
          <div className="text-sm text-purple-700 hidden sm:block">
            Customer Service: <span className="font-bold text-purple-900">0772077020</span>
          </div>
          <form onSubmit={handleSearch} className="relative" role="search">
            <label htmlFor="search-input" className="sr-only">
              Search products
            </label>
            <input
              id="search-input"
              type="text"
              placeholder="Search luxury products..."
              className="border-2 border-pink-300 rounded-full py-2 px-4 pl-10 text-sm w-40 md:w-52 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white/80"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search products"
            />
            <button
              type="submit"
              className="absolute left-3 top-2.5 h-4 w-4 text-pink-500 hover:text-purple-600"
              aria-label="Submit search"
            >
              <Search className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Main header */}
        <div className="flex justify-between items-center h-24 px-4 md:px-8">
          <div>
            <Link to="/" className="block">
              <h1
                className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 bg-clip-text text-transparent tracking-tight"
                style={{ fontFamily: "'Dancing Script', 'Brush Script MT', cursive" }}
              >
                Crystal Beauty
              </h1>
              <p className="text-xs text-purple-600 mt-1 hidden md:block font-medium tracking-wide">
                LUXURY COSMETICS & PREMIUM BEAUTY
              </p>
            </Link>
          </div>

          <div className="flex items-center gap-6">
            {/* Mobile Menu */}
            <button
              onClick={toggleSlider}
              className="lg:hidden p-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 rounded-full transition-colors shadow-lg"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              <nav className="flex items-center gap-8">
                <Link
                  to="/"
                  className="relative text-gray-800 font-semibold hover:text-pink-600 transition-colors duration-200 text-md py-2 group"
                >
                  Home
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-600 transition-all duration-200 group-hover:w-full" />
                </Link>
                <Link
                  to="/products"
                  className="relative text-gray-800 font-semibold hover:text-pink-600 transition-colors duration-200 text-md py-2 group"
                >
                  Products
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-600 transition-all duration-200 group-hover:w-full" />
                </Link>
                <Link
                  to="/about"
                  className="relative text-gray-800 font-semibold hover:text-pink-600 transition-colors duration-200 text-md py-2 group"
                >
                  About Us
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-600 transition-all duration-200 group-hover:w-full" />
                </Link>
                <Link
                  to="/contact"
                  className="relative text-gray-800 font-semibold hover:text-pink-600 transition-colors duration-200 text-md py-2 group"
                >
                  Contact
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-600 transition-all duration-200 group-hover:w-full" />
                </Link>
              </nav>

              {/* Cart and Wishlist Icons - Moved to be after navigation */}
              <div className="flex items-center gap-4 border-l border-pink-200 pl-4">
                <WishlistIcon />
                
                {/* Add to Cart Icon */}
                <Link to="/cart" className="relative group">
                  <button className="p-3 text-black cursor-pointer">
                    <div className="relative">
                      <ShoppingCart className="h-6 w-6" />
                    </div>
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg">
                        {cartCount}
                      </span>
                    )}
                  </button>
                  <span className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap border border-purple-600 bg-white px-3 py-2 text-sm text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-200 cursor-text shadow-lg"
                    style={{ zIndex: 100 }}>
                    My Cart
                  </span>
                </Link>
              </div>

              {/* User Authentication */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={toggleUserDropdown}
                    className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-pink-100 to-purple-100 hover:from-pink-200 hover:to-purple-200 rounded-full transition-all duration-300 shadow-md hover:shadow-lg border border-pink-300"
                  >
                    <div className="p-1 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full">
                      <User className="h-5 w-5 text-purple-700" />
                    </div>
                    <span className="font-semibold text-purple-800">{user.name}</span>
                    <ChevronDown className="h-4 w-4 text-purple-600" />
                  </button>
                  {showUserDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white border-2 border-pink-200 rounded-lg shadow-2xl z-50 overflow-hidden">
                      <div className="bg-gradient-to-r from-purple-700 to-purple-700 text-white px-4 py-3">
                        <div className="flex items-center gap-2">
                          <User className="h-5 w-5" />
                          <span className="font-semibold">{user.name}</span>
                        </div>
                        <div className="text-xs text-pink-100 mt-1">{user.email}</div>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-3 text-purple-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <UserCircle className="h-4 w-4" />
                        My Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="flex items-center gap-3 px-4 py-3 text-purple-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        My Orders
                      </Link>
                      <hr className="border-pink-200" />
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 px-4 py-3 text-rose-600 hover:bg-rose-50 w-full text-left transition-colors"
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
                    <button className="px-6 py-2 text-purple-800 font-semibold hover:text-pink-600 cursor-pointer rounded-full transition-all duration-300">
                      Sign In
                    </button>
                  </Link>
                  <Link to="/register">
                    <button className="px-6 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-full transition-all duration-300 shadow-lg hover:shadow-xl font-semibold cursor-pointer">
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