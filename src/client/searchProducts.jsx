import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import ProductCard from "../components/productCard";

export default function SearchProductPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { query } = useParams();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/search/${encodeURIComponent(query)}`
        );
        
        setProducts(response.data);
        setIsLoading(false);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError(err.response.data.message);
        } else {
          setError(err.message || "Failed to fetch products");
        }
        setIsLoading(false);
        setProducts([]);
      }
    };

    if (query && query.trim() !== "") {
      fetchProducts();
    } else {
      setIsLoading(false);
      setError("Please enter a search term");
      setProducts([]);
    }
  }, [query]);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-800 mb-4"></div>
        <p className="text-lg">Searching products...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-8">
          Search Results for: <span className="text-red-600">"{decodeURIComponent(query)}"</span>
        </h2>

        {error ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-4">{error}</p>
            <Link 
              to="/products" 
              className="text-red-600 hover:text-red-800 font-medium underline"
            >
              Browse all products
            </Link>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">
              No products found matching your search criteria.
            </p>
            <p className="mt-4">
              Try a different search term or browse our{" "}
              <Link to="/products" className="text-red-600 hover:underline">
                full product catalog
              </Link>.
            </p>
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-6">
              Found {products.length} {products.length === 1 ? "product" : "products"}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}