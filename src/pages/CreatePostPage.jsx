import { Layout } from '../components/layout/Layout';
import { BlogForm } from '../components/blog/BlogForm';
import { motion } from 'framer-motion';
import { PenSquare } from 'lucide-react';

export default function CreatePostPage() {
  return (
    <Layout showSidebar={false}>
      <title>Write New Post — Inkwell</title>
      <div className="max-w-3xl mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center">
              <PenSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100">Write a New Post</h1>
              <p className="text-sm text-zinc-400">Share your ideas with the world</p>
            </div>
          </div>
          <BlogForm mode="create" />
        </motion.div>
      </div>
    </Layout>
  );
}
