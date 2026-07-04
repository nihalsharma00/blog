import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Menu, X, Rss, PenSquare, BookOpen, Home, Check, ChevronDown, Palette
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { SearchModal } from '../ui/SearchModal';
import { useQuery } from '@tanstack/react-query';
import { fetchPosts } from '../../api/posts';
import { useSubscribe } from '../../hooks/useSubscribe';

const NAV_LINKS = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/category/all', label: 'Latest', icon: BookOpen },
];

const CATEGORIES = [
  { id: 'tech', label: 'Tech' },
  { id: 'travel', label: 'Travel' },
  { id: 'food', label: 'Food' },
  { id: 'fashion', label: 'Fashion' },
  { id: 'study', label: 'Study' },
  { id: 'gaming', label: 'Gaming' },
  { id: 'personal', label: 'Personal' },
  { id: 'news', label: 'News' },
];

const THEMES = [
  { id: 'clean-light', name: 'Clean Light', colors: ['#ffffff', '#f4f4f5', '#111827'] },
  { id: 'cyber-neon', name: 'Cyber Neon', colors: ['#0a061b', '#d946ef', '#f1f5f9'] },
  { id: 'sunset-glass', name: 'Sunset Glass', colors: ['#fff5f3', '#f43f5e', '#4c0519'] },
  { id: 'forest-calm', name: 'Forest Calm', colors: ['#e6eee7', '#579369', '#1b3020'] },
  { id: 'royal-midnight', name: 'Royal Midnight', colors: ['#07122b', '#c69b44', '#f8fafc'] },
];

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { isSubscribed } = useSubscribe();
  const themeDropdownRef = useRef(null);

  const { data: posts = [] } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    staleTime: 5 * 60 * 1000,
  });

  // Track scroll for shadow
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  // Keyboard shortcut: Cmd/Ctrl + K
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // Theme dropdown click outside and escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(e.target)) {
        setThemeDropdownOpen(false);
      }
    };
    const handleEsc = (e) => {
      if (e.key === 'Escape') setThemeDropdownOpen(false);
    };
    
    if (themeDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEsc);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [themeDropdownOpen]);

  const handleSubscribe = () => navigate('/subscribe');

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 dark:bg-[#0f0f13]/90 backdrop-blur-xl shadow-sm shadow-black/5'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group mr-4">
                <div className="w-9 h-9 rounded-xl bg-theme-text flex items-center justify-center transition-transform group-hover:scale-105 group-active:scale-95">
                  <PenSquare className="w-4 h-4 text-theme-bg" />
                </div>
                <span className="text-xl font-black tracking-tight text-theme-text hidden sm:block">
                  Inkwell
                </span>
              </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
              {NAV_LINKS.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950'
                        : 'text-theme-muted hover:text-theme-text hover:bg-theme-border'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}

              <div className="relative" onMouseLeave={() => setDropdownOpen(false)}>
                <button
                  onMouseEnter={() => setDropdownOpen(true)}
                  className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-theme-muted hover:text-theme-text hover:bg-theme-border transition-all duration-200"
                >
                  Topics <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-1 w-48 bg-theme-card border border-theme-border rounded-xl shadow-xl overflow-hidden z-50"
                    >
                      <div className="py-2 grid grid-cols-1">
                        {CATEGORIES.map(cat => (
                          <Link
                            key={cat.id}
                            to={`/category/${cat.id}`}
                            className="px-4 py-2 text-sm text-theme-text hover:bg-primary-50 dark:hover:bg-primary-950 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors block"
                          >
                            {cat.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            {/* Right controls */}
            <div className="flex items-center gap-1">
              {/* Search button */}
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Open search"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-theme-muted hover:text-theme-text hover:bg-theme-border transition-all duration-200"
              >
                <Search className="w-4 h-4" />
                <span className="hidden lg:flex items-center gap-2">
                  <span className="text-theme-muted">Search</span>
                  <kbd className="px-1.5 py-0.5 text-xs bg-theme-bg rounded border border-theme-border">
                    ⌘K
                  </kbd>
                </span>
              </button>

              {/* Theme selector */}
              <div className="relative" ref={themeDropdownRef}>
                <button
                  onClick={() => setThemeDropdownOpen(p => !p)}
                  aria-label="Select theme"
                  aria-expanded={themeDropdownOpen}
                  className="p-2 rounded-lg text-theme-muted hover:text-theme-text hover:bg-theme-border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <Palette className="w-4 h-4" />
                </button>
                <AnimatePresence>
                  {themeDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-2 w-56 bg-theme-card border border-theme-border rounded-xl shadow-xl overflow-hidden z-50"
                    >
                      <div className="py-2 flex flex-col">
                        {THEMES.map(t => (
                          <button
                            key={t.id}
                            onClick={() => { setTheme(t.id); setThemeDropdownOpen(false); }}
                            className={`flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${theme === t.id ? 'bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400 font-medium' : 'text-theme-text hover:bg-theme-border'}`}
                          >
                            <span className="flex items-center gap-3">
                              <span className="flex gap-0.5">
                                {t.colors.map((c, i) => (
                                  <span key={i} className="w-2.5 h-2.5 rounded-full border border-black/10 dark:border-white/10" style={{ backgroundColor: c }} />
                                ))}
                              </span>
                              {t.name}
                            </span>
                            {theme === t.id && <Check className="w-4 h-4 text-primary-600 dark:text-primary-400" />}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Subscribe */}
              <div className="hidden sm:flex items-center ml-1 gap-2">
                {isSubscribed ? (
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" />
                    Subscribed
                  </span>
                ) : (
                  <button
                    onClick={handleSubscribe}
                    className="btn-primary text-sm py-2 px-4"
                    id="header-subscribe-btn"
                  >
                    <Rss className="w-3.5 h-3.5" />
                    Subscribe
                  </button>
                )}
              </div>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 -mr-2 text-theme-muted hover:text-theme-text transition-colors"
                aria-label="Toggle mobile menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="md:hidden overflow-hidden border-t border-theme-border bg-theme-bg"
            >
              <nav className="px-4 py-4 space-y-1">
                {NAV_LINKS.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                        isActive
                          ? 'bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400'
                          : 'text-theme-muted hover:text-theme-text hover:bg-theme-border'
                      }`
                    }
                  >
                    <Icon className="w-5 h-5" />
                    {label}
                  </NavLink>
                ))}
                
                <div className="pt-2 mt-2 border-t border-theme-border">
                  <span className="px-4 text-xs font-bold uppercase text-theme-muted mb-2 block">Categories</span>
                  <div className="grid grid-cols-2 gap-1">
                    {CATEGORIES.map(cat => (
                      <Link
                        key={cat.id}
                        to={`/category/${cat.id}`}
                        onClick={() => setMobileOpen(false)}
                        className="px-4 py-2 text-sm text-theme-text hover:bg-theme-border rounded-lg"
                      >
                        {cat.label}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-2 border-t border-theme-border flex gap-2">
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      handleSubscribe();
                    }}
                    className="btn-primary flex-1 py-2.5"
                  >
                    Subscribe
                  </button>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        posts={posts}
      />
    </>
  );
}
