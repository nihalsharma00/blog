import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { BackToTop } from './components/blog/BackToTop';
import { ScrollToTop } from './components/layout/ScrollToTop';

// Code-split pages
const HomePage      = lazy(() => import('./pages/HomePage'));
const ArticlePage   = lazy(() => import('./pages/ArticlePage'));
const CategoryPage  = lazy(() => import('./pages/CategoryPage'));
const SearchPage    = lazy(() => import('./pages/SearchPage'));
const SubscribePage = lazy(() => import('./pages/SubscribePage'));
const NotFoundPage  = lazy(() => import('./pages/NotFoundPage'));


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

function PageLoader() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0f0f13] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-zinc-900 dark:bg-zinc-100 animate-pulse" />
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-primary-400 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          {/* Global back-to-top button */}
          <BackToTop />
          <ScrollToTop />

          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public routes */}
              <Route path="/"                  element={<HomePage />} />
              <Route path="/post/:id"          element={<ArticlePage />} />
              <Route path="/category/:slug"    element={<CategoryPage />} />
              <Route path="/search"            element={<SearchPage />} />
              <Route path="/subscribe"         element={<SubscribePage />} />



              {/* 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>

          {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
