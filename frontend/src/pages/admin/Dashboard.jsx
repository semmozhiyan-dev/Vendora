import { useState, useEffect } from "react";
import API from "../../api/axios";
import { CardSkeleton } from "../../components/common/Skeleton";

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/dashboard");
      // Backend returns: { success, message, data: { totalUsers, totalOrders, totalRevenue, recentOrders } }
      setData(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="rounded-[28px] border border-gray-200 bg-white px-6 py-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#C9A84C]">Overview</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-[#0A0A0A]">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[28px] border border-gray-200 bg-white py-16 text-center shadow-sm">
        <p className="text-lg text-gray-500">Failed to load dashboard</p>
        <button
          onClick={fetchDashboardData}
          className="mt-4 rounded-full bg-[#0A0A0A] px-5 py-2.5 font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Revenue",
      value: `$${data?.totalRevenue?.toLocaleString() || 0}`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "bg-[#0A0A0A]",
    },
    {
      title: "Total Orders",
      value: data?.totalOrders || 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      color: "bg-[#1F2937]",
    },
    {
      title: "Total Products",
      value: data?.totalProducts || 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      color: "bg-[#C9A84C]",
    },
    {
      title: "Total Users",
      value: data?.totalUsers || 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: "bg-[#374151]",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-[28px] border border-gray-200 bg-white px-6 py-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#C9A84C]">Overview</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-[#0A0A0A]">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stat Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className={`${stat.color} p-5 text-white`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/80">{stat.title}</p>
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className="rounded-2xl bg-white/15 p-3 backdrop-blur-sm">
                  {stat.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders Table */}
      <div className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 bg-[#FAFAFA] px-6 py-4">
          <h2 className="text-xl font-bold text-[#0A0A0A]">Recent Orders</h2>
          <p className="mt-1 text-sm text-gray-600">Latest orders from your customers</p>
        </div>
        
        <div className="overflow-x-auto">
          {data?.recentOrders && data.recentOrders.length > 0 ? (
            <table className="w-full">
              <thead className="bg-[#FAFAFA]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.24em] text-gray-600">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.24em] text-gray-600">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.24em] text-gray-600">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.24em] text-gray-600">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.24em] text-gray-600">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        #{order._id.slice(-8).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{order.user?.name || "N/A"}</span>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      <span className="text-sm font-semibold text-purple-600">
                        ${order.totalAmount?.toFixed(2) || "0.00"}
                      </span>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "shipped"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "processing"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="px-6 py-16 text-center">
              <p className="text-lg text-gray-500">No orders yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;