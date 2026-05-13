import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { logout } from '../store/authSlice';
import { FiMenu, FiX, FiLogOut, FiHome, FiUser, FiWallet, FiHeadphones } from 'react-icons/fi';
import Toaster from './Toaster';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navigationLinks = [
    {
      label: 'Dashboard',
      href: `/${user?.role}/dashboard`,
      icon: FiHome,
      roles: ['customer', 'partner', 'enterprise', 'admin'],
    },
    {
      label: 'Profile',
      href: '/profile',
      icon: FiUser,
      roles: ['customer', 'partner', 'enterprise', 'admin'],
    },
    {
      label: 'Wallet',
      href: '/wallet',
      icon: FiWallet,
      roles: ['customer', 'partner', 'enterprise'],
    },
    {
      label: 'Support',
      href: '/support',
      icon: FiHeadphones,
      roles: ['customer', 'partner', 'enterprise', 'admin'],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            QuickLift
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <span className="text-gray-700">
                  Welcome, <strong>{user?.name}</strong>
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  <FiLogOut /> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 transition font-semibold"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        {isAuthenticated && (
          <aside
            className={`${
              sidebarOpen ? 'block' : 'hidden'
            } md:block w-64 bg-gray-900 text-white p-6 min-h-screen`}
          >
            <nav className="space-y-4">
              {navigationLinks.map((link) =>
                link.roles.includes(user?.role) ? (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-800 transition"
                  >
                    <link.icon size={20} />
                    {link.label}
                  </Link>
                ) : null
              )}
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>

      {/* Toaster */}
      <Toaster />
    </div>
  );
}
