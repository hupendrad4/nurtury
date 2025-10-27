'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Search, User, Menu, X, LogOut } from 'lucide-react';
import { CartIcon } from './CartIcon';
import { useRouter } from 'next/navigation';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    // Clear all auth data
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

    setIsAuthenticated(false);
    setUser(null);

    // Redirect to home
    router.push('/');
    router.refresh();
  };

  return (
    <header className="bg-primary text-white sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🌱</span>
            <div>
              <div className="font-bold text-xl">Nurtury</div>
              <div className="text-xs opacity-90">We Grow Roots</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/products" className="hover:text-accent transition-colors">
              Products
            </Link>
            <Link href="/categories" className="hover:text-accent transition-colors">
              Categories
            </Link>
            <Link href="/about" className="hover:text-accent transition-colors">
              About
            </Link>
            <Link href="/contact" className="hover:text-accent transition-colors">
              Contact
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button className="hover:text-accent transition-colors">
              <Search size={20} />
            </button>

            <CartIcon />

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link href="/orders" className="hover:text-accent transition-colors flex items-center gap-1">
                  <User size={20} />
                  <span className="hidden lg:inline text-sm">{user?.firstName}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="hover:text-accent transition-colors flex items-center gap-1"
                  title="Logout"
                >
                  <LogOut size={20} />
                  <span className="hidden lg:inline text-sm">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="hidden sm:block px-3 py-1 border border-white rounded hover:bg-white hover:text-primary transition-colors text-sm"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="hidden sm:block px-3 py-1 bg-white text-primary rounded hover:bg-accent hover:text-white transition-colors text-sm font-medium"
                >
                  Register
                </Link>
                <Link href="/login" className="sm:hidden hover:text-accent transition-colors">
                  <User size={20} />
                </Link>
              </div>
            )}

            <button
              className="md:hidden hover:text-accent transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/products"
                className="hover:text-accent transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/categories"
                className="hover:text-accent transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Categories
              </Link>
              {isAuthenticated && (
                <Link
                  href="/orders"
                  className="hover:text-accent transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Orders
                </Link>
              )}
              <Link
                href="/about"
                className="hover:text-accent transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="hover:text-accent transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              {!isAuthenticated && (
                <>
                  <Link
                    href="/login"
                    className="hover:text-accent transition-colors pt-4 border-t border-white/20"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="hover:text-accent transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
              {isAuthenticated && (
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-left hover:text-accent transition-colors pt-4 border-t border-white/20"
                >
                  Logout
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
