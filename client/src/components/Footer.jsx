import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Shield, Server, Database, Code, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">UserFlow</span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Enterprise-grade Full-Stack User Management System powered by Node.js, Express.js, MongoDB, Mongoose, and React. Engineered for reliability, clean architecture, and data security.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Bcrypt 10-round salted password hashing & zero hash exposure</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-white tracking-wider uppercase mb-4">
              Platform Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  Management Dashboard
                </Link>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Core Features
                </a>
              </li>
              <li>
                <a href="#api-docs" className="hover:text-white transition-colors">
                  API Documentation
                </a>
              </li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="text-xs font-semibold text-white tracking-wider uppercase mb-4">
              Technology Stack
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <Server className="w-3.5 h-3.5 text-indigo-400" />
                <span>Node.js & Express 5.x</span>
              </li>
              <li className="flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span>MongoDB & Mongoose ODM</span>
              </li>
              <li className="flex items-center gap-2">
                <Code className="w-3.5 h-3.5 text-sky-400" />
                <span>React 18 + Vite + Tailwind CSS</span>
              </li>
              <li className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-violet-400" />
                <span>Helmet & Express-Validator</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} UserFlow Management System. Built for full-stack developer portfolio & technical assessment.
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              API Health: /api/health
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
