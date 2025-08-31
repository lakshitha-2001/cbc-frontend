"use client"

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Edit, Trash2, Plus, ArrowUp, ArrowDown } from "lucide-react";

export default function AdminSlidersPage() {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/sliders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSliders(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Fetch sliders error:", err);
        toast.error("Failed to fetch sliders");
        setLoading(false);
      }
    };

    fetchSliders();
  }, [token]);

  const handleDelete = async (sliderId) => {
    if (!window.confirm("Are you sure you want to delete this slider?")) return;

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/sliders/${sliderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Slider deleted successfully");
      setSliders(sliders.filter(slider => slider.sliderId !== sliderId));
    } catch (err) {
      console.error("Delete slider error:", err);
      toast.error("Failed to delete slider");
    }
  };

  const handleOrderChange = async (sliderId, direction) => {
    try {
      const sliderIndex = sliders.findIndex(s => s.sliderId === sliderId);
      if ((direction === 'up' && sliderIndex === 0) || 
          (direction === 'down' && sliderIndex === sliders.length - 1)) {
        return;
      }

      const newOrder = direction === 'up' ? -1 : 1;
      const updatedSliders = [...sliders];
      const tempOrder = updatedSliders[sliderIndex].order;
      updatedSliders[sliderIndex].order = updatedSliders[sliderIndex + newOrder].order;
      updatedSliders[sliderIndex + newOrder].order = tempOrder;

      // Sort based on order
      updatedSliders.sort((a, b) => a.order - b.order);
      setSliders(updatedSliders);

      // Update in backend
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/sliders/${sliderId}`,
        { order: updatedSliders[sliderIndex].order },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Also update the adjacent slider
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/sliders/${updatedSliders[sliderIndex + newOrder].sliderId}`,
        { order: updatedSliders[sliderIndex + newOrder].order },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Update order error:", err);
      toast.error("Failed to update slider order");
    }
  };

  const toggleActiveStatus = async (sliderId, currentStatus) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/sliders/${sliderId}`,
        { isActive: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setSliders(sliders.map(slider => 
        slider.sliderId === sliderId 
          ? { ...slider, isActive: !currentStatus } 
          : slider
      ));
      toast.success(`Slider ${!currentStatus ? 'activated' : 'deactivated'}`);
    } catch (err) {
      console.error("Toggle active status error:", err);
      toast.error("Failed to update slider status");
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading sliders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Slider Management</h1>
        <Link
          to="/admin/sliders/add"
          className="flex items-center px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Slider
        </Link>
      </div>

      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-purple-800/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-purple-800/30">
            <thead className="bg-white/5">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Preview
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Subtitle
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Link
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Order
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-800/30">
              {sliders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-slate-400">
                    No sliders found. Add your first slider!
                  </td>
                </tr>
              ) : (
                sliders.map((slider) => (
                  <tr key={slider.sliderId} className="hover:bg-white/5">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-24 h-16 rounded-md overflow-hidden border border-purple-800/30">
                        <img 
                          src={slider.imageUrl} 
                          alt={slider.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-white font-medium">{slider.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-slate-400">{slider.subtitle || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-slate-400">
                        {slider.link ? (
                          <a href={slider.link} target="_blank" rel="noopener noreferrer" className="text-pink-300 hover:underline">
                            View Link
                          </a>
                        ) : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleActiveStatus(slider.sliderId, slider.isActive)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          slider.isActive 
                            ? 'bg-green-500/20 text-green-300' 
                            : 'bg-rose-500/20 text-rose-300'
                        }`}
                      >
                        {slider.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleOrderChange(slider.sliderId, 'up')}
                          disabled={sliders.findIndex(s => s.sliderId === slider.sliderId) === 0}
                          className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <span className="text-white">{slider.order}</span>
                        <button
                          onClick={() => handleOrderChange(slider.sliderId, 'down')}
                          disabled={sliders.findIndex(s => s.sliderId === slider.sliderId) === sliders.length - 1}
                          className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end space-x-2">
                        <Link
                          to={`/admin/sliders/edit/${slider.sliderId}`}
                          state={{ slider }}
                          className="p-2 text-blue-400 hover:text-blue-300 rounded-full hover:bg-white/10"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(slider.sliderId)}
                          className="p-2 text-rose-400 hover:text-rose-300 rounded-full hover:bg-white/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}