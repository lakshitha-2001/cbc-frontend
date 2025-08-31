"use client"
import { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"

export default function HomeSlider() {
  const [sliders, setSliders] = useState([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/sliders`)
        setSliders(response.data)
        setLoading(false)
      } catch (err) {
        console.error("Fetch sliders error:", err)
        setLoading(false)
      }
    }

    fetchSliders()
  }, [])

  useEffect(() => {
    if (sliders.length > 1 && !isHovered) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev === sliders.length - 1 ? 0 : prev + 1))
      }, 4000)

      return () => clearInterval(interval)
    }
  }, [sliders.length, isHovered]) 

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  if (loading) {
    return <div className="h-[400px] sm:h-[600px] md:h-[800px] lg:h-[1000px] bg-gray-200 animate-pulse"></div>
  }

  if (sliders.length === 0) {
    return null
  }

  return (
    <div
      className="relative w-full h-[500px] sm:h-[700px] md:h-[900px] lg:h-[1100px] overflow-hidden"
      style={{ zIndex: 0 }} 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {sliders.map((slider, index) => (
        <div
          key={slider.sliderId}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          {slider.link ? (
            <Link to={slider.link}>
              <img
                src={slider.imageUrl || "/placeholder.svg"}
                alt={slider.title || "Homepage slider"}
                className="w-full h-full object-cover cursor-pointer"
              />
            </Link>
          ) : (
            <img
              src={slider.imageUrl || "/placeholder.svg"}
              alt={slider.title || "Homepage slider"}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      ))}

      {sliders.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {sliders.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                currentSlide === index ? "bg-white" : "bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
