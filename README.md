# Next.js Enterprise SaaS Starter Template

A production-grade, highly-scalable Next.js starter template designed for software agencies to accelerate client project setups. This starter features a decoupled backend architecture, centralized Redux state management, robust authentication via NextAuth, and automated CI/CD configurations.

---

## 🚀 Tech Stack

* **Framework**: Next.js 16 (App Router)
* **Language**: TypeScript (Strict Mode)
* **Styling**: Tailwind CSS v4 (CSS-first config) & Lucide Icons
* **State Management**: Redux Toolkit & React Redux
* **Session & Auth**: NextAuth.js (Credentials Provider)
* **Forms & Validation**: React Hook Form & Zod
* **Client Layer**: Axios (Auto request header inject + Token Refresh Interceptor)
* **DevOps**: Docker, Docker Compose, GitHub Actions CI Pipeline
* **Linting & Quality**: Prettier, ESLint, Commitlint

---

## 📂 Project Structure

This project uses a root-level architecture (no `src/` directory).

```text
├── .agent/                  # AI agent guidelines and standards
├── .github/workflows/       # GitHub Actions CI configurations
├── app/                     # Next.js pages, layouts, and route groups
│   ├── (auth)/              # Public route group (login, signup, recover)
│   ├── (dashboard)/         # Private route group (dashboard, settings)
│   │   └── admin/           # Admin-only panels (RBAC protected)
│   ├── api/                 # Next.js backend API routes
│   ├── globals.css          # Tailwind CSS v4 entry
│   └── layout.tsx           # Global HTML wrapper
├── components/
│   ├── ui/                  # Atomic reusable components (button, input, card)
│   └── shared/              # Structural shells (sidebar, header, breadcrumbs)
├── config/                  # Configuration files (env validation schema)
├── lib/
│   ├── api/                 # Axios clients and decoupled services
│   ├── auth.ts              # NextAuth core providers and callbacks
│   └── utils.ts             # Tailwind class merging helpers
├── providers/               # Client-side React context wrappers
├── store/                   # Redux state configuration and slices
├── types/                   # Ambient TypeScript typings
└── .env.example             # Environment template
```

### Folder Conventions
* **`app/`**: Contains client pages and server views.
  * *What belongs*: Layout files, Page files, Route groups, and API handlers.
  * *What never belongs*: Reusable dumb UI components or generic data fetch functions.
* **`components/ui/`**: Pure atomic UI elements.
  * *What belongs*: Buttons, Inputs, Cards, Badges.
  * *What never belongs*: NextAuth session hooks or Redux dispatch calls.
* **`lib/api/`**: Centralized API clients.
  * *What belongs*: Service modules (`auth.service.ts`), endpoints mappings, Axios clients.
  * *What never belongs*: React client components or styling stylesheets.

---

## 🛠️ Getting Started

### Prerequisites
* **Node.js**: v20 or higher
* **Package Manager**: npm

### Installation
1. Clone the repository and navigate into the folder:
   ```bash
   git clone <repo-url> next_js_starter
   cd next_js_starter
   ```
2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

### Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🔒 Environment Management

The project uses Zod to validate environment variables during boot. All keys are verified inside `config/env.ts`.

| Variable Name | Purpose | Example |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Decoupled backend target endpoint | `https://api.example.com` |
| `NEXTAUTH_SECRET` | NextAuth cryptographic cookie key | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Main application URL | `http://localhost:3000` |

> [!CAUTION]
> Never commit `.env` files containing production secrets to version control. Maintain `.env` keys securely inside target hosts or CI secrets.

---

## 🔒 Route Architecture & Access Control (RBAC)

The project separates route files using Next.js **Route Groups** and guards them in `middleware.ts`:

1. **Public Forms** (`/auth/login`, `/auth/signup`, `/auth/forgot-password`, `/auth/reset-password`):
   * Handled inside the `(auth)` group.
   * Authenticated users are automatically redirected to `/dashboard` if they attempt to access these pages.
2. **Private Portal** (`/dashboard`, `/settings`):
   * Handled inside the `(dashboard)` group.
   * Requires a valid session token. Unauthenticated users are redirected to `/auth/login`.
3. **Admin Center** (`/admin/users`):
   * Handled inside the `(dashboard)/admin` group.
   * Requires a session token with `role === "admin"`. Non-admin users are redirected to `/dashboard` automatically with a warning toast.

---

## 📡 API Layer & Token Refresh Flow

The Axios client in `lib/api/axios.ts` is configured with interceptors:
* **Request Interceptor**: Automatically attaches the active JWT `Bearer <token>` to all request headers when running client-side.
* **Response Interceptor**:
  1. Validates success payloads.
  2. If a request returns a `401 Unauthorized` status, it triggers a **Token Refresh Flow**.
  3. The request is placed in a retry queue while the backend refresh endpoint is called.
  4. Once refreshed, queued requests are executed with the new token.
  5. If the refresh fails, the user is signed out and redirected to the login screen.

*Note: Change `USE_MOCKS = true` in `auth.service.ts` and `user.service.ts` to `false` when connecting to a live backend.*

---

## 🐳 DevOps & Deployment

### Docker Deployment
Build and run the container locally:
```bash
docker-compose up --build
```
The Dockerfile uses a **multi-stage build** caching `node_modules` and utilizing Next.js standalone outputs to shrink image footprints.

### VPS Deployment with Nginx Reverse Proxy
To deploy on a VPS, serve the Next.js process using a Systemd daemon and proxy requests through Nginx:

1. **Systemd Service File (`/etc/systemd/system/nextjs.service`)**:
   ```ini
   [Unit]
   Description=Next.js Web Server
   After=network.target

   [Service]
   Type=simple
   User=deploy
   WorkingDirectory=/home/deploy/app
   ENV_FILE=/home/deploy/app/.env
   ExecStart=/usr/bin/node server.js
   Restart=on-failure

   [Install]
   WantedBy=multi-user.target
   ```
2. **Nginx Host Configuration (`/etc/nginx/sites-available/default`)**:
   ```nginx
   server {
       listen 80;
       server_name app.example.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

---

## 🤝 Git Workflow & Coding Standards

### Branching Strategy
* **`main` / `master`**: Represents production-ready states. Only merges from `release/*` or `hotfix/*` branches.
* **`develop`**: Central integration branch. All feature branches merge here.
* **`feature/<name>`**: New feature additions.
* **`bugfix/<name>`**: Minor bug resolutions.

### Commit Messages
We enforce **Conventional Commits** using Commitlint:
* Format: `<type>(<scope>): <description>` (e.g. `feat(auth): add google signin integration`).
* Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
