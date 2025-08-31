"use client"

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import { toast } from "react-toastify";
import uploadMediaToSupabase from "../../utils/mediaUpload ";

export default function EditSliderForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const slider = location.state?.slider;

  const [sliderId, setSliderId] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [link, setLink] = useState("");
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [newImageFile, setNewImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [order, setOrder] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!slider) {
      toast.error("No slider data found");
      navigate("/admin/sliders");
      return;
    }

    setSliderId(slider.sliderId);
    setTitle(slider.title);
    setSubtitle(slider.subtitle || "");
    setLink(slider.link || "");
    setExistingImageUrl(slider.imageUrl);
    setIsActive(slider.isActive);
    setOrder(slider.order);
  }, [slider, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Only JPG, PNG, and WebP images are allowed");
      return;
    }
    
    setNewImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const removeNewImage = () => {
    setNewImageFile(null);
    URL.revokeObjectURL(previewUrl);
    setPreviewUrl("");
  };

  async function handleSubmit() {
    if (!title) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!existingImageUrl && !newImageFile) {
      toast.error("Please select an image");
      return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem("token");
    
    if (!token) {
      toast.error("Please log in to edit sliders");
      navigate("/login");
      return;
    }

    try {
      let imageUrl = existingImageUrl;
      if (newImageFile) {
        imageUrl = await uploadMediaToSupabase(newImageFile);
      }

      const sliderData = {
        sliderId,
        title,
        subtitle,
        imageUrl,
        link: link || undefined,
        isActive,
        order: Number(order)
      };

      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/sliders/${slider.sliderId}`,
        sliderData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Slider updated successfully");
      navigate("/admin/sliders");
    } catch (err) {
      console.error("Update slider error:", err);
      const errorMsg = err.response?.data?.message || "Failed to update slider";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!slider) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Slider</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">Slider ID</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
                value={sliderId}
                readOnly
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">Title*</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:outline-none"
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
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">Link URL</label>
              <input
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:outline-none"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">Order*</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:outline-none"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                min="0"
                required
              />
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
              <label className="text-gray-700 font-medium mb-1">Change Image</label>
              <input
                type="file"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:outline-none"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
              />
            </div>

            {/* Image Display */}
            <div className="mt-4">
              <h3 className="text-gray-700 font-medium mb-2">Current Image</h3>
              {previewUrl ? (
                <div className="relative">
                  <img 
                    src={previewUrl} 
                    alt="New Preview" 
                    className="w-full h-48 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={removeNewImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <img 
                    src={existingImageUrl} 
                    alt="Current" 
                    className="w-full h-48 object-cover rounded border"
                  />
                  <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full px-2 py-1 text-xs">
                    Current
                  </div>
                </div>
              )}
            </div>
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
            {isSubmitting ? "Updating..." : "Update Slider"}
          </button>
        </div>
      </div>
    </div>
  );
}