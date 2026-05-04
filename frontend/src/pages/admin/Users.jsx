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
      <div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-1">Manage registered users</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 py-16 text-center">
        <p className="text-gray-500 text-lg">Failed to load users</p>
        <button
          onClick={fetchUsers}
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
        <h1 className="text-3xl font-bold text-gray-900">Users</h1>
        <p className="text-gray-600 mt-1">Manage registered users</p>
      </div>

      {/* Users Table */}
      {users.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
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
                        <div className="w-9 h-9 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center font-semibold text-white text-sm">
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
                          className="px-3 py-1.5 text-sm font-medium border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300 text-gray-700"
                        >
                          <option value="user">user</option>
                          <option value="admin">admin</option>
                        </select>
                        {currentUser?._id === user._id && (
                          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 border border-gray-300 rounded-md">
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
                          className="text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors"
                          title="View details"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          disabled={deletingUser === user._id || currentUser?._id === user._id}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 py-16 text-center">
          <p className="text-gray-500 text-lg">No users found</p>
        </div>
      )}
    </div>
  );
}

export default Users;