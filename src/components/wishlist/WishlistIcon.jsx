import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { getWishlistItemCount } from "../../utils/wishlistFunctions";

export default function WishlistIcon() {
  const [wishlistCount, setWishlistCount] = useState(0);
  
  useEffect(() => {
    // Get initial wishlist count
    setWishlistCount(getWishlistItemCount());
    
    // Listen for wishlist updates
    const handleWishlistUpdate = () => {
      setWishlistCount(getWishlistItemCount());
    };
    
    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
    };
  }, []);
  
  return (
    <Link to="/wishlist" className="relative group">
      <button className="p-3 text-black cursor-pointer">
        <div className="relative">
          <Heart className="h-6 w-6" />
        </div>
        {wishlistCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg">
            {wishlistCount}
          </span>
        )}
      </button>
      <span className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap border border-purple-600 bg-white px-3 py-2 text-sm text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-200 cursor-text shadow-lg"
        style={{ zIndex: 100 }}>
        My Wishlist
      </span>
    </Link>
  );
}