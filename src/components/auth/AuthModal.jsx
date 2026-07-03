import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, PenSquare } from 'lucide-react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { useAuth } from '../../context/AuthContext';

const DISMISS_KEY = 'auth_modal_dismissed_until';
const DISMISS_HOURS = 24;

export function AuthModal() {
  const { isAuthenticated, loading, isSupabaseConfigured, isAuthModalOpen, authModalTab, openAuthModal, closeAuthModal } = useAuth();
  const timerRef = useRef(null);

  useEffect(() => {
    if (loading || isAuthenticated || !isSupabaseConfigured) return;

    // Check if user dismissed recently (stored in localStorage for UI prefs only)
    const dismissedUntil = localStorage.getItem(DISMISS_KEY);
    if (dismissedUntil && Date.now() < parseInt(dismissedUntil, 10)) return;

    // Show after 4 seconds for guests
    timerRef.current = setTimeout(() => {
      openAuthModal('login');
    }, 4000);

    return () => clearTimeout(timerRef.current);
  }, [loading, isAuthenticated, isSupabaseConfigured, openAuthModal]);

  const handleDismiss = () => {
    closeAuthModal();
    // Store dismissal for 24 hours (UI preference only — not auth data)
    localStorage.setItem(DISMISS_KEY, String(Date.now() + DISMISS_HOURS * 60 * 60 * 1000));
  };

  const handleSuccess = () => {
    closeAuthModal();
  };

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') handleDismiss(); };
    if (isAuthModalOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isAuthModalOpen]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = isAuthModalOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isAuthModalOpen]);

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="auth-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={handleDismiss}
          />

          {/* Modal */}
          <motion.div
            key="auth-modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            role="dialog"
            aria-modal="true"
            aria-label={authModalTab === 'login' ? 'Sign in' : 'Create account'}
          >
            <div className="bg-theme-card rounded-2xl shadow-2xl w-full max-w-md border border-theme-border overflow-hidden relative">
              {/* Close Button */}
              <button
                onClick={handleDismiss}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-theme-muted hover:text-theme-text hover:bg-theme-border transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {!isSupabaseConfigured ? (
                <div className="p-8 text-center mt-4">
                  <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <PenSquare className="w-8 h-8 text-rose-600 dark:text-rose-400" />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">Setup Required</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">
                    Authentication requires Supabase setup. Please add your credentials to the <code>.env.local</code> file and follow the README instructions to use Full Mode.
                  </p>
                  <button onClick={handleDismiss} className="btn-outline w-full py-2.5">
                    Close
                  </button>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-theme-border">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-theme-text flex items-center justify-center">
                        <PenSquare className="w-4 h-4 text-theme-bg" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-theme-text">
                          {authModalTab === 'login' ? 'Welcome back' : 'Join Inkwell'}
                        </h2>
                        <p className="text-xs text-theme-muted">
                          {authModalTab === 'login' ? 'Sign in to your account' : 'Create your free account'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Forms */}
                  <div className="p-6">
                    {authModalTab === 'login' ? (
                      <LoginForm onSuccess={handleSuccess} />
                    ) : (
                      <RegisterForm onSuccess={handleSuccess} />
                    )}
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-4 bg-theme-bg border-t border-theme-border text-center">
                    <p className="text-sm text-theme-muted">
                      {authModalTab === 'login' ? "Don't have an account? " : 'Already have an account? '}
                      <button
                        onClick={() => openAuthModal(authModalTab === 'login' ? 'register' : 'login')}
                        className="font-bold text-theme-text hover:underline focus:outline-none"
                      >
                        {authModalTab === 'login' ? 'Sign up' : 'Log in'}
                      </button>
                    </p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
