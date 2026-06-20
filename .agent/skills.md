# AI Agent Development Guidelines

Welcome, AI coding agent. This document outlines the architectural standards, conventions, and security rules for this codebase. Read and follow these instructions strictly before proposing edits.

---

## 1. Folder Architecture (No `src` folder)

* `app/`: Routing pages, layouts, and route groups. Keep pages thin; defer business logic to `services` and UI templates to `components`.
* `components/ui/`: Reusable, atomic dumb UI primitives (buttons, inputs, cards). Avoid domain-specific states here.
* `components/shared/`: Layout containers (Sidebar, Header, Breadcrumbs, Dropdowns).
* `features/`: Modular domain specific files (page subcomponents, features state slices).
* `hooks/`: Reusable generic hooks (`useLocalStorage`, `useDebounce`).
* `lib/`: Configuration instances (axios clients, NextAuth configurations, central helpers).
* `providers/`: Application provider elements (Redux, Session, Theme).
* `services/`: API services decoupled from UI controllers. Supports fallback mocks.
* `store/`: State manager configuration (`store.ts`, `hooks.ts`, slices).
* `types/`: Core TypeScript type declarations and ambient next-auth extensions.
* `config/`: Application environment and menu manifests.

---

## 2. Next.js 16 & React 19 Conventions

* **Asynchronous cookies & headers**: All Next.js dynamic context handlers return promises. You MUST await them:
  ```typescript
  // CORRECT
  const cookieStore = await cookies();
  const token = cookieStore.get('token');
  ```
* **No `src/` Parent folder**: All directories reside in the project root.
* **Stand-alone deployment builds**: Docker containers run on built-in standalone outputs. Keep `output: 'standalone'` in `next.config.ts`.
* **Path Aliases**: Use `@/` for absolute imports mapping to root paths (e.g. `@/components/ui/button`).

---

## 3. Tailwind CSS v4 Conventions

* **No `tailwind.config.js`**: Tailwind CSS v4 uses a CSS-first configuration pipeline.
* **Custom Theme styling**: Custom colors, borders, and variables belong in `@theme` blocks inside `app/globals.css`:
  ```css
  @theme {
    --color-indigo-650: #4f46e5;
  }
  ```
* **Design Systems**: Rely on utility classes. Use semantic HSL custom properties for theme colors so light/dark toggles work out-of-the-box.

---

## 4. API & Axios Conventions

* **Central Client**: Always interact via the preconfigured `apiClient` in `@/lib/api/axios`.
* **Token refresh**: Request intercepts auto-inject Bearer tokens. Response intercepts catch 401s to fire refresh operations, queueing failing transactions automatically.
* **Decoupled Mock States**: Maintain simulated delays and mock returns in services (e.g., `auth.service.ts`) using a `USE_MOCKS` check to facilitate out-of-the-box developer testing.

---

## 5. Redux State Management

* **No Server leaking**: Always export store building functions (`makeStore()`) inside `store.ts` to ensure independent instances are generated per request, avoiding server-side state bleeding.
* **TypeScript Hook Safety**: Never use `useDispatch` or `useSelector` raw. Import wrappers:
  ```typescript
  import { useAppDispatch, useAppSelector } from '@/store/hooks';
  ```

---

## 6. Security & Documentation Rules

* **Server Actions**: Always run authorization checks inside server methods or database handlers.
* **Env variable Validation**: Zod parses all environment items. Never import raw `process.env` directly; import the typed validator `import { env } from '@/config/env'`.
* **Document edits**: Write detailed JSDocs detailing "WHO should use it" and "WHEN to modify" above every newly added configuration file or api handler.
