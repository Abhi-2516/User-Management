import React, { useState, useMemo } from 'react';
import { 
  Eye, 
  Pencil, 
  Trash2, 
  Calendar, 
  Mail, 
  ChevronLeft, 
  ChevronRight,
  Shield,
  Clock
} from 'lucide-react';

/**
 * Deterministic avatar color and initials helper.
 * Generates consistent, modern initials with tasteful pastel colors.
 */
function getDeterministicAvatar(name = '') {
  const cleanName = (name || 'User').trim();
  const parts = cleanName.split(/\s+/).filter(Boolean);
  let initials = 'U';
  if (parts.length >= 2) {
    initials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  } else if (parts.length === 1 && parts[0].length > 0) {
    initials = parts[0].slice(0, 2).toUpperCase();
  }

  // Consistent color palette
  const palettes = [
    { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200' },
    { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
    { bg: 'bg-violet-100', text: 'text-violet-700', border: 'border-violet-200' },
    { bg: 'bg-sky-100', text: 'text-sky-700', border: 'border-sky-200' },
    { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
    { bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-200' },
    { bg: 'bg-teal-100', text: 'text-teal-700', border: 'border-teal-200' },
  ];

  let hash = 0;
  for (let i = 0; i < cleanName.length; i++) {
    hash = cleanName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % palettes.length;
  return { initials, style: palettes[index] };
}

/**
 * Friendly date formatter
 */
function formatDate(dateString) {
  if (!dateString) return 'Unknown';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch (e) {
    return dateString;
  }
}

export default function UsersTable({
  users = [],
  onViewUser,
  onEditUser,
  onDeleteUser,
  pageSize = 10,
  onPageSizeChange,
}) {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 if current page is out of range
  const totalPages = Math.max(1, Math.ceil(users.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedUsers = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return users.slice(start, start + pageSize);
  }, [users, safePage, pageSize]);

  const startIndex = (safePage - 1) * pageSize + 1;
  const endIndex = Math.min(safePage * pageSize, users.length);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col">
      {/* Desktop & Tablet Table View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th scope="col" className="py-3.5 pl-6 pr-4">User</th>
              <th scope="col" className="py-3.5 px-4">Email</th>
              <th scope="col" className="py-3.5 px-4">Created Date</th>
              <th scope="col" className="py-3.5 pl-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {paginatedUsers.map((user) => {
              const { initials, style } = getDeterministicAvatar(user.fullName);
              const userId = user.id || user._id;

              return (
                <tr 
                  key={userId} 
                  className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  onClick={() => onViewUser(user)}
                >
                  {/* Name & Avatar */}
                  <td className="py-4 pl-6 pr-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 border ${style.bg} ${style.text} ${style.border}`}>
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <span className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors block truncate">
                          {user.fullName}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          ID: {userId ? userId.substring(0, 8) + '...' : ''}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="py-4 px-4 text-slate-600">
                    <div className="flex items-center gap-1.5 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{user.email}</span>
                    </div>
                  </td>

                  {/* Created Date */}
                  <td className="py-4 px-4 text-slate-600 text-xs">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{formatDate(user.createdAt)}</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-4 pl-4 pr-6 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onViewUser(user)}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="View user details"
                        aria-label={`View details for ${user.fullName}`}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEditUser(user)}
                        className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Edit user"
                        aria-label={`Edit ${user.fullName}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteUser(user)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete user"
                        aria-label={`Delete ${user.fullName}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="sm:hidden divide-y divide-slate-100">
        {paginatedUsers.map((user) => {
          const { initials, style } = getDeterministicAvatar(user.fullName);
          const userId = user.id || user._id;

          return (
            <div 
              key={userId} 
              className="p-4 space-y-3 hover:bg-slate-50/60 transition-colors"
              onClick={() => onViewUser(user)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 border ${style.bg} ${style.text} ${style.border}`}>
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-slate-900 text-sm truncate">
                      {user.fullName}
                    </h4>
                    <p className="text-xs text-slate-500 truncate flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3 shrink-0" />
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-50">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDate(user.createdAt)}
                </span>
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onViewUser(user)}
                    className="p-1.5 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg"
                    aria-label="View user"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEditUser(user)}
                    className="p-1.5 text-slate-600 hover:bg-amber-50 hover:text-amber-600 rounded-lg"
                    aria-label="Edit user"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteUser(user)}
                    className="p-1.5 text-slate-600 hover:bg-rose-50 hover:text-rose-600 rounded-lg"
                    aria-label="Delete user"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination & Controls Bar */}
      <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span>Show</span>
          <select
            value={pageSize}
            onChange={(e) => {
              onPageSizeChange(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
            aria-label="Select items per page"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span>per page</span>
          <span className="text-slate-400 mx-1">|</span>
          <span>
            {users.length > 0
              ? `Showing ${startIndex}-${endIndex} of ${users.length} users`
              : '0 users'}
          </span>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Previous Page"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 py-1 font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg">
              Page {safePage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Next Page"
              aria-label="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
