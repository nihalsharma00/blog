export function SkeletonCard() {
  return (
    <div className="card overflow-hidden animate-pulse">
      <div className="skeleton h-48 rounded-none" />
      <div className="p-5 space-y-3">
        <div className="skeleton h-4 w-20 rounded-full" />
        <div className="skeleton h-5 w-full rounded" />
        <div className="skeleton h-5 w-4/5 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="flex items-center gap-3 pt-2">
          <div className="skeleton h-8 w-8 rounded-full" />
          <div className="space-y-1 flex-1">
            <div className="skeleton h-3 w-24 rounded" />
            <div className="skeleton h-3 w-32 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonHero() {
  return (
    <div className="animate-pulse rounded-3xl overflow-hidden">
      <div className="skeleton h-[480px] w-full rounded-3xl" />
    </div>
  );
}

export function SkeletonArticle() {
  return (
    <div className="animate-pulse space-y-6 max-w-3xl mx-auto">
      <div className="skeleton h-8 w-20 rounded-full" />
      <div className="space-y-3">
        <div className="skeleton h-10 w-full rounded" />
        <div className="skeleton h-10 w-3/4 rounded" />
      </div>
      <div className="flex items-center gap-4">
        <div className="skeleton h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <div className="skeleton h-4 w-32 rounded" />
          <div className="skeleton h-3 w-48 rounded" />
        </div>
      </div>
      <div className="skeleton h-[400px] w-full rounded-2xl" />
      {[...Array(6)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="skeleton h-4 w-full rounded" />
          <div className="skeleton h-4 w-5/6 rounded" />
          <div className="skeleton h-4 w-4/5 rounded" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonSidebar() {
  return (
    <div className="space-y-6 animate-pulse">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="card p-5 space-y-3">
          <div className="skeleton h-5 w-32 rounded" />
          {[...Array(4)].map((_, j) => (
            <div key={j} className="flex gap-3">
              <div className="skeleton h-14 w-14 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-3 w-full rounded" />
                <div className="skeleton h-3 w-3/4 rounded" />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
