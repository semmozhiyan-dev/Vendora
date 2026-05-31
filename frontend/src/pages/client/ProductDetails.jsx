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
      <div className="min-h-screen bg-[#FAFAFA]">
        <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          {/* Breadcrumb Skeleton */}
          <div className="mb-6 animate-pulse sm:mb-8">
            <div className="h-4 w-64 rounded bg-gray-200"></div>
          </div>

          {/* Two-column layout */}
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
            {/* Left Column - Image Skeleton */}
            <div className="animate-pulse">
              <div className="mb-6 aspect-square rounded-[32px] bg-gray-200"></div>
              <div className="flex gap-4">
                <div className="h-24 w-24 rounded-2xl bg-gray-200"></div>
                <div className="h-24 w-24 rounded-2xl bg-gray-200"></div>
              </div>
            </div>

            {/* Right Column - Info Skeleton */}
            <div className="animate-pulse space-y-6">
              {/* Category */}
              <div className="h-3 w-24 rounded bg-gray-200"></div>
              
              {/* Product Name */}
              <div className="space-y-3">
                <div className="h-10 w-full rounded bg-gray-200"></div>
                <div className="h-10 w-3/4 rounded bg-gray-200"></div>
              </div>
              
              {/* Price */}
              <div className="h-10 w-32 rounded bg-gray-200"></div>
              
              {/* Stock Status */}
              <div className="h-5 w-28 rounded bg-gray-200"></div>
              
              {/* Description */}
              <div className="space-y-3 border-t border-gray-200 pt-6">
                <div className="h-4 w-24 rounded bg-gray-200"></div>
                <div className="h-4 w-full rounded bg-gray-200"></div>
                <div className="h-4 w-full rounded bg-gray-200"></div>
                <div className="h-4 w-5/6 rounded bg-gray-200"></div>
              </div>
              
              {/* Quantity Selector */}
              <div className="space-y-3 border-t border-gray-200 pt-6">
                <div className="h-4 w-20 rounded bg-gray-200"></div>
                <div className="h-12 w-48 rounded bg-gray-200"></div>
              </div>
              
              {/* Add to Cart Button */}
              <div className="border-t border-gray-200 pt-6">
                <div className="h-14 w-full rounded-full bg-gray-200"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#FAFAFA]">
        <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <div className="rounded-[32px] border border-gray-200 bg-white px-6 py-20 text-center shadow-sm">
            <p className="mb-6 text-2xl font-semibold text-gray-700">{error || 'Product not found'}</p>
            <button
              onClick={fetchProduct}
              className="rounded-full bg-[#0A0A0A] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        {/* Breadcrumb */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="transition-colors hover:text-[#0A0A0A]">Home</Link>
            <span>/</span>
            <Link to="/products" className="transition-colors hover:text-[#0A0A0A]">Products</Link>
            <span>/</span>
            <span className="text-[#0A0A0A]">{product.name}</span>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
          {/* Left Column - Images */}
          <div>
            {/* Main Image */}
            <div className="group mb-4 overflow-hidden rounded-[32px] border border-gray-200 bg-white shadow-sm sm:mb-6 cursor-zoom-in">
              {images[selectedImage] ? (
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  loading="lazy"
                  className="aspect-square w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              ) : (
                <div className="flex aspect-square w-full items-center justify-center bg-gray-50">
                  <svg className="h-32 w-32 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 sm:gap-4 sm:flex-wrap sm:pb-0">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border bg-white transition-all duration-200 sm:h-24 sm:w-24 ${
                      selectedImage === index
                        ? 'border-[#C9A84C] ring-2 ring-[#C9A84C]/30 ring-offset-2 scale-105'
                        : 'border-gray-200 opacity-70 hover:scale-105 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-5 rounded-[32px] border border-gray-200 bg-white p-6 shadow-sm sm:space-y-6 sm:p-8 lg:p-10">
            {/* Category */}
            {product.category && (
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#C9A84C]">{product.category}</p>
            )}

            {/* Product Name */}
            <h1 className="text-4xl font-black tracking-tight text-gray-950 sm:text-5xl">
              {product.name}
            </h1>

            {/* Price */}
            <div className="font-mono text-4xl font-bold text-[#0A0A0A] sm:text-5xl">
              ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-3 py-4">
              <div className={`h-2.5 w-2.5 rounded-full ${
                product.stock > 0 ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span className="text-sm font-semibold text-gray-700">
                {product.stock > 0 ? (
                  <>{product.stock} in stock</>
                ) : (
                  <>Out of stock</>
                )}
              </span>
            </div>

            {/* Description */}
            <div className="border-t border-gray-200 pt-6">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">Description</h2>
              <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
                {product.description || 'No description available'}
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="border-t border-gray-200 pt-6">
              <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">Quantity</label>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-300 bg-white text-lg font-medium transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-400 hover:shadow-sm active:scale-95"
                >
                  −
                </button>
                <span className="w-12 text-center text-xl font-semibold sm:w-16">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-300 bg-white text-lg font-medium transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-400 hover:shadow-sm active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:border-gray-300 disabled:hover:shadow-none"
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
                className="w-full rounded-full bg-[#C9A84C] py-4 text-base font-bold text-[#0A0A0A] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-sm"
              >
                {addingToCart ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mx-auto mt-16 max-w-7xl sm:mt-20 lg:mt-24">
            <h2 className="mb-6 border-l-4 border-[#C9A84C] pl-4 text-3xl font-bold tracking-tight text-[#0A0A0A] sm:mb-8 sm:text-4xl">You May Also Like</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
