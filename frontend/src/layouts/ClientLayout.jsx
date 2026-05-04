import { Link, Outlet } from "react-router-dom";

function ClientLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <nav className="px-6 py-4 flex items-center gap-6">
          <Link to="/" className="text-gray-800 hover:text-black font-medium">
            Home
          </Link>
          <Link to="/products" className="text-gray-800 hover:text-black font-medium">
            Products
          </Link>
          <Link to="/cart" className="text-gray-800 hover:text-black font-medium">
            Cart
          </Link>
          <Link to="/checkout" className="text-gray-800 hover:text-black font-medium">
            Checkout
          </Link>
        </nav>
      </header>
      <main className="p-6">{children ?? <Outlet />}</main>
    </div>
  );
}

export default ClientLayout;