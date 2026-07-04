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
  const [localLikes, setLocalLikes] = useState(likes);
  const [hasLiked, setHasLiked] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [localReplies, setLocalReplies] = useState([]);

  const handleLike = () => {
    if (hasLiked) {
      setLocalLikes(l => l - 1);
      setHasLiked(false);
    } else {
      setLocalLikes(l => l + 1);
      setHasLiked(true);
    }
  };

  const handleReplySubmit = () => {
    if (!replyText.trim()) return;
    setLocalReplies([...localReplies, { id: Date.now(), text: replyText, author: 'You (Guest)', date: 'Just now' }]);
    setReplyText('');
    setIsReplying(false);
  };
  const isLong = body?.length > 150;
  const displayBody = isLong && !isExpanded ? body.slice(0, 150) + '...' : body;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="flex gap-4 py-5 border-b border-theme-border last:border-0"
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
          <span className="text-sm font-bold text-theme-text">
            {authorName}
          </span>
          {authorEmail && <span className="text-xs text-theme-muted">{authorEmail}</span>}
          {date && <span className="text-[10px] text-theme-muted font-medium">{date}</span>}
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
            <button 
              onClick={handleLike}
              className={`flex items-center gap-1 text-xs font-semibold transition-colors ${hasLiked ? 'text-primary-600' : 'text-theme-muted hover:text-primary-600'}`}
            >
              <ThumbsUp className={`w-3.5 h-3.5 ${hasLiked ? 'fill-current' : ''}`} />
              {localLikes}
            </button>
          )}
          {!isSupabaseId && (
            <button 
              onClick={() => setIsReplying(!isReplying)}
              className="text-xs font-semibold text-theme-muted hover:text-primary-600 transition-colors"
            >
              Reply
            </button>
          )}
        </div>

        {/* Reply Input */}
        {isReplying && (
          <div className="mt-3 flex gap-2 items-center">
            <input 
              type="text" 
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..." 
              className="flex-1 text-sm bg-theme-bg border border-theme-border rounded-lg px-3 py-1.5 focus:outline-none focus:border-primary-500 text-theme-text transition-colors"
              onKeyDown={(e) => e.key === 'Enter' && handleReplySubmit()}
              autoFocus
            />
            <button 
              onClick={handleReplySubmit}
              disabled={!replyText.trim()}
              className="p-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors shrink-0"
              aria-label="Send reply"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Local Replies List */}
        {localReplies.length > 0 && (
          <div className="mt-3 pl-4 border-l-2 border-theme-border space-y-3">
            {localReplies.map(reply => (
              <div key={reply.id}>
                <div className="flex items-baseline gap-2 mb-0.5">
                  <span className="text-sm font-bold text-theme-text">{reply.author}</span>
                  <span className="text-[10px] text-theme-muted font-medium">{reply.date}</span>
                </div>
                <p className="text-sm text-theme-muted">{reply.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function CommentList({ comments = [], postId, isSupabaseId }) {
  return (
    <section aria-label="Comments section">

      {comments.length === 0 ? (
        <p className="text-theme-muted text-sm text-center py-8">No comments yet. Be the first!</p>
      ) : (
        <div className="card divide-y divide-theme-border overflow-hidden px-4">
          {comments.map((comment, i) => (
            <CommentItem key={comment.id} comment={comment} index={i} isSupabaseId={isSupabaseId} />
          ))}
        </div>
      )}
    </section>
  );
}
