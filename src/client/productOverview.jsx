"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Loading from "../components/loading"
import { ChevronLeft, ChevronRight, Heart, X, Minus, Plus, Star } from "lucide-react"

import { toast } from "react-toastify"
import { addToCart } from "../utils/cartFunction "

function ProductOverview() {
  const params = useParams()
  const navigate = useNavigate()
  const productId = params.id
  const [status, setStatus] = useState("loading")
  const [product, setProduct] = useState(null)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [showImagePopup, setShowImagePopup] = useState(false)

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}`)
      .then((response) => {
        setProduct(response.data)
        setStatus("success")
      })
      .catch((error) => {
        console.error("Error fetching product data:", error)
        setError(error)
        setStatus("error")
        toast.error("Error fetching product details")
      })
  }, [productId])

  const handleAddToCart = () => {
    const updatedCart = addToCart(
      productId,
      quantity,
      {
        name: product?.name,
        images: product?.images,
        price: product?.price,
        labelledPrice: product?.labelledPrice
      }
    )
    toast.success("Added to cart!")
  }

  const handleBuyNow = () => {
    // Store the product temporarily for checkout page to detect
    localStorage.setItem("buyNowProduct", JSON.stringify({
      productId,
      quantity,
      name: product?.name,
      images: product?.images,
      price: product?.price,
      labelledPrice: product?.labelledPrice
    }))
    
    // Add to cart and navigate
    handleAddToCart()
    navigate("/checkout")
  }

  const handleAddToWishlist = () => {
    toast.success("Added to wishlist!")
  }

  const navigateImage = (direction) => {
    if (!product?.images?.length) return

    if (direction === "next") {
      setSelectedImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))
    } else {
      setSelectedImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))
    }
  }

  if (status === "loading") return <Loading />
  if (status === "error") return <div className="text-center py-10 text-red-500">Error loading product</div>
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Beautiful Image Popup Modal */}
      {showImagePopup && (
        <div className="fixed inset-0 bg-transparent/0 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="relative max-w-3xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Close button */}
            <button
              onClick={() => setShowImagePopup(false)}
              className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-700 hover:text-black p-2 rounded-full shadow-md z-10 transition-all"
              aria-label="Close popup"
            >
              <X className="h-5 w-5 cursor-pointer" />
            </button>

            {/* Navigation buttons */}
            {product?.images?.length > 1 && (
              <>
                <button
                  onClick={() => navigateImage("prev")}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 hover:text-black p-2 rounded-full shadow-md transition-all"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-5 w-5 cursor-pointer" />
                </button>
                <button
                  onClick={() => navigateImage("next")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 hover:text-black p-2 rounded-full shadow-md transition-all"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-5 w-5 cursor-pointer" />
                </button>
              </>
            )}

            {/* Main popup image */}
            <div className="p-6">
              <img
                src={product?.images[selectedImageIndex] || "/placeholder.svg"}
                alt={`Product view ${selectedImageIndex + 1}`}
                className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
              />
            </div>

            {/* Image counter and info */}
            <div className="px-6 pb-4 flex justify-between items-center text-sm text-gray-600">
              <span>
                {selectedImageIndex + 1} of {product?.images?.length}
              </span>
              <span className="text-gray-800 font-medium">{product?.name}</span>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images Section */}
        <div>
          {/* Main Image without gray background */}
          <div
            className="w-full aspect-square rounded-lg overflow-hidden cursor-zoom-in flex items-center justify-center relative group border border-gray-100"
            onClick={() => setShowImagePopup(true)}
          >
            <img
              src={product?.images[selectedImageIndex] || "/placeholder.svg"}
              alt={`Product view ${selectedImageIndex + 1}`}
              className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity"></div>
            <span className="absolute bottom-3 right-3 bg-white/90 text-black text-xs px-3 py-1 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
              Click to enlarge
            </span>
          </div>

          {/* Thumbnail Gallery - Beautifully aligned */}
          {product?.images?.length > 1 && (
            <div className="grid grid-cols-5 gap-2 mt-4">
              {product.images.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square rounded-md overflow-hidden cursor-pointer transition-all duration-200 border-2 ${
                    selectedImageIndex === index ? "border-red-600 shadow-md" : "border-gray-100 hover:border-gray-300"
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info Section */}
        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-4">
            <h2 className="text-xl font-light tracking-wider text-gray-500 uppercase">{product?.brand || "ENCHANT"}</h2>
            <h1 className="text-3xl font-bold text-gray-900 mt-1">{product?.name || "EYE-SHADOW PALETTE"}</h1>
            <p className="text-gray-500 mt-1">{product?.productId || "HOLIDAY COLLECTION"}</p>
            {/* <p className="text-gray-500 mt-1">{product?.collection || "HOLIDAY COLLECTION"}</p> */}
          </div>

          {/* Price Section with labeled price */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 font-medium">Price:</span>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-3xl font-bold text-red-600">${product?.price?.toFixed(2) || "0.00"}</p>
                {product?.labelledPrice && product.labelledPrice > product.price && (
                  <p className="text-lg text-gray-500 line-through">${product.labelledPrice.toFixed(2)}</p>
                )}
              </div>
            </div>

            {product?.discountPercentage && (
              <span className="bg-red-100 text-red-800 text-sm font-semibold px-3 py-1 rounded-full">
                {product.discountPercentage}% OFF
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-current" />
              ))}
            </div>
            <span className="text-gray-600 font-medium">(42 reviews)</span>
          </div>

          {/* Description */}
          <p className="text-gray-700 leading-relaxed">{product?.description}</p>

          {/* Quantity Selector - Styled with red/black/white */}
          <div className="flex items-center gap-4">
            <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-4 py-3 text-lg hover:bg-gray-50 text-black transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="px-6 py-3 border-x-2 border-gray-200 min-w-[60px] text-center font-semibold">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-4 py-3 text-lg hover:bg-gray-50 text-black transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <span className="text-sm text-gray-500 font-medium">{product?.stock || 0} available</span>
          </div>

          {/* Action Buttons - Using red, black, white colors */}
          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-black hover:bg-gray-800 text-white py-4 px-6 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-4 px-6 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
            >
              Buy Now
            </button>
            <button
              onClick={handleAddToWishlist}
              className="p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm hover:shadow-md"
              title="Add to wishlist"
              aria-label="Add to wishlist"
            >
              <Heart className="h-6 w-6 text-red-500" />
            </button>
          </div>

          {/* Product Details */}
          <div className="pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 text-lg mb-3">Product Details</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex justify-between">
                <span className="font-medium">Category:</span>
                <span>{product?.category || "N/A"}</span>
              </li>
              <li className="flex justify-between">
                <span className="font-medium">Weight:</span>
                <span>{product?.weight || "N/A"}</span>
              </li>
              <li className="flex justify-between">
                <span className="font-medium">SKU:</span>
                <span>{product?.sku || "N/A"}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductOverview
