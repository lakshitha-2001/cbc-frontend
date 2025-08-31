"use client"
import axios from "axios"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Loading from "../components/loading"
import { ChevronLeft, ChevronRight, X, Minus, Plus, Star } from "lucide-react"
import { toast } from "react-toastify"
import { addToCart } from "../utils/cartFunction "
import { addToWishlist, removeFromWishlist, isInWishlist } from "../utils/wishlistFunctions"
import WishlistButton from "../components/wishlist/WishlistButton"


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
  const [zoomLevel, setZoomLevel] = useState(1)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })

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
    localStorage.setItem("buyNowProduct", JSON.stringify({
      productId,
      quantity,
      name: product?.name,
      images: product?.images,
      price: product?.price,
      labelledPrice: product?.labelledPrice
    }))
    
    handleAddToCart()
    navigate("/checkout")
  }

  const navigateImage = (direction) => {
    if (!product?.images?.length) return

    if (direction === "next") {
      setSelectedImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))
    } else {
      setSelectedImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))
    }
    setZoomLevel(1)
  }

  const handleImageClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPosition({ x, y })
    setZoomLevel(zoomLevel === 1 ? 2 : 1)
  }

  const handleMouseMove = (e) => {
    if (zoomLevel === 1) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPosition({ x, y })
  }

  if (status === "loading") return <Loading />
  if (status === "error") return <div className="text-center py-10 text-red-500">Error loading product</div>
  
  // Calculate discount percentage if labelled price exists and is greater than price
  const discountPercentage = product?.labelledPrice && product.labelledPrice > product.price
    ? Math.round(((product.labelledPrice - product.price) / product.labelledPrice) * 100)
    : 0

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Image Popup Modal */}
      {showImagePopup && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6">
          <div className="relative max-w-5xl w-full bg-white shadow-2xl overflow-hidden">
            {/* Close button */}
            <button
              onClick={() => {
                setShowImagePopup(false)
                setZoomLevel(1)
              }}
              className="absolute top-4 right-4 bg-white hover:bg-gray-100 text-gray-800 p-2 shadow-md z-10 transition-all cursor-pointer"
              aria-label="Close popup"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Navigation buttons */}
            {product?.images?.length > 1 && (
              <>
                <button
                  onClick={() => navigateImage("prev")}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 text-gray-800 p-2 shadow-md transition-all cursor-pointer z-20"
                  aria-label="Previous image"
                  type="button"
                >
                  <ChevronLeft className="h-5 w-5 pointer-events-none" />
                </button>

                <button
                  onClick={() => navigateImage("next")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 text-gray-800 p-2 shadow-md transition-all cursor-pointer z-20"
                  aria-label="Next image"
                  type="button"
                >
                  <ChevronRight className="h-5 w-5 pointer-events-none" />
                </button>
              </>
            )}

            {/* Main popup image with zoom */}
            <div 
              className="p-6 h-[80vh] flex items-center justify-center"
              onClick={handleImageClick}
              onMouseMove={handleMouseMove}
            >
              <div className="relative w-full h-full overflow-hidden">
                <img
                  src={product?.images[selectedImageIndex] || "/placeholder.svg"}
                  alt={`Product view ${selectedImageIndex + 1}`}
                  className={`absolute max-w-none transition-transform duration-300 ${
                    zoomLevel === 1 ? 'w-full h-full object-contain cursor-zoom-in' : 'origin-top-left cursor-zoom-out'
                  }`}
                  style={{
                    transform: zoomLevel === 1 
                      ? 'none' 
                      : `scale(${zoomLevel}) translate(${-zoomPosition.x}%, ${-zoomPosition.y}%)`
                  }}
                />
              </div>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Images Section */}
        <div>
          {/* Main Image */}
          <div className="w-full aspect-square overflow-hidden relative">
            <img
              src={product?.images[selectedImageIndex] || "/placeholder.svg"}
              alt={`Product view ${selectedImageIndex + 1}`}
              className="w-full h-full object-contain cursor-zoom-in transition-opacity"
              onClick={() => setShowImagePopup(true)}
            />
          </div>

          {/* Thumbnail Gallery */}
          {product?.images?.length > 1 && (
            <div className="grid grid-cols-5 gap-3 mt-4">
              {product.images.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square overflow-hidden cursor-pointer transition-all duration-200 border ${
                    selectedImageIndex === index ? "border-black-600" : "border-gray-200 hover:border-gray-600"
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
          </div>

          {/* Price Section */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 font-medium">Price:</span>
              <div className="flex items-center gap-3 mt-1">
                {/* Old price in gray & cut */}
                {product?.price && (
                  <p className="text-lg text-gray-500 line-through">
                  Rs. {product.price.toFixed(2)}
                  </p>
                )}
                {/* New price in red */}
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


          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-current" />
              ))}
            </div>
            <span className="text-gray-600 font-medium">(42 reviews)</span>
          </div>

          {/* Stock Alert */}
          {product?.stock && product.stock <= 10 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
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
          )}

          {/* Description */}
          <p className="text-gray-700 leading-relaxed">{product?.description}</p>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-gray-300 overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-4 py-3 text-lg hover:bg-gray-100 text-black transition-colors cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="px-6 py-3 border-x border-gray-300 min-w-[60px] text-center font-semibold">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-4 py-3 text-lg hover:bg-gray-100 text-black transition-colors cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <span className="text-sm text-gray-500 font-medium">{product?.stock || 0} available</span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-black hover:bg-gray-800 text-white py-4 px-6 font-semibold transition-colors shadow-md hover:shadow-lg cursor-pointer"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-4 px-6 font-semibold transition-colors shadow-md hover:shadow-lg cursor-pointer"
            >
              Buy Now
            </button>
            <WishlistButton 
              product={product} 
              size="large" 
            />
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