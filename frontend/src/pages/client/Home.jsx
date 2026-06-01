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

  useEffect(() => {
    const handleFocus = () => {
      fetchProducts();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await API.get('/products');
      const productList = res.data.items || res.data.products || res.data.data || res.data;
      
      // Add hover images to all 8 products
      const productsWithHover = Array.isArray(productList) ? productList.map((product, index) => {
        if (product.image) {
          return product;
        }

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
    <div className="bg-[#FAFAFA] text-gray-900">
      <section className="relative isolate overflow-hidden border-b border-black/5 bg-[#FAFAFA]">
        <div className="mx-auto grid min-h-screen w-full max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-2 lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <p className="inline-flex items-center rounded-full border border-[#C9A84C]/30 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-[#C9A84C] shadow-sm">
              Premium essentials, curated daily
            </p>
            <h1 className="mt-6 text-5xl font-black tracking-tight text-[#0A0A0A] sm:text-6xl lg:text-7xl lg:leading-[0.92]">
              Elevated style for every
              <span className="block text-[#C9A84C]">modern wardrobe</span>
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-gray-600 sm:text-base">
              Discover refined products selected for quality, clarity, and everyday luxury. Clean silhouettes, considered details, and a premium shopping experience.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button className="inline-flex items-center justify-center rounded-full bg-[#C9A84C] px-8 py-4 text-sm font-bold text-[#0A0A0A] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
                Shop Collection
              </button>
              <button className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-8 py-4 text-sm font-bold text-[#0A0A0A] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-400 hover:shadow-md">
                Explore New Arrivals
              </button>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {['New Season', 'Premium Picks', 'Best Sellers', 'Limited Stock'].map((pill) => (
                <span key={pill} className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm">
                  {pill}
                </span>
              ))}
            </div>
            <div className="mt-10 grid max-w-lg grid-cols-3 gap-4">
              <div className="rounded-3xl border border-gray-200 bg-white px-4 py-5 shadow-sm">
                <p className="text-2xl font-black text-[#0A0A0A]">250+</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-gray-500">Premium products</p>
              </div>
              <div className="rounded-3xl border border-gray-200 bg-white px-4 py-5 shadow-sm">
                <p className="text-2xl font-black text-[#0A0A0A]">4.9/5</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-gray-500">Customer rating</p>
              </div>
              <div className="rounded-3xl border border-gray-200 bg-white px-4 py-5 shadow-sm">
                <p className="text-2xl font-black text-[#0A0A0A]">24h</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-gray-500">Fast support</p>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-2xl">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="overflow-hidden rounded-[32px] border border-gray-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                <img src="/images/products/image1.jpg" alt="Featured product 1" className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
              </div>
              <div className="grid gap-4">
                <div className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                  <img src="/images/products/image2.jpg" alt="Featured product 2" className="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-105" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                    <img src="/images/products/image3.jpg" alt="Featured product 3" className="aspect-square w-full object-cover transition-transform duration-500 hover:scale-105" />
                  </div>
                  <div className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                    <img src="/images/products/image4.jpg" alt="Featured product 4" className="aspect-square w-full object-cover transition-transform duration-500 hover:scale-105" />
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 left-4 rounded-3xl border border-gray-200 bg-white px-5 py-4 shadow-xl sm:left-8">
              <p className="text-xs uppercase tracking-[0.22em] text-gray-500">Curated edit</p>
              <p className="mt-1 text-sm font-semibold text-[#0A0A0A]">Every product is selected for a clean, premium look.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-black/5 bg-[#0A0A0A] py-16 text-white">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#C9A84C]">Showcase</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">Vendora ecommerce showcase</h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-gray-300">
              A clean product showcase video that highlights Vendora’s premium collections and smooth shopping experience across mobile and desktop.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:items-stretch">
            <div className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
              <div className="absolute inset-0 bg-gradient-to-tr from-black/55 via-black/20 to-transparent" />
              <video
                className="h-full min-h-[260px] w-full object-cover sm:min-h-[380px] lg:min-h-[520px]"
                src="/videos/showcase.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />
              <div className="absolute inset-0 flex items-end p-5 sm:p-6 lg:p-8">
                <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div className="max-w-xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#C9A84C]">Featured video</p>
                    <h3 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Vendora in motion</h3>
                    <p className="mt-3 max-w-lg text-sm leading-relaxed text-gray-200 sm:text-base">
                      This video showcases our featured products with a polished look and a smooth, responsive shopping feel.
                    </p>
                  </div>
                  <div className="inline-flex h-10 w-10 items-center justify-center self-start rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-sm sm:self-auto">
                    <span className="h-2 w-2 rounded-full bg-[#C9A84C]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-lg">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#C9A84C]">Responsive</p>
                <h3 className="mt-3 text-xl font-bold text-white">Built for every screen</h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-300">
                  The product visuals stay clean on small screens and expand smoothly on larger displays.
                </p>
              </div>
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-lg">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#C9A84C]">Performance</p>
                <h3 className="mt-3 text-xl font-bold text-white">Lightweight and seamless</h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-300">
                  Auto-play, muted playback keeps the product experience smooth without interrupting the shopping flow.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div className="border-l-4 border-[#C9A84C] pl-4">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#C9A84C]">Featured</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#0A0A0A] sm:text-4xl">Featured products</h2>
            </div>
            <p className="hidden max-w-lg text-sm leading-relaxed text-gray-600 md:block">
              A polished edit of our most-loved items, presented with the clarity and balance of a premium boutique.
            </p>
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
            <div className="rounded-[28px] border border-gray-200 bg-gray-50 px-6 py-12 text-center shadow-sm">
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
            <div className="rounded-[28px] border border-gray-200 bg-gray-50 px-6 py-20 text-center shadow-sm">
              <p className="text-2xl font-semibold text-gray-500">No products available</p>
            </div>
          )}
        </div>
      </section>

      <section className="bg-[#FAFAFA] py-20 sm:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#C9A84C]">Why Vendora</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#0A0A0A] sm:text-4xl">Why choose us</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { title: 'Quality products', description: 'Carefully selected items with a polished finish and dependable craftsmanship.' },
              { title: 'Fair pricing', description: 'A premium shopping experience without unnecessary markup or clutter.' },
              { title: 'Fast delivery', description: 'Smooth fulfillment and reliable shipping that keeps the experience effortless.' },
            ].map((feature, index) => (
              <div key={feature.title} className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0A0A0A] text-[#C9A84C]">
                  <span className="text-lg font-black">0{index + 1}</span>
                </div>
                <h3 className="mt-5 text-xl font-semibold text-[#0A0A0A]">{feature.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0A0A0A] py-20 text-white sm:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#C9A84C]">Ready when you are</p>
          <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">Start shopping today</h2>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-gray-300 sm:text-base">
            Explore a calmer, cleaner, more premium way to shop. Every page is designed to keep the product front and center.
          </p>
          <button className="mt-8 inline-flex items-center justify-center rounded-full bg-[#C9A84C] px-8 py-4 text-sm font-bold text-[#0A0A0A] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
            Browse Collection
          </button>
        </div>
      </section>
    </div>
  );
}

export default Home;