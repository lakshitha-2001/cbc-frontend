"use client"

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { toast } from "react-toastify";
import uploadMediaToSupabase from "../../utils/mediaUpload ";

export default function AddSliderForm() {
  const [sliderId, setSliderId] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [link, setLink] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [order, setOrder] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Only JPG, PNG, and WebP images are allowed");
      return;
    }
    
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    URL.revokeObjectURL(previewUrl);
    setPreviewUrl("");
  };

  async function handleSubmit() {
    if (!sliderId || !title || !imageFile) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem("token");
    
    if (!token) {
      toast.error("Please log in to add sliders");
      navigate("/login");
      return;
    }

    try {
      // Upload image
      const imageUrl = await uploadMediaToSupabase(imageFile);

      const sliderData = {
        sliderId,
        title,
        subtitle,
        imageUrl,
        link: link || undefined,
        isActive,
        order: Number(order)
      };

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/sliders`,
        sliderData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Slider added successfully");
      navigate("/admin/sliders");
    } catch (err) {
      console.error("Add slider error:", err);
      const errorMsg = err.response?.data?.message || "Failed to add slider";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Slider</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">Slider ID*</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:outline-none"
                placeholder="Enter Slider ID"
                value={sliderId}
                onChange={(e) => setSliderId(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">Title*</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:outline-none"
                placeholder="Enter Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">Subtitle</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:outline-none"
                placeholder="Enter Subtitle"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
              />
            </div>

            {/* <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">Link URL</label>
              <input
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:outline-none"
                placeholder="https://example.com"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </div> */}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">Order*</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:outline-none"
                placeholder="Enter Order Number"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                min="0"
                required
              />
              <p className="text-sm text-gray-500 mt-1">Lower numbers appear first</p>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">Status</label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                  Active
                </label>
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">Image*</label>
              <input
                type="file"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:outline-none"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
              />
              <p className="text-sm text-gray-500 mt-1">Recommended aspect ratio: 16:9</p>
            </div>

            {/* Image Preview */}
            {previewUrl && (
              <div className="mt-4">
                <h3 className="text-gray-700 font-medium mb-2">Image Preview</h3>
                <div className="relative">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/admin/sliders")}
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
            {isSubmitting ? "Adding..." : "Add Slider"}
          </button>
        </div>
      </div>
    </div>
  );
}