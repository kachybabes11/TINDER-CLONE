export const SwipeCardSkeleton = () => (
  <div
    aria-label="Loading profile"
    aria-busy="true"
    className="relative mx-auto h-[min(60vh,34rem)] min-h-[24rem] w-full max-w-md animate-pulse overflow-hidden rounded-3xl bg-slate-200"
    role="status"
  >
    <div className="absolute inset-0 bg-gradient-to-b from-slate-200 via-slate-300 to-slate-500" />
    <div className="absolute inset-x-0 bottom-0 space-y-3 p-6">
      <div className="h-8 w-2/3 rounded bg-white/40" />
      <div className="h-4 w-1/3 rounded bg-white/30" />
      <div className="h-4 w-full rounded bg-white/30" />
      <div className="h-4 w-4/5 rounded bg-white/30" />
    </div>
  </div>
);

export const MatchListSkeleton = () => (
  <div aria-label="Loading matches" aria-busy="true" className="space-y-4" role="status">
    {Array.from({ length: 5 }, (_, index) => (
      <div className="flex animate-pulse items-center gap-3" key={index}>
        <div className="h-12 w-12 shrink-0 rounded-full bg-slate-200" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-4 w-2/3 rounded bg-slate-200" />
          <div className="h-3 w-full rounded bg-slate-100" />
        </div>
      </div>
    ))}
  </div>
);

export const AppLoadingSkeleton = () => (
  <div
    aria-busy="true"
    aria-label="Loading your home page"
    className="min-h-screen bg-slate-50"
    role="status"
  >
    <span className="sr-only">Loading your home page</span>
    <header className="h-[4.5rem] bg-white shadow-sm">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="h-8 w-32 animate-pulse rounded-lg bg-slate-200" />
        <div className="h-10 w-36 animate-pulse rounded-full bg-slate-100" />
      </div>
    </header>
    <main className="relative flex min-h-[calc(100vh-4.5rem)] flex-col px-4 py-7 sm:px-6">
      <div className="relative mx-auto w-full max-w-7xl text-center">
        <div className="mx-auto h-3 w-24 animate-pulse rounded bg-pink-100" />
        <div className="mx-auto mt-3 h-8 w-72 max-w-full animate-pulse rounded bg-slate-200" />
        <div className="mx-auto mt-2 h-4 w-80 max-w-full animate-pulse rounded bg-slate-100" />
        <div className="absolute right-0 top-0 h-10 w-28 animate-pulse rounded-full bg-slate-100" />
      </div>
      <div className="flex flex-1 items-center justify-center py-6">
        <SwipeCardSkeleton />
      </div>
    </main>
  </div>
);
