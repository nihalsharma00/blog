import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  TrendingUp, Clock, Tag, Hash, Mail,
  ChevronRight, Flame, CheckCircle2
} from 'lucide-react';

// Inline SVG social icons
const TwitterIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
const GithubIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
  </svg>
);
const LinkedinIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);
import { fetchPosts, fetchAlbums, fetchUsers, fetchComments } from '../../api/posts';
import { formatDate, mockDate } from '../../utils/formatDate';
import { truncate, extractTags } from '../../utils/truncate';
import { readingTime } from '../../utils/readingTime';
import { slugify } from '../../utils/slugify';
import { SkeletonSidebar } from '../ui/Skeleton';
import { CategoryBadge } from '../ui/Badge';

function PopularPostItem({ post, rank, commentsCount }) {
  return (
    <Link
      to={`/post/${post.id}`}
      className="flex items-start gap-3 group hover:bg-theme-border/50 -mx-2 px-2 py-2 rounded-xl transition-colors"
    >
      <span className="text-2xl font-black text-theme-border w-7 text-center leading-none mt-0.5 flex-shrink-0">
        {rank}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-theme-text group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 capitalize leading-snug">
          {post.title}
        </p>
        <p className="text-xs text-theme-muted mt-1">{commentsCount} comments · {readingTime(post.body)}</p>
      </div>
    </Link>
  );
}

function RecentPostItem({ post, photo }) {
  return (
    <Link
      to={`/post/${post.id}`}
      className="flex items-start gap-3 group hover:bg-theme-border/50 -mx-2 px-2 py-2 rounded-xl transition-colors"
    >
      <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-theme-border">
        <img
          src={`https://picsum.photos/seed/post${post.id}/100/100`}
          alt=""
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          width={56}
          height={56}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-theme-text group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 capitalize leading-snug">
          {post.title}
        </p>
        <p className="text-xs text-theme-muted mt-1">{formatDate(mockDate(post.id))}</p>
      </div>
    </Link>
  );
}

function NewsletterWidget() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <div className="card p-5 bg-gradient-to-br from-primary-50 to-violet-50 dark:from-primary-950 dark:to-violet-950/30 border-primary-100 dark:border-primary-900">
      <div className="flex items-center gap-2 mb-3">
        <Mail className="w-4 h-4 text-primary-600 dark:text-primary-400" />
        <h3 className="text-sm font-bold text-theme-text">Newsletter</h3>
      </div>
      <p className="text-xs text-theme-muted mb-4 leading-relaxed">
        Get the best articles delivered straight to your inbox. No spam, ever.
      </p>
      {submitted ? (
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
          <CheckCircle2 className="w-4 h-4" />
          You&apos;re subscribed!
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="input text-sm py-2.5"
            required
            aria-label="Email address for newsletter"
          />
          <button type="submit" className="btn-primary w-full justify-center text-sm py-2.5">
            Subscribe Free
          </button>
        </form>
      )}
    </div>
  );
}

export function Sidebar({ currentPostId }) {
  const { data: posts = [], isLoading: postsLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    staleTime: 5 * 60 * 1000,
  });

  const { data: albums = [] } = useQuery({
    queryKey: ['albums'],
    queryFn: fetchAlbums,
    staleTime: 5 * 60 * 1000,
  });

  const { data: comments = [] } = useQuery({
    queryKey: ['comments'],
    queryFn: fetchComments,
    staleTime: 5 * 60 * 1000,
  });

  if (postsLoading) return <SkeletonSidebar />;

  // Comments count per post
  const commentsByPost = {};
  comments.forEach((c) => {
    commentsByPost[c.postId] = (commentsByPost[c.postId] || 0) + 1;
  });

  // Popular: sort by comment count
  const popularPosts = [...posts]
    .filter(p => p.id !== currentPostId)
    .sort((a, b) => (commentsByPost[b.id] || 0) - (commentsByPost[a.id] || 0))
    .slice(0, 5);

  // Recent: reverse chronological (highest id = latest)
  const recentPosts = [...posts]
    .filter(p => p.id !== currentPostId)
    .sort((a, b) => b.id - a.id)
    .slice(0, 4);

  // Tags
  const tags = extractTags(posts.map(p => p.title), 18);

  // Categories (first 10 albums)
  const categories = albums.slice(0, 10);

  const SOCIAL = [
    { label: 'Twitter', icon: TwitterIcon, href: '#', followers: '12.4K' },
    { label: 'GitHub', icon: GithubIcon, href: '#', followers: '8.1K' },
    { label: 'LinkedIn', icon: LinkedinIcon, href: '#', followers: '5.7K' },
  ];

  return (
    <aside className="space-y-6">
      {/* Popular Posts */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="card p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Flame className="w-4 h-4 text-rose-500" />
          <h3 className="section-title mb-0">Popular Posts</h3>
        </div>
        <div className="space-y-1">
          {popularPosts.map((post, i) => (
            <PopularPostItem
              key={post.id}
              post={post}
              rank={i + 1}
              commentsCount={commentsByPost[post.id] || 0}
            />
          ))}
        </div>
      </motion.div>

      {/* Recent Posts */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08 }}
        className="card p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-primary-500" />
          <h3 className="section-title mb-0">Recent Posts</h3>
        </div>
        <div className="space-y-1">
          {recentPosts.map((post) => (
            <RecentPostItem key={post.id} post={post} />
          ))}
        </div>
      </motion.div>

      {/* Newsletter */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.12 }}
      >
        <NewsletterWidget />
      </motion.div>

      {/* Categories */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.16 }}
        className="card p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Tag className="w-4 h-4 text-primary-600" />
          <h3 className="section-title mb-0">Categories</h3>
        </div>
        <ul className="space-y-1">
          {categories.map((album) => (
            <li key={album.id}>
              <Link
                to={`/category/${slugify(album.title)}`}
                className="flex items-center justify-between py-2 px-2 -mx-2 rounded-lg hover:bg-theme-border/50 transition-colors group"
              >
                <span className="text-sm text-theme-text group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors capitalize truncate">
                  {album.title}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-theme-muted group-hover:text-primary-400 flex-shrink-0 ml-2" />
              </Link>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Tags */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="card p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Hash className="w-4 h-4 text-amber-500" />
          <h3 className="section-title mb-0">Popular Tags</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link
              key={tag}
              to={`/search?q=${encodeURIComponent(tag)}`}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-theme-border text-theme-text hover:bg-primary-100 dark:hover:bg-primary-900 hover:text-primary-700 dark:hover:text-primary-300 transition-all duration-200"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Social Follow */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.24 }}
        className="card p-5"
      >
        <h3 className="section-title">Follow Us</h3>
        <div className="space-y-3">
          {SOCIAL.map(({ label, icon: Icon, href, followers }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between hover:bg-theme-border/50 -mx-2 px-2 py-2 rounded-xl transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-theme-border flex items-center justify-center group-hover:bg-primary-100 dark:group-hover:bg-primary-900 transition-colors">
                  <Icon className="w-4 h-4 text-theme-muted group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                </div>
                <span className="text-sm font-semibold text-theme-text">{label}</span>
              </div>
              <span className="text-xs text-theme-muted font-medium">{followers}</span>
            </a>
          ))}
        </div>
      </motion.div>
    </aside>
  );
}
