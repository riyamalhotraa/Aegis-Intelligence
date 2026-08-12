export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} />
}

export function SkeletonLines({ count = 3 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className={`h-4 ${i === count - 1 ? 'w-2/3' : 'w-full'}`} />
      ))}
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <Skeleton className="mb-3 h-3 w-24" />
      <Skeleton className="h-8 w-32" />
    </div>
  )
}
