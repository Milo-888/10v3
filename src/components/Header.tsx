import React, { useState } from 'react';
import { Menu, X, BookOpen, Sun, Moon, Cloud } from 'lucide-react';
import { toast } from 'react-toastify';
import { Link, useLocation } from 'react-router-dom';
import { Theme } from '@radix-ui/themes';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/' },
    { name: 'Create eBook', href: '/create' },
    { name: 'My eBooks', href: '/library' },
    { name: 'Templates', href: '/templates' },
    { name: 'Analytics', href: '/analytics' },
  ];

  const isActive = (href: string) => location.pathname === href;

  const toggleTheme = () => {
    setIsDark(!isDark);
    // In a real app, this would update the Radix theme
  };

  return (
    <Theme appearance={isDark ? "dark" : "light"}>
      <header className="bg-white shadow-sm border-b border-slate-200 dark:bg-slate-900 dark:border-slate-700">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors">
                <BookOpen className="h-8 w-8" />
                <span className="text-xl font-bold">eBookCraft</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-baseline space-x-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              {/* Connect Supabase Button */}
              <button onClick={() => {
                const url = import.meta.env.VITE_SUPABASE_URL;
                const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
                if (url && key) {
                  toast.success('Supabase environment detected. Ready to connect.');
                } else {
                  toast.warn('Supabase env vars missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
                }
              }} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                <Cloud className="h-4 w-4" />
                <span>Connect Supabase</span>
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <button
                onClick={toggleTheme}
                className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                aria-expanded="false"
                aria-label="Toggle navigation menu"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive(item.href)
                        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <button onClick={() => {
                  const url = import.meta.env.VITE_SUPABASE_URL;
                  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
                  if (url && key) {
                    toast.success('Supabase environment detected. Ready to connect.');
                  } else {
                    toast.warn('Supabase env vars missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
                  }
                }} className="flex items-center space-x-2 w-full px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  <Cloud className="h-4 w-4" />
                  <span>Connect Supabase</span>
                </button>
              </div>
            </div>
          )}
        </nav>
      </header>
    </Theme>
  );
};

export default Header;