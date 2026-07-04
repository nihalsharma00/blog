import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, MessageCircle, User } from 'lucide-react';
import { CategoryBadge } from '../ui/Badge';
import { formatDate, mockDate } from '../../utils/formatDate';
import { truncate } from '../../utils/truncate';
import { readingTime } from '../../utils/readingTime';
import { BookmarkButton } from './BookmarkButton';
import { CATEGORY_MAP } from './CategoryTheme';

export function PostCard({ post, user, album, commentsCount = 0, index = 0 }) {
  // Handle both Supabase post format and JSONPlaceholder post format
  const isSupabase = !!post.created_at;

  const date = isSupabase ? new Date(post.created_at) : mockDate(post.id);
  const rt = post.reading_time || readingTime(post.body || post.excerpt || post.content || '');
  
  // Category mapping
  const catColorInfo = CATEGORY_MAP[post.category] || CATEGORY_MAP.tech;
  const categoryName = `${catColorInfo.emoji} ${catColorInfo.label}`;

  // Author mapping
  const authorName = isSupabase ? (post.profiles?.full_name || post.profiles?.username) : (user?.name ?? 'Unknown');
  const authorAvatar = isSupabase ? post.profiles?.avatar_url : null;
  const avatarFallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&size=56&background=random&color=fff&bold=true`;

  // Image mapping
  const coverImage = post.cover_image || `https://picsum.photos/seed/post${post.id}/800/450`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <div className="card group flex flex-col h-full overflow-hidden hover:-translate-y-1 transition-all duration-300 relative">
        <Link
          to={`/post/${post.id}`}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex flex-col h-full overflow-hidden block"
          aria-label={`Read article: ${post.title}`}
        >
          {/* Image */}
          <div className="relative overflow-hidden aspect-[16/9] bg-theme-border">
            {post.cover_image === null && isSupabase ? (
               <div
                  className="w-full h-full flex items-center justify-center text-5xl"
                  style={{ backgroundColor: `${catColorInfo.color}20`, color: catColorInfo.color }}
                >
                  {catColorInfo.emoji}
                </div>
            ) : (
              <img
                src={coverImage}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                width={800}
                height={450}
              />
            )}
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Category badge on image */}
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider text-white shadow-sm" style={{ backgroundColor: catColorInfo.color }}>
                {categoryName}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col flex-1 p-5">
            {/* Title */}
            <h2 className="text-base font-bold text-theme-text group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-snug capitalize line-clamp-2 mb-2">
              {post.title}
            </h2>

            {/* Excerpt */}
            <p className="text-sm text-theme-muted leading-relaxed line-clamp-3 flex-1 mb-4">
              {post.excerpt || truncate(post.body || post.content || '', 110)}
            </p>

            {/* Meta */}
            <div className="flex items-center justify-between mt-auto pt-3 border-t border-theme-border">
              {/* Author */}
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full overflow-hidden bg-theme-text flex items-center justify-center flex-shrink-0">
                  {authorAvatar || authorName ? (
                    <img
                      src={authorAvatar || avatarFallback}
                      alt={authorName}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      width={28}
                      height={28}
                    />
                  ) : (
                    <User className="w-4 h-4 text-theme-bg" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-semibold text-theme-text leading-none">
                    {authorName}
                  </p>
                  <p className="text-[10px] text-theme-muted mt-0.5">{formatDate(date)}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-3 text-xs text-theme-muted">
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
          </div>
        </Link>
        {isSupabase && (
          <div className="absolute top-3 right-3 z-10">
            <BookmarkButton postId={post.id} className="bg-theme-card/90 border border-theme-border backdrop-blur-sm shadow-sm text-theme-text hover:text-primary-500" />
          </div>
        )}
      </div>
    </motion.article>
  );
}
