import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, ArrowLeft, FileQuestion } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#0f0f13] px-4 py-20">
      <title>404 — Page Not Found — Inkwell</title>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        {/* Illustration */}
        <div className="relative mb-8">
          <div className="text-[10rem] font-black text-zinc-100 dark:text-zinc-900 leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-3xl bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center shadow-2xl shadow-primary-500">
              <FileQuestion className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 mb-3">
          Page Not Found
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/" className="btn-primary">
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          <Link to="/search" className="btn-outline">
            <Search className="w-4 h-4" />
            Search Articles
          </Link>
        </div>

        {/* Decorative dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-primary-400 dark:bg-primary-700"
              animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
