import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/productCard";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products`
        );
        setProducts(response.data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch products");
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []); // Empty dependency array for one-time fetch on mount

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-center mb-12">Our Products</h1>
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-20 w-20 border-b-5 border-pink-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-center mb-12">Our Products</h1>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-red-500 text-lg">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-center mb-12">Our Products</h1>
      
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-gray-500 text-lg">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}