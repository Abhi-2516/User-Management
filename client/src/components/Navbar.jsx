import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Users, 
  Layers, 
  FileCode2, 
  LayoutDashboard, 
  Activity, 
  Menu, 
  X, 
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import useBackendHealth from '../hooks/useBackendHealth';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { status, latency, checkHealth, isChecking } = useBackendHealth(20000);

  const isHome = location.pathname === '/';
  const isDashboard = location.pathname === '/dashboard';

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <Link 
            to="/" 
            className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg p-1"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                UserFlow
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-600 -mt-1">
                REST Management
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link
              to="/"
              className={`hover:text-indigo-600 transition-colors py-1 ${
                isHome ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600' : ''
              }`}
            >
              Home
            </Link>
            <a
              href={isHome ? "#features" : "/#features"}
              className="hover:text-indigo-600 transition-colors py-1"
            >
              Features
            </a>
            <a
              href={isHome ? "#api-docs" : "/#api-docs"}
              className="hover:text-indigo-600 transition-colors py-1 flex items-center gap-1"
            >
              <FileCode2 className="w-4 h-4 text-slate-400" />
              API Docs
            </a>
          </nav>

          {/* Status Badge & CTA Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Live Backend Connection Status */}
            <div 
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                status === 'connected'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : status === 'disconnected'
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
              title={
                status === 'connected'
                  ? `Backend operational (${latency !== null ? `${latency}ms latency` : 'Active'})`
                  : 'Backend service is unreachable'
              }
            >
              <span className="relative flex h-2 w-2">
                {status === 'connected' && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    status === 'connected'
                      ? 'bg-emerald-500'
                      : status === 'disconnected'
                      ? 'bg-rose-500'
                      : 'bg-amber-400'
                  }`}
                ></span>
              </span>
              <span className="capitalize">
                {status === 'connected' ? 'API Connected' : status === 'disconnected' ? 'API Offline' : 'Checking...'}
              </span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  checkHealth();
                }}
                disabled={isChecking}
                aria-label="Refresh backend health status"
                className="hover:text-slate-900 transition-colors disabled:opacity-50 ml-0.5"
              >
                <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Dashboard CTA */}
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-sm hover:shadow transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Open Dashboard</span>
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4 shadow-xl">
          <div className="flex flex-col space-y-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                isHome ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Home
            </Link>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Features
            </a>
            <a
              href="#api-docs"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              API Documentation
            </a>
          </div>

          {/* Mobile Status badge */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span
                className={`inline-block w-2.5 h-2.5 rounded-full ${
                  status === 'connected' ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
              ></span>
              <span>Backend: {status === 'connected' ? 'Connected' : 'Offline'}</span>
            </div>
            <button
              onClick={checkHealth}
              className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin' : ''}`} />
              Retry
            </button>
          </div>

          <Link
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Open Dashboard</span>
          </Link>
        </div>
      )}
    </header>
  );
}
