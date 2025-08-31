"use client"

import { Route, Routes, Link } from "react-router-dom"
import LoginPage from "./login"
import ProductPage from "../client/productPage"
import ProductOverview from "../client/productOverview"
import Cart from "../client/cart"
import Checkout from "../client/checkout"
import ForgetPasswordPage from "./forgetPassword"
import SearchProductPage from "../client/searchProducts"
import HomeSlider from "../components/sliders/HomeSlider"
import { useEffect, useState } from "react"
import axios from "axios"
import ProductCard from "../components/productCard"
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"

export default function HomePage() {
  const [newArrivals, setNewArrivals] = useState([])
  const [bestSellers, setBestSellers] = useState([])
  const [trendingProducts, setTrendingProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentSlide, setCurrentSlide] = useState({
    newArrivals: 0,
    bestSellers: 0,
    trending: 0
  })

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [newArrivalsRes, bestSellersRes, trendingRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products?sort=-createdAt&limit=12`),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/best-sellers`),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products?sort=-views&limit=12`)
        ]);

        setNewArrivals(newArrivalsRes.data);
        setBestSellers(bestSellersRes.data);
        setTrendingProducts(trendingRes.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch products");
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const nextSlide = (type) => {
    setCurrentSlide((prev) => ({
      ...prev,
      [type]: (prev[type] + 1) % Math.ceil((type === "newArrivals" ? newArrivals : 
              type === "bestSellers" ? bestSellers : trendingProducts).length / 4),
    }))
  }

  const prevSlide = (type) => {
    setCurrentSlide((prev) => ({
      ...prev,
      [type]:
        (prev[type] - 1 + Math.ceil((type === "newArrivals" ? newArrivals : 
         type === "bestSellers" ? bestSellers : trendingProducts).length / 4)) %
        Math.ceil((type === "newArrivals" ? newArrivals : 
         type === "bestSellers" ? bestSellers : trendingProducts).length / 4),
    }))
  }

  const visibleProducts = (products, type) => {
    const start = currentSlide[type] * 4
    return products.slice(start, start + 4)
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50">
      <Routes>
        {/* Home route with slider */}
        <Route
          path="/"
          element={
            <>
              <div className="w-full">
                <HomeSlider />
              </div>
              <div className="flex-1 w-full p-4 md:p-8">
                {/* New Arrivals Section */}
                <section className="max-w-[1650px] mx-auto my-12 relative">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-pink-500">
                      <span className="border-b-4 border-pink-400 pb-2">New Arrivals</span>
                    </h2>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => prevSlide("newArrivals")}
                        disabled={currentSlide.newArrivals === 0}
                        className="p-2 rounded-full bg-pink-100 text-pink-600 hover:bg-pink-200 disabled:opacity-50"
                      >
                        <FiChevronLeft size={20} />
                      </button>
                      <button
                        onClick={() => nextSlide("newArrivals")}
                        disabled={currentSlide.newArrivals === Math.ceil(newArrivals.length / 4) - 1}
                        className="p-2 rounded-full bg-pink-100 text-pink-600 hover:bg-pink-200 disabled:opacity-50"
                      >
                        <FiChevronRight size={20} />
                      </button>
                    </div>
                  </div>

                  {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-[600px] bg-gray-200 animate-pulse rounded-xl"></div>
                      ))}
                    </div>
                  ) : error ? (
                    <div className="text-center text-red-500 py-12">{error}</div>
                  ) : (
                    <div className="relative overflow-hidden">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {visibleProducts(newArrivals, "newArrivals").map((product) => (
                          <ProductCard key={product._id} product={product} showDescription={false} isNewArrival={true} />
                        ))}
                      </div>
                    </div>
                  )}
                </section>

                {/* Beauty of Joseon Promo Section */}
                <section className="max-w-[1650px] mx-auto my-16 bg-gradient-to-r from-amber-50 to-rose-50 rounded-xl overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                      <h3 className="text-2xl font-light text-gray-700 mb-2">Beauty of Joseon</h3>
                      <h2 className="text-4xl font-bold text-gray-800 mb-4">ROOTED IN TRADITION, CRAFTED FOR TODAY</h2>
                      <p className="text-lg text-gray-600 mb-6">
                        Inspired by the Hanbang rituals, Beauty of Joseon formulas blend time-honored herbal ingredients with modern skincare science. Each product is thoughtfully made to nourish, soothe, and bring out your skin's natural glow—gently and effectively.
                      </p>
                      <Link 
                        to="/products?brand=Beauty%20of%20Joseon" 
                        className="self-start bg-gray-800 text-white px-6 py-3 hover:bg-gray-700 transition-colors"
                      >
                        Shop Now
                      </Link>
                    </div>
                    <div className="md:w-1/2 h-64 md:h-auto">
                      <img 
                        src="https://images.pexels.com/photos/6690884/pexels-photo-6690884.jpeg" // Replace with your actual image URL
                        alt="Beauty of Joseon Products"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </section>

                {/* Trending Products Section */}
                <section className="max-w-[1650px] mx-auto my-20 relative">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-purple-600">
                      <span className="border-b-4 border-purple-400 pb-2">New & Trending</span>
                    </h2>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => prevSlide("trending")}
                        disabled={currentSlide.trending === 0}
                        className="p-2 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 disabled:opacity-50"
                      >
                        <FiChevronLeft size={20} />
                      </button>
                      <button
                        onClick={() => nextSlide("trending")}
                        disabled={currentSlide.trending === Math.ceil(trendingProducts.length / 4) - 1}
                        className="p-2 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 disabled:opacity-50"
                      >
                        <FiChevronRight size={20} />
                      </button>
                    </div>
                  </div>

                  {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-[600px] bg-gray-200 animate-pulse rounded-xl"></div>
                      ))}
                    </div>
                  ) : error ? (
                    <div className="text-center text-red-500 py-12">{error}</div>
                  ) : (
                    <div className="relative overflow-hidden">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {visibleProducts(trendingProducts, "trending").map((product) => (
                          <ProductCard key={product._id} product={product} showDescription={false} />
                        ))}
                      </div>
                    </div>
                  )}
                </section>

                {/* Another Promo Section */}
                <section className="max-w-[1650px] mx-auto my-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl overflow-hidden">
                  <div className="flex flex-col md:flex-row-reverse">
                    <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                      <h3 className="text-2xl font-light text-gray-700 mb-2">Premium Skincare</h3>
                      <h2 className="text-4xl font-bold text-gray-800 mb-4">ELEVATE YOUR SKINCARE ROUTINE</h2>
                      <p className="text-lg text-gray-600 mb-6">
                        Discover our curated collection of premium skincare products that combine luxury with efficacy. Transform your daily routine into a spa-like experience with formulations designed for visible results.
                      </p>
                      <Link 
                        to="/products?category=premium" 
                        className="self-start bg-purple-800 text-white px-6 py-3 hover:bg-purple-600 transition-colors"
                      >
                        Explore Luxury
                      </Link>
                    </div>
                    <div className="md:w-1/2 h-64 md:h-auto">
                      <img 
                        src="https://images.pexels.com/photos/5205693/pexels-photo-5205693.jpeg"
                        alt="Premium Skincare Products"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </section>

                {/* Best Sellers Section */}
                <section className="max-w-[1650px] mx-auto my-20 relative">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-blue-600">
                      <span className="border-b-4 border-blue-400 pb-2">Best Sellers</span>
                    </h2>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => prevSlide("bestSellers")}
                        disabled={currentSlide.bestSellers === 0}
                        className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 disabled:opacity-50"
                      >
                        <FiChevronLeft size={20} />
                      </button>
                      <button
                        onClick={() => nextSlide("bestSellers")}
                        disabled={currentSlide.bestSellers === Math.ceil(bestSellers.length / 4) - 1}
                        className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 disabled:opacity-50"
                      >
                        <FiChevronRight size={20} />
                      </button>
                    </div>
                  </div>

                  {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-[600px] bg-gray-200 animate-pulse rounded-xl"></div>
                      ))}
                    </div>
                  ) : error ? (
                    <div className="text-center text-red-500 py-12">{error}</div>
                  ) : (
                    <div className="relative overflow-hidden">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {visibleProducts(bestSellers, "bestSellers").map((product) => (
                          <ProductCard key={product._id} product={product} showDescription={false} />
                        ))}
                      </div>
                    </div>
                  )}
                </section>

                {/* Call-to-action */}
                {/* <div className="text-center my-16 bg-gradient-to-r from-pink-50 to-blue-50 py-12 rounded-xl">
                  <h2 className="text-4xl font-bold mb-6 text-gray-800">Discover More</h2>
                  <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                    Explore our wide range of products and find exactly what you're looking for.
                  </p>
                  <Link
                    to="/products"
                    className="inline-block bg-gradient-to-r from-pink-500 to-blue-500 text-white px-8 py-3 rounded-lg hover:from-pink-600 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl"
                  >
                    View All Products
                  </Link>
                </div> */}
              </div>
            </>
          }
        />

        {/* Other routes */}
        <Route path="/products/*" element={<ProductPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forget-password" element={<ForgetPasswordPage />} />
        <Route path="/about" element={
          <div className="flex-1 w-full p-4 md:p-8">
            <h1 className="text-3xl font-bold text-center my-8">About Us</h1>
          </div>
        } />
        <Route path="/cart" element={<Cart />} />
        <Route path="/overview/:id" element={<ProductOverview />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/search/:query" element={<SearchProductPage />} />
      </Routes>
    </div>
  )
}