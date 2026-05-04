import { Outlet } from "react-router-dom";

function AdminLayout({ children }) {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-black text-white p-6">
        <h2 className="text-xl font-semibold">Admin Panel</h2>
      </aside>

      <main className="flex-1 p-6">
        {children ?? <Outlet />}
      </main>
    </div>
  );
}

export default AdminLayout;