export function Badge({ children, variant = 'primary', className = '' }) {
  const variants = {
    primary: 'badge-primary',
    zinc: 'badge-zinc',
    violet: 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300',
    emerald: 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300',
    rose: 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300',
    amber: 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
  };
  return (
    <span className={`${variants[variant] || variants.primary} ${className}`}>
      {children}
    </span>
  );
}

// Rotating category colour palette by album ID
const CATEGORY_COLORS = ['primary', 'violet', 'emerald', 'rose', 'amber'];

export function CategoryBadge({ name, albumId = 1, className = '' }) {
  const variant = CATEGORY_COLORS[(albumId - 1) % CATEGORY_COLORS.length];
  return <Badge variant={variant} className={className}>{name}</Badge>;
}
