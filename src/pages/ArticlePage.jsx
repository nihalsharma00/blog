import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Clock, MessageCircle, Calendar, ArrowLeft } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { AuthorCard } from '../components/blog/AuthorCard';
import { CommentList } from '../components/blog/CommentList';
import { RelatedPosts } from '../components/blog/RelatedPosts';
import { PostNavigation } from '../components/blog/PostNavigation';
import { ReadingProgress } from '../components/ui/ReadingProgress';
import { ShareBar } from '../components/ui/ShareBar';
import { CategoryBadge } from '../components/ui/Badge';
import { SkeletonArticle } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/States';
import { fetchPosts, fetchUsers, fetchPostComments } from '../api/posts';
import { fetchSupabasePost, fetchSupabaseComments } from '../api/supabase';
import { isSupabaseConfigured } from '../lib/supabase';
import { formatDate, mockDate } from '../utils/formatDate';
import { readingTime } from '../utils/readingTime';
import { CategoryTheme, CATEGORY_MAP } from '../components/blog/CategoryTheme';
import { BookmarkButton } from '../components/blog/BookmarkButton';
import { PostActions } from '../components/blog/PostActions';

// Expand short JSONPlaceholder body to full reading experience
function expandContent(body = '') {
  const paragraphs = body.split('\n').filter(Boolean);
  const expanded = [];
  const lorem = [
    'In the rapidly evolving landscape of modern technology, understanding the fundamental principles that drive innovation is more critical than ever. As we navigate through complex systems and intricate architectures, the ability to distill complexity into clarity becomes a core competency.',
    'The intersection of design thinking and engineering excellence creates products that not only function flawlessly but also delight users at every interaction. This holistic approach to building software — where aesthetics and functionality coexist — defines the benchmark of great digital experiences.',
    'Consider the broader implications: when we invest in crafting intuitive interfaces and robust back-end systems, we are not merely writing code. We are shaping how people interact with the world, making previously insurmountable challenges approachable and even enjoyable.',
    'Communities of practice have long understood that knowledge grows fastest at the edges of disciplines. By bringing together diverse perspectives — from product managers and designers to engineers and researchers — we unlock solutions that no single viewpoint could discover alone.',
    'Measurement and iteration form the backbone of any successful digital product. Without clear metrics and the willingness to pivot based on evidence, even the most elegant solutions risk missing their mark. The feedback loop between users, data, and development teams is where magic truly happens.',
    'Looking ahead, the principles of accessibility, performance, and scalability will continue to define what it means to build with excellence. These are not constraints but catalysts — forces that push our creative and technical limits in pursuit of something genuinely valuable.',
  ];

  paragraphs.forEach(p => expanded.push(p));
  lorem.forEach(p => expanded.push(p));
  return expanded;
}

