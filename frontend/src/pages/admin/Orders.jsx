import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import API from "../../api/axios";
import { TableRowSkeleton } from "../../components/common/Skeleton";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await API.get("/admin/orders");
      // Handle different response structures
      const orderList = res.data.data?.data || res.data.data || res.data.orders || res.data;
      setOrders(Array.isArray(orderList) ? orderList : []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(orderId);
      await API.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      
      toast.success("Order status updated successfully!");
      
      // Update local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to update status";
      toast.error(errorMessage);
      // Revert on error by refetching
      fetchOrders();
    } finally {
      setUpdatingStatus(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="rounded-[28px] border border-gray-200 bg-white px-6 py-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#C9A84C]">Operations</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-[#0A0A0A]">Orders</h1>
          <p className="mt-1 text-sm text-gray-600">Manage customer orders and track deliveries</p>
        </div>
        <div className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-100 bg-[#FAFAFA]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.24em] text-gray-600">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.24em] text-gray-600">
                    User Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.24em] text-gray-600">
                    Total Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.24em] text-gray-600">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-[0.24em] text-gray-600">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[28px] border border-gray-200 bg-white py-16 text-center shadow-sm">
        <p className="text-lg text-gray-500">Failed to load orders</p>
        <button
          onClick={fetchOrders}
          className="mt-4 rounded-full bg-[#0A0A0A] px-5 py-2.5 font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-[28px] border border-gray-200 bg-white px-6 py-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#C9A84C]">Operations</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-[#0A0A0A]">Orders</h1>
        <p className="mt-1 text-sm text-gray-600">Manage customer orders and track deliveries</p>
      </div>

      {/* Orders Table */}
      {orders.length > 0 ? (
        <div className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-100 bg-[#FAFAFA]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.24em] text-gray-600">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.24em] text-gray-600">
                    User Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.24em] text-gray-600">
                    Total Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.24em] text-gray-600">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-[0.24em] text-gray-600">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    {/* Order ID */}
                    <td className="px-6 py-3 whitespace-nowrap">
                      <span className="text-sm font-medium text-[#0A0A0A]">
                        #{order._id.slice(-8).toUpperCase()}
                      </span>
                    </td>

                    {/* User Email */}
                    <td className="px-6 py-3 whitespace-nowrap">
                      <span className="text-sm text-[#0A0A0A]">
                        {order.user?.email || "N/A"}
                      </span>
                    </td>

                    {/* Total Amount */}
                    <td className="px-6 py-3 whitespace-nowrap">
                      <span className="text-base font-bold text-[#0A0A0A]">
                        ${order.totalAmount?.toFixed(2) || "0.00"}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-3 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        disabled={updatingStatus === order._id}
                        className="rounded-2xl border border-gray-200 bg-[#FAFAFA] px-3 py-1.5 text-sm font-medium text-[#0A0A0A] transition-all focus:border-[#C9A84C] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 hover:border-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
                        style={{
                          color:
                            order.status === "DELIVERED"
                              ? "#166534"
                              : order.status === "SHIPPED"
                              ? "#1e40af"
                              : order.status === "PAID"
                              ? "#4338ca"
                              : order.status === "PENDING"
                              ? "#ca8a04"
                              : "#374151",
                        }}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="PAID">PAID</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                      </select>
                    </td>

                    {/* Action */}
                    <td className="px-6 py-3 whitespace-nowrap text-right">
                      <button
                        className="text-sm font-semibold text-[#C9A84C] transition-colors hover:text-[#0A0A0A]"
                        title="View details"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-[28px] border border-gray-200 bg-white py-16 text-center shadow-sm">
          <p className="text-lg text-gray-500">No orders yet</p>
        </div>
      )}
    </div>
  );
}

export default Orders;