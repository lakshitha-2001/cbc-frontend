"use client"

import { useEffect, useState } from "react";
import axios from "axios";

export default function HomeSlider() {
  const [sliders, setSliders] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/sliders`);
        setSliders(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Fetch sliders error:", err);
        setLoading(false);
      }
    };

    fetchSliders();
  }, []);

  useEffect(() => {
    if (sliders.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev === sliders.length - 1 ? 0 : prev + 1));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [sliders.length]);

  if (loading) {
    return <div className="h-64 bg-gray-200 animate-pulse rounded-lg"></div>;
  }

  if (sliders.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full h-64 md:h-96 overflow-hidden rounded-lg">
      {sliders.map((slider, index) => (
        <div
          key={slider.sliderId}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={slider.imageUrl}
            alt={slider.title}
            className="w-full h-full object-cover"
          />
          {(slider.title || slider.subtitle) && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              <div className="max-w-4xl mx-auto">
                {slider.title && (
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
                    {slider.title}
                  </h2>
                )}
                {slider.subtitle && (
                  <p className="text-white/90">{slider.subtitle}</p>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
      
      {sliders.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          {sliders.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentSlide ? "bg-white" : "bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}