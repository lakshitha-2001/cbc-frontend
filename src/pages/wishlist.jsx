// pages/wishlist.jsx
"use client"
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, ShoppingBag, Heart, ShoppingCart, ArrowRight } from "lucide-react";
import ProductCard from "../components/productCard";
import { getWishlist, removeFromWishlist, addToCart } from "../utils/wishlistFunctions";
import { toast } from "react-toastify";

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const loadWishlist = () => {
      const items = getWishlist();
      setWishlistItems(items);
      setLoading(false);
    };

    loadWishlist();

    // Listen for wishlist updates
    const handleWishlistUpdate = () => {
      loadWishlist();
    };

    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
    };
  }, []);

  const handleRemoveItem = (productId) => {
    setIsUpdating(true);
    removeFromWishlist(productId);
    toast.success("Removed from wishlist!");
    setIsUpdating(false);
  };

  const handleClearWishlist = () => {
    if (window.confirm("Are you sure you want to clear your wishlist?")) {
      setIsUpdating(true);
      localStorage.removeItem('wishlist');
      window.dispatchEvent(new Event('wishlistUpdated'));
      toast.success("Wishlist cleared!");
      setIsUpdating(false);
    }
  };

  const handleMoveToCart = (product) => {
    setIsUpdating(true);
    // Add to cart
    addToCart(product);
    // Remove from wishlist
    removeFromWishlist(product.productId || product._id || product.id);
    toast.success("Moved to cart!");
    setIsUpdating(false);
  };

  const handleMoveAllToCart = () => {
    if (window.confirm("Move all items to cart?")) {
      setIsUpdating(true);
      wishlistItems.forEach(product => {
        addToCart(product);
      });
      localStorage.removeItem('wishlist');
      window.dispatchEvent(new Event('wishlistUpdated'));
      window.dispatchEvent(new Event('cartUpdated'));
      toast.success("All items moved to cart!");
      setIsUpdating(false);
    }
  };

  const getWishlistTotal = () => {
    return wishlistItems.reduce((total, item) => {
      const price = item.price || item.currentPrice || 0;
      return total + price;
    }, 0);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <Heart className="h-8 w-8 text-pink-500 fill-pink-500" />
        My Wishlist
      </h1>
      
      {wishlistItems.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-8">Start adding items you love to your wishlist</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 transition-colors"
          >
            <ShoppingBag className="h-5 w-5" />
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Wishlist Items */}
          <div className="lg:col-span-2 space-y-6">
            {wishlistItems.map((product) => {
              const productId = product.productId || product._id || product.id;
              const price = product.price || product.currentPrice || 0;
              const labelledPrice = product.labelledPrice || product.originalPrice;
              
              return (
                <div key={productId} className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg">
                  {/* Product Image */}
                  <div className="w-full sm:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={product.image || product.images?.[0] || '/placeholder-product.png'} 
                      alt={product.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.src = '/placeholder-product.png';
                      }}
                    />
                  </div>
                  
                  {/* Product Info */}
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold">{product.name}</h3>
                      <button 
                        onClick={() => handleRemoveItem(productId)}
                        className="text-gray-500 hover:text-red-500 transition"
                        aria-label="Remove from wishlist"
                        disabled={isUpdating}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <p className="text-gray-600 mt-1">
                      {labelledPrice && labelledPrice > price ? (
                        <>
                          <span className="text-red-600 font-semibold">Rs.{price.toFixed(2)}</span>
                          <span className="ml-2 text-sm line-through">Rs.{labelledPrice.toFixed(2)}</span>
                        </>
                      ) : (
                        <span className="font-semibold">Rs.{price.toFixed(2)}</span>
                      )}
                    </p>
                    
                    {/* Action Buttons */}
                    <div className="mt-4 flex items-center gap-4">
                      <button 
                        onClick={() => handleMoveToCart(product)}
                        disabled={isUpdating}
                        className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white py-2 px-4 rounded-md transition disabled:opacity-50"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        Move to Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            
            <div className="flex justify-between mt-4">
              <button 
                onClick={handleClearWishlist}
                className="text-red-600 hover:text-red-800 flex items-center gap-2 transition"
                disabled={isUpdating}
              >
                <Trash2 className="h-5 w-5" />
                Clear Wishlist
              </button>
              
              <button 
                onClick={handleMoveAllToCart}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center gap-2 py-2 px-4 rounded-md transition disabled:opacity-50"
                disabled={isUpdating}
              >
                <ShoppingCart className="h-4 w-4" />
                Move All to Cart
              </button>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="bg-gray-50 p-6 rounded-lg h-fit sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Wishlist Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Items ({wishlistItems.length})</span>
                <span>Rs.{getWishlistTotal().toFixed(2)}</span>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total Value</span>
                  <span>Rs.{getWishlistTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleMoveAllToCart}
              className="w-full bg-black hover:bg-gray-800 text-white py-3 px-6 font-medium mt-6 transition flex items-center justify-center gap-2 disabled:opacity-50"
              disabled={isUpdating || wishlistItems.length === 0}
            >
              <ShoppingCart className="h-5 w-5" />
              Move All to Cart
            </button>
            
            <Link to="/cart">
              <button 
                className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 px-6 font-medium mt-4 transition flex items-center justify-center gap-2"
              >
                Go to Cart
                <ArrowRight className="h-5 w-5" />
              </button>
            </Link>
            
            <div className="mt-4 text-sm text-gray-500">
              <p>or</p>
              <Link to="/products">
                <button className="text-blue-600 hover:underline mt-2">
                  Continue Shopping
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}