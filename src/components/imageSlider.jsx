"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

export default function ImageSlider({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showFullscreen, setShowFullscreen] = useState(false)

  const goToPrevious = () => {
    const isFirstImage = currentIndex === 0
    const newIndex = isFirstImage ? images.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
  }

  const goToNext = () => {
    const isLastImage = currentIndex === images.length - 1
    const newIndex = isLastImage ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
  }

  const toggleFullscreen = () => {
    setShowFullscreen(!showFullscreen)
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto overflow-hidden rounded-lg shadow-lg">
      {/* Beautiful Fullscreen Modal */}
      {showFullscreen && (
        <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="relative max-w-3xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
            <button
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-700 hover:text-black p-2 rounded-full shadow-md z-10 transition-all"
              aria-label="Close fullscreen"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="p-6">
              <img
                src={images[currentIndex] || "/placeholder.svg"}
                alt={`Product view ${currentIndex + 1}`}
                className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
              />
            </div>

            {images.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 hover:text-black p-2 rounded-full shadow-md transition-all"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 hover:text-black p-2 rounded-full shadow-md transition-all"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            {/* Image counter */}
            <div className="px-6 pb-4 text-center text-sm text-gray-600">
              {currentIndex + 1} of {images.length}
            </div>
          </div>
        </div>
      )}

      {/* Main slider without gray background */}
      <div className="relative w-full h-96 flex items-center justify-center border border-gray-100 rounded-lg">
        <img
          src={images[currentIndex] || "/placeholder.svg"}
          alt={`Product view ${currentIndex + 1}`}
          className="max-h-full max-w-full object-contain cursor-zoom-in transition-transform duration-300 hover:scale-105"
          onClick={toggleFullscreen}
        />
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-black p-2 rounded-full shadow-md transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-black p-2 rounded-full shadow-md transition-colors"
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Thumbnail indicators */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  currentIndex === index ? "bg-red-600" : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
