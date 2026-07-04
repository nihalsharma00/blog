import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, MessageCircle, ArrowRight } from 'lucide-react';
import { CategoryBadge } from '../ui/Badge';
import { formatDate, mockDate } from '../../utils/formatDate';
import { truncate } from '../../utils/truncate';
import { readingTime } from '../../utils/readingTime';
import { CATEGORY_MAP } from './CategoryTheme';

export function FeaturedHero({ post, user, commentsCount = 0 }) {
  if (!post) return null;

  const date = mockDate(post.id);
  const rt = readingTime(post.body);
  const catColorInfo = CATEGORY_MAP[post.category] || CATEGORY_MAP.tech;
  const categoryName = `${catColorInfo.emoji} ${catColorInfo.label}`;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative rounded-3xl overflow-hidden mb-12 group"
      aria-label="Featured article"
    >
      {/* Background Image */}
      <div className="relative aspect-[16/7] min-h-[360px] max-h-[520px]">
        <img
          src={`https://picsum.photos/seed/post${post.id}/1400/700`}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          width={1400}
          height={700}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 lg:p-10">
        <div className="max-w-2xl">
          {/* Featured tag */}
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-sm text-white border border-white/30">
              ✦ Featured
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider text-white shadow-sm" style={{ backgroundColor: catColorInfo.color }}>
              {categoryName}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight capitalize mb-3 text-balance">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-5 line-clamp-2 max-w-xl">
            {truncate(post.body, 140)}
          </p>

          {/* Meta + CTA */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Author */}
              {user && (
                <div className="flex items-center gap-2.5">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&size=72&background=random&color=fff&bold=true`}
                    alt={user.name}
                    className="w-9 h-9 rounded-full border-2 border-white/40"
                    width={36}
                    height={36}
                  />
                  <div>
                    <p className="text-sm font-semibold text-white">{user.name}</p>
                    <p className="text-xs text-white/60">{formatDate(date)}</p>
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center gap-3 text-white/60 text-xs ml-2">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {rt}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-3.5 h-3.5" />
                  {commentsCount}
                </span>
              </div>
            </div>

            {/* CTA */}
            <Link
              to={`/post/${post.id}`}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-zinc-900 text-sm font-bold hover:bg-primary-50 transition-colors duration-200 group/btn self-start sm:self-auto flex-shrink-0"
            >
              Read Article
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
