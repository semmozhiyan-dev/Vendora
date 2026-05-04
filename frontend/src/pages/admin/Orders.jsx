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
      <div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Orders</h1>
          <p className="text-gray-600 mt-1">Manage customer orders and track deliveries</p>
        </div>
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    User Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Total Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
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
      <div className="bg-white rounded-xl shadow-md border border-gray-100 py-16 text-center">
        <p className="text-gray-500 text-lg">Failed to load orders</p>
        <button
          onClick={fetchOrders}
          className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Orders</h1>
        <p className="text-gray-600 mt-1">Manage customer orders and track deliveries</p>
      </div>

      {/* Orders Table */}
      {orders.length > 0 ? (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    User Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Total Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    {/* Order ID */}
                    <td className="px-6 py-3 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        #{order._id.slice(-8).toUpperCase()}
                      </span>
                    </td>

                    {/* User Email */}
                    <td className="px-6 py-3 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {order.user?.email || "N/A"}
                      </span>
                    </td>

                    {/* Total Amount */}
                    <td className="px-6 py-3 whitespace-nowrap">
                      <span className="text-base font-bold text-purple-600">
                        ${order.totalAmount?.toFixed(2) || "0.00"}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-3 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        disabled={updatingStatus === order._id}
                        className="px-3 py-1.5 text-sm font-medium border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all hover:border-purple-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300"
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
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
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
        <div className="bg-white rounded-xl shadow-md border border-gray-100 py-16 text-center">
          <p className="text-gray-500 text-lg">No orders yet</p>
        </div>
      )}
    </div>
  );
}

export default Orders;