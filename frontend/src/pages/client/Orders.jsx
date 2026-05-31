import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await API.get('/orders');
      setOrders(res.data.items || res.data.orders || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders.');
    } finally {
      setLoading(false);
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
    });
  };

  const formatAmount = (amount) => {
    if (amount === null || amount === undefined) return '₹0';
    return `₹${Number(amount).toLocaleString('en-IN')}`;
  };

  const totalValue = orders.reduce((sum, order) => sum + (Number(order.totalAmount) || 0), 0);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mb-8 rounded-[32px] border border-gray-200 bg-white px-6 py-8 shadow-sm sm:mb-10 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#C9A84C]">Orders</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-[#0A0A0A] sm:text-5xl">My Orders</h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-base">
            Review every purchase in one clean, premium dashboard with live order status and tracking access.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-[28px] border border-gray-200 bg-white shadow-sm" />
          ))}
        </div>

        <div className="mt-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm animate-pulse sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-48 rounded bg-gray-200" />
                  <div className="h-4 w-32 rounded bg-gray-200" />
                </div>
                <div className="h-7 w-24 rounded-full bg-gray-200" />
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="h-4 w-24 rounded bg-gray-200" />
                <div className="h-4 w-28 rounded bg-gray-200" />
                <div className="h-4 w-20 rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mb-8 rounded-[32px] border border-gray-200 bg-white px-6 py-8 shadow-sm sm:mb-10 sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#C9A84C]">Orders</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-[#0A0A0A] sm:text-5xl">My Orders</h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-base">
              Review every purchase in one place with fast access to payment, delivery, and tracking details.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[420px]">
            <div className="rounded-[24px] border border-gray-200 bg-[#FAFAFA] px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">Orders</p>
              <p className="mt-2 text-2xl font-black text-[#0A0A0A]">{orders.length}</p>
            </div>
            <div className="rounded-[24px] border border-gray-200 bg-[#FAFAFA] px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">Value</p>
              <p className="mt-2 text-2xl font-black text-[#0A0A0A]">{formatAmount(totalValue)}</p>
            </div>
            <div className="rounded-[24px] border border-gray-200 bg-[#FAFAFA] px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">Latest</p>
              <p className="mt-2 text-2xl font-black text-[#0A0A0A]">{orders[0]?.status || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      {error ? (
        <div className="rounded-[28px] border border-red-200 bg-red-50 px-6 py-10 text-center shadow-sm">
          <p className="mb-4 text-lg font-medium text-red-700">{error}</p>
          <button
            onClick={fetchOrders}
            className="rounded-full bg-[#0A0A0A] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
          >
            Retry
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-[28px] border border-gray-200 bg-white px-6 py-20 text-center shadow-sm">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-gray-200 bg-[#FAFAFA]">
            <svg className="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <p className="mb-6 text-xl text-gray-500">No orders yet</p>
          <button
            onClick={() => navigate('/products')}
            className="rounded-full bg-[#C9A84C] px-6 py-3 text-sm font-bold text-[#0A0A0A] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <button
              key={order._id}
              type="button"
              onClick={() => navigate(`/orders/${order._id}`)}
              className="group w-full rounded-[28px] border border-gray-200 bg-white p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-lg sm:p-6"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">Order ID</p>
                  <p className="font-mono text-sm font-semibold text-[#0A0A0A]">{order._id}</p>
                </div>
                <span className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>

              <div className="mt-5 grid gap-3 border-t border-gray-100 pt-5 sm:grid-cols-3">
                <div className="rounded-[22px] bg-[#FAFAFA] px-4 py-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Total</span>
                  <p className="mt-1 font-mono text-base font-bold text-[#0A0A0A]">{formatAmount(order.totalAmount)}</p>
                </div>
                <div className="rounded-[22px] bg-[#FAFAFA] px-4 py-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Date</span>
                  <p className="mt-1 text-sm font-medium text-[#0A0A0A]">{formatDate(order.createdAt)}</p>
                </div>
                <div className="rounded-[22px] bg-[#FAFAFA] px-4 py-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Items</span>
                  <p className="mt-1 text-sm font-medium text-[#0A0A0A]">{order.items?.length || 0}</p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 text-sm text-gray-500">
                <span>Tap to view order details</span>
                <svg className="h-5 w-5 text-[#C9A84C] transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
