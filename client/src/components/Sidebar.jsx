import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Users, 
  LayoutDashboard, 
  FileCode2, 
  Activity, 
  ArrowLeft,
  X,
  ShieldCheck,
  Database
} from 'lucide-react';

export default function Sidebar({ 
  mobileOpen = false, 
  onClose = () => {},
  activeTab = 'users',
  setActiveTab = () => {},
  totalUsers = 0,
  backendStatus = 'connected'
}) {
  const location = useLocation();

  const navItems = [
    {
      id: 'users',
      label: 'Users Management',
      icon: Users,
      badge: totalUsers > 0 ? totalUsers : null,
    },
    {
      id: 'api-reference',
      label: 'API Documentation',
      icon: FileCode2,
    },
    {
      id: 'diagnostics',
      label: 'System Health',
      icon: Activity,
    },
  ];

  const content = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight leading-tight">
              UserFlow
            </h1>
            <p className="text-[10px] text-slate-600 uppercase font-semibold tracking-wider">
              Admin Console
            </p>
          </div>
        </Link>
        {mobileOpen && (
          <button
            onClick={onClose}
            className="md:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-6 space-y-1">
        <p className="px-3 pb-2 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
          Main Navigation
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (mobileOpen) onClose();
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== null && item.badge !== undefined && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                  isActive ? 'bg-indigo-200/80 text-indigo-800' : 'bg-slate-100 text-slate-600'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="pt-6">
          <p className="px-3 pb-2 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
            Quick Actions
          </p>
          <Link
            to="/"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400" />
            <span>Return to Landing Page</span>
          </Link>
        </div>
      </div>

      {/* Footer System Status Card */}
      <div className="p-4 m-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
        <div className="flex items-center justify-between text-xs font-medium text-slate-700">
          <span className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-slate-500" />
            <span>MongoDB Atlas</span>
          </span>
          <span className={`inline-block w-2 h-2 rounded-full ${
            backendStatus === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
          }`}></span>
        </div>
        <p className="text-[11px] text-slate-600 leading-snug">
          Express 5 REST API running on port 5000 with Mongoose ODM.
        </p>
        <div className="pt-1 flex items-center gap-1 text-[11px] text-slate-600">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Bcrypt Active</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop static sidebar */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 h-[calc(100vh-4rem)] sticky top-16 z-20">
        {content}
      </aside>

      {/* Mobile drawer backdrop and overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />
          <div className="relative w-72 max-w-full h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
