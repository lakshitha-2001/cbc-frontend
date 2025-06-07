import axios from "axios";
import { useState, useEffect } from "react";

import { useLocation, useNavigate } from "react-router-dom";
import uploadMediaToSupabase from "../../utils/mediaUpload ";
import { toast } from "react-toastify";


export default function EditProductForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;

  const [productId, setProductId] = useState("");
  const [name, setName] = useState("");
  const [alternativeNames, setAlternativeNames] = useState("");
  const [existingImages, setExistingImages] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [price, setPrice] = useState("");
  const [labelledPrice, setLabelledPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!product) {
      toast.error("No product data found");
      navigate("/admin/products");
      return;
    }

    setProductId(product.productId);
    setName(product.name);
    setAlternativeNames(product.altName?.join(", ") || "");
    setExistingImages(product.images || []);
    setPrice(product.price);
    setLabelledPrice(product.labelledPrice || "");
    setStock(product.stock);
    setDescription(product.description);
  }, [product, navigate]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file types
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      toast.error("Only JPG, PNG, and WebP images are allowed");
      return;
    }
    
    setNewImageFiles(files);
    
    // Create preview URLs
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const removeExistingImage = (index) => {
    const newImages = [...existingImages];
    newImages.splice(index, 1);
    setExistingImages(newImages);
  };

  const removeNewImage = (index) => {
    const newFiles = [...newImageFiles];
    newFiles.splice(index, 1);
    setNewImageFiles(newFiles);
    
    const newUrls = [...previewUrls];
    URL.revokeObjectURL(newUrls[index]);
    newUrls.splice(index, 1);
    setPreviewUrls(newUrls);
  };

  async function handleSubmit() {
    if (!name || !price || !stock || !description) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (existingImages.length === 0 && newImageFiles.length === 0) {
      toast.error("Please keep at least one image");
      return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem("token");
    
    if (!token) {
      toast.error("Please log in to edit products");
      navigate("/login");
      return;
    }

    try {
      const altName = alternativeNames 
        ? alternativeNames.split(",").map(name => name.trim()).filter(name => name)
        : [];

      // Upload new images if any
      let newImageUrls = [];
      if (newImageFiles.length > 0) {
        newImageUrls = await Promise.all(
          newImageFiles.map(file => uploadMediaToSupabase(file))
        );
      }

      const productData = {
        productId,
        name,
        altName,
        images: [...existingImages, ...newImageUrls],
        price: Number(price),
        labelledPrice: labelledPrice ? Number(labelledPrice) : undefined,
        stock: Number(stock),
        description,
        isAvailable: product.isAvailable
      };

      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/${product.productId}`,
        productData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Product updated successfully");
      navigate("/admin/products");
    } catch (err) {
      console.error("Update error:", err);
      const errorMsg = err.response?.data?.message || "Failed to update product";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Product</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">Product ID</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
                value={productId}
                readOnly
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">Product Name*</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">Alternative Names</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:outline-none"
                value={alternativeNames}
                onChange={(e) => setAlternativeNames(e.target.value)}
                placeholder="Comma-separated alternative names"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">Price*</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:outline-none"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">Last Price</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:outline-none"
                value={labelledPrice}
                onChange={(e) => setLabelledPrice(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">Stock*</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:outline-none"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                min="0"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">Description*</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:outline-none"
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">Add New Images</label>
              <input
                type="file"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:outline-none"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                multiple
              />
            </div>
          </div>
        </div>

        {/* Image Display */}
        <div className="mt-8">
          <h3 className="text-gray-700 font-medium mb-4">Product Images</h3>
          
          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className="mb-6">
              <h4 className="text-gray-600 mb-2">Current Images</h4>
              <div className="flex flex-wrap gap-4">
                {existingImages.map((imgUrl, index) => (
                  <div key={`existing-${index}`} className="relative">
                    <img 
                      src={imgUrl} 
                      alt={`Product ${index + 1}`} 
                      className="w-24 h-24 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Image Previews */}
          {previewUrls.length > 0 && (
            <div>
              <h4 className="text-gray-600 mb-2">New Images to Add</h4>
              <div className="flex flex-wrap gap-4">
                {previewUrls.map((url, index) => (
                  <div key={`new-${index}`} className="relative">
                    <img 
                      src={url} 
                      alt={`New Image ${index + 1}`} 
                      className="w-24 h-24 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Updating..." : "Update Product"}
          </button>
        </div>
      </div>
    </div>
  );
}