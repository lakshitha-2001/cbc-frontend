import axios from "axios";
import { useState } from "react";

import { useNavigate } from "react-router-dom";
import uploadMediaToSupabase from "../../utils/mediaUpload ";
import { toast } from "react-toastify";


export default function AddProductForm() {
  const [productId, setProductId] = useState("");
  const [name, setName] = useState("");
  const [alternativeNames, setAlternativeNames] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [price, setPrice] = useState("");
  const [lastPrice, setLastPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file types
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      toast.error("Only JPG, PNG, and WebP images are allowed");
      return;
    }
    
    setImageFiles(files);
    
    // Create preview URLs
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const removeImage = (index) => {
    const newFiles = [...imageFiles];
    newFiles.splice(index, 1);
    setImageFiles(newFiles);
    
    const newUrls = [...previewUrls];
    URL.revokeObjectURL(newUrls[index]);
    newUrls.splice(index, 1);
    setPreviewUrls(newUrls);
  };

  async function handleSubmit() {
    if (!productId || !name || !price || !stock || !description) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (imageFiles.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem("token");
    
    if (!token) {
      toast.error("Please log in to add products");
      navigate("/login");
      return;
    }

    try {
      const altName = alternativeNames 
        ? alternativeNames.split(",").map(name => name.trim()).filter(name => name)
        : [];

      // Upload images
      const imgUrls = await Promise.all(
        imageFiles.map(file => uploadMediaToSupabase(file))
      );

      const productData = {
        productId,
        name,
        altName,
        images: imgUrls,
        price: Number(price),
        labelledPrice: lastPrice ? Number(lastPrice) : undefined,
        stock: Number(stock),
        description,
        isAvailable: true
      };

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/products`,
        productData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Product added successfully");
      navigate("/admin/products");
    } catch (err) {
      console.error("Add product error:", err);
      const errorMsg = err.response?.data?.message || "Failed to add product";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Product</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">Product ID*</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:outline-none"
                placeholder="Enter Product ID"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">Product Name*</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:outline-none"
                placeholder="Enter Product Name"
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
                placeholder="Comma-separated alternative names"
                value={alternativeNames}
                onChange={(e) => setAlternativeNames(e.target.value)}
              />
              <p className="text-sm text-gray-500 mt-1">Separate with commas if multiple</p>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">Price*</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:outline-none"
                placeholder="Enter Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">Last Price</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:outline-none"
                placeholder="Enter Last Price"
                value={lastPrice}
                onChange={(e) => setLastPrice(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">Stock*</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:outline-none"
                placeholder="Enter Stock Quantity"
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
                placeholder="Enter Product Description"
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">Images*</label>
              <input
                type="file"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:outline-none"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                multiple
              />
              <p className="text-sm text-gray-500 mt-1">Upload at least one image (JPEG, PNG, or WebP)</p>
            </div>

            {/* Image Previews */}
            {previewUrls.length > 0 && (
              <div className="mt-4">
                <h3 className="text-gray-700 font-medium mb-2">Image Previews</h3>
                <div className="flex flex-wrap gap-2">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={url} 
                        alt={`Preview ${index + 1}`} 
                        className="w-20 h-20 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
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
            {isSubmitting ? "Adding..." : "Add Product"}
          </button>
        </div>
      </div>
    </div>
  );
}