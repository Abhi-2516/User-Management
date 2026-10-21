import React, { useState, useEffect } from 'react';
import { X, UserPlus, Pencil, Lock, Mail, User, AlertCircle, Loader2 } from 'lucide-react';
import { createUser, updateUser } from '../services/api';
import { useToast } from './Toast';

export default function UserFormModal({
  isOpen,
  onClose,
  onSuccess,
  mode = 'create', // 'create' | 'edit'
  initialUser = null,
}) {
  const { addToast } = useToast();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prefill or reset fields when modal opens or initialUser changes
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialUser) {
        setFullName(initialUser.fullName || '');
        setEmail(initialUser.email || '');
        setPassword('');
      } else {
        setFullName('');
        setEmail('');
        setPassword('');
      }
      setFieldErrors({});
      setGeneralError('');
      setIsSubmitting(false);
    }
  }, [isOpen, mode, initialUser]);

  if (!isOpen) return null;

  // Validate form locally before submitting
  const validateForm = () => {
    const errors = {};
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      errors.fullName = 'Full name is required';
    } else if (trimmedName.length < 2 || trimmedName.length > 100) {
      errors.fullName = 'Full name must be between 2 and 100 characters long';
    }

    if (!trimmedEmail) {
      errors.email = 'Email address is required';
    } else if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      errors.email = 'Please provide a valid email address';
    }

    if (mode === 'create') {
      if (!password) {
        errors.password = 'Password is required for new users';
      } else if (password.length < 6) {
        errors.password = 'Password must be at least 6 characters long';
      }
    } else if (mode === 'edit' && password.length > 0) {
      if (password.length < 6) {
        errors.password = 'New password must be at least 6 characters long';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      if (mode === 'create') {
        const newUser = await createUser({
          fullName: fullName.trim(),
          email: email.trim(),
          password,
        });

        addToast({
          type: 'success',
          title: 'User Created',
          message: `${newUser.fullName} was successfully created.`,
        });

        // Clear password immediately
        setPassword('');
        onSuccess(newUser);
        onClose();
      } else {
        // Edit mode: only submit changed fields
        const updates = {};
        if (fullName.trim() !== initialUser.fullName) {
          updates.fullName = fullName.trim();
        }
        if (email.trim().toLowerCase() !== initialUser.email.toLowerCase()) {
          updates.email = email.trim();
        }
        if (password.trim() !== '') {
          updates.password = password;
        }

        if (Object.keys(updates).length === 0) {
          setGeneralError('No fields were changed. Make an update or cancel.');
          setIsSubmitting(false);
          return;
        }

        const userId = initialUser.id || initialUser._id;
        const updated = await updateUser(userId, updates);

        addToast({
          type: 'success',
          title: 'User Updated',
          message: `User details updated successfully.`,
        });

        setPassword('');
        onSuccess(updated);
        onClose();
      }
    } catch (err) {
      // Handle validation errors from backend
      if (err.errors && err.errors.length > 0) {
        const backendMap = {};
        err.errors.forEach((e) => {
          backendMap[e.field] = e.message;
        });
        setFieldErrors(backendMap);
      }

      if (err.status === 409) {
        setGeneralError('A user with this email address already exists. Please use a unique email.');
      } else {
        setGeneralError(err.message || 'An unexpected error occurred while saving.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => !isSubmitting && onClose()}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden transform transition-all animate-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                mode === 'create' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'
              }`}>
                {mode === 'create' ? <UserPlus className="w-5 h-5" /> : <Pencil className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {mode === 'create' ? 'Add New User' : 'Edit User Profile'}
                </h3>
                <p className="text-xs text-slate-500">
                  {mode === 'create'
                    ? 'Enter information to register a user into MongoDB'
                    : `Updating details for ${initialUser?.fullName || 'user'}`}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {generalError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-xs">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{generalError}</p>
              </div>
            )}

            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className={`w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    fieldErrors.fullName
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                      : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200'
                  }`}
                />
              </div>
              {fieldErrors.fullName && (
                <p className="text-xs text-rose-600 mt-1.5">{fieldErrors.fullName}</p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. rahul.sharma@example.com"
                  className={`w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    fieldErrors.email
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                      : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200'
                  }`}
                />
              </div>
              {fieldErrors.email && (
                <p className="text-xs text-rose-600 mt-1.5">{fieldErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  {mode === 'create' ? 'Password' : 'New Password'}{' '}
                  {mode === 'create' ? (
                    <span className="text-rose-500">*</span>
                  ) : (
                    <span className="text-slate-400 font-normal lowercase">(optional)</span>
                  )}
                </label>
                <span className="text-[11px] text-slate-600">Min 6 characters</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={
                    mode === 'create'
                      ? '•••••••• (minimum 6 characters)'
                      : 'Leave blank to preserve current password'
                  }
                  autoComplete={mode === 'create' ? 'new-password' : 'off'}
                  className={`w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    fieldErrors.password
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                      : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200'
                  }`}
                />
              </div>
              {fieldErrors.password && (
                <p className="text-xs text-rose-600 mt-1.5">{fieldErrors.password}</p>
              )}
              {mode === 'edit' && (
                <p className="text-[11px] text-slate-600 mt-1">
                  Only provide a value if you wish to reset the user's password.
                </p>
              )}
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white rounded-xl shadow-xs transition-all disabled:opacity-50 ${
                  mode === 'create'
                    ? 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800'
                    : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{mode === 'create' ? 'Creating User...' : 'Saving Changes...'}</span>
                  </>
                ) : (
                  <span>{mode === 'create' ? 'Create User' : 'Save Changes'}</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
