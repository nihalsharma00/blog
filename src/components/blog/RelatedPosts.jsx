import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { readingTime } from '../../utils/readingTime';
import { truncate } from '../../utils/truncate';

export function RelatedPosts({ posts = [] }) {
  if (!posts.length) return null;

  return (
    <section aria-label="Related articles">
      <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">
        Related Articles
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {posts.slice(0, 3).map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
            >
              <Link
                to={`/post/${post.id}`}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="card overflow-hidden group flex flex-col h-full hover:-translate-y-0.5 transition-all duration-300 block"
              >
                <div className="aspect-[16/9] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  <img
                    src={`https://picsum.photos/seed/post${post.id}/600/338`}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    width={600}
                    height={338}
                  />
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 capitalize mb-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 flex-1 mb-3">
                    {truncate(post.body, 80)}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {readingTime(post.body)}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-600 group-hover:text-primary-500 transition-colors" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
      </div>
    </section>
  );
}
