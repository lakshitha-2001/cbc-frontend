// utils/wishlistFunctions.js

// Get wishlist from localStorage
export const getWishlist = () => {
  try {
    const wishlist = localStorage.getItem('wishlist');
    return wishlist ? JSON.parse(wishlist) : [];
  } catch (error) {
    console.error('Error getting wishlist:', error);
    return [];
  }
};

// Helper function to get product ID (supports multiple ID field names)
const getProductId = (product) => {
  return product.productId || product._id || product.id;
};

// Add item to wishlist
export const addToWishlist = (product) => {
  try {
    const wishlist = getWishlist();
    const productId = getProductId(product);
    
    // Check if product already exists in wishlist
    const existingItem = wishlist.find(item => getProductId(item) === productId);
    if (existingItem) {
      return wishlist; // Item already in wishlist
    }
    
    // Add new item to wishlist
    const updatedWishlist = [...wishlist, product];
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    
    // Dispatch event to notify components of wishlist change
    window.dispatchEvent(new Event('wishlistUpdated'));
    
    return updatedWishlist;
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return getWishlist();
  }
};

// Remove item from wishlist
export const removeFromWishlist = (productId) => {
  try {
    const wishlist = getWishlist();
    const updatedWishlist = wishlist.filter(item => getProductId(item) !== productId);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    
    // Dispatch event to notify components of wishlist change
    window.dispatchEvent(new Event('wishlistUpdated'));
    
    return updatedWishlist;
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return getWishlist();
  }
};

// Check if product is in wishlist
export const isInWishlist = (productId) => {
  const wishlist = getWishlist();
  return wishlist.some(item => getProductId(item) === productId);
};

// Get wishlist item count
export const getWishlistItemCount = () => {
  const wishlist = getWishlist();
  return wishlist.length;
};



export const addToCart = (product) => {
  try {
    const cart = loadCart();
    const productId = getProductId(product);
    const index = cart.findIndex(item => getProductId(item) === productId);

    if (index === -1) {
      // Add new item to cart with quantity 1
      const newItem = {
        productId: productId,
        qty: 1,
        name: product.name,
        image: product.image || product.images?.[0],
        price: product.price || product.currentPrice,
        labelledPrice: product.labelledPrice || product.originalPrice
      };
      cart.push(newItem);
    } else {
      // Increase quantity if already in cart
      cart[index].qty += 1;
    }

    saveCart(cart);
    return cart;
  } catch (error) {
    console.error('Error adding to cart:', error);
    return loadCart();
  }
};

// Load cart from localStorage
const loadCart = () => {
  try {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error loading cart:', error);
    return [];
  }
};

// Save cart to localStorage
const saveCart = (cart) => {
  try {
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
  } catch (error) {
    console.error('Error saving cart:', error);
  }
};