"use client"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FiHeart, FiEye, FiShoppingCart, FiX } from "react-icons/fi"
import { FaHeart } from "react-icons/fa"
import { addToWishlist, removeFromWishlist, isInWishlist } from "../utils/wishlistFunctions"
import { toast } from "react-toastify"

// Helper function to get product ID (supports multiple ID field names)
const getProductId = (product) => {
  return product.productId || product._id || product.id;
};

export default function ProductCard({ product, showDescription = true, isNewArrival = false }) {
  const [isHovered, setIsHovered] = useState(false)
  const productId = getProductId(product);
  const [isWishlisted, setIsWishlisted] = useState(isInWishlist(productId))
  const [showQuickView, setShowQuickView] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const navigate = useNavigate()

  const displayImage = product.images?.[currentImageIndex] || "https://via.placeholder.com/500x600?text=No+Image"

  // Calculate discount percentage if labelled price exists and is greater than price
  const hasDiscount = product.price < product.labelledPrice
  const discountPercentage = hasDiscount
  ? Math.round(((product.labelledPrice - product.price) / product.labelledPrice) * 100)
  : 0

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    console.log("Added to cart:", product.name)
    navigate(`/overview/${productId}`)
  }

  const handleAddToWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isWishlisted) {
      removeFromWishlist(productId)
      toast.success("Removed from wishlist!")
    } else {
      addToWishlist(product)
      toast.success("Added to wishlist!")
    }
    
    setIsWishlisted(!isWishlisted)
  }

  const handleQuickView = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setShowQuickView(true)
    setCurrentImageIndex(0)
  }

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index)
  }

  return (
    <div
      className={`w-full bg-white shadow-lg overflow-hidden transition-all duration-300 ${isHovered ? "shadow-xl" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/overview/${productId}`}>
        <div className="relative h-[400px] overflow-hidden cursor-pointer">
          <img
            src={displayImage}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/500x600?text=No+Image"
            }}
          />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col space-y-2">
            {isNewArrival && (
              <span className="bg-blue-500 text-white text-sm font-bold px-3 py-1 rounded-md">NEW</span>
            )}
            {hasDiscount && (
              <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                {discountPercentage}% OFF
              </span>
            )}
          </div>

          {/* Stock Alert Badge */}
          {product.stock && product.stock <= 10 && (
            <div className="absolute top-4 right-4 bg-yellow-500 text-white text-sm font-bold px-3 py-1 rounded-full">
              {product.stock <= 5 ? 'Hurry!' : 'Low Stock'}
            </div>
          )}

          {/* Quick Actions */}
          <div
            className={`absolute top-4 right-4 flex flex-col space-y-3 transition-all duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <button
              onClick={handleAddToWishlist}
              className="p-3 bg-white rounded-full shadow-lg hover:bg-pink-50 hover:text-pink-500 transition-colors"
            >
              {isWishlisted ? <FaHeart className="text-pink-500 text-lg cursor-pointer" /> : <FiHeart className="text-lg cursor-pointer" />}
            </button>
            <button
              onClick={handleQuickView}
              className="p-3 bg-white rounded-full shadow-lg hover:bg-blue-50 hover:text-blue-500 transition-colors"
            >
              <FiEye className="text-lg cursor-pointer" />
            </button>
          </div>
        </div>
      </Link>

      {/* Product Details */}
      <div className="p-6">
        <Link to={`/overview/${productId}`} className="block mb-3">
          <h3 className="text-xl font-bold text-gray-800 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {/* Price Section */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 font-medium">Price:</span>
              <div className="flex items-center gap-3 mt-1">
                {/* Show old price only if it's different */}
                {product?.price &&
                  product.price !== product.labelledPrice && (
                    <p className="text-lg text-gray-500 line-through">
                    Rs. {product.price.toFixed(2)}
                  </p>
                  
                  )}
                {/* New price */}
                <p className="text-3xl font-bold text-red-600">
                  Rs. {product?.labelledPrice?.toFixed(2) || "0.00"}
                </p>
              </div>
            </div>

            {discountPercentage > 0 && (
              <span className="bg-red-100 text-red-800 text-sm font-semibold px-3 py-1">
                {discountPercentage}% OFF
              </span>
            )}
          </div>

        {/* Stock Status */}
        <div className="mb-4">
          {product.stock && product.stock <= 10 ? (
            <div className="flex items-center">
              <span className="text-md font-medium text-red-600">
                {product.stock <= 5 
                  ? `Hurry! Only ${product.stock} left!` 
                  : `Only ${product.stock} left!`}
              </span>
            </div>
          ) : (
            <span className={`text-md font-medium ${product.isAvailable ? "text-blue-700" : "text-red-600"}`}>
              {product.isAvailable ? "In Stock" : "Out of Stock"}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className={`w-full py-4 flex items-center justify-center text-lg font-semibold transition-colors ${
            product.isAvailable
              ? "bg-gray-900 text-white hover:bg-gray-700 cursor-pointer"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          disabled={!product.isAvailable}
        >
          <FiShoppingCart className="mr-2" /> Add to Cart
        </button>
      </div>

      {/* Enhanced Quick View Modal */}
      {showQuickView && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-3xl font-bold text-gray-800">{product.name}</h3>
              <button 
                onClick={() => setShowQuickView(false)} 
                className="text-gray-500 hover:text-gray-700 p-2 transition-colors cursor-pointer"
              >
                <FiX size={28} />
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Image Gallery */}
              <div>
                <div className="h-96 overflow-hidden mb-4">
                  <img
                    src={product.images?.[currentImageIndex] || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                {product.images && product.images.length > 1 && (
                  <div className="flex space-x-2 overflow-x-auto">
                    {product.images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => handleThumbnailClick(index)}
                        className={`w-20 h-20 object-cover border-2 transition-colors ${
                          currentImageIndex === index 
                            ? "border-accent-800" 
                            : "border-gray-200 hover:border-purple-400 cursor-pointer"
                        }`}
                      >
                        <img
                          src={img || "/placeholder.svg"}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center space-x-4 mb-4">
                    {hasDiscount ? (
                      <>
                        <span className="text-2xl font-bold text-red-600">Rs. {product.price.toFixed(2)}</span>
                        <span className="text-lg text-gray-500 line-through">
                          Rs. {product.labelledPrice.toFixed(2)}
                        </span>
                        <span className="bg-red-100 text-red-800 text-sm font-semibold px-3 py-1 rounded-full">
                          {discountPercentage}% OFF
                        </span>
                      </>
                    ) : (
                      <span className="text-2xl font-bold text-purple-800">Rs. {product.labelledPrice.toFixed(2)}</span>
                    )}
                  </div>
                  
                  {/* Stock Alert */}
                  {product.stock && product.stock <= 10 ? (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-yellow-700">
                            {product.stock <= 5 
                              ? `Hurry! Only ${product.stock} left in stock!` 
                              : `Only ${product.stock} left in stock!`}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <span className={`inline-block px-3 py-1 rounded-md text-sm font-medium ${
                      product.isAvailable ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-800"
                    }`}>
                      {product.isAvailable ? "✓ In Stock" : "✗ Out of Stock"}
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Description</h4>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description || "No description available for this product."}
                  </p>
                </div>

                {product.details && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Details</h4>
                    <ul className="text-gray-600 list-disc pl-5 space-y-1">
                      {Object.entries(product.details).map(([key, value]) => (
                        <li key={key}>
                          <span className="font-medium">{key}:</span> {value}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 py-4 cursor-pointer font-semibold text-lg transition-colors ${
                      product.isAvailable
                        ? "bg-gray-900 text-white hover:bg-gray-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    disabled={!product.isAvailable}
                  >
                    <FiShoppingCart className="inline mr-2" />
                    Add to Cart
                  </button>
                  <Link
                    to={`/overview/${productId}`}
                    className="flex-1 py-4 text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg transition-colors"
                    onClick={() => setShowQuickView(false)}
                  >
                    View Full Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}  
    </div>
  )
}