import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { useCart } from "../context/CartContext";

function ClientLayout({ children }) {
  const { cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-gray-900">
      <header className="sticky top-0 z-50 border-b border-black/5 bg-white/90 shadow-[0_1px_0_rgba(0,0,0,0.04)] backdrop-blur-xl">
        <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex shrink-0 items-center gap-3" onClick={closeMobileMenu}>
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-sm transition-transform duration-200 hover:scale-105">
              <img src="/images/products/Logo.jpeg" alt="Vendora logo" className="h-full w-full object-contain p-1" />
            </div>
            <div className="leading-tight">
              <span className="block text-lg font-black tracking-tight text-[#0A0A0A]">Vendora</span>
              <span className="text-xs uppercase tracking-[0.24em] text-gray-500">Premium retail</span>
            </div>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link to="/" className="group relative text-sm font-semibold text-gray-700 transition-colors hover:text-[#0A0A0A]">
              Home
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#C9A84C] transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link to="/products" className="group relative text-sm font-semibold text-gray-700 transition-colors hover:text-[#0A0A0A]">
              Products
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#C9A84C] transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link to="/profile" className="group relative text-sm font-semibold text-gray-700 transition-colors hover:text-[#0A0A0A]">
              Profile
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#C9A84C] transition-all duration-300 group-hover:w-full" />
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              className="hidden items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:text-[#0A0A0A] hover:shadow-md sm:inline-flex"
              aria-label="Search"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </button>

            <Link
              to="/cart"
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:text-[#0A0A0A] hover:shadow-md"
              onClick={closeMobileMenu}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#C9A84C] px-1 text-[10px] font-bold text-[#0A0A0A]">
                {cartCount}
              </span>
            </Link>

            <Link
              to="/profile"
              className="hidden h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:text-[#0A0A0A] hover:shadow-md sm:inline-flex"
              onClick={closeMobileMenu}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>

            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:text-[#0A0A0A] hover:shadow-md md:hidden"
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((open) => !open)}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </nav>

        <div className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${mobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"}`} onClick={closeMobileMenu} aria-hidden="true" />
        <div className={`fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] border-r border-white/10 bg-[#0A0A0A] px-5 py-6 text-white shadow-2xl transition-transform duration-300 ease-out md:hidden ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex items-center justify-between border-b border-white/10 pb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-sm">
                <img src="/images/products/Logo.jpeg" alt="Vendora logo" className="h-full w-full object-contain p-1" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-gray-400">Menu</p>
                <p className="mt-1 text-lg font-black text-white">Vendora</p>
              </div>
            </div>
            <button type="button" onClick={closeMobileMenu} className="rounded-full border border-white/10 p-2 text-white transition-colors hover:border-white/20 hover:bg-white/5" aria-label="Close menu">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="mt-6 flex flex-col gap-3">
            <Link to="/" onClick={closeMobileMenu} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10">
              Home
            </Link>
            <Link to="/products" onClick={closeMobileMenu} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10">
              Products
            </Link>
            <Link to="/cart" onClick={closeMobileMenu} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10">
              Cart ({cartCount})
            </Link>
            <Link to="/profile" onClick={closeMobileMenu} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10">
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