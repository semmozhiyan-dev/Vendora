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
      const res = await API.get('/cart');
      setCart(res.data.cart || res.data);
    } catch {
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
          <div className={`px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 ${
            toast.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
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

      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-10">Shopping Cart</h1>

        {loading ? (
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="flex-1 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 bg-white border border-gray-100 rounded-xl p-4 shadow-sm animate-pulse">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-7 bg-gray-200 rounded w-24 mt-3"></div>
                  </div>
                  <div className="w-16 h-5 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
            <div className="lg:w-80 flex-shrink-0">
              <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-32 mb-6"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
                <div className="border-t border-gray-100 mt-4 pt-4">
                  <div className="h-5 bg-gray-200 rounded"></div>
                </div>
                <div className="h-12 bg-gray-200 rounded-lg mt-6"></div>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 text-lg mb-4">{error}</p>
            <button
              onClick={fetchCart}
              className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all duration-200 active:scale-98"
            >
              Retry
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-xl text-gray-400 mb-6">Your cart is empty.</p>
            <Link to="/products" className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all duration-200 active:scale-98 inline-block">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Cart Items */}
            <div className="flex-1 space-y-4">
              {items.map((item) => {
                const product = item.product || item;
                const price = item.price ?? product.price ?? 0;
                const isUpdating = updatingItems.has(product._id);
                return (
                  <div key={product._id} className="flex gap-4 bg-white border border-gray-100 rounded-xl p-4 shadow-sm relative transition-all duration-200 hover:shadow-md hover:border-gray-200">
                    {isUpdating && (
                      <div className="absolute inset-0 bg-white/80 rounded-xl flex items-center justify-center z-10 transition-opacity duration-200">
                        <span className="text-sm text-gray-600 font-medium">Updating...</span>
                      </div>
                    )}
                    <img
                      src={product.image || '/images/products/image1.jpg'}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0 transition-transform duration-200 hover:scale-105"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{product.name}</p>
                      <p className="text-gray-500 text-sm mt-0.5">₹{price.toLocaleString()}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <button
                          onClick={() => updateQuantity(product._id, item.quantity - 1)}
                          disabled={isUpdating}
                          className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:border-gray-400 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                        >
                          −
                        </button>
                        <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(product._id, item.quantity + 1)}
                          disabled={isUpdating}
                          className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:border-gray-400 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeItem(product._id)}
                        disabled={isUpdating}
                        className="text-gray-400 hover:text-red-500 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed active:scale-90"
                        aria-label="Remove"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <p className="font-semibold text-gray-900">₹{(price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm sticky top-24">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h2>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal ({items.length} item{items.length !== 1 ? 's' : ''})</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (18% GST)</span>
                    <span>₹{tax.toLocaleString()}</span>
                  </div>
                </div>
                <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between font-semibold text-gray-900">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
                <button
                  onClick={() => navigate('/checkout')}
                  className="mt-6 w-full py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all duration-200 active:scale-98"
                >
                  Proceed to Checkout
                </button>
                <Link
                  to="/products"
                  className="mt-3 block text-center text-sm text-gray-500 hover:text-gray-700 transition-colors duration-150"
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
