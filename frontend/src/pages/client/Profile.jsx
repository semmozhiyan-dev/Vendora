import { useContext, useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

const navItems = [
  { label: "Account Overview", to: "/profile" },
  { label: "My Orders", to: "/profile/orders" },
  { label: "My Details", to: "/profile/details" },
  { label: "Change Password", to: "/profile/password" },
  { label: "Address Book", to: "/profile/addresses" },
  { label: "Preferences", to: "/profile/preferences" },
];

function SidebarLink({ to, children }) {
  return (
    <NavLink
      to={to}
      end={to === "/profile"}
      className={({ isActive }) =>
        `flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-medium transition-colors ${
          isActive
            ? "bg-gray-900 text-white shadow-sm"
            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span>{children}</span>
          <span className={`h-2 w-2 rounded-full ${isActive ? "bg-white" : "bg-gray-300"}`} />
        </>
      )}
    </NavLink>
  );
}

function SectionHeader({ title, description }) {
  return (
    <div className="space-y-1">
      <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
}

function ProfileLayout() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto flex w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <aside className="w-full max-w-xs shrink-0">
          <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="border-b border-gray-100 px-2 pb-4">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-400">Profile</p>
              <h1 className="mt-2 text-2xl font-semibold text-gray-900">My Account</h1>
              <p className="mt-1 text-sm text-gray-500">Manage your account settings</p>
            </div>

            <div className="mt-4 space-y-1">
              {navItems.map((item) => (
                <SidebarLink key={item.to} to={item.to}>
                  {item.label}
                </SidebarLink>
              ))}
            </div>

            <div className="mt-4 border-t border-gray-100 pt-4">
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
              >
                <span>Logout</span>
                <span className="h-2 w-2 rounded-full bg-red-400" />
              </button>
            </div>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <Outlet />
          </div>
        </section>
      </div>
    </div>
  );
}

export function ProfileOverview() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/orders/my");
        const fetchedOrders = response.data?.items || response.data?.orders || [];
        setOrders(fetchedOrders);
      } catch (fetchError) {
        setError("Unable to load your order summary right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  const sortedOrders = [...orders].sort((firstOrder, secondOrder) => {
    const firstDate = new Date(firstOrder.createdAt || 0).getTime();
    const secondDate = new Date(secondOrder.createdAt || 0).getTime();
    return secondDate - firstDate;
  });

  const totalOrders = orders.length;
  const lastOrderStatus = sortedOrders[0]?.status || "No orders yet";

  const getStatusLabel = (status) => {
    if (!status) {
      return "No orders yet";
    }

    return status
      .toString()
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/(^|\s)\S/g, (character) => character.toUpperCase());
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Account Overview"
        description="A quick summary of your profile and recent order activity."
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl border border-gray-200 bg-gray-50 px-6 py-5 shadow-sm lg:col-span-1">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-400">Profile</p>
          <p className="mt-4 text-2xl font-semibold text-gray-900">{user?.name || "Guest user"}</p>
          <p className="mt-2 text-sm text-gray-500">{user?.email || "No email available"}</p>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white px-6 py-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-400">Quick Stat</p>
          <p className="mt-4 text-4xl font-semibold text-gray-900">
            {loading ? "—" : totalOrders}
          </p>
          <p className="mt-2 text-sm text-gray-500">Total orders placed</p>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white px-6 py-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-400">Latest Order</p>
          <p className="mt-4 text-2xl font-semibold text-gray-900">
            {loading ? "Loading..." : getStatusLabel(lastOrderStatus)}
          </p>
          <p className="mt-2 text-sm text-gray-500">Most recent order status</p>
        </div>
      </div>

      {error ? (
        <div className="rounded-3xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
          {error}
        </div>
      ) : null}

      <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white px-6 py-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">Account snapshot</p>
            <p className="mt-1 text-sm text-gray-500">
              {loading
                ? "Fetching your latest profile and order details..."
                : "Your overview is ready for a quick check-in."}
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700">
            <span className={`h-2.5 w-2.5 rounded-full ${loading ? "bg-amber-400" : "bg-emerald-500"}`} />
            {loading ? "Updating" : "Live summary"}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProfileOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/orders/my");
        setOrders(response.data?.items || response.data?.orders || []);
      } catch (fetchError) {
        setError("Unable to load your orders right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) {
      return "N/A";
    }

    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatAmount = (amount) => {
    if (amount === null || amount === undefined) {
      return "₹0";
    }

    return `₹${Number(amount).toLocaleString("en-IN")}`;
  };

  const getStatusClassName = (status) => {
    const classes = {
      PENDING: "bg-yellow-100 text-yellow-800",
      PAID: "bg-blue-100 text-blue-800",
      SHIPPED: "bg-purple-100 text-purple-800",
      DELIVERED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800",
      FAILED: "bg-red-100 text-red-800",
    };

    return classes[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="My Orders" description="View your recent purchases and current order status." />

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="animate-pulse rounded-3xl border border-gray-200 bg-white px-5 py-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3">
                  <div className="h-5 w-48 rounded bg-gray-200" />
                  <div className="h-4 w-32 rounded bg-gray-200" />
                </div>
                <div className="h-7 w-24 rounded-full bg-gray-200" />
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="h-4 w-28 rounded bg-gray-200" />
                <div className="h-4 w-28 rounded bg-gray-200" />
                <div className="h-4 w-28 rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-3xl border border-gray-200 bg-gray-50 px-5 py-8 text-sm text-gray-500">
          You have not placed any orders yet.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <button
              key={order._id}
              type="button"
              onClick={() => navigate(`/orders/${order._id}`)}
              className="w-full rounded-3xl border border-gray-200 bg-white px-5 py-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-sm font-medium text-gray-900">Order #{order._id}</p>
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClassName(order.status)}`}>
                      {order.status || "UNKNOWN"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">Date: {formatDate(order.createdAt)}</p>
                </div>

                <div className="text-sm font-medium text-gray-900">{formatAmount(order.totalAmount)}</div>
              </div>

              <div className="mt-5 flex items-center justify-between text-sm text-gray-500">
                <span>Tap to view order details</span>
                <span aria-hidden="true">→</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ProfileDetails() {
  const { user, setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/users/profile");
        const profileData = response.data?.data || {};

        setFormData({
          name: profileData.name || "",
          phone: profileData.phone || "",
        });
      } catch (fetchError) {
        setError("Unable to load your profile details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name || !formData.name.trim()) {
      setError("Name is required.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess(false);

      const response = await api.put("/users/profile", {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
      });

      const updatedUser = response.data?.data || {};

      setFormData({
        name: updatedUser.name || formData.name,
        phone: updatedUser.phone || formData.phone,
      });

      if (setUser) {
        setUser({
          ...user,
          name: updatedUser.name || user.name,
          phone: updatedUser.phone || user.phone,
        });
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (submitError) {
      setError(submitError.response?.data?.message || "Failed to update profile. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <SectionHeader title="My Details" description="Update your basic account information." />
        <div className="space-y-4">
          {[1, 2].map((item) => (
            <div key={item} className="animate-pulse rounded-3xl border border-gray-200 bg-white px-6 py-4 shadow-sm">
              <div className="mb-2 h-4 w-24 rounded bg-gray-200" />
              <div className="h-10 rounded-2xl bg-gray-100" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader title="My Details" description="Update your basic account information." />

      {error ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="rounded-3xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-800">
          ✓ Your profile has been updated successfully.
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={submitting}
            placeholder="Your full name"
            className="mt-3 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm placeholder-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone (optional)
          </label>
          <input
            id="phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={submitting}
            placeholder="Your contact number"
            className="mt-3 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm placeholder-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email (cannot be changed)
          </label>
          <input
            id="email"
            type="email"
            value={user?.email || ""}
            disabled
            className="mt-3 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="rounded-2xl border border-gray-900 bg-gray-900 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

export function ProfilePassword() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.currentPassword || !formData.newPassword) {
      setError("Both current and new password are required.");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess(false);

      await api.put("/users/change-password", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      setFormData({
        currentPassword: "",
        newPassword: "",
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (submitError) {
      setError(submitError.response?.data?.message || "Failed to change password. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Change Password" description="Keep your account secure with a strong password." />

      {error ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="rounded-3xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-800">
          ✓ Your password has been changed successfully.
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
            Current Password
          </label>
          <input
            id="currentPassword"
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            disabled={submitting}
            placeholder="Enter your current password"
            className="mt-3 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm placeholder-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>

        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            id="newPassword"
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            disabled={submitting}
            placeholder="Enter a new password (min. 6 characters)"
            className="mt-3 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm placeholder-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>

        <div className="rounded-3xl border border-gray-100 bg-gray-50 px-5 py-4">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Password requirements:</span>
          </p>
          <ul className="mt-2 space-y-1 text-sm text-gray-600">
            <li>• At least 6 characters long</li>
            <li>• Different from your current password</li>
            <li>• We recommend using a mix of letters, numbers, and symbols</li>
          </ul>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="rounded-2xl border border-gray-900 bg-gray-900 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Updating..." : "Change Password"}
        </button>
      </form>
    </div>
  );
}

export function ProfileAddresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/users/addresses");
      setAddresses(response.data?.data || []);
    } catch (fetchError) {
      setError("Unable to load your addresses.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (address = null) => {
    if (address) {
      setEditingId(address._id);
      setFormData({
        fullName: address.fullName || "",
        phone: address.phone || "",
        addressLine: address.addressLine || "",
        city: address.city || "",
        state: address.state || "",
        pincode: address.pincode || "",
        isDefault: address.isDefault || false,
      });
    } else {
      setEditingId(null);
      setFormData({
        fullName: "",
        phone: "",
        addressLine: "",
        city: "",
        state: "",
        pincode: "",
        isDefault: false,
      });
    }
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.fullName?.trim() || !formData.phone?.trim() || !formData.addressLine?.trim() || !formData.city?.trim() || !formData.state?.trim() || !formData.pincode?.trim()) {
      setError("All fields are required.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      if (editingId) {
        await api.put(`/users/addresses/${editingId}`, formData);
        setSuccess("Address updated successfully.");
      } else {
        await api.post("/users/addresses", formData);
        setSuccess("Address added successfully.");
      }

      await fetchAddresses();
      handleCloseModal();
      setTimeout(() => setSuccess(""), 4000);
    } catch (submitError) {
      setError(submitError.response?.data?.message || "Failed to save address. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?")) {
      return;
    }

    try {
      setError("");
      await api.delete(`/users/addresses/${addressId}`);
      setSuccess("Address deleted successfully.");
      await fetchAddresses();
      setTimeout(() => setSuccess(""), 4000);
    } catch (deleteError) {
      setError(deleteError.response?.data?.message || "Failed to delete address. Please try again.");
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      setError("");
      await api.put(`/users/addresses/${addressId}`, { isDefault: true });
      setSuccess("Default address updated.");
      await fetchAddresses();
      setTimeout(() => setSuccess(""), 4000);
    } catch (updateError) {
      setError(updateError.response?.data?.message || "Failed to update default address. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <SectionHeader title="Address Book" description="Manage your shipping addresses and default delivery location." />
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="animate-pulse rounded-3xl border border-gray-200 bg-white px-6 py-5 shadow-sm">
              <div className="mb-3 h-5 w-32 rounded bg-gray-200" />
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-gray-200" />
                <div className="h-4 w-4/5 rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <SectionHeader title="Address Book" description="Manage your shipping addresses and default delivery location." />
        </div>
        <button
          type="button"
          onClick={() => handleOpenModal()}
          className="rounded-2xl border border-gray-900 bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-gray-800"
        >
          + Add Address
        </button>
      </div>

      {error ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="rounded-3xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-800">
          ✓ {success}
        </div>
      ) : null}

      {addresses.length === 0 ? (
        <div className="rounded-3xl border border-gray-200 bg-gray-50 px-5 py-8 text-center text-sm text-gray-500">
          No addresses yet. Add one to get started.
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((address) => (
            <div key={address._id} className="rounded-3xl border border-gray-200 bg-white px-6 py-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-gray-900">{address.fullName}</h3>
                    {address.isDefault && (
                      <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{address.addressLine}</p>
                  <p className="text-sm text-gray-600">
                    {address.city}, {address.state} {address.pincode}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">Phone: {address.phone}</p>
                </div>

                <div className="flex items-center gap-2">
                  {!address.isDefault && (
                    <button
                      type="button"
                      onClick={() => handleSetDefault(address._id)}
                      className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      Set Default
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleOpenModal(address)}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(address._id)}
                    className="rounded-lg border border-red-300 bg-white px-3 py-2 text-xs font-medium text-red-700 transition-colors hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingId ? "Edit Address" : "Add New Address"}
            </h3>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="modal-fullName" className="block text-sm font-medium text-gray-700">
                  Full Name *
                </label>
                <input
                  id="modal-fullName"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={submitting}
                  placeholder="John Doe"
                  className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm placeholder-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 disabled:bg-gray-50"
                />
              </div>

              <div>
                <label htmlFor="modal-phone" className="block text-sm font-medium text-gray-700">
                  Phone *
                </label>
                <input
                  id="modal-phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={submitting}
                  placeholder="9999999999"
                  className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm placeholder-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 disabled:bg-gray-50"
                />
              </div>

              <div>
                <label htmlFor="modal-addressLine" className="block text-sm font-medium text-gray-700">
                  Address *
                </label>
                <input
                  id="modal-addressLine"
                  type="text"
                  name="addressLine"
                  value={formData.addressLine}
                  onChange={handleChange}
                  disabled={submitting}
                  placeholder="House No., Street, Locality"
                  className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm placeholder-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 disabled:bg-gray-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="modal-city" className="block text-sm font-medium text-gray-700">
                    City *
                  </label>
                  <input
                    id="modal-city"
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    disabled={submitting}
                    placeholder="Mumbai"
                    className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm placeholder-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label htmlFor="modal-state" className="block text-sm font-medium text-gray-700">
                    State *
                  </label>
                  <input
                    id="modal-state"
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    disabled={submitting}
                    placeholder="Maharashtra"
                    className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm placeholder-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 disabled:bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="modal-pincode" className="block text-sm font-medium text-gray-700">
                  PIN Code *
                </label>
                <input
                  id="modal-pincode"
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  disabled={submitting}
                  placeholder="400001"
                  className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm placeholder-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 disabled:bg-gray-50"
                />
              </div>

              <div className="flex items-center gap-2 border-t border-gray-100 pt-4">
                <input
                  id="modal-isDefault"
                  type="checkbox"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleChange}
                  disabled={submitting}
                  className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                />
                <label htmlFor="modal-isDefault" className="text-sm font-medium text-gray-700">
                  Set as default address
                </label>
              </div>

              <div className="flex gap-3 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={submitting}
                  className="flex-1 rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-2xl border border-gray-900 bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-gray-800 disabled:opacity-60"
                >
                  {submitting ? "Saving..." : editingId ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export function ProfilePreferences() {
  return (
    <div className="space-y-4">
      <SectionHeader title="Preferences" description="Control your contact and notification settings." />
      <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-gray-900">Email notifications</p>
            <p className="mt-1 text-sm text-gray-500">Receive updates about orders and account activity.</p>
          </div>
          <div className="rounded-full bg-gray-900 px-3 py-1 text-xs font-medium text-white">On</div>
        </div>
      </div>
    </div>
  );
}

export default ProfileLayout;
