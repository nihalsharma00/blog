import { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { motion } from 'framer-motion';
import { Mail, CheckCircle2, Rss, Bell, BookOpen, Loader2 } from 'lucide-react';
import { useSubscribe } from '../hooks/useSubscribe';

const PERKS = [
  { icon: Mail, title: 'Weekly Digest', desc: 'Curated articles delivered every Monday morning.' },
  { icon: Bell, title: 'Instant Alerts', desc: 'Be first to read when new articles go live.' },
  { icon: BookOpen, title: 'Exclusive Content', desc: 'Subscriber-only deep-dives and long reads.' },
];

export default function SubscribePage() {
  const { subscribe, isSubscribing, isSubscribed, error: subscribeError } = useSubscribe();
  
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setErrorMsg('');
    try {
      await subscribe(email);
      setSubmitted(true);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to subscribe. Please try again.');
    }
  };

  return (
    <Layout showSidebar={false}>
      <title>Subscribe — Inkwell</title>
      <div className="max-w-2xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 rounded-2xl bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary-500">
            <Rss className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-black text-zinc-900 dark:text-zinc-100 mb-4">
            Stay in the loop
          </h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
            Join over 10,000 curious minds getting weekly insights on technology, design, and the future.
          </p>
        </motion.div>

        {/* Perks */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {PERKS.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="card p-5 text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900 flex items-center justify-center mx-auto mb-3">
                <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1">{title}</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="card p-8 max-w-md mx-auto"
        >
          {submitted || isSubscribed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                You&apos;re subscribed!
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400">
                Welcome to Inkwell. Your first digest lands next Monday.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="sub-name" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  First Name (optional)
                </label>
                <input
                  id="sub-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ada"
                  className="input"
                />
              </div>
              <div>
                <label htmlFor="sub-email" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  id="sub-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ada@lovelace.com"
                  className="input w-full"
                  disabled={isSubscribing}
                />
              </div>

              {errorMsg && (
                <p className="text-sm text-rose-500 font-medium">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={!email || isSubscribing}
                className="btn-primary w-full py-3 mt-2 flex justify-center items-center gap-2"
              >
                {isSubscribing ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Subscribing...</>
                ) : (
                  <>
                    <Rss className="w-4 h-4" />
                    Subscribe for Free
                  </>
                )}
              </button>
              <p className="text-center text-xs text-zinc-400">
                No spam, ever. Unsubscribe at any time.
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </Layout>
  );
}
