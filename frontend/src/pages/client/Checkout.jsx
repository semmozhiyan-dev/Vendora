import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import API from '../../api/axios';

const formatINR = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Math.round(Number(value) || 0));

function Checkout() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });
  const { refreshCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const openRazorpayModal = (razorpayOrderId, orderId, amount, razorpayKey) => {
    const options = {
      key: razorpayKey,
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      order_id: razorpayOrderId,
      name: 'Vendora',
      description: 'Order Payment',
      handler: async (response) => {
        try {
          console.log('Payment successful:', response);
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;
          
          // Verify payment on backend
          await API.post('/payment/verify', {
            orderId,
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature
          });
          
          // Refresh cart count (cart will be cleared on backend)
          refreshCart();
          
          // Navigate to success page
          navigate('/order-success', { state: { orderId } });
        } catch (error) {
          console.error('Payment verification failed:', error);
          setToast({ type: 'error', message: 'Payment verification failed. Please contact support.' });
          setSubmitting(false);
        }
      },
      prefill: {
        name: formData.fullName,
        email: formData.email,
        contact: formData.phone
      },
      theme: {
        color: '#111827' // gray-900
      },
      modal: {
        ondismiss: () => {
          setSubmitting(false);
          setToast({ type: 'error', message: 'Payment cancelled. Your order is saved.' });
        }
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await API.get('/cart');
      const cartData = res.data.cart || res.data;
      if (!cartData?.items?.length) {
        navigate('/cart');
        return;
      }
      setCart(cartData);
    } catch {
      navigate('/cart');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert('Failed to load Razorpay. Please check your internet connection.');
        setSubmitting(false);
        return;
      }

      // Step 1: Create order in database
      const orderData = {
        items: items.map(item => ({
          productId: item.product?._id || item.product,
          quantity: item.quantity
        })),
        shippingAddress: {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.pincode,
          country: 'India'
        },
        totalAmount: total
      };

      const orderRes = await API.post('/orders', orderData);
      const orderId = orderRes.data.order?._id || orderRes.data._id;
      
      console.log('Order created:', orderId);

      // Step 2: Create Razorpay order
      const paymentRes = await API.post('/payment/create-order', { orderId });
      const razorpayOrderId = paymentRes.data.razorpayOrderId || paymentRes.data.id;
      const razorpayKey = paymentRes.data.key;
      if (!razorpayKey) {
        throw new Error('Razorpay key missing from payment order response');
      }
      
      console.log('Razorpay order created:', razorpayOrderId);
      
      // Step 3: Open Razorpay payment modal
      openRazorpayModal(razorpayOrderId, orderId, total, razorpayKey);
    } catch (error) {
      console.error('Order creation failed:', error);
      setToast({ type: 'error', message: 'Failed to create order. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <p className="text-sm text-gray-500">Loading checkout...</p>
      </div>
    );
  }

  const items = cart?.items || [];
  const subtotal = items.reduce((sum, item) => {
    const price = Number(item.price ?? item.product?.price ?? 0);
    const quantity = Number(item.quantity) || 0;
    return sum + price * quantity;
  }, 0);
  const shipping = 0;
  const tax = Math.round(subtotal * 0.18);
  const total = Math.round(subtotal + shipping + tax);

  return (
    <>
      {/* Toast Notification */}
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

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mb-8 rounded-[32px] border border-gray-200 bg-white px-6 py-8 shadow-sm sm:mb-10 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#C9A84C]">Checkout</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-[#0A0A0A] sm:text-5xl">Secure checkout</h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-base">A clean and calm checkout layout focused on clarity, trust, and a premium finish.</p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
        {/* Address Form */}
        <div className="flex-1">
          <div className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
            <h2 className="mb-6 text-2xl font-bold tracking-tight text-[#0A0A0A]">Shipping Address</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 transition-all focus:border-[#C9A84C] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20"
                  placeholder="John Doe"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 transition-all focus:border-[#C9A84C] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 transition-all focus:border-[#C9A84C] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="w-full resize-none rounded-2xl border border-gray-200 px-4 py-3 transition-all focus:border-[#C9A84C] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20"
                  placeholder="Street address, apartment, suite, etc."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 transition-all focus:border-[#C9A84C] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20"
                    placeholder="Mumbai"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 transition-all focus:border-[#C9A84C] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20"
                    placeholder="Maharashtra"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                    pattern="[0-9]{6}"
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 transition-all focus:border-[#C9A84C] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20"
                    placeholder="400001"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-6 w-full rounded-full bg-[#C9A84C] py-4 text-sm font-bold text-[#0A0A0A] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? 'Processing...' : 'Place Order'}
              </button>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-96 flex-shrink-0">
          <div className="sticky top-24 rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="mb-6 text-2xl font-bold tracking-tight text-[#0A0A0A]">Order Summary</h2>

            {/* Cart Items */}
            <div className="mb-6 max-h-72 space-y-4 overflow-y-auto">
              {items.map((item) => {
                const product = item.product || item;
                const price = item.price ?? product.price ?? 0;
                return (
                  <div key={product._id} className="flex gap-3">
                    <img
                      src={product.image || '/images/products/image1.jpg'}
                      alt={product.name}
                      className="h-16 w-16 flex-shrink-0 rounded-2xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-950">{product.name}</p>
                      <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                    </div>
                      <p className="font-mono text-sm font-bold text-[#0A0A0A]">{formatINR(price * item.quantity)}</p>
                  </div>
                );
              })}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 border-t border-gray-100 pt-4 text-sm text-gray-600">
              <div className="flex justify-between gap-3">
                <span>Subtotal ({items.length} item{items.length !== 1 ? 's' : ''})</span>
                <span>{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span>Shipping</span>
                <span className="text-emerald-600">Free</span>
              </div>
              <div className="flex justify-between gap-3">
                <span>Tax (18% GST)</span>
                <span>{formatINR(tax)}</span>
              </div>
            </div>

            <div className="mt-4 flex justify-between border-t border-gray-100 pt-4 font-semibold text-gray-900">
              <span>Total</span>
              <span className="font-mono text-lg">{formatINR(total)}</span>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}

export default Checkout;
