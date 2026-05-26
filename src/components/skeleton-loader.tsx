export function SkeletonLoader() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl overflow-hidden h-[410px] flex flex-col justify-between p-0 animate-pulse"
        >
          {/* Image skeleton */}
          <div className="h-48 bg-slate-200 dark:bg-slate-800 w-full" />
          
          {/* Body skeleton */}
          <div className="p-5 flex-grow space-y-4">
            <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-lg w-5/6" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/2" />
            
            <div className="grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800/80 pt-4 mt-auto">
              <div className="space-y-2">
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
              </div>
            </div>
          </div>
          
          {/* Button skeleton */}
          <div className="p-5 pt-0">
            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
