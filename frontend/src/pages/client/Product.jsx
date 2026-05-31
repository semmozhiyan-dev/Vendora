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
      
      // Add hover images to products (same as Home page)
      const productsWithHover = Array.isArray(productList) ? productList.map((product, index) => {
        const imageIndex = index % 8; // Cycle through 8 image pairs
        
        if (imageIndex === 0) {
          return { ...product, image: '/images/products/image1.jpg', secondaryImage: '/images/products/image2.jpg' };
        } else if (imageIndex === 1) {
          return { ...product, image: '/images/products/image3.jpg', secondaryImage: '/images/products/image4.jpg' };
        } else if (imageIndex === 2) {
          return { ...product, image: '/images/products/image5.jpg', secondaryImage: '/images/products/image6.jpg' };
        } else if (imageIndex === 3) {
          return { ...product, image: '/images/products/image7.jpg', secondaryImage: '/images/products/image8.jpg' };
        } else if (imageIndex === 4) {
          return { ...product, image: '/images/products/image9.jpg', secondaryImage: '/images/products/image10.jpg' };
        } else if (imageIndex === 5) {
          return { ...product, image: '/images/products/image11.jpg', secondaryImage: '/images/products/image12.jpg' };
        } else if (imageIndex === 6) {
          return { ...product, image: '/images/products/image13.jpg', secondaryImage: '/images/products/image14.jpg' };
        } else if (imageIndex === 7) {
          return { ...product, image: '/images/products/image15.jpg', secondaryImage: '/images/products/image16.jpg' };
        }
        return product;
      }) : [];
      
      setProducts(productsWithHover);
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="mb-8 rounded-[32px] border border-gray-200 bg-white px-6 py-8 shadow-sm sm:px-8 sm:py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#C9A84C]">Collection</p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-[#0A0A0A] sm:text-5xl">All products</h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-600 sm:text-base">
                A refined catalog of essentials and statement pieces, laid out with clear spacing, high contrast, and a premium editorial feel.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {[
                { label: 'Clean layout' },
                { label: 'Premium finish' },
                { label: 'Fast browsing' },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-gray-200 bg-[#FAFAFA] px-4 py-4 text-center shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
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
          <div className="rounded-[28px] border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
            <p className="text-lg font-medium text-gray-700">{error}</p>
            <button
              onClick={fetchProducts}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-[#0A0A0A] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            >
              Retry
            </button>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] border border-gray-200 bg-white px-6 py-20 text-center shadow-sm">
            <p className="text-2xl font-semibold text-gray-500">No products available</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Product;