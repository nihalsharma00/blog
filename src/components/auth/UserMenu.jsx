import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  PenSquare, BookMarked, LogOut, ChevronDown, LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function UserMenu() {
  const { user, profile, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSignOut = async () => {
    setOpen(false);
    try {
      await signOut();
      navigate('/');
    } catch (e) {
      console.error(e);
    }
  };

  const displayName = profile?.full_name || profile?.username || user?.email?.split('@')[0] || 'User';
  const avatarUrl = profile?.avatar_url
    ? profile.avatar_url
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&size=80&background=random&color=fff&bold=true`;

  const MENU_ITEMS = [
    { label: 'My Blogs', icon: LayoutDashboard, to: '/my-blogs' },
    { label: 'Bookmarks', icon: BookMarked, to: '/bookmarks' },
    { label: 'Write New Post', icon: PenSquare, to: '/create', highlight: true },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(p => !p)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="User menu"
        className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
      >
        <img
          src={avatarUrl}
          alt={displayName}
          className="w-8 h-8 rounded-full object-cover border-2 border-primary-200 dark:border-primary-800"
          width={32}
          height={32}
        />
        <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 hidden sm:block ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-[#1a1a24] border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-xl overflow-hidden z-50"
          >
            {/* User info */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
              <img src={avatarUrl} alt="" className="w-9 h-9 rounded-full" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">{displayName}</p>
                <p className="text-xs text-zinc-400 truncate">{user?.email}</p>
              </div>
            </div>

            {/* Nav items */}
            <div className="py-1.5" role="none">
              {MENU_ITEMS.map(({ label, icon: Icon, to, highlight }) => (
                <Link
                  key={to}
                  to={to}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                    highlight
                      ? 'text-primary-600 dark:text-primary-400 font-semibold hover:bg-primary-50 dark:hover:bg-primary-950'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
            </div>

            {/* Sign out */}
            <div className="py-1.5 border-t border-zinc-100 dark:border-zinc-800">
              <button
                role="menuitem"
                onClick={handleSignOut}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
