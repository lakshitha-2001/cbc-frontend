/**
 * Cart Item Type
 * @typedef {Object} CartItem
 * @property {string} productId - The ID of the product
 * @property {number} qty - The quantity of the product
 * @property {string} [name] - The name of the product
 * @property {string} [image] - The image URL of the product
 * @property {number} [price] - The current price of the product
 * @property {number} [labelledPrice] - The original price if discounted
 */

/**
 * Loads the cart from localStorage
 * @returns {CartItem[]} The cart array
 */
export function loadCart() {
  try {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error("Error loading cart:", error);
    return [];
  }
}

/**
 * Saves the cart to localStorage and dispatches update event
 * @param {CartItem[]} cart - The cart array to save
 */
export function saveCart(cart) {
  try {
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    console.log("Cart saved:", cart);
  } catch (error) {
    console.error("Error saving cart:", error);
  }
}

/**
 * Adds a product to the cart or updates its quantity
 * @param {string} productId - The ID of the product
 * @param {number} qty - The quantity to add
 * @param {Object} [productDetails] - Full product details
 * @param {string} [productDetails.name] - Product name
 * @param {string[]} [productDetails.images] - Product images array
 * @param {number} [productDetails.price] - Product price
 * @param {number} [productDetails.labelledPrice] - Original price if discounted
 * @returns {CartItem[]} The updated cart
 */
export function addToCart(productId, qty, productDetails = null) {
  const cart = loadCart();
  const index = cart.findIndex(item => item.productId === productId);

  if (index === -1) {
    // New item
    const newItem = productDetails 
      ? {
          productId,
          qty,
          name: productDetails.name,
          image: productDetails.images?.[0] || "",
          price: productDetails.price,
          labelledPrice: productDetails.labelledPrice
        }
      : { productId, qty };
    
    cart.push(newItem);
  } else {
    // Existing item - update quantity
    const newQty = cart[index].qty + qty;
    
    if (newQty <= 0) {
      // Remove if quantity is zero or negative
      cart.splice(index, 1);
    } else {
      // Update quantity
      cart[index].qty = newQty;
    }
  }

  saveCart(cart);
  return cart;
}

/**
 * Removes an item from the cart
 * @param {string} productId - The ID of the product to remove
 * @returns {CartItem[]} The updated cart
 */
export function deleteItem(productId) {
  const cart = loadCart();
  const filteredCart = cart.filter(item => item.productId !== productId);
  
  if (filteredCart.length !== cart.length) {
    saveCart(filteredCart);
  }

  return filteredCart;
}

/**
 * Clears the entire cart
 */
export function clearCart() {
  localStorage.removeItem("cart");
  window.dispatchEvent(new Event('cartUpdated'));
}

/**
 * Gets the total number of items in the cart
 * @returns {number} Total quantity of all items
 */
export function getCartItemCount() {
  const cart = loadCart();
  return cart.reduce((total, item) => total + item.qty, 0);
}

/**
 * Gets the total price of all items in the cart
 * @returns {number} Total price
 */
export function getCartTotal() {
  const cart = loadCart();
  return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
}

/**
 * Updates the quantity of a specific item in the cart
 * @param {string} productId - The ID of the product
 * @param {number} newQty - The new quantity
 * @returns {CartItem[]} The updated cart
 */
export function updateItemQuantity(productId, newQty) {
  const cart = loadCart();
  const index = cart.findIndex(item => item.productId === productId);

  if (index !== -1) {
    if (newQty <= 0) {
      cart.splice(index, 1);
    } else {
      cart[index].qty = newQty;
    }
    saveCart(cart);
  }

  return cart;
}

/**
 * Finds an item in the cart
 * @param {string} productId - The ID of the product to find
 * @returns {CartItem|null} The cart item or null if not found
 */
export function findCartItem(productId) {
  const cart = loadCart();
  return cart.find(item => item.productId === productId) || null;
}

/**
 * Calculates the total savings from discounts
 * @returns {number} Total savings amount
 */
export function getTotalSavings() {
  const cart = loadCart();
  return cart.reduce((sum, item) => {
    if (item.labelledPrice && item.labelledPrice > item.price) {
      return sum + ((item.labelledPrice - item.price) * item.qty);
    }
    return sum;
  }, 0);
}