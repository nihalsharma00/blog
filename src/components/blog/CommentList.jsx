import { useState } from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, Send, Loader2 } from 'lucide-react';


import { formatDate } from '../../utils/formatDate';

function CommentItem({ comment, index, isSupabaseId }) {
  // Deterministic fake like count for Demo Mode, or 0 for real
  const likes = isSupabaseId ? 0 : ((comment.id * 7 + comment.postId * 3) % 30 + 1);

  // Map fields
  const authorName = isSupabaseId ? (comment.profiles?.full_name || comment.profiles?.username) : comment.name;
  const authorEmail = isSupabaseId ? '' : comment.email;
  const authorAvatar = isSupabaseId ? comment.profiles?.avatar_url : null;
  const avatarFallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&size=80&background=random&color=fff&bold=true`;
  const body = isSupabaseId ? comment.content : comment.body;
  const date = isSupabaseId ? formatDate(new Date(comment.created_at)) : null;

  const [isExpanded, setIsExpanded] = useState(false);
  const isLong = body?.length > 150;
  const displayBody = isLong && !isExpanded ? body.slice(0, 150) + '...' : body;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="flex gap-4 py-5 border-b border-zinc-100 dark:border-zinc-800 last:border-0"
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        <img
          src={authorAvatar || avatarFallback}
          alt={authorName}
          className="w-10 h-10 rounded-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-baseline gap-2 mb-1.5">
          <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            {authorName}
          </span>
          {authorEmail && <span className="text-xs text-zinc-400">{authorEmail}</span>}
          {date && <span className="text-[10px] text-zinc-500 font-medium">{date}</span>}
        </div>
        <p className="text-sm text-theme-muted leading-relaxed whitespace-pre-wrap">
          {displayBody}
        </p>
        {isLong && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)} 
            className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline mt-1"
          >
            {isExpanded ? 'Show less comments' : 'Read More'}
          </button>
        )}
        {/* Actions */}
        <div className="flex items-center gap-3 mt-2">
          {!isSupabaseId && (
            <button className="flex items-center gap-1 text-xs font-semibold text-zinc-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              <ThumbsUp className="w-3.5 h-3.5" />
              {likes}
            </button>
          )}
          <button className="text-xs font-semibold text-zinc-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            Reply
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function CommentList({ comments = [], postId, isSupabaseId }) {
  return (
    <section aria-label="Comments section">

      {comments.length === 0 ? (
        <p className="text-zinc-400 text-sm text-center py-8">No comments yet. Be the first!</p>
      ) : (
        <div className="card divide-y divide-zinc-100 dark:divide-zinc-800 overflow-hidden px-4">
          {comments.map((comment, i) => (
            <CommentItem key={comment.id} comment={comment} index={i} isSupabaseId={isSupabaseId} />
          ))}
        </div>
      )}
    </section>
  );
}
