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

  const formatAmount = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN')}`;

  const subtotal = order?.items?.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0) || 0;
  const taxAmount = Math.round(subtotal * 0.18);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Header Skeleton */}
        <div className="mb-8 animate-pulse rounded-[32px] border border-gray-200 bg-white px-6 py-8 shadow-sm sm:mb-10 sm:px-8">
          <div className="flex items-start gap-4">
            <div className="h-11 w-11 rounded-2xl bg-gray-200"></div>
            <div className="flex-1">
              <div className="h-8 w-56 rounded bg-gray-200"></div>
              <div className="mt-3 h-4 w-72 rounded bg-gray-200"></div>
            </div>
            <div className="h-8 w-24 rounded-full bg-gray-200"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Content Skeleton */}
          <div className="space-y-6 lg:col-span-2">
            {/* Order Items Skeleton */}
            <div className="animate-pulse rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 h-6 w-32 rounded bg-gray-200"></div>
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="flex gap-4 rounded-[22px] border border-gray-100 bg-[#FAFAFA] p-4">
                    <div className="h-20 w-20 flex-shrink-0 rounded-2xl bg-gray-200"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-5 w-3/4 rounded bg-gray-200"></div>
                      <div className="h-4 w-1/4 rounded bg-gray-200"></div>
                      <div className="h-4 w-1/3 rounded bg-gray-200"></div>
                    </div>
                    <div className="h-5 w-20 rounded bg-gray-200"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address Skeleton */}
            <div className="animate-pulse rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 h-6 w-40 rounded bg-gray-200"></div>
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-gray-200"></div>
                <div className="h-4 w-5/6 rounded bg-gray-200"></div>
                <div className="h-4 w-4/6 rounded bg-gray-200"></div>
                <div className="mt-3 h-4 w-3/6 rounded bg-gray-200"></div>
                <div className="h-4 w-4/6 rounded bg-gray-200"></div>
              </div>
            </div>

            {/* Timeline Skeleton */}
            <div className="animate-pulse rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-6 h-6 w-36 rounded bg-gray-200"></div>
              <div className="space-y-0">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="h-4 w-4 rounded-full bg-gray-200"></div>
                      {i !== 4 && <div className="h-16 w-0.5 bg-gray-200"></div>}
                    </div>
                    <div className={`flex-1 ${i !== 4 ? 'pb-12' : ''}`}>
                      <div className="mb-2 h-5 w-24 rounded bg-gray-200"></div>
                      <div className="h-4 w-32 rounded bg-gray-200"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="space-y-6">
            {/* Order Summary Skeleton */}
            <div className="animate-pulse rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 h-6 w-32 rounded bg-gray-200"></div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <div className="h-4 w-20 rounded bg-gray-200"></div>
                  <div className="h-4 w-16 rounded bg-gray-200"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-4 w-20 rounded bg-gray-200"></div>
                  <div className="h-4 w-16 rounded bg-gray-200"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-4 w-24 rounded bg-gray-200"></div>
                  <div className="h-4 w-16 rounded bg-gray-200"></div>
                </div>
              </div>
              <div className="mt-4 flex justify-between border-t border-gray-100 pt-4">
                <div className="h-5 w-16 rounded bg-gray-200"></div>
                <div className="h-6 w-24 rounded bg-gray-200"></div>
              </div>
            </div>

            {/* Tracking Info Skeleton */}
            <div className="animate-pulse rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 h-6 w-40 rounded bg-gray-200"></div>
              <div className="space-y-3">
                <div>
                  <div className="mb-2 h-4 w-24 rounded bg-gray-200"></div>
                  <div className="h-5 w-full rounded bg-gray-200"></div>
                </div>
                <div>
                  <div className="mb-2 h-4 w-32 rounded bg-gray-200"></div>
                  <div className="h-5 w-3/4 rounded bg-gray-200"></div>
                </div>
              </div>
            </div>

            {/* Order Info Skeleton */}
            <div className="animate-pulse rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 h-6 w-36 rounded bg-gray-200"></div>
              <div className="space-y-3">
                <div>
                  <div className="mb-2 h-4 w-24 rounded bg-gray-200"></div>
                  <div className="h-5 w-full rounded bg-gray-200"></div>
                </div>
                <div>
                  <div className="mb-2 h-4 w-28 rounded bg-gray-200"></div>
                  <div className="h-5 w-full rounded bg-gray-200"></div>
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
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="rounded-[28px] border border-red-200 bg-red-50 px-6 py-12 text-center shadow-sm">
          <p className="mb-4 text-lg font-medium text-red-700">{error || 'Order not found'}</p>
          <button
            onClick={() => navigate('/orders')}
            className="rounded-full bg-[#0A0A0A] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const summaryTax = Math.round(subtotal * 0.18);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* Header */}
      <div className="mb-8 rounded-[32px] border border-gray-200 bg-white px-6 py-8 shadow-sm sm:mb-10 sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <button
              onClick={() => navigate('/orders')}
              className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-200 bg-[#FAFAFA] text-gray-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:bg-white"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#C9A84C]">Order details</p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-[#0A0A0A] sm:text-5xl">Order Details</h1>
              <p className="mt-3 font-mono text-sm text-gray-500">{order._id}</p>
            </div>
          </div>
          <span className={`inline-flex w-fit rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
        </div>
      </div>

      {/* Delivered Success Banner */}
      {order.status === 'DELIVERED' && (
        <div className="mb-6 rounded-[28px] border border-emerald-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="mb-1 text-lg font-semibold text-[#0A0A0A]">Order Delivered Successfully!</h3>
              <p className="mb-3 text-sm text-gray-600">
                Your order has been delivered. We hope you enjoy your purchase!
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate('/products')}
                  className="rounded-full bg-[#0A0A0A] px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Shop Again
                </button>
                <button
                  className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-sm"
                >
                  Rate Products
                </button>
                <button
                  className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-sm"
                >
                  Need Help?
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Order Items */}
          <div className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-[#0A0A0A]">Order Items</h2>
              <span className="rounded-full border border-gray-200 bg-[#FAFAFA] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                {order.items?.length || 0} Items
              </span>
            </div>
            <div className="space-y-4">
              {order.items?.map((item) => {
                const product = item.product || item;
                return (
                  <div key={item._id || product._id} className="flex gap-4 rounded-[24px] border border-gray-100 bg-[#FAFAFA] p-4 last:border-gray-100">
                    <img
                      src={product.image || '/images/products/image1.jpg'}
                      alt={product.name}
                      className="h-20 w-20 flex-shrink-0 rounded-2xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#0A0A0A]">{product.name}</p>
                      <p className="mt-1 text-sm text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-sm text-gray-500">{formatAmount(item.price)} each</p>
                    </div>
                    <p className="font-semibold text-[#0A0A0A]">{formatAmount(item.price * item.quantity)}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <div className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-[#0A0A0A]">Shipping Address</h2>
              <div className="space-y-1 text-gray-600">
                <p className="font-medium text-[#0A0A0A]">{order.shippingAddress.fullName}</p>
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
            <div className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#C9A84C]">Tracking</p>
                  <h2 className="mt-2 text-lg font-semibold text-[#0A0A0A]">Order Timeline</h2>
                </div>
              </div>
              <Timeline timeline={tracking.timeline} currentStatus={order.status} />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-[#0A0A0A]">Order Summary</h2>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex justify-between gap-4">
                <span>Subtotal</span>
                <span>{formatAmount(subtotal)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Shipping</span>
                <span className="text-emerald-600">Free</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Tax (18% GST)</span>
                <span>{formatAmount(summaryTax)}</span>
              </div>
            </div>
            <div className="mt-4 flex justify-between border-t border-gray-100 pt-4 font-semibold text-[#0A0A0A]">
              <span>Total</span>
              <span className="text-lg">{formatAmount(order.totalAmount)}</span>
            </div>
          </div>

          {/* Tracking Info */}
          {tracking && (
            <div className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-[#0A0A0A]">Tracking Information</h2>
              <div className="space-y-3 text-sm">
                {tracking.trackingId && (
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">Tracking ID</p>
                    <p className="font-mono font-semibold text-[#0A0A0A]">{tracking.trackingId}</p>
                  </div>
                )}
                {tracking.estimatedDelivery && (
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">Estimated Delivery</p>
                    <p className="font-medium text-[#0A0A0A]">{formatDate(tracking.estimatedDelivery)}</p>
                  </div>
                )}
                {!tracking.trackingId && !tracking.estimatedDelivery && (
                  <p className="text-gray-500">Tracking information will be available once the order is shipped.</p>
                )}
              </div>
            </div>
          )}

          {/* Order Info */}
          <div className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-[#0A0A0A]">Order Information</h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">Order Date</p>
                <p className="font-medium text-[#0A0A0A]">{formatDate(order.createdAt)}</p>
              </div>
              {order.paidAt && (
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">Payment Date</p>
                  <p className="font-medium text-[#0A0A0A]">{formatDate(order.paidAt)}</p>
                </div>
              )}
              {order.razorpayPaymentId && (
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">Payment ID</p>
                  <p className="font-mono text-xs text-[#0A0A0A]">{order.razorpayPaymentId}</p>
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
