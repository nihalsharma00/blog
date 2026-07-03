import { Link } from 'react-router-dom';
import { Mail, Globe } from 'lucide-react';

export function AuthorCard({ user }) {
  if (!user) return null;

  return (
    <div className="card p-6 flex flex-col sm:flex-row gap-5">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <img
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&size=160&background=random&color=fff&bold=true`}
          alt={user.name}
          className="w-20 h-20 rounded-2xl object-cover"
          width={80}
          height={80}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{user.name}</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">@{user.username}</p>
          </div>
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
          {user.name} is a contributing writer at Inkwell, exploring topics at the intersection of technology,
          design, and society. Based in {user.address?.city || 'the internet'}.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          {user.email && (
            <a
              href={`mailto:${user.email}`}
              className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              {user.email}
            </a>
          )}
          {user.website && (
            <a
              href={`https://${user.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              {user.website}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
