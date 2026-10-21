import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  LayoutDashboard, 
  ShieldCheck, 
  Search, 
  UserCheck, 
  Edit3, 
  Trash2, 
  Database, 
  Server, 
  Terminal, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  Activity,
  Code2,
  RefreshCw,
  ExternalLink,
  Lock,
  Layers
} from 'lucide-react';
import useBackendHealth from '../hooks/useBackendHealth';

export default function Home() {
  const { status, data: healthData, latency, lastChecked, checkHealth, isChecking } = useBackendHealth(20000);
  const [activeApiTab, setActiveApiTab] = useState('GET /api/users');

  const apiEndpoints = [
    {
      method: 'GET',
      path: '/api/health',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      description: 'Checks backend service status and database connectivity.',
      sampleResponse: `{
  "success": true,
  "message": "User Management API is operational",
  "timestamp": "${healthData?.timestamp || new Date().toISOString()}"
}`
    },
    {
      method: 'POST',
      path: '/api/users',
      badge: 'bg-sky-100 text-sky-800 border-sky-200',
      description: 'Creates a new user record. Hashes password using bcrypt. Returns HTTP 201.',
      sampleResponse: `{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "6701a2b3c4d5e6f7a8b9c0d1",
    "fullName": "Rahul Sharma",
    "email": "rahul.sharma@example.com",
    "createdAt": "2026-10-21T14:00:00.000Z"
  }
}`
    },
    {
      method: 'GET',
      path: '/api/users',
      badge: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      description: 'Fetches all registered users sorted by newest first. Excludes password hashes.',
      sampleResponse: `{
  "success": true,
  "message": "Users retrieved successfully",
  "count": 2,
  "data": [
    {
      "id": "6701a2b3c4d5e6f7a8b9c0d1",
      "fullName": "Rahul Sharma",
      "email": "rahul.sharma@example.com",
      "createdAt": "2026-10-21T14:00:00.000Z"
    }
  ]
}`
    },
    {
      method: 'GET',
      path: '/api/users/:id',
      badge: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      description: 'Retrieves a single user by MongoDB ObjectId. Validates ID format and returns 404 if missing.',
      sampleResponse: `{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": "6701a2b3c4d5e6f7a8b9c0d1",
    "fullName": "Rahul Sharma",
    "email": "rahul.sharma@example.com",
    "createdAt": "2026-10-21T14:00:00.000Z"
  }
}`
    },
    {
      method: 'PATCH',
      path: '/api/users/:id',
      badge: 'bg-amber-100 text-amber-800 border-amber-200',
      description: 'Updates specific user fields (fullName, email, password). Enforces email uniqueness and bcrypt hashing.',
      sampleResponse: `{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": "6701a2b3c4d5e6f7a8b9c0d1",
    "fullName": "Rahul S. Verma",
    "email": "rahul.sharma@example.com",
    "createdAt": "2026-10-21T14:00:00.000Z"
  }
}`
    },
    {
      method: 'DELETE',
      path: '/api/users/:id',
      badge: 'bg-rose-100 text-rose-800 border-rose-200',
      description: 'Permanently deletes user from MongoDB by ObjectId. Returns deleted ID confirmation.',
      sampleResponse: `{
  "success": true,
  "message": "User deleted successfully",
  "data": {
    "id": "6701a2b3c4d5e6f7a8b9c0d1"
  }
}`
    }
  ];

  const currentEndpoint = apiEndpoints.find(
    (e) => `${e.method} ${e.path}` === activeApiTab
  ) || apiEndpoints[0];

  const features = [
    {
      icon: Users,
      title: 'Full User Lifecycle (CRUD)',
      desc: 'Create, read, update, and delete users directly against MongoDB through cleanly separated Express controllers and routes.'
    },
    {
      icon: Search,
      title: 'Instant Search & Sorting',
      desc: 'Filter user directories instantaneously by full name or email, and sort chronologically or alphabetically with responsive pagination.'
    },
    {
      icon: ShieldCheck,
      title: 'Bcrypt Password Security',
      desc: 'Mongoose pre-save hooks automatically hash passwords using 10 bcrypt salt rounds. Passwords and hashes are strictly stripped from all API outputs.'
    },
    {
      icon: CheckCircle2,
      title: 'Robust Input Validation',
      desc: 'Strict express-validator middleware validates email formats, min password lengths (6+), and rejects arbitrary unsupported payload fields.'
    },
    {
      icon: Database,
      title: 'MongoDB & Mongoose ODM',
      desc: 'Built with MongoDB Atlas cloud integration and Mongoose schemas with indexed unique email constraints to prevent race condition duplicates.'
    },
    {
      icon: Activity,
      title: 'Live Health Diagnostics',
      desc: 'Continuous real-time API health telemetry monitoring latency, database connectivity status, and service uptime.'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 bg-gradient-to-b from-indigo-50/50 via-white to-slate-50 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Enterprise User Management Stack</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                Manage Users. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                  Simplify Everything.
                </span>
              </h1>

              {/* Supporting Text */}
              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                A clean, reliable user management platform powered by a REST API, Express.js, and MongoDB.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Open Dashboard</span>
                </Link>

                <a
                  href="#features"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs hover:border-slate-300 transition-all"
                >
                  <span>Explore Features</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </a>
              </div>

              {/* Live Backend Telemetry Pill */}
              <div className="pt-2 flex items-center justify-center lg:justify-start gap-3 text-xs text-slate-500">
                <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-xs">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    status === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                  }`}></span>
                  <span className="font-medium text-slate-700">
                    Backend Status: {status === 'connected' ? 'Operational' : 'Unavailable'}
                  </span>
                  {latency !== null && (
                    <span className="text-slate-400 font-mono">({latency}ms)</span>
                  )}
                  <button
                    onClick={checkHealth}
                    disabled={isChecking}
                    className="text-indigo-600 hover:text-indigo-800 p-0.5 ml-1"
                    title="Ping health check"
                  >
                    <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Custom Polished UI Composition Preview */}
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                {/* Background decorative glow */}
                <div className="absolute -inset-1.5 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-3xl blur-xl opacity-20 transform -rotate-1"></div>

                {/* Dashboard Window Frame */}
                <div className="relative bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
                  {/* Window Bar */}
                  <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                      <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                      <span className="ml-2 text-xs font-mono text-slate-500 font-medium">userflow-dashboard</span>
                    </div>
                    <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                      Live Preview
                    </span>
                  </div>

                  {/* Dashboard Mock Preview Content */}
                  <div className="p-5 space-y-4 bg-slate-50/50">
                    {/* Micro stats row */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-xs">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Database Users</span>
                        <div className="text-xl font-extrabold text-slate-900 mt-0.5">MongoDB</div>
                        <span className="text-[11px] text-emerald-600 font-medium">Active & Synchronized</span>
                      </div>
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-xs">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Encryption</span>
                        <div className="text-xl font-extrabold text-slate-900 mt-0.5">Bcrypt 10x</div>
                        <span className="text-[11px] text-indigo-600 font-medium">Salted Hashes</span>
                      </div>
                    </div>

                    {/* Table mockup */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                      <div className="p-3 border-b border-slate-100 flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-800">Recent Users Table</span>
                        <span className="text-slate-400 font-mono">GET /api/users</span>
                      </div>
                      <div className="divide-y divide-slate-100 text-xs">
                        <div className="p-3 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[10px]">
                              RS
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800">Rahul Sharma</p>
                              <p className="text-[11px] text-slate-500 font-mono">rahul@example.com</p>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold">
                            Active
                          </span>
                        </div>
                        <div className="p-3 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-[10px]">
                              AV
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800">Ananya Verma</p>
                              <p className="text-[11px] text-slate-500 font-mono">ananya@example.com</p>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold">
                            Active
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-1 flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Server className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Port 5000 REST API</span>
                      </span>
                      <Link
                        to="/dashboard"
                        className="text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1"
                      >
                        Launch Interactive Console &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Production-Grade Architecture, Clean Separation
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              Every feature corresponds to an existing, fully tested Express route backed by MongoDB Mongoose schemas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={idx}
                  className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-6 card-hover flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-100/70 border border-indigo-200/60 flex items-center justify-center text-indigo-700">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* API Documentation Section */}
      <section id="api-docs" className="py-20 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              REST API Reference
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Documented Endpoints & Response Contracts
            </h2>
            <p className="text-slate-600 text-base">
              Explore the exact JSON payloads and HTTP status codes exposed by the Express backend.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Endpoint selector buttons */}
            <div className="lg:col-span-5 space-y-2">
              {apiEndpoints.map((ep) => {
                const key = `${ep.method} ${ep.path}`;
                const isSelected = activeApiTab === key;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveApiTab(key)}
                    className={`w-full p-4 rounded-xl text-left border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-white border-indigo-500 shadow-md ring-1 ring-indigo-500'
                        : 'bg-white/80 border-slate-200 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`px-2.5 py-1 text-xs font-mono font-bold rounded-lg border ${ep.badge}`}>
                        {ep.method}
                      </span>
                      <span className="text-sm font-semibold font-mono text-slate-900 truncate">
                        {ep.path}
                      </span>
                    </div>
                    <ArrowRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'text-indigo-600 translate-x-1' : 'text-slate-400'}`} />
                  </button>
                );
              })}
            </div>

            {/* Right: Endpoint details and response code block */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 space-y-2">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 text-xs font-mono font-bold rounded-lg border ${currentEndpoint.badge}`}>
                    {currentEndpoint.method}
                  </span>
                  <span className="text-base font-bold font-mono text-slate-900">
                    {currentEndpoint.path}
                  </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed pt-1">
                  {currentEndpoint.description}
                </p>
              </div>

              {/* Code viewer */}
              <div className="p-4 bg-slate-950 text-slate-100 font-mono text-xs overflow-x-auto">
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800 text-slate-400 text-[11px]">
                  <span>Expected JSON Response</span>
                  <span className="text-emerald-400">Content-Type: application/json</span>
                </div>
                <pre className="text-slate-200 leading-relaxed selection:bg-indigo-600">
                  {currentEndpoint.sampleResponse}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to inspect and manage users?
          </h2>
          <p className="text-indigo-200 text-base max-w-2xl mx-auto leading-relaxed">
            Every user action is committed directly to your configured MongoDB database via authenticated Mongoose operations.
          </p>
          <div className="pt-2">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-base font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-xl shadow-lg transition-all"
            >
              <LayoutDashboard className="w-5 h-5 text-indigo-600" />
              <span>Launch Management Console</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
