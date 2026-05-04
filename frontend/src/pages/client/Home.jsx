import { useState, useEffect } from 'react';
import API from '../../api/axios';
import ProductCard from '../../components/client/ProductCard';
import { CardSkeleton } from '../../components/common/Skeleton';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await API.get('/products');
      const productList = res.data.items || res.data.products || res.data.data || res.data;
      
      // Add hover images to all 8 products
      const productsWithHover = Array.isArray(productList) ? productList.map((product, index) => {
        if (index === 0) {
          return { ...product, image: '/images/products/image1.jpg', secondaryImage: '/images/products/image2.jpg' };
        } else if (index === 1) {
          return { ...product, image: '/images/products/image3.jpg', secondaryImage: '/images/products/image4.jpg' };
        } else if (index === 2) {
          return { ...product, image: '/images/products/image5.jpg', secondaryImage: '/images/products/image6.jpg' };
        } else if (index === 3) {
          return { ...product, image: '/images/products/image7.jpg', secondaryImage: '/images/products/image8.jpg' };
        } else if (index === 4) {
          return { ...product, image: '/images/products/image9.jpg', secondaryImage: '/images/products/image10.jpg' };
        } else if (index === 5) {
          return { ...product, image: '/images/products/image11.jpg', secondaryImage: '/images/products/image12.jpg' };
        } else if (index === 6) {
          return { ...product, image: '/images/products/image13.jpg', secondaryImage: '/images/products/image14.jpg' };
        } else if (index === 7) {
          return { ...product, image: '/images/products/image15.jpg', secondaryImage: '/images/products/image16.jpg' };
        }
        return product;
      }).slice(0, 8) : [];
      
      setProducts(productsWithHover);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen w-full">
        <div className="w-full px-6 py-32 md:py-40 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
              Beautifully crafted.
              <br />
              Thoughtfully designed.
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 font-light">
              Discover products that blend form and function.
            </p>
            <button className="px-8 py-4 bg-gray-900 text-white rounded-full text-lg font-medium hover:bg-gray-800 transition-colors">
              Shop Now
            </button>
          </div>
        </div>
        
        {/* Animated Product Images */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Image 1 - Top Left */}
          <div className="absolute top-10 left-10 w-64 h-64 opacity-40 animate-float">
            <img src="/images/products/image1.jpg" alt="" className="w-full h-full object-cover rounded-3xl shadow-2xl" />
          </div>
          
          {/* Image 2 - Top Right */}
          <div className="absolute top-20 right-10 w-72 h-72 opacity-35 animate-float-delayed">
            <img src="/images/products/image2.jpg" alt="" className="w-full h-full object-cover rounded-3xl shadow-2xl" />
          </div>
          
          {/* Image 3 - Middle Left */}
          <div className="absolute top-1/2 -translate-y-1/2 left-5 w-56 h-56 opacity-45 animate-float-slow">
            <img src="/images/products/image3.jpg" alt="" className="w-full h-full object-cover rounded-3xl shadow-2xl" />
          </div>
          
          {/* Image 4 - Middle Right */}
          <div className="absolute top-1/3 right-5 w-60 h-60 opacity-40 animate-float">
            <img src="/images/products/image4.jpg" alt="" className="w-full h-full object-cover rounded-3xl shadow-2xl" />
          </div>
          
          {/* Image 5 - Bottom Left */}
          <div className="absolute bottom-10 left-20 w-64 h-64 opacity-35 animate-float-delayed">
            <img src="/images/products/image5.jpg" alt="" className="w-full h-full object-cover rounded-3xl shadow-2xl" />
          </div>
          
          {/* Image 6 - Bottom Right */}
          <div className="absolute bottom-20 right-16 w-56 h-56 opacity-40 animate-float-slow">
            <img src="/images/products/image6.jpg" alt="" className="w-full h-full object-cover rounded-3xl shadow-2xl" />
          </div>
        </div>
        
        {/* Subtle gradient background */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-gray-50 to-white"></div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white w-full">
        <div className="w-full px-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-8 px-6">Shop by Category</h2>
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide px-6">
            <div className="flex-shrink-0 w-40 text-center group cursor-pointer">
              <div className="w-40 h-40 bg-gray-100 rounded-2xl mb-4 flex items-center justify-center transition-transform hover:scale-105">
                <svg className="w-16 h-16 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-900">Electronics</p>
            </div>
            <div className="flex-shrink-0 w-40 text-center group cursor-pointer">
              <div className="w-40 h-40 bg-gray-100 rounded-2xl mb-4 flex items-center justify-center transition-transform hover:scale-105">
                <svg className="w-16 h-16 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-900">Fashion</p>
            </div>
            <div className="flex-shrink-0 w-40 text-center group cursor-pointer">
              <div className="w-40 h-40 bg-gray-100 rounded-2xl mb-4 flex items-center justify-center transition-transform hover:scale-105">
                <svg className="w-16 h-16 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-900">Home</p>
            </div>
            <div className="flex-shrink-0 w-40 text-center group cursor-pointer">
              <div className="w-40 h-40 bg-gray-100 rounded-2xl mb-4 flex items-center justify-center transition-transform hover:scale-105">
                <svg className="w-16 h-16 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-900">Books</p>
            </div>
            <div className="flex-shrink-0 w-40 text-center group cursor-pointer">
              <div className="w-40 h-40 bg-gray-100 rounded-2xl mb-4 flex items-center justify-center transition-transform hover:scale-105">
                <svg className="w-16 h-16 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-900">Toys</p>
            </div>
            <div className="flex-shrink-0 w-40 text-center group cursor-pointer">
              <div className="w-40 h-40 bg-gray-100 rounded-2xl mb-4 flex items-center justify-center transition-transform hover:scale-105">
                <svg className="w-16 h-16 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-900">Music</p>
            </div>
          </div>
        </div>
      </section>

      {/* Video Showcase Section */}
      <section className="relative h-[600px] overflow-hidden bg-gray-900">
        {/* Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/showcase.mp4" type="video/mp4" />
        </video>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20"></div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-gray-50 w-full">
        <div className="w-full px-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-semibold text-gray-900 mb-3">Featured Products</h2>
            <p className="text-gray-600">Handpicked favorites just for you</p>
          </div>
          
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
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">{error}</p>
              <button
                onClick={fetchProducts}
                className="mt-4 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
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
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 w-full">
        <div className="w-full px-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-900 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Products</h3>
              <p className="text-gray-600">Carefully selected items that meet our high standards</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-900 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Best Prices</h3>
              <p className="text-gray-600">Competitive pricing on all our products</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-900 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Quick and reliable shipping to your door</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 w-full bg-gray-900">
        <div className="w-full px-12">
          <div className="text-center">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Start Shopping Today
            </h2>
            <p className="text-xl text-gray-300 mb-10 font-light">
              Join thousands of satisfied customers
            </p>
            <button className="px-10 py-4 bg-white text-gray-900 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors">
              Browse Collection
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;