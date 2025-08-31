// components/wishlist/WishlistButton.jsx
import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { addToWishlist, removeFromWishlist, isInWishlist } from "../../utils/wishlistFunctions";
import { toast } from "react-toastify";

export default function WishlistButton({ product, size = "medium" }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  useEffect(() => {
    // Get the correct product ID
    const productId = product.productId || product._id || product.id;
    // Check if product is in wishlist on component mount
    setIsWishlisted(isInWishlist(productId));
    
    // Listen for wishlist updates from other components
    const handleWishlistUpdate = () => {
      setIsWishlisted(isInWishlist(productId));
    };
    
    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
    };
  }, [product]);
  
  const handleWishlistToggle = () => {
    const productId = product.productId || product._id || product.id;
    if (isWishlisted) {
      removeFromWishlist(productId);
      toast.success("Removed from wishlist!");
    } else {
      addToWishlist(product);
      toast.success("Added to wishlist!");
    }
  };
  
  const sizeClasses = {
    small: "p-2",
    medium: "p-3",
    large: "p-4"
  };
  
  const iconSizes = {
    small: "h-4 w-4",
    medium: "h-5 w-5",
    large: "h-6 w-6"
  };
  
  return (
    <button
      onClick={handleWishlistToggle}
      className={`border border-gray-300 hover:bg-gray-100 transition-colors rounded-full ${sizeClasses[size]}`}
      title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart 
        className={`${iconSizes[size]} ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"}`} 
      />
    </button>
  );
}