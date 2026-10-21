import React from 'react';
import { UserPlus, SearchX, AlertTriangle, RefreshCw } from 'lucide-react';

export default function EmptyState({
  type = 'no-users', // 'no-users' | 'no-search-results' | 'error'
  title,
  description,
  onAction,
  actionLabel,
  isRetrying = false,
}) {
  if (type === 'error') {
    return (
      <div className="bg-white rounded-2xl border border-rose-200 p-12 text-center shadow-xs">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mb-4">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">
          {title || 'Failed to Load User Records'}
        </h3>
        <p className="text-sm text-slate-600 max-w-md mx-auto mt-2 leading-relaxed">
          {description || 'The REST API could not be reached or returned an error. Ensure the server is running on port 5000 and MongoDB is connected.'}
        </p>
        {onAction && (
          <div className="mt-6">
            <button
              onClick={onAction}
              disabled={isRetrying}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
              <span>{actionLabel || 'Retry Connection'}</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  if (type === 'no-search-results') {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center shadow-xs">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mb-4">
          <SearchX className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">
          {title || 'No Matching Users Found'}
        </h3>
        <p className="text-sm text-slate-600 max-w-sm mx-auto mt-2 leading-relaxed">
          {description || 'We couldn\'t find any users matching your search criteria. Try checking spelling or clear your filters.'}
        </p>
        {onAction && (
          <div className="mt-6">
            <button
              onClick={onAction}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-all"
            >
              <span>{actionLabel || 'Clear Search Filters'}</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // Default: no-users
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center shadow-xs">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
        <UserPlus className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 tracking-tight">
        {title || 'No Users in Database Yet'}
      </h3>
      <p className="text-sm text-slate-600 max-w-sm mx-auto mt-2 leading-relaxed">
        {description || 'Get started by creating your first user. User credentials will be securely hashed with bcrypt in MongoDB.'}
      </p>
      {onAction && (
        <div className="mt-6">
          <button
            onClick={onAction}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-xs hover:shadow transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>{actionLabel || 'Create First User'}</span>
          </button>
        </div>
      )}
    </div>
  );
}
