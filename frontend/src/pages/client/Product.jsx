import { useState, useEffect } from "react";
import API from "../../api/axios";
import ProductCard from "../../components/client/ProductCard";
import { CardSkeleton } from "../../components/common/Skeleton";

function Product() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await API.get("/products");
      const productList = res.data.items || res.data.products || res.data.data || res.data;
      setProducts(Array.isArray(productList) ? productList : []);
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="w-full px-12 py-16">
        {/* Header */}
        <div className="mb-12 px-6">
          <h1 className="text-4xl font-semibold text-gray-900 mb-2">All Products</h1>
          <p className="text-gray-600">Discover our complete collection</p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg mb-4">{error}</p>
            <button
              onClick={fetchProducts}
              className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-400 font-light">No products available</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Product;