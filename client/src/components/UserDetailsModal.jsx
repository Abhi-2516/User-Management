import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Calendar, 
  Key, 
  Copy, 
  Check, 
  Pencil, 
  Trash2, 
  ShieldCheck, 
  Clock, 
  Loader2,
  RefreshCw
} from 'lucide-react';
import { getUserById } from '../services/api';

export default function UserDetailsModal({
  isOpen,
  onClose,
  user: initialUser,
  onEdit,
  onDelete,
}) {
  const [userData, setUserData] = useState(initialUser);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copiedId, setCopiedId] = useState(false);

  const userId = initialUser?.id || initialUser?._id;

  // Fresh fetch from GET /api/users/:id
  useEffect(() => {
    if (isOpen && userId) {
      setUserData(initialUser);
      setIsLoading(true);
      setError(null);
      getUserById(userId)
        .then((fresh) => {
          setUserData(fresh);
        })
        .catch((err) => {
          setError(err.message || 'Could not fetch latest user details');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isOpen, userId]);

  if (!isOpen || !initialUser) return null;

  const handleCopyId = () => {
    if (userId) {
      navigator.clipboard.writeText(userId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    try {
      const d = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'full',
        timeStyle: 'medium',
      }).format(d);
    } catch {
      return dateString;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden transform transition-all animate-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  User Details
                </h3>
                <p className="text-xs text-slate-500">
                  Record retrieved via GET /api/users/:id
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-5">
            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-indigo-600 bg-indigo-50/60 border border-indigo-100 p-2.5 rounded-xl">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Synchronizing latest record from MongoDB...</span>
              </div>
            )}

            {error && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                {error} (showing cached client state)
              </div>
            )}

            {/* Profile Highlight */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white text-xl font-bold shadow-md shadow-indigo-600/20">
                {(userData?.fullName || 'U').charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-lg font-bold text-slate-900 truncate">
                  {userData?.fullName}
                </h4>
                <p className="text-sm text-slate-600 truncate flex items-center gap-1.5 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{userData?.email}</span>
                </p>
              </div>
            </div>

            {/* Detailed Properties Grid */}
            <div className="space-y-3">
              {/* Unique MongoDB ID */}
              <div className="p-3.5 rounded-xl border border-slate-200/80 bg-white">
                <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                  <span className="font-semibold uppercase tracking-wider text-[10px]">Database ID (_id)</span>
                  <button
                    onClick={handleCopyId}
                    className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium"
                    title="Copy ID"
                  >
                    {copiedId ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <div className="font-mono text-xs text-slate-800 select-all break-all">
                  {userId}
                </div>
              </div>

              {/* Email Address */}
              <div className="p-3.5 rounded-xl border border-slate-200/80 bg-white flex items-center justify-between">
                <div>
                  <span className="font-semibold uppercase tracking-wider text-[10px] text-slate-600 block mb-0.5">Email Address</span>
                  <span className="text-sm text-slate-800 font-medium">{userData?.email}</span>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Unique Key
                </span>
              </div>

              {/* Created Date */}
              <div className="p-3.5 rounded-xl border border-slate-200/80 bg-white">
                <span className="font-semibold uppercase tracking-wider text-[10px] text-slate-600 block mb-1">
                  Creation Timestamp
                </span>
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{formatDate(userData?.createdAt)}</span>
                </div>
              </div>

              {/* Security Banner */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs text-slate-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p>
                  <strong className="text-slate-800">Security Guarantee:</strong> Passwords are encrypted with bcrypt salts. The raw password and hash are never returned by the REST API and are omitted from serialization.
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onDelete(userData);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete User</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onEdit(userData);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