export default function ArticlePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  // Supabase uses UUIDs, JSON uses integers
  const isSupabaseId = Number.isNaN(parseInt(id, 10));
  const postId = isSupabaseId ? id : parseInt(id, 10);

  // --- DEMO MODE DATA ---
  const { data: jsonPosts = [], isLoading: jsonPostsLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    enabled: !isSupabaseId,
    staleTime: 5 * 60 * 1000,
  });
  const { data: users = [] } = useQuery({ queryKey: ['users'], queryFn: fetchUsers, enabled: !isSupabaseId, staleTime: 5 * 60 * 1000 });
  const { data: jsonComments = [], isLoading: jsonCommentsLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => fetchPostComments(postId),
    enabled: !isSupabaseId,
    staleTime: 5 * 60 * 1000,
  });

  // --- FULL MODE DATA ---
  const { data: sbPost, isLoading: sbPostLoading, error: sbPostError } = useQuery({
    queryKey: ['supabase-post', postId],
    queryFn: () => fetchSupabasePost(postId),
    enabled: isSupabaseId && isSupabaseConfigured,
    retry: 1,
  });
  const { data: sbComments = [], isLoading: sbCommentsLoading } = useQuery({
    queryKey: ['supabase-comments', postId],
    queryFn: () => fetchSupabaseComments(postId),
    enabled: isSupabaseId && isSupabaseConfigured,
  });

  const isLoading = isSupabaseId ? sbPostLoading : jsonPostsLoading;

  if (isLoading) {
    return (
      <Layout showSidebar={false}>
        <ReadingProgress />
        <div className="max-w-3xl mx-auto px-4 py-10">
          <SkeletonArticle />
        </div>
      </Layout>
    );
  }

  const post = isSupabaseId ? sbPost : jsonPosts.find(p => p.id === postId);

  if (!post || (isSupabaseId && sbPostError)) {
    return (
      <Layout showSidebar={false}>
        <div className="max-w-3xl mx-auto px-4 py-20">
          <ErrorState message="Post not found. It may have been deleted." />
          <div className="text-center mt-4">
            <Link to="/" className="btn-outline inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  // Resolving post data
  const date = isSupabaseId ? new Date(post.created_at) : mockDate(post.id);
  const comments = isSupabaseId ? sbComments : jsonComments;
  const isCommentsLoading = isSupabaseId ? sbCommentsLoading : jsonCommentsLoading;
  
  // Category mapping
  const categoryTheme = post.category || 'tech';
  const catColorInfo = CATEGORY_MAP[categoryTheme] || CATEGORY_MAP.tech;
  const categoryName = `${catColorInfo.emoji} ${catColorInfo.label}`;

  // Author mapping
  const authorName = isSupabaseId ? (post.profiles?.full_name || post.profiles?.username) : (users.find(u => u.id === post.userId)?.name ?? 'Unknown');
  const authorAvatar = isSupabaseId ? post.profiles?.avatar_url : null;
  const avatarFallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&size=80&background=random&color=fff&bold=true`;
  const authorDesc = isSupabaseId ? 'Passionate writer sharing insights and stories.' : 'Software Engineer & Tech Writer based in San Francisco, CA.';

  // Image mapping
  const coverImage = isSupabaseId ? post.cover_image : `https://picsum.photos/seed/post${post.id}/1200/600`;

  // Content mapping
  const paragraphs = !isSupabaseId ? expandContent(post.body) : [];
  const rt = post.reading_time || readingTime(isSupabaseId ? post.content : paragraphs.join(' '));

  // Navigation (only supported in Demo Mode currently)
  const currentIndex = !isSupabaseId ? jsonPosts.findIndex(p => p.id === postId) : -1;
  const prevPost = !isSupabaseId && currentIndex > 0 ? jsonPosts[currentIndex - 1] : null;
  const nextPost = !isSupabaseId && currentIndex < jsonPosts.length - 1 ? jsonPosts[currentIndex + 1] : null;
  const relatedPosts = !isSupabaseId
    ? jsonPosts.filter(p => p.category === post.category && p.id !== postId).slice(0, 3)
    : []; // could fetch related supabase posts later

  const [showAllComments, setShowAllComments] = useState(false);
  const displayedComments = showAllComments ? comments : comments.slice(0, 2);

  return (
    <CategoryTheme category={categoryTheme}>
      <Layout showSidebar currentPostId={postId}>
        <ReadingProgress />

        {/* Action Bar */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-theme-muted hover:text-primary-600 dark:hover:text-primary-400 transition-colors group"
            aria-label="Back to home"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Articles
          </Link>

          {isSupabaseId && (
            <div className="flex items-center gap-2">
              <BookmarkButton postId={post.id} />
              <PostActions post={post} onDeleted={() => navigate('/')} />
            </div>
          )}
        </div>

        <article aria-label={post.title}>
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            {/* Category + Reading time */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {categoryName && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider text-white shadow-sm" style={{ backgroundColor: catColorInfo.color }}>
                  {categoryName}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-sm text-theme-muted">
                <Clock className="w-3.5 h-3.5" />
                {rt}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-theme-muted">
                <MessageCircle className="w-3.5 h-3.5" />
                {comments.length} comments
              </span>
              <span className="flex items-center gap-1.5 text-sm text-theme-muted">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(date)}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-theme-text leading-tight capitalize mb-6 text-balance">
              {post.title}
            </h1>

            {/* Author */}
            <div className="flex items-center gap-3 pb-6 border-b border-theme-border">
              <img
                src={authorAvatar || avatarFallback}
                alt={authorName}
                className="w-10 h-10 rounded-full object-cover bg-theme-border"
                loading="lazy"
              />
              <div>
                <p className="font-semibold text-theme-text">{authorName}</p>
                <p className="text-sm text-theme-muted">
                  {authorDesc.slice(0, 40)}…
                </p>
              </div>
            </div>
          </motion.header>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="w-full aspect-[16/9] sm:aspect-[2/1] rounded-2xl overflow-hidden mb-12 shadow-lg bg-theme-border"
          >
            {coverImage ? (
              <img
                src={coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-8xl"
                style={{ backgroundColor: `${catColorInfo.color}20`, color: catColorInfo.color }}
              >
                {catColorInfo.emoji}
              </div>
            )}
          </motion.div>

          {/* Content Body */}
          <div className="relative flex flex-col xl:flex-row gap-12">
            {/* Desktop Share Sidebar */}
            <div className="hidden xl:block w-12 flex-shrink-0">
              <div className="sticky top-24">
                <ShareBar title={post.title} />
              </div>
            </div>

            {/* Main Text */}
            <div className="flex-1 min-w-0 max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="prose-content"
              >
                {isSupabaseId ? (
                  <div dangerouslySetInnerHTML={{ __html: post.content }} />
                ) : (
                  <>
                    <p className="text-xl font-medium text-zinc-600 dark:text-zinc-300 leading-relaxed capitalize">
                      {post.body}
                    </p>
                    {paragraphs.map((p, i) => (
                      <div key={i}>
                        <p className={i === 2 ? "border-l-4 border-primary-500 pl-5 py-2 my-8 italic text-zinc-600 dark:text-zinc-400 bg-primary-50 dark:bg-primary-950 rounded-r-xl" : "mb-6"}>
                          {p}
                        </p>
                        {/* Inject an image after every 3rd paragraph (but not the last one) */}
                        {i > 0 && i % 3 === 0 && i < paragraphs.length - 1 && (
                          <div className="my-8 rounded-xl overflow-hidden shadow-md border border-theme-border">
                            <img
                              src={`https://picsum.photos/seed/article${post.id}img${i}/800/400`}
                              alt="Article illustration"
                              className="w-full h-auto object-cover"
                              loading="lazy"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </>
                )}
                
                {/* Tags (Supabase) */}
                {isSupabaseId && post.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                    {post.tags.map(tag => (
                      <span key={tag} className="badge bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm py-1.5 px-3">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Mobile Share */}
              <div className="xl:hidden mt-10 pt-6 border-t border-zinc-100 dark:border-zinc-800 flex justify-center">
                <ShareBar title={post.title} horizontal />
              </div>

              {/* Author Bio */}
              <div className="mt-12">
                <AuthorCard 
                  name={authorName} 
                  avatar={authorAvatar || avatarFallback} 
                  description={authorDesc} 
                />
              </div>

              {/* Prev / Next (JSON only for now) */}
              {!isSupabaseId && (prevPost || nextPost) && (
                <div className="mt-12">
                  <PostNavigation prevPost={prevPost} nextPost={nextPost} />
                </div>
              )}

              {/* Comments */}
              <div className="mt-16" id="comments">
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-8">
                  Comments ({comments.length})
                </h3>
                {isCommentsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
                  </div>
                ) : (
                  <>
                    <CommentList 
                      comments={displayedComments} 
                      postId={postId} 
                      isSupabaseId={isSupabaseId} 
                    />
                    {comments.length > 2 && (
                      <div className="mt-6 text-center">
                        <button 
                          onClick={() => setShowAllComments(!showAllComments)} 
                          className="btn-outline px-6 py-2.5 text-sm font-semibold shadow-sm hover:shadow-md transition-all"
                        >
                          {showAllComments ? 'Show less comments' : `Read all ${comments.length} comments`}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </article>

        {/* Related Posts (JSON only for now) */}
        {!isSupabaseId && relatedPosts.length > 0 && (
          <div className="mt-20 pt-10 border-t border-theme-border">
            <RelatedPosts posts={relatedPosts} />
          </div>
        )}
      </Layout>
    </CategoryTheme>
  );
}
