import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import ProductCard from '../../components/client/ProductCard';
import { useCart } from '../../context/CartContext';

function ProductDetails() {
  const { id } = useParams();
  const { refreshCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product) {
      fetchRelatedProducts();
    }
  }, [product]);

  const images = useMemo(() =>
    [product?.image, product?.secondaryImage].filter(Boolean),
    [product?.image, product?.secondaryImage]
  );

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await API.get(`/products/${id}`, {
        headers: { 'X-Skip-Loading': 'true' }
      });
      const productData = res.data.product || res.data.data || res.data;
      
      // Add images to the product (use a hash of the product ID to get consistent images)
      const productIdHash = productData._id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const imageIndex = productIdHash % 8; // Get a number between 0-7
      
      let productWithImages = { ...productData };
      
      if (imageIndex === 0) {
        productWithImages = { ...productData, image: '/images/products/image1.jpg', secondaryImage: '/images/products/image2.jpg' };
      } else if (imageIndex === 1) {
        productWithImages = { ...productData, image: '/images/products/image3.jpg', secondaryImage: '/images/products/image4.jpg' };
      } else if (imageIndex === 2) {
        productWithImages = { ...productData, image: '/images/products/image5.jpg', secondaryImage: '/images/products/image6.jpg' };
      } else if (imageIndex === 3) {
        productWithImages = { ...productData, image: '/images/products/image7.jpg', secondaryImage: '/images/products/image8.jpg' };
      } else if (imageIndex === 4) {
        productWithImages = { ...productData, image: '/images/products/image9.jpg', secondaryImage: '/images/products/image10.jpg' };
      } else if (imageIndex === 5) {
        productWithImages = { ...productData, image: '/images/products/image11.jpg', secondaryImage: '/images/products/image12.jpg' };
      } else if (imageIndex === 6) {
        productWithImages = { ...productData, image: '/images/products/image13.jpg', secondaryImage: '/images/products/image14.jpg' };
      } else if (imageIndex === 7) {
        productWithImages = { ...productData, image: '/images/products/image15.jpg', secondaryImage: '/images/products/image16.jpg' };
      }
      
      setProduct(productWithImages);
    } catch (err) {
      setError('Failed to load product');
      console.error('Product fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    if (!product) return;
    
    try {
      const res = await API.get('/products');
      const productList = res.data.items || res.data.products || res.data.data || res.data;
      
      if (Array.isArray(productList)) {
        // Add images to products
        const productsWithImages = productList.map((p, index) => {
          const imageIndex = index % 8;
          
          if (imageIndex === 0) {
            return { ...p, image: '/images/products/image1.jpg', secondaryImage: '/images/products/image2.jpg' };
          } else if (imageIndex === 1) {
            return { ...p, image: '/images/products/image3.jpg', secondaryImage: '/images/products/image4.jpg' };
          } else if (imageIndex === 2) {
            return { ...p, image: '/images/products/image5.jpg', secondaryImage: '/images/products/image6.jpg' };
          } else if (imageIndex === 3) {
            return { ...p, image: '/images/products/image7.jpg', secondaryImage: '/images/products/image8.jpg' };
          } else if (imageIndex === 4) {
            return { ...p, image: '/images/products/image9.jpg', secondaryImage: '/images/products/image10.jpg' };
          } else if (imageIndex === 5) {
            return { ...p, image: '/images/products/image11.jpg', secondaryImage: '/images/products/image12.jpg' };
          } else if (imageIndex === 6) {
            return { ...p, image: '/images/products/image13.jpg', secondaryImage: '/images/products/image14.jpg' };
          } else if (imageIndex === 7) {
            return { ...p, image: '/images/products/image15.jpg', secondaryImage: '/images/products/image16.jpg' };
          }
          return p;
        });
        
        // Filter products: same category, exclude current product, limit to 4
        const related = productsWithImages
          .filter(p => p._id !== id && p.category === product.category)
          .slice(0, 4);
        
        // If not enough products in same category, add random products
        if (related.length < 4) {
          const additional = productsWithImages
            .filter(p => p._id !== id && !related.includes(p))
            .slice(0, 4 - related.length);
          setRelatedProducts([...related, ...additional]);
        } else {
          setRelatedProducts(related);
        }
      }
    } catch (err) {
      console.error('Failed to load related products:', err);
    }
  };

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      console.log('Adding to cart:', { productId: id, quantity });
      const response = await API.post('/cart', {
        productId: id,
        quantity: quantity
      });
      console.log('Cart response:', response.data);
      toast.success('Added to cart successfully!');
      refreshCart();
    } catch (err) {
      console.error('Add to cart error:', err);
      console.error('Error response:', err.response?.data);
      const errorMessage = err.response?.data?.message || 'Failed to add to cart';
      toast.error(errorMessage);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <div className="w-full px-4 sm:px-6 lg:px-12 py-10 sm:py-16">
          {/* Breadcrumb Skeleton */}
          <div className="max-w-7xl mx-auto mb-6 sm:mb-8 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-64"></div>
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 max-w-7xl mx-auto">
            {/* Left Column - Image Skeleton */}
            <div className="animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-2xl mb-6"></div>
              <div className="flex gap-4">
                <div className="w-24 h-24 bg-gray-200 rounded-xl"></div>
                <div className="w-24 h-24 bg-gray-200 rounded-xl"></div>
              </div>
            </div>

            {/* Right Column - Info Skeleton */}
            <div className="animate-pulse space-y-6">
              {/* Category */}
              <div className="h-3 bg-gray-200 rounded w-24"></div>
              
              {/* Product Name */}
              <div className="space-y-3">
                <div className="h-10 bg-gray-200 rounded w-full"></div>
                <div className="h-10 bg-gray-200 rounded w-3/4"></div>
              </div>
              
              {/* Price */}
              <div className="h-10 bg-gray-200 rounded w-32"></div>
              
              {/* Stock Status */}
              <div className="h-5 bg-gray-200 rounded w-28"></div>
              
              {/* Description */}
              <div className="border-t border-gray-200 pt-6 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
              
              {/* Quantity Selector */}
              <div className="border-t border-gray-200 pt-6 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-12 bg-gray-200 rounded w-48"></div>
              </div>
              
              {/* Add to Cart Button */}
              <div className="border-t border-gray-200 pt-6">
                <div className="h-14 bg-gray-200 rounded-full w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-white min-h-screen">
        <div className="w-full px-4 sm:px-6 lg:px-12 py-10 sm:py-16">
          <div className="text-center py-20">
            <p className="text-2xl text-gray-400 font-light mb-6">{error || 'Product not found'}</p>
            <button
              onClick={fetchProduct}
              className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 active:scale-95 transition-all duration-200"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  

  return (
    <div className="bg-white min-h-screen">
      <div className="w-full px-4 sm:px-6 lg:px-12 py-10 sm:py-16">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto mb-6 sm:mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-gray-900 transition-colors">Products</Link>
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 max-w-7xl mx-auto">
          {/* Left Column - Images */}
          <div>
            {/* Main Image */}
            <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden mb-4 sm:mb-6 group cursor-zoom-in">
              {images[selectedImage] ? (
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-32 h-32 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 sm:pb-0 sm:flex-wrap">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl overflow-hidden transition-all duration-200 ${
                      selectedImage === index
                        ? 'ring-2 ring-gray-900 ring-offset-2 scale-105'
                        : 'opacity-60 hover:opacity-100 hover:scale-105'
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-5 sm:space-y-6">
            {/* Category */}
            {product.category && (
              <p className="text-xs text-gray-500 uppercase tracking-widest font-medium">{product.category}</p>
            )}

            {/* Product Name */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="text-3xl sm:text-4xl font-bold text-gray-900">
              ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-3 py-4">
              <div className={`w-2 h-2 rounded-full ${
                product.stock > 0 ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span className="text-sm font-medium text-gray-700">
                {product.stock > 0 ? (
                  <>{product.stock} in stock</>
                ) : (
                  <>Out of stock</>
                )}
              </span>
            </div>

            {/* Description */}
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Description</h2>
              <p className="text-base text-gray-600 leading-relaxed">
                {product.description || 'No description available'}
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="border-t border-gray-200 pt-6">
              <label className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3 block">Quantity</label>
              <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-11 h-11 sm:w-12 sm:h-12 border border-gray-300 rounded-lg hover:bg-gray-100 hover:border-gray-400 active:scale-95 transition-all duration-200 font-medium text-lg"
                >
                  −
                </button>
                <span className="text-xl font-semibold w-12 sm:w-16 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  className="w-11 h-11 sm:w-12 sm:h-12 border border-gray-300 rounded-lg hover:bg-gray-100 hover:border-gray-400 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 font-medium text-lg"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="border-t border-gray-200 pt-6">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || addingToCart}
                className="w-full py-4 bg-gray-900 text-white rounded-full text-base font-semibold hover:bg-gray-800 active:scale-98 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-900 disabled:active:scale-100"
              >
                {addingToCart ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 sm:mt-20 lg:mt-24 max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6 sm:mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct._id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetails;
