import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Timeline from '../../components/client/Timeline';
import API from '../../api/axios';

function OrderDetails() {
  const [order, setOrder] = useState(null);
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrderDetails();
    fetchTracking();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await API.get(`/orders/${id}`);
      setOrder(res.data.order);
    } catch (err) {
      setError('Failed to load order details.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTracking = async () => {
    try {
      const res = await API.get(`/orders/${id}/tracking`);
      setTracking(res.data.tracking);
    } catch (err) {
      console.error('Failed to load tracking:', err);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PAID: 'bg-blue-100 text-blue-800',
      SHIPPED: 'bg-purple-100 text-purple-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
      FAILED: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header Skeleton */}
        <div className="flex items-center gap-4 mb-8 animate-pulse">
          <div className="w-9 h-9 bg-gray-200 rounded-lg"></div>
          <div className="flex-1">
            <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-64"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-20"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items Skeleton */}
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="flex gap-4 pb-4 border-b border-gray-100">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    </div>
                    <div className="h-5 bg-gray-200 rounded w-20"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address Skeleton */}
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                <div className="h-4 bg-gray-200 rounded w-3/6 mt-3"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>

            {/* Timeline Skeleton */}
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-36 mb-6"></div>
              <div className="space-y-0">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-gray-200"></div>
                      {i !== 4 && <div className="w-0.5 h-16 bg-gray-200"></div>}
                    </div>
                    <div className={`flex-1 ${i !== 4 ? 'pb-12' : ''}`}>
                      <div className="h-5 bg-gray-200 rounded w-24 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="space-y-6">
            {/* Order Summary Skeleton */}
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
              <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between">
                <div className="h-5 bg-gray-200 rounded w-16"></div>
                <div className="h-6 bg-gray-200 rounded w-24"></div>
              </div>
            </div>

            {/* Tracking Info Skeleton */}
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
              <div className="space-y-3">
                <div>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-5 bg-gray-200 rounded w-full"></div>
                </div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>

            {/* Order Info Skeleton */}
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-36 mb-4"></div>
              <div className="space-y-3">
                <div>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-5 bg-gray-200 rounded w-full"></div>
                </div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-28 mb-2"></div>
                  <div className="h-5 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center py-12">
          <p className="text-red-500 text-lg mb-4">{error || 'Order not found'}</p>
          <button
            onClick={() => navigate('/orders')}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const subtotal = order.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/orders')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
          <p className="text-sm text-gray-500 mt-1 font-mono">{order._id}</p>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
          {order.status}
        </span>
      </div>

      {/* Delivered Success Banner */}
      {order.status === 'DELIVERED' && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-green-900 mb-1">Order Delivered Successfully!</h3>
              <p className="text-green-700 text-sm mb-3">
                Your order has been delivered. We hope you enjoy your purchase!
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate('/products')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  Shop Again
                </button>
                <button
                  className="px-4 py-2 bg-white border border-green-300 text-green-700 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors"
                >
                  Rate Products
                </button>
                <button
                  className="px-4 py-2 bg-white border border-green-300 text-green-700 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors"
                >
                  Need Help?
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items?.map((item) => {
                const product = item.product || item;
                return (
                  <div key={item._id || product._id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <img
                      src={product.image || '/images/products/image1.jpg'}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                      <p className="text-sm text-gray-500">₹{item.price?.toLocaleString()} each</p>
                    </div>
                    <p className="font-semibold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h2>
              <div className="text-gray-600 space-y-1">
                <p className="font-medium text-gray-900">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}
                </p>
                <p className="pt-2">{order.shippingAddress.phone}</p>
                <p>{order.shippingAddress.email}</p>
              </div>
            </div>
          )}

          {/* Timeline */}
          {tracking?.timeline && tracking.timeline.length > 0 && (
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Timeline</h2>
              <Timeline timeline={tracking.timeline} currentStatus={order.status} />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (18% GST)</span>
                <span>₹{(subtotal * 0.18).toLocaleString()}</span>
              </div>
            </div>
            <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between font-semibold text-gray-900">
              <span>Total</span>
              <span className="text-lg">₹{order.totalAmount?.toLocaleString()}</span>
            </div>
          </div>

          {/* Tracking Info */}
          {tracking && (
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Tracking Information</h2>
              <div className="space-y-3 text-sm">
                {tracking.trackingId && (
                  <div>
                    <p className="text-gray-500 mb-1">Tracking ID</p>
                    <p className="font-mono font-semibold text-gray-900">{tracking.trackingId}</p>
                  </div>
                )}
                {tracking.estimatedDelivery && (
                  <div>
                    <p className="text-gray-500 mb-1">Estimated Delivery</p>
                    <p className="font-medium text-gray-900">{formatDate(tracking.estimatedDelivery)}</p>
                  </div>
                )}
                {!tracking.trackingId && !tracking.estimatedDelivery && (
                  <p className="text-gray-500">Tracking information will be available once the order is shipped.</p>
                )}
              </div>
            </div>
          )}

          {/* Order Info */}
          <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Information</h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-500 mb-1">Order Date</p>
                <p className="font-medium text-gray-900">{formatDate(order.createdAt)}</p>
              </div>
              {order.paidAt && (
                <div>
                  <p className="text-gray-500 mb-1">Payment Date</p>
                  <p className="font-medium text-gray-900">{formatDate(order.paidAt)}</p>
                </div>
              )}
              {order.razorpayPaymentId && (
                <div>
                  <p className="text-gray-500 mb-1">Payment ID</p>
                  <p className="font-mono text-xs text-gray-900">{order.razorpayPaymentId}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;
