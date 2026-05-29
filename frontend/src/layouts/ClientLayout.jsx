import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { useCart } from "../context/CartContext";

function ClientLayout({ children }) {
  const { cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <nav className="w-full px-4 sm:px-6 lg:px-12 py-4 sm:py-5 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0" onClick={closeMobileMenu}>
            <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">Vendora</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-700 hover:text-gray-900 font-medium transition-colors relative group">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-900 transition-all group-hover:w-full"></span>
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-gray-900 font-medium transition-colors relative group">
              Products
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-900 transition-all group-hover:w-full"></span>
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search Icon */}
            <button className="hidden sm:inline-flex p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Search">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Cart */}
            <Link to="/cart" className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors relative" onClick={closeMobileMenu}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {/* Cart Badge */}
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-gray-900 text-white text-xs rounded-full flex items-center justify-center font-medium">
                {cartCount}
              </span>
            </Link>

            {/* User Account */}
            <Link to="/profile" className="hidden sm:inline-flex p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors" onClick={closeMobileMenu}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>

            <button
              type="button"
              className="inline-flex md:hidden p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((open) => !open)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </nav>

        <div className={`${mobileMenuOpen ? "block" : "hidden"} md:hidden border-t border-gray-200 bg-white px-4 py-4`}>
          <div className="flex flex-col gap-3">
            <Link to="/" onClick={closeMobileMenu} className="rounded-xl px-4 py-3 text-left font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900">
              Home
            </Link>
            <Link to="/products" onClick={closeMobileMenu} className="rounded-xl px-4 py-3 text-left font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900">
              Products
            </Link>
            <Link to="/cart" onClick={closeMobileMenu} className="rounded-xl px-4 py-3 text-left font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900">
              Cart ({cartCount})
            </Link>
            <Link to="/profile" onClick={closeMobileMenu} className="rounded-xl px-4 py-3 text-left font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900">
              Profile
            </Link>
          </div>
        </div>
      </header>
      <main className="w-full">{children ?? <Outlet />}</main>
    </div>
  );
}

export default ClientLayout;