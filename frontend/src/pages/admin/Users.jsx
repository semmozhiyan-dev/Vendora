import { useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import { TableRowSkeleton } from "../../components/common/Skeleton";

function Users() {
  const { user: currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingRole, setUpdatingRole] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await API.get("/admin/users");
      const userList = res.data.data || res.data.users || res.data;
      setUsers(Array.isArray(userList) ? userList : []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      setUpdatingRole(userId);
      await API.put(`/admin/users/${userId}/role`, { role: newRole });
      
      toast.success("User role updated successfully!");
      
      // Update local state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to update role";
      toast.error(errorMessage);
      // Revert on error by refetching
      fetchUsers();
    } finally {
      setUpdatingRole(null);
    }
  };

  const handleDeleteUser = async (user) => {
    // Prevent deleting self
    if (currentUser?._id === user._id) {
      alert("You cannot delete your own account");
      return;
    }

    // Confirm before delete
    const confirmed = window.confirm(
      `Are you sure you want to delete "${user.name || user.email}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeletingUser(user._id);
      await API.delete(`/admin/users/${user._id}`);
      
      // Remove user from UI after success
      setUsers((prevUsers) => prevUsers.filter((u) => u._id !== user._id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    } finally {
      setDeletingUser(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="rounded-[28px] border border-gray-200 bg-white px-6 py-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#C9A84C]">Directory</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-[#0A0A0A]">Users</h1>
          <p className="mt-1 text-sm text-gray-600">Manage registered users</p>
        </div>
        <div className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-100 bg-[#FAFAFA]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.24em] text-gray-600">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.24em] text-gray-600">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.24em] text-gray-600">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.24em] text-gray-600">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-[0.24em] text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
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
        <p className="text-lg text-gray-500">Failed to load users</p>
        <button
          onClick={fetchUsers}
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
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#C9A84C]">Directory</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-[#0A0A0A]">Users</h1>
        <p className="mt-1 text-sm text-gray-600">Manage registered users</p>
      </div>

      {/* Users Table */}
      {users.length > 0 ? (
        <div className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-100 bg-[#FAFAFA]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.24em] text-gray-600">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.24em] text-gray-600">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.24em] text-gray-600">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.24em] text-gray-600">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-[0.24em] text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    {/* User */}
                    <td className="px-6 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0A0A0A] font-semibold text-sm text-white">
                          {user.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user.name || "N/A"}</p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-3 whitespace-nowrap">
                      <span className="text-sm text-gray-700">{user.email}</span>
                    </td>

                    {/* Role */}
                    <td className="px-6 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <select
                          value={user.role || "user"}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          disabled={updatingRole === user._id || currentUser?._id === user._id}
                          className="rounded-2xl border border-gray-200 bg-[#FAFAFA] px-3 py-1.5 text-sm font-medium text-[#0A0A0A] transition-all focus:border-[#C9A84C] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 hover:border-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="user">user</option>
                          <option value="admin">admin</option>
                        </select>
                        {currentUser?._id === user._id && (
                            <span className="rounded-md border border-gray-200 bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                            You
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Joined Date */}
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-600">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-3 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="text-sm font-semibold text-[#C9A84C] transition-colors hover:text-[#0A0A0A]"
                          title="View details"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          disabled={deletingUser === user._id || currentUser?._id === user._id}
                          className="rounded-xl p-2 text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          title={currentUser?._id === user._id ? "Cannot delete yourself" : "Delete user"}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-[28px] border border-gray-200 bg-white py-16 text-center shadow-sm">
          <p className="text-lg text-gray-500">No users found</p>
        </div>
      )}
    </div>
  );
}

export default Users;