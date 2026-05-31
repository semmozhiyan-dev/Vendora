import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import API from '../../api/axios';

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingItems, setUpdatingItems] = useState(new Set());
  const [toast, setToast] = useState(null);
  const { refreshCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Fetching cart...');
      const res = await API.get('/cart');
      console.log('Cart response:', res.data);
      const cartData = res.data.cart || res.data;
      console.log('Cart data:', cartData);
      setCart(cartData);
    } catch (err) {
      console.error('Fetch cart error:', err);
      setError('Failed to load cart.');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return removeItem(productId);
    setUpdatingItems(prev => new Set(prev).add(productId));
    try {
      const res = await API.put(`/cart/${productId}`, { quantity });
      setCart(res.data.cart || res.data);
      refreshCart();
      setToast({ type: 'success', message: 'Cart updated successfully' });
    } catch {
      setToast({ type: 'error', message: 'Failed to update quantity' });
    } finally {
      setUpdatingItems(prev => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  };

  const removeItem = async (productId) => {
    if (!confirm('Remove this item from your cart?')) return;
    setUpdatingItems(prev => new Set(prev).add(productId));
    try {
      const res = await API.delete(`/cart/${productId}`);
      setCart(res.data.cart || res.data);
      refreshCart();
      setToast({ type: 'success', message: 'Item removed from cart' });
    } catch {
      setToast({ type: 'error', message: 'Failed to remove item' });
    } finally {
      setUpdatingItems(prev => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  };

  const items = cart?.items || [];
  const subtotal = items.reduce((sum, item) => sum + (item.price ?? item.product?.price ?? 0) * item.quantity, 0);
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + tax;

  return (
    <>
      {toast && (
        <div className="fixed top-20 right-6 z-50 animate-slide-in">
          <div className={`flex items-center gap-3 rounded-2xl border px-5 py-3 shadow-xl ${
            toast.type === 'success' ? 'border-emerald-200 bg-white text-emerald-700' : 'border-red-200 bg-white text-red-700'
          }`}>
            {toast.type === 'success' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mb-8 rounded-[32px] border border-gray-200 bg-white px-6 py-8 shadow-sm sm:mb-10 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#C9A84C]">Cart</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-[#0A0A0A] sm:text-5xl">Shopping cart</h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-base">
            Review your selected items with a clean, calm layout designed to keep the checkout path clear and premium.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
            <div className="flex-1 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 rounded-[28px] border border-gray-200 bg-white p-4 shadow-sm animate-pulse">
                  <div className="h-20 w-20 flex-shrink-0 rounded-2xl bg-gray-200"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-3/4 rounded bg-gray-200"></div>
                    <div className="h-4 w-1/4 rounded bg-gray-200"></div>
                    <div className="mt-3 h-7 w-24 rounded bg-gray-200"></div>
                  </div>
                  <div className="h-5 w-16 rounded bg-gray-200"></div>
                </div>
              ))}
            </div>
            <div className="lg:w-80 flex-shrink-0">
              <div className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm animate-pulse">
                <div className="mb-6 h-6 w-32 rounded bg-gray-200"></div>
                <div className="space-y-3">
                  <div className="h-4 rounded bg-gray-200"></div>
                  <div className="h-4 rounded bg-gray-200"></div>
                  <div className="h-4 rounded bg-gray-200"></div>
                </div>
                <div className="mt-4 border-t border-gray-100 pt-4">
                  <div className="h-5 rounded bg-gray-200"></div>
                </div>
                <div className="mt-6 h-12 rounded-full bg-gray-200"></div>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="py-12 text-center">
            <p className="mb-4 text-lg text-red-500">{error}</p>
            <button
              onClick={fetchCart}
              className="rounded-full bg-[#0A0A0A] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            >
              Retry
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="py-20 text-center sm:py-24">
            <p className="mb-6 text-xl text-gray-500">Your cart is empty.</p>
            <Link to="/products" className="inline-block rounded-full bg-[#0A0A0A] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
            {/* Cart Items */}
            <div className="flex-1 space-y-4">
              {items.map((item) => {
                const product = item.product || item;
                const price = item.price ?? product.price ?? 0;
                const isUpdating = updatingItems.has(product._id);
                return (
                  <div key={product._id} className="relative flex flex-col gap-4 rounded-[28px] border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg sm:flex-row">
                    {isUpdating && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[28px] bg-white/80 transition-opacity duration-200">
                        <span className="text-sm font-medium text-gray-600">Updating...</span>
                      </div>
                    )}
                    <img
                      src={product.image || '/images/products/image1.jpg'}
                      alt={product.name}
                      className="h-40 w-full flex-shrink-0 rounded-2xl object-cover transition-transform duration-200 hover:scale-105 sm:h-24 sm:w-24"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-semibold text-gray-950">{product.name}</p>
                      <p className="mt-1 text-sm text-gray-500">₹{price.toLocaleString()}</p>
                      <div className="mt-3 flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(product._id, item.quantity - 1)}
                          disabled={isUpdating}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-600 transition-all duration-150 hover:-translate-y-0.5 hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          −
                        </button>
                        <span className="w-4 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(product._id, item.quantity + 1)}
                          disabled={isUpdating}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-600 transition-all duration-150 hover:-translate-y-0.5 hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="flex items-end justify-between gap-3 sm:flex-col sm:items-end sm:justify-between sm:gap-0">
                      <button
                        onClick={() => removeItem(product._id)}
                        disabled={isUpdating}
                        className="text-gray-400 transition-all duration-150 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Remove"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <p className="font-mono text-lg font-bold text-[#0A0A0A]">₹{(price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="sticky top-24 rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="mb-6 text-2xl font-bold tracking-tight text-[#0A0A0A]">Order Summary</h2>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex justify-between gap-3">
                    <span>Subtotal ({items.length} item{items.length !== 1 ? 's' : ''})</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span>Shipping</span>
                    <span className="text-emerald-600">Free</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span>Tax (18% GST)</span>
                    <span>₹{tax.toLocaleString()}</span>
                  </div>
                </div>
                <div className="mt-4 flex justify-between border-t border-gray-100 pt-4 font-semibold text-gray-900">
                  <span>Total</span>
                  <span className="font-mono text-lg">₹{total.toLocaleString()}</span>
                </div>
                <button
                  onClick={() => navigate('/checkout')}
                  className="mt-6 w-full rounded-full bg-[#C9A84C] py-4 text-sm font-bold text-[#0A0A0A] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Proceed to Checkout
                </button>
                <Link
                  to="/products"
                  className="mt-3 block text-center text-sm font-medium text-gray-500 transition-colors duration-150 hover:text-[#0A0A0A]"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Cart;
