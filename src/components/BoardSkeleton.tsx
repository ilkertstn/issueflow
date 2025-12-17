import { Skeleton } from "./Skeleton";

export function BoardSkeleton() {
  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto">
      <div className="rounded-3xl border border-white/5 bg-white/5 p-6 mb-8 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-24 rounded-xl" />
        </div>

        <div className="mt-8 flex gap-2">
          <Skeleton className="h-10 w-24 rounded-xl" />
          <Skeleton className="h-10 w-24 rounded-xl" />
          <Skeleton className="h-10 w-24 rounded-xl" />
        </div>

        <div className="mt-6 flex flex-col md:flex-row gap-3">
          <Skeleton className="h-12 flex-1 rounded-xl" />
          <div className="flex gap-2">
            <Skeleton className="h-12 w-32 rounded-xl" />
            <Skeleton className="h-12 w-24 rounded-xl" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start h-full">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex flex-col gap-3 rounded-xl border border-white/5 p-4 w-full h-full border-t-2 border-t-slate-700/50 bg-slate-800/20"
          >
            <div className="flex justify-between items-center mb-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-5 w-8 rounded" />
            </div>

            <div className="space-y-3">
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
