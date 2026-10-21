import React from 'react';

export default function LoadingState({ count = 5 }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="h-4 w-32 skeleton-shimmer rounded-md"></div>
        <div className="h-4 w-20 skeleton-shimmer rounded-md"></div>
      </div>
      <div className="divide-y divide-slate-100">
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className="p-4 sm:px-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {/* Avatar placeholder */}
              <div className="w-10 h-10 rounded-full skeleton-shimmer shrink-0"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 w-40 skeleton-shimmer rounded"></div>
                <div className="h-3 w-56 skeleton-shimmer rounded"></div>
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="h-3 w-24 skeleton-shimmer rounded"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg skeleton-shimmer"></div>
              <div className="w-8 h-8 rounded-lg skeleton-shimmer"></div>
              <div className="w-8 h-8 rounded-lg skeleton-shimmer"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
