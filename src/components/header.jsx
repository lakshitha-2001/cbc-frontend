"use client"
import { useState, useEffect } from "react"
import { Search, Menu, ShoppingCart, UserCircle, LogOut, ChevronDown, User, Heart } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import { toast } from "react-toastify"
import { getCartItemCount } from "../utils/cartFunction "
import { getWishlistItemCount } from "../utils/wishlistFunctions"


export default function Header() {
  const [isSliderOpen, setIsSliderOpen] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [user, setUser] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate()
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    updateUserFromToken()
    updateCartCount()
    updateWishlistCount()
    const handleAuthChange = () => {
      updateUserFromToken()
    }
    const handleCartChange = () => {
      updateCartCount()
    }
    const handleWishlistChange = () => {
      updateWishlistCount()
    }
    window.addEventListener("authChange", handleAuthChange)
    window.addEventListener("storage", handleCartChange)
    window.addEventListener("cartUpdated", handleCartChange)
    window.addEventListener("wishlistUpdated", handleWishlistChange)
    return () => {
      window.removeEventListener("authChange", handleAuthChange)
      window.removeEventListener("storage", handleCartChange)
      window.removeEventListener("cartUpdated", handleCartChange)
      window.removeEventListener("wishlistUpdated", handleWishlistChange)
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

  const updateWishlistCount = () => {
    setWishlistCount(getWishlistItemCount())
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

  // WishlistIcon component moved here temporarily to fix the styling issue
  const WishlistIcon = () => {
    return (
      <Link to="/wishlist" className="relative group">
        <button className="p-3 text-black cursor-pointer">
          <div className="relative">
            <Heart className="h-6 w-6" />
          </div>
          {wishlistCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-600 to-red-800 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg">
              {wishlistCount}
            </span>
          )}
        </button>
        <span className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap border border-red-600 bg-white px-3 py-2 text-sm text-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-200 cursor-text shadow-lg"
          style={{ zIndex: 100 }}>
          My Wishlist
        </span>
      </Link>
    )
  }

  return (
    <>
      {/* Mobile Slider Menu */}
      {isSliderOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-60" onClick={toggleSlider}></div>
          <div className="fixed right-0 top-0 h-full w-80 bg-gradient-to-b from-red-900 to-black shadow-2xl">
            <div className="flex flex-col gap-6 p-6 mt-8">
              <button onClick={toggleSlider} className="self-end text-red-300 hover:text-white text-xl">
                ✕
              </button>
              <Link
                to="/"
                className="text-lg font-medium text-red-100 hover:text-gray-300 transition-colors border-b border-red-600 pb-3"
                onClick={toggleSlider}
              >
                Home
              </Link>
              <Link
                to="/products"
                className="text-lg font-medium text-red-100 hover:text-gray-300 transition-colors border-b border-red-600 pb-3"
                onClick={toggleSlider}
              >
                Products
              </Link>
              <Link
                to="/about"
                className="text-lg font-medium text-red-100 hover:text-gray-300 transition-colors border-b border-red-600 pb-3"
                onClick={toggleSlider}
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className="text-lg font-medium text-red-100 hover:text-gray-300 transition-colors border-b border-red-600 pb-3"
                onClick={toggleSlider}
              >
                Contact
              </Link>
              {user ? (
                <div className="flex flex-col gap-4 pt-4 border-t border-red-600">
                  <div className="text-sm text-red-200">Welcome back,</div>
                  <div className="font-semibold text-red-300 flex items-center gap-2">
                    <UserCircle className="h-5 w-5" />
                    {user.name}
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-4 py-2 border border-red-500 text-red-300 hover:bg-red-800 rounded-md transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 pt-4 border-t border-red-600">
                  <Link to="/login">
                    <button className="w-full px-4 py-2 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white rounded-md transition-all border border-red-500">
                      Sign In
                    </button>
                  </Link>
                  <Link to="/register">
                    <button className="w-full px-4 py-2 border border-red-500 text-red-300 hover:bg-red-800 rounded-md transition-colors">
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
      <div className="bg-red-800 text-white text-sm py-3 text-center font-medium shadow-lg">
        <div className="flex items-center justify-center gap-2">
          <span className="text-red-300"></span>
          <span>
            FREE SHIPPING ON ORDERS ABOVE $50 | Use Code: <span className="text-amber-400 font-bold">BEAUTY20</span> for
            20% OFF
          </span>
          <span className="text-red-300"></span>
        </div>
      </div>

      <header className="bg-white w-full relative shadow-md border-b border-red-600">
        {/* Top utility bar */}
        <div className="flex justify-end items-center px-4 md:px-8 py-3 border-b border-red-200 gap-4 md:gap-6">
          <div className="text-sm text-red-700 hidden sm:block">
            Customer Service: <span className="font-bold text-red-900">0772077020</span>
          </div>
          <form onSubmit={handleSearch} className="relative" role="search">
            <label htmlFor="search-input" className="sr-only">
              Search products
            </label>
            <input
              id="search-input"
              type="text"
              placeholder="Search luxury products..."
              className="border-2 border-red-300 rounded-full py-2 px-4 pl-10 text-sm w-40 md:w-52 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search products"
            />
            <button
              type="submit"
              className="absolute left-3 top-2.5 h-4 w-4 text-red-500 hover:text-red-700"
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
                className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-700 to-black bg-clip-text text-transparent tracking-tight"
                style={{ fontFamily: "'Dancing Script', 'Brush Script MT', cursive" }}
              >
                Crystal Beauty
              </h1>
              <p className="text-xs text-red-800 mt-1 hidden md:block font-medium tracking-wide">
                LUXURY COSMETICS & PREMIUM BEAUTY
              </p>
            </Link>
          </div>

          <div className="flex items-center gap-6">
            {/* Mobile Menu */}
            <button
              onClick={toggleSlider}
              className="lg:hidden p-3 bg-gradient-to-r from-red-600 to-red-800 text-white hover:from-red-700 hover:to-red-900 rounded-full transition-colors shadow-lg"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              <nav className="flex items-center gap-8">
                <Link
                  to="/"
                  className="relative text-black font-semibold hover:text-gray-600 transition-colors duration-200 text-md py-2 group"
                >
                  Home
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all duration-200 group-hover:w-full" />
                </Link>
                <Link
                  to="/products"
                  className="relative text-black font-semibold hover:text-gray-600 transition-colors duration-200 text-md py-2 group"
                >
                  Products
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all duration-200 group-hover:w-full" />
                </Link>
                <Link
                  to="/about"
                  className="relative text-black font-semibold hover:text-gray-600 transition-colors duration-200 text-md py-2 group"
                >
                  About Us
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all duration-200 group-hover:w-full" />
                </Link>
                <Link
                  to="/contact"
                  className="relative text-black font-semibold hover:text-gray-600 transition-colors duration-200 text-md py-2 group"
                >
                  Contact
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all duration-200 group-hover:w-full" />
                </Link>
              </nav>

              {/* Cart and Wishlist Icons - Moved to be after navigation */}
              <div className="flex items-center gap-4 border-l border-red-200 pl-4">
                <WishlistIcon />
                
                {/* Add to Cart Icon */}
                <Link to="/cart" className="relative group">
                  <button className="p-3 text-black cursor-pointer">
                    <div className="relative">
                      <ShoppingCart className="h-6 w-6" />
                    </div>
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-600 to-red-800 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg">
                        {cartCount}
                      </span>
                    )}
                  </button>
                  <span className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap border border-red-600 bg-white px-3 py-2 text-sm text-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-200 cursor-text shadow-lg"
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
                    className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-red-100 to-red-50 hover:from-red-200 hover:to-red-100 rounded-full transition-all duration-300 shadow-md hover:shadow-lg border border-red-300"
                  >
                    <div className="p-1 bg-gradient-to-r from-red-200 to-red-300 rounded-full">
                      <User className="h-5 w-5 text-red-700" />
                    </div>
                    <span className="font-semibold text-red-800">{user.name}</span>
                    <ChevronDown className="h-4 w-4 text-red-600" />
                  </button>
                  {showUserDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white border-2 border-red-300 rounded-lg shadow-2xl z-50 overflow-hidden">
                      <div className=" text-black px-4 py-3">
                        <div className="flex items-center gap-2">
                          <User className="h-5 w-5" />
                          <span className="font-semibold">{user.name}</span>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">{user.email}</div>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-3 text-red-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <UserCircle className="h-4 w-4" />
                        My Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="flex items-center gap-3 px-4 py-3 text-red-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        My Orders
                      </Link>
                      <hr className="border-red-200" />
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
                    <button className="px-6 py-2 text-red-800 font-semibold hover:text-red-600 cursor-pointer rounded-full transition-all duration-300">
                      Sign In
                    </button>
                  </Link>
                  <Link to="/register">
                    <button className="px-6 py-2 bg-red-700 hover:bg-red-600 text-white rounded-full transition-all duration-300 shadow-lg hover:shadow-xl font-semibold cursor-pointer">
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