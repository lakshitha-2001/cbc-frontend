"use client"

import axios from "axios"
import { useEffect, useState, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { Plus, Pencil, Trash2, Eye } from "lucide-react"

export default function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [productsLoaded, setProductsLoaded] = useState(false)
  const [viewModalVisible, setViewModalVisible] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const navigate = useNavigate()
  const modalRef = useRef(null)

  useEffect(() => {
    if (!productsLoaded) {
      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/api/products")
        .then((res) => {
          setProducts(res.data)
          setProductsLoaded(true)
        })
        .catch((err) => {
          console.error("Error loading products:", err)
          toast.error("Failed to load products")
        })
    }
  }, [productsLoaded])

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal()
      }
    }

    if (viewModalVisible) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [viewModalVisible])

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return

    const token = localStorage.getItem("token")
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      toast.success("Product deleted successfully")
      setProductsLoaded(false)
    } catch (err) {
      console.error("Delete error:", err)
      toast.error(err.response?.data?.message || "Failed to delete product")
    }
  }

  const handleViewProduct = (product) => {
    setSelectedProduct(product)
    setActiveImageIndex(0)
    setViewModalVisible(true)
  }

  const closeModal = () => {
    setViewModalVisible(false)
    setSelectedProduct(null)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 relative">
      <Link
        to="/admin/products/addProduct"
        className="fixed right-6 bottom-6 z-10 text-2xl border-2 bg-blue-50 border-blue-500 text-blue-500 p-4 rounded-xl hover:rounded-full hover:bg-blue-100 transition-all duration-300 shadow-lg hover:shadow-xl"
      >
        <Plus />
      </Link>

      <div className="max-w-full mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-8 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800">Admin Products</h1>
          <p className="text-gray-600 mt-2">Manage your product inventory</p>
        </div>

        {productsLoaded ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                    Images
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                    Last Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product, index) => (
                  <tr
                    key={product.productId}
                    className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-25"}`}
                  >
                    <td className="px-6 py-4">
                      <div className="w-48">
                        {product.images?.length > 0 ? (
                          <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                            {product.images.map((image, imgIndex) => (
                              <div key={imgIndex} className="relative flex-shrink-0">
                                <img
                                  src={image || "/placeholder.svg"}
                                  alt={`${product.name} ${imgIndex + 1}`}
                                  className="w-14 h-14 object-cover rounded border-2 border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer"
                                  onClick={() => window.open(image, "_blank")}
                                  onError={(e) => {
                                    e.target.src = "/placeholder.svg?height=56&width=56"
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="w-14 h-14 bg-gray-200 rounded border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs">
                            No Image
                          </div>
                        )}
                        {product.images?.length > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            {product.images.length} image{product.images.length !== 1 ? "s" : ""}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono align-top">
                      #{product.productId}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium align-top">
                      <div className="max-w-xs" title={product.name}>
                        {product.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold align-top">
                      ${product.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 align-top">
                      {product.labelledPrice ? (
                        <span className="line-through text-gray-400">${product.labelledPrice}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 align-top">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.stock > 50
                            ? "bg-green-100 text-green-800"
                            : product.stock > 10
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium align-top">
                      <div className="flex items-start space-x-2 pt-0">
                        <button
                          onClick={() => handleViewProduct(product)}
                          className="inline-flex items-center justify-center w-9 h-9 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors duration-200 border border-blue-200 hover:border-blue-300"
                          title="View Product"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => navigate("/admin/products/editProduct", { state: { product } })}
                          className="inline-flex items-center justify-center w-9 h-9 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors duration-200 border border-blue-200 hover:border-blue-300"
                          title="Edit Product"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.productId)}
                          className="inline-flex items-center justify-center w-9 h-9 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors duration-200 border border-red-200 hover:border-red-300"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 animate-spin rounded-full"></div>
              <p className="text-gray-500 text-sm">Loading products...</p>
            </div>
          </div>
        )}

        {productsLoaded && products.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">Get started by adding your first product.</p>
            <Link
              to="/admin/products/addProduct"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Link>
          </div>
        )}
      </div>

      {/* Product View Modal */}
      {viewModalVisible && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div ref={modalRef} className="bg-white w-full max-w-5xl rounded-xl shadow-2xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{selectedProduct.name}</h2>
                  <p className="text-gray-600 mt-1">Product #{selectedProduct.productId}</p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-200 rounded-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Product Images */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Images</h3>
                  {selectedProduct.images && selectedProduct.images.length > 0 ? (
                    <div className="space-y-4">
                      {/* Main Image */}
                      <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                        <img
                          src={selectedProduct.images[activeImageIndex] || "/placeholder.svg"}
                          alt={selectedProduct.name}
                          className="w-full h-80 object-contain p-2"
                          onError={(e) => {
                            e.target.src = "/placeholder.svg?height=320&width=320"
                          }}
                        />
                      </div>

                      {/* Thumbnails */}
                      {selectedProduct.images.length > 1 && (
                        <div className="flex flex-wrap gap-2">
                          {selectedProduct.images.map((image, imgIndex) => (
                            <div
                              key={imgIndex}
                              className={`cursor-pointer border-2 rounded-md overflow-hidden ${
                                activeImageIndex === imgIndex ? "border-blue-500" : "border-gray-200"
                              }`}
                              onClick={() => setActiveImageIndex(imgIndex)}
                            >
                              <img
                                src={image || "/placeholder.svg"}
                                alt={`${selectedProduct.name} thumbnail ${imgIndex + 1}`}
                                className="w-16 h-16 object-cover"
                                onError={(e) => {
                                  e.target.src = "/placeholder.svg?height=64&width=64"
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <p className="mt-2">No images available</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Details</h3>
                  <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                    <div>
                      <span className="text-sm text-gray-500">Product Name</span>
                      <p className="text-gray-900 font-medium">{selectedProduct.name}</p>
                    </div>

                    {selectedProduct.description && (
                      <div>
                        <span className="text-sm text-gray-500">Description</span>
                        <p className="text-gray-900">{selectedProduct.description}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-500">Price</span>
                        <p className="text-gray-900 font-semibold">${selectedProduct.price}</p>
                      </div>

                      <div>
                        <span className="text-sm text-gray-500">Original Price</span>
                        <p className="text-gray-900">
                          {selectedProduct.labelledPrice ? (
                            <span className="line-through text-gray-500">${selectedProduct.labelledPrice}</span>
                          ) : (
                            "-"
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-500">Stock</span>
                        <p className="mt-1">
                          <span
                            className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                              selectedProduct.stock > 50
                                ? "bg-green-100 text-green-800"
                                : selectedProduct.stock > 10
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {selectedProduct.stock} in stock
                          </span>
                        </p>
                      </div>

                      <div>
                        <span className="text-sm text-gray-500">SKU</span>
                        <p className="text-gray-900 font-mono">{selectedProduct.sku || "-"}</p>
                      </div>
                    </div>

                    {selectedProduct.categories && selectedProduct.categories.length > 0 && (
                      <div>
                        <span className="text-sm text-gray-500">Categories</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {selectedProduct.categories.map((category, index) => (
                            <span
                              key={index}
                              className="inline-flex px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
                            >
                              {category}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Additional product details */}
                    {selectedProduct.brand && (
                      <div>
                        <span className="text-sm text-gray-500">Brand</span>
                        <p className="text-gray-900">{selectedProduct.brand}</p>
                      </div>
                    )}

                    {selectedProduct.weight && (
                      <div>
                        <span className="text-sm text-gray-500">Weight</span>
                        <p className="text-gray-900">{selectedProduct.weight}</p>
                      </div>
                    )}

                    {selectedProduct.dimensions && (
                      <div>
                        <span className="text-sm text-gray-500">Dimensions</span>
                        <p className="text-gray-900">{selectedProduct.dimensions}</p>
                      </div>
                    )}

                    {/* Display any other product attributes */}
                    {selectedProduct.attributes &&
                      Object.entries(selectedProduct.attributes).map(([key, value]) => (
                        <div key={key}>
                          <span className="text-sm text-gray-500">{key}</span>
                          <p className="text-gray-900">{value}</p>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex justify-end space-x-3">
                  <button
                    className="inline-flex items-center px-4 py-2 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                    onClick={() => navigate("/admin/products/editProduct", { state: { product: selectedProduct } })}
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit Product
                  </button>
                  <button
                    className="inline-flex items-center px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
