# UserFlow — Full-Stack User Management System

A modern, production-ready Full-Stack User Management application built with a **Node.js & Express REST API**, **MongoDB Atlas & Mongoose**, and a **React 18 + Vite + Tailwind CSS** frontend dashboard.

This system provides complete end-to-end CRUD (Create, Read, Update, Delete) functionality with strict request validation, database-level uniqueness enforcement, bcrypt password hashing, zero password exposure, real-time health telemetry, and an automated integration test suite.

---

## Table of Contents
- [Project Overview](#project-overview)
- [Screens and Features](#screens-and-features)
  - [Landing Page (`/`)](#landing-page-)
  - [Management Dashboard (`/dashboard`)](#management-dashboard-dashboard)
  - [Interactive CRUD Modals](#interactive-crud-modals)
- [Architecture & Request Lifecycle](#architecture--request-lifecycle)
- [Technology Stack](#technology-stack)
- [Project Folder Structure](#project-folder-structure)
- [Vercel Full-Stack Deployment Guide](#vercel-full-stack-deployment-guide)
  - [Single-Domain Architecture](#single-domain-architecture)
  - [Step-by-Step Vercel Deployment](#step-by-step-vercel-deployment)
  - [Required Environment Variables](#required-environment-variables)
  - [MongoDB Atlas Network Configuration](#mongodb-atlas-network-configuration)
- [Prerequisites](#prerequisites)
- [Installation & Local Setup](#installation--local-setup)
- [Environment Configuration](#environment-configuration)
- [Running the Application Locally](#running-the-application-locally)
- [Running Automated Tests](#running-automated-tests)
- [API Endpoints & Contracts](#api-endpoints--contracts)
  - [HTTP Status Codes](#http-status-codes)
  - [Endpoints Reference](#endpoints-reference)
  - [Request & Response Samples](#request--response-samples)
- [Security Considerations](#security-considerations)
- [Postman Collection & Verification Guide](#postman-collection--verification-guide)
- [Screenshot Verification Checklist](#screenshot-verification-checklist)
- [Troubleshooting Common Issues](#troubleshooting-common-issues)
- [Git & GitHub Submission Guide](#git--github-submission-guide)

---

## Project Overview

**UserFlow** connects directly to MongoDB Atlas or a local MongoDB instance through an Express 5 REST API layer. In production on Vercel, the frontend and backend share a **single public domain**, completely eliminating CORS friction and preventing database credentials from ever leaking to the browser.

Key highlights:
- **Zero Mock Data**: All dashboard records are fetched in real-time from MongoDB via the REST API.
- **Single-Domain Vercel Architecture**: Static assets are served from Vercel's global CDN while `/api/*` requests route transparently to a serverless Express function (`api/index.js`).
- **Serverless Database Caching**: Mongoose connections are cached across warm serverless function invocations to prevent connection leaks and Atlas pool exhaustion.
- **Enterprise-Grade Security**: Passwords are encrypted with 10 bcrypt salt rounds before persistence. Passwords and hashes are omitted from all JSON responses and transforms.
- **Resilient UI States**: Features dedicated loading skeletons, search filtering, client-side pagination, sorting, live health telemetry, duplicate email conflict handling, and permanent deletion confirmation dialogs.

---

## Screens and Features

### Landing Page (`/`)
- **Navigation Bar**: Product logo (**UserFlow**), Home, Features, API Documentation anchors, and an **"Open Dashboard"** CTA button.
- **Live Health Status Pill**: Actively pings `GET /api/health` to indicate backend connectivity, latency, and uptime.
- **Hero Section**:
  - Headline: *"Manage Users. Simplify Everything."*
  - Supporting text: *"A clean, reliable user management platform powered by a REST API, Express.js, and MongoDB."*
  - Custom interactive dashboard preview window showing realistic data schemas.
- **Features Section**: Explains actual platform capabilities (Full CRUD, Instant Search, Bcrypt Security, Input Validation, MongoDB ODM, and Health Telemetry).
- **Interactive REST API Documentation**: Live explorer showcasing all 6 endpoints (`GET /api/health`, `POST /api/users`, `GET /api/users`, `GET /api/users/:id`, `PATCH /api/users/:id`, `DELETE /api/users/:id`) with syntax-highlighted response payloads.
- **Footer**: Technical stack breakdown, platform links, and project attribution.

### Management Dashboard (`/dashboard`)
- **Responsive Navigation Sidebar**: Collapsible drawer on mobile devices with tabs for User Management, API Documentation, and System Diagnostics.
- **Real Summary Cards**:
  1. **Total Database Users**: Real count of records retrieved from MongoDB.
  2. **Shown Records**: Number of users currently displayed after active search filters.
  3. **Latest Registration**: Human-readable timestamp of the most recently created user.
  4. **Backend Status**: Live connection indicator with latency measurement to the Express server.
- **Users Table**:
  - Displays user full name with deterministic initials avatars (pastel backgrounds generated by name hash).
  - Displays user email and formatted creation date (`MMM DD, YYYY, HH:MM AM/PM`).
  - Row actions: **View Details** (Eye), **Edit User** (Pencil), **Delete User** (Trash).
  - Responsive layout: clean tabular presentation on desktop/tablet, adaptive card view on mobile.
  - Client-side pagination with selectable page sizes (5, 10, 20, 50).
- **Search & Sort Controls**:
  - Real-time search by full name or email address.
  - Sort dropdown: Newest First, Oldest First, Name (A → Z), Name (Z → A).
  - Refresh button with loading spinner for immediate database synchronization.
  - Clear search button.

### Interactive CRUD Modals
1. **Create User Modal ("Add User")**:
   - Fields: Full Name (min 2, max 100 chars), Email Address, Password (min 6 chars).
   - Real-time client-side validation + backend validation error mapping.
   - Duplicate email conflict handling (`HTTP 409`) with clear feedback.
   - Loading indicator and disabled submission to prevent duplicate records.
   - Clears password immediately; never exposes password or hash.
2. **Read User Details Modal**:
   - Fetches fresh record directly via `GET /api/users/:id`.
   - Displays Database ID (`_id`), full name, email, creation timestamp, and security guarantees.
   - One-click "Copy ID" button with copy feedback.
   - Direct shortcuts to Edit or Delete the selected user.
3. **Update User Modal ("Edit User")**:
   - Prefills current user profile data.
   - Allows updating Full Name and Email Address.
   - Includes optional "New Password" field (leaving blank keeps existing password unchanged).
   - Sends only changed fields via `PATCH /api/users/:id`.
4. **Delete User Confirmation Dialog**:
   - Prevents accidental deletions by displaying the user's name and email prominently.
   - Clearly flags the action as permanent in MongoDB.
   - Executes `DELETE /api/users/:id` and refreshes the table with a success toast.

---

## Architecture & Request Lifecycle

```mermaid
flowchart TD
    subgraph SingleDomain["Single Public Domain (e.g. userflow.vercel.app)"]
        Browser[User Browser]
        VercelRouter{Vercel Edge Router\nvercel.json}
        
        Browser -->|Request| VercelRouter
        
        VercelRouter -->|Static Assets\n/assets/*, /index.html| CDN[Vercel Global CDN\nclient/dist]
        VercelRouter -->|SPA Deep Links\n/, /dashboard| CDN
        VercelRouter -->|API Calls\n/api/*| ServerlessFunc[Vercel Serverless Function\napi/index.js]
    end

    subgraph BackendEngine["Express Backend & Mongoose"]
        ServerlessFunc --> DBCheck{Cached DB\nConnection?}
        DBCheck -->|No| MongoConnect[Connect to MongoDB Atlas\n(maxPoolSize: 10)]
        DBCheck -->|Yes| ExpressApp[Express 5 App\napp.js]
        MongoConnect --> ExpressApp
        
        ExpressApp --> Security[Helmet & CORS]
        Security --> Router[userRoutes]
        Router --> Validator[express-validator]
        Validator --> Controller[userController]
        Controller --> UserModel[Mongoose User Model\n(bcrypt pre-save)]
    end

    subgraph DatabaseCloud["Cloud Database"]
        UserModel -->|Mongoose Queries| Atlas[(MongoDB Atlas Cloud)]
    end
```

---

## Technology Stack

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React | ^18.3.1 | Component-based interactive UI |
| **Frontend Bundler** | Vite | ^5.4.14 | Ultra-fast development server & production builder |
| **Styling** | Tailwind CSS | ^3.4.17 | Modern utility-first CSS design system |
| **Icons** | Lucide React | ^0.475.0 | Clean, accessible SVG iconography |
| **Routing** | React Router DOM | ^6.28.2 | Single-page application routing (`/`, `/dashboard`) |
| **Backend Runtime** | Node.js | v24+ | Server-side JavaScript runtime environment |
| **Web Framework** | Express.js | ^5.3.0 | RESTful API server |
| **Database ODM** | Mongoose | ^9.11.2 | Schema definitions, validation, and connection caching |
| **Database** | MongoDB Atlas | v7.x / 8.x | Document-oriented cloud NoSQL database |
| **Password Security** | bcryptjs | ^3.0.3 | 10-round salted cryptographic one-way hashing |
| **Request Validation** | express-validator | ^7.3.2 | Declarative validation rules for bodies and params |
| **HTTP Security** | Helmet & CORS | ^8.3.0 / ^2.8.6 | Secure HTTP headers and Cross-Origin control |
| **Testing** | Jest & Supertest | ^30.5.2 / ^7.3.1 | Automated backend integration test suite (23 tests) |
| **In-Memory Runner** | mongodb-memory-server | ^11.3.0 | Ephemeral MongoDB instance for isolated testing |
| **Deployment Platform**| Vercel | v2 Configuration | Unified static CDN + serverless function hosting |

---

## Project Folder Structure

```
user-management/
├── api/
│   └── index.js                     # Vercel serverless function entry point
├── config/
│   └── db.js                        # Cached MongoDB connection manager for serverless
├── controllers/
│   └── userController.js            # Express handlers (Create, Read, Update, Delete)
├── middleware/
│   ├── errorHandler.js              # Centralized error handler (400, 404, 409, 500)
│   ├── notFound.js                  # 404 handler for undefined routes
│   └── validate.js                  # express-validator rules and validation formatter
├── models/
│   └── User.js                      # Mongoose schema, bcrypt pre-save, safe serialization
├── routes/
│   └── userRoutes.js                # Express routing for /api/users
├── tests/
│   └── user.test.js                 # 23 integration tests (Jest + Supertest)
├── postman/
│   └── User-Management-API.postman_collection.json # Complete Postman collection
├── screenshots/
│   └── README.md                    # Visual testing evidence documentation
├── client/                          # React + Vite frontend application
│   ├── src/
│   │   ├── components/
│   │   │   ├── DeleteConfirmation.jsx   # Permanent deletion confirmation modal
│   │   │   ├── EmptyState.jsx           # Zero-users, zero-search, and error fallback states
│   │   │   ├── Footer.jsx               # Branded footer with stack overview
│   │   │   ├── LoadingState.jsx         # Shimmer skeleton loader
│   │   │   ├── Navbar.jsx               # Navigation bar with live health telemetry
│   │   │   ├── SearchBar.jsx            # Live query, sorting, and refresh controls
│   │   │   ├── Sidebar.jsx              # Admin navigation and system status drawer
│   │   │   ├── StatCard.jsx             # Real API metric summary cards
│   │   │   ├── Toast.jsx                # Toast notification system
│   │   │   ├── UserDetailsModal.jsx     # Read-only user inspector with copy ID
│   │   │   ├── UserFormModal.jsx        # Dual-mode modal for Create & Edit user
│   │   │   └── UsersTable.jsx           # Paginated table with deterministic avatars
│   │   ├── hooks/
│   │   │   └── useBackendHealth.js      # Polling hook for /api/health status
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx            # Full CRUD admin dashboard
│   │   │   └── Home.jsx                 # Landing page with interactive API docs
│   │   ├── services/
│   │   │   └── api.js                   # Centralized API service with normalized relative requests
│   │   ├── App.jsx                      # App root with routing & ToastProvider
│   │   ├── index.css                    # Tailwind directives & design tokens
│   │   └── main.jsx                     # Vite React entry point
│   ├── index.html                       # HTML template with SEO meta and Inter font
│   ├── package.json                     # Client dependencies
│   ├── postcss.config.js                # PostCSS configuration
│   ├── tailwind.config.js               # Tailwind custom color palette
│   ├── vite.config.js                   # Vite dev proxy configuration for /api
│   ├── .env.example                     # Client environment template
│   └── .env                             # Client local environment variables
├── .env.example                     # Root backend environment template
├── .env                             # Local backend environment variables (git-ignored)
├── .gitignore                       # Git exclusions (preserves .env.example)
├── app.js                           # Express application assembly
├── package.json                     # Root scripts and backend dependencies
├── README.md                        # Project documentation
├── server.js                        # Local Node HTTP server listener
└── vercel.json                      # Vercel deployment & routing configuration
```

---

## Vercel Full-Stack Deployment Guide

### Single-Domain Architecture
The deployment uses a single Vercel project configuration (`vercel.json`):
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "client/dist",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/index.js"
    },
    {
      "source": "/((?!api/).*)",
      "destination": "/index.html"
    }
  ]
}
```
- **Static Assets**: Vite compiles the frontend into `client/dist`. Vercel automatically deploys these assets to its global edge network.
- **Client-Side Routing**: The negative-lookahead rewrite `/((?!api/).*)` routes all non-API requests (such as `/` and `/dashboard`) to `/index.html`, allowing React Router to handle page reloads without 404s.
- **Serverless API**: Requests matching `/api/:path*` (such as `/api/health`, `/api/users`, `/api/users/:id`) execute the serverless function [`api/index.js`](file:///d:/Project/User%20Management/api/index.js).

---

### Step-by-Step Vercel Deployment

1. **Commit and Push to GitHub**:
   Ensure your local changes are committed and pushed to your GitHub repository:
   ```bash
   git add .
   git commit -m "feat: configure full-stack Vercel deployment with serverless API and Vite SPA"
   git push origin master
   ```

2. **Log into Vercel**:
   Go to [vercel.com](https://vercel.com) and log in with your GitHub account.

3. **Import Project**:
   - Click **"Add New..."** &rarr; **"Project"**.
   - Select your repository: **`Abhi-2516/User-Management`**.

4. **Configure Project Settings in Vercel Dashboard**:
   - **Framework Preset**: `Other` (or `Vite`)
   - **Root Directory**: Leave as `./` (Project root)
   - **Build & Development Settings**:
     - *Build Command*: Leave default or set `npm run build`
     - *Output Directory*: Leave default or set `client/dist` (Vercel automatically detects this from `vercel.json`)
     - *Install Command*: Leave default (`npm install`) or set `npm install && npm install --prefix client`

5. **Configure Environment Variables in Vercel**:
   Under the **"Environment Variables"** section, add:

   | Key | Value | Notes |
   | :--- | :--- | :--- |
   | `MONGODB_URI` | `mongodb+srv://<username>:<password>@cluster0.mongodb.net/user_management?retryWrites=true&w=majority` | Your MongoDB Atlas connection string |
   | `NODE_ENV` | `production` | Enables production optimizations |

   > **Note on Frontend API URL**: Do **NOT** set `VITE_API_BASE_URL` on Vercel. Leaving it empty enables the client to use relative same-origin paths (`/api/users`), which guarantees seamless communication without CORS.

6. **Click "Deploy"**:
   Vercel will install dependencies, build the Vite frontend, bundle the serverless Express function, and provide you with a live production URL (e.g., `https://user-management-xxx.vercel.app`).

---

### MongoDB Atlas Network Configuration

Because Vercel Serverless Functions execute on dynamic IP addresses, you must whitelist all outbound IPs in MongoDB Atlas:
1. Open the [MongoDB Atlas Dashboard](https://cloud.mongodb.com/).
2. Navigate to **Security** &rarr; **Network Access**.
3. Click **"Add IP Address"**.
4. Click **"Allow Access from Anywhere"** (`0.0.0.0/0`).
5. Click **"Confirm"**.

---

## Prerequisites

- **Node.js**: v18.x or v20+ (tested on v24.19.0)
- **npm**: v9+ (tested on v11.17.0)
- **MongoDB**: Local MongoDB instance (`mongodb://127.0.0.1:27017/user_management`) or a MongoDB Atlas cluster URI.

---

## Installation & Local Setup

1. **Clone or navigate to the repository**:
   ```bash
   cd "d:/Project/User Management"
   ```

2. **Install root and client dependencies**:
   ```bash
   npm install
   npm install --prefix client
   ```

3. **Configure Local Environment Files**:
   - Root `.env`:
     ```env
     PORT=5000
     NODE_ENV=development
     MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/user_management?retryWrites=true&w=majority
     ```
   - Client `client/.env`:
     ```env
     # Leave empty to use Vite proxy (forwards /api to localhost:5000)
     VITE_API_BASE_URL=
     ```

---

## Running the Application Locally

### Run Both Simultaneously (Recommended)
```bash
npm run dev
```
- **Backend Express API**: `http://localhost:5000`
- **Frontend Vite Client**: `http://localhost:5173` (with `/api` transparently proxied to port 5000)

### Or Run Individually
- **Backend Only**:
  ```bash
  npm run dev:server
  ```
- **Frontend Only**:
  ```bash
  npm run dev:client
  ```

---

## Running Automated Tests

Run the full integration test suite with Jest:
```bash
npm test
```

### Test Coverage Highlights
All **23 automated tests** pass cleanly with zero configuration needed, using an isolated in-memory runner (`mongodb-memory-server`):
- **POST `/api/users`**: Successful creation (201), missing fields validation (400), invalid email rejection (400), short password rejection (400), duplicate email conflict (409).
- **GET `/api/users`**: Empty database response (200), user list sorted by newest first (200).
- **GET `/api/users/:id`**: Valid user retrieval (200), malformed ID format error (400), nonexistent user (404).
- **PATCH `/api/users/:id`**: Update name (200), update email (200), duplicate email conflict (409), password update with re-hashing (200), unsupported fields rejection (400), empty body rejection (400), nonexistent ID (404).
- **DELETE `/api/users/:id`**: Successful deletion (200), nonexistent ID (404), malformed ID (400).
- **Security & Infrastructure**: Zero exposure of password hashes in any serialization, 404 for unknown routes, 200 on `/api/health`.

---

## API Endpoints & Contracts

### HTTP Status Codes

| Code | Status | Usage |
| :--- | :--- | :--- |
| `200` | **OK** | Successful retrieval, update, or deletion |
| `201` | **Created** | Successful creation of a new user record |
| `400` | **Bad Request** | Validation failure, malformed JSON, or invalid ObjectId |
| `404` | **Not Found** | Target user ID does not exist or route is undefined |
| `409` | **Conflict** | Attempted to register or update to an existing email address |
| `500` | **Internal Server Error** | Database connection error or unhandled exception |

### Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Serves React landing page (or root API JSON if requested with Accept: application/json) |
| `GET` | `/api` | Root API discovery endpoint returning status and endpoints |
| `GET` | `/api/health` | Health check endpoint returning status and ISO timestamp |
| `POST` | `/api/users` | Creates a new user with bcrypt password hashing |
| `GET` | `/api/users` | Retrieves all users sorted by `createdAt: -1` |
| `GET` | `/api/users/:id` | Retrieves a single user record by MongoDB ID |
| `PATCH` | `/api/users/:id` | Selectively updates `fullName`, `email`, or `password` |
| `DELETE` | `/api/users/:id` | Permanently deletes a user by MongoDB ID |

---

## Security Considerations

1. **Password Encryption**:
   - Every password is encrypted with `bcryptjs` using 10 salt rounds inside Mongoose pre-save hooks.
   - Plain text passwords exist in memory only during hashing and are never logged or stored.
2. **Strict Zero Hash Exposure**:
   - The User schema defines `password: { select: false }`.
   - The Mongoose `toJSON` and `toObject` transform functions explicitly execute `delete ret.password` and `delete ret.__v`.
   - Automated tests explicitly test JSON serialization against regex patterns to ensure bcrypt signatures (`$2a$`, `$2b$`) never escape the backend.
3. **HTTP Header Hardening**:
   - Helmet middleware applies `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, and removes `X-Powered-By`.
4. **CORS Governance**:
   - Configured to allow verified local development ports while permitting same-origin requests in production.
5. **No Direct Database Access from Browser**:
   - The React frontend communicates strictly with the Express REST API. MongoDB credentials and connection strings are isolated to backend environment variables.

---

## Postman Collection & Verification Guide

A complete Postman collection is included at:
`postman/User-Management-API.postman_collection.json`

### Importing & Running in Postman
1. Open Postman.
2. Click **Import** (top left) and choose `postman/User-Management-API.postman_collection.json`.
3. Set the collection variable `baseUrl` to:
   - For local testing: `http://localhost:5000`
   - For deployed testing: `https://your-app.vercel.app`
4. Run requests `01` through `13` sequentially or trigger the **Collection Runner**.
   - Request `02` automatically saves the generated user ID into the `{{userId}}` environment variable, enabling seamless execution of `GET`, `PATCH`, and `DELETE` without manual copying.

---

## Screenshot Verification Checklist

When presenting this project for an internship or technical interview, capture the following screenshots:

- [ ] **`01_landing_page_hero.png`**: Landing page showing the brand "UserFlow", headline, and live "API Connected" status pill.
- [ ] **`02_landing_page_api_docs.png`**: Interactive REST API documentation explorer on the landing page showing formatted request/response payloads.
- [ ] **`03_dashboard_overview.png`**: Admin dashboard at `/dashboard` with real summary cards, search bar, and populated users table.
- [ ] **`04_create_user_modal.png`**: "Add User" modal displaying input validation and required field indicators.
- [ ] **`05_create_user_success_toast.png`**: Success toast and instant table update after creating a new user record.
- [ ] **`06_user_details_modal.png`**: Detailed user view displaying MongoDB ID, timestamps, and security guarantee banner.
- [ ] **`07_edit_user_modal.png`**: Edit modal prefilled with current public user information and optional password change.
- [ ] **`08_search_and_filter.png`**: Real-time filtering showing matching results and updated "Shown Records" stat card.
- [ ] **`09_delete_confirmation_modal.png`**: Permanent delete confirmation dialog showing the target user's name and email.
- [ ] **`10_empty_state.png`**: Zero-users or zero-search results empty state with clear calls to action.
- [ ] **`11_automated_test_suite_passing.png`**: Terminal showing `npm test` with all 23 tests passing.
- [ ] **`12_client_production_build.png`**: Terminal showing `npm run build` completing with 0 errors.

---

## Troubleshooting Common Issues

### 1. `MongooseServerSelectionError: connection timed out` on Vercel
- **Cause**: MongoDB Atlas has not whitelisted Vercel's IP addresses.
- **Solution**: In MongoDB Atlas &rarr; Network Access, add `0.0.0.0/0` (Allow Access from Anywhere).

### 2. `MONGODB_URI is not defined in environment variables` on Vercel
- **Cause**: The environment variable was not configured in the Vercel project settings.
- **Solution**: Go to Vercel Project Settings &rarr; Environment Variables, add `MONGODB_URI`, and redeploy.

### 3. Frontend Shows "API Offline"
- **Cause**: Serverless function cold start timeout or database connection failure.
- **Solution**: Check Vercel Function logs under the **"Logs"** tab to inspect the exact exception.

---

## Git & GitHub Submission Guide

Follow these commands to push your project to GitHub:

### 1. Verify Status
```bash
git status
```

### 2. Stage Changes & Commit
```bash
git add .
git commit -m "feat: configure full-stack Vercel deployment with serverless API and Vite SPA"
```

### 3. Push to GitHub
```bash
git push origin master
```
