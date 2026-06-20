<!-- BEGIN:nextjs-agent-rules -->
# Next.js: ALWAYS read docs before coding

Before any Next.js work, find and read the relevant doc in `node_modules/next/dist/docs/`. Your training data is outdated — the docs are the source of truth.

<!-- END:nextjs-agent-rules -->

# 🚀 Next.js 16 & React 19 Best Practices for this Project

## 1. Directory Structure (No `src` Folder)
* All core directories (`app/`, `components/`, `lib/`, `providers/`, `store/`, `services/`, `types/`) must reside in the **root directory**. Do not create a `src/` parent folder.

## 2. Routing & Page Security (Proxy vs Middleware)
* The `middleware.ts` file convention is deprecated in Next.js 16.
* **Always use Proxy** (`proxy.ts` in the root) for route guarding and redirects.
* The proxy handler must be a named export:
  ```typescript
  export function proxy(request: Request, event: any) { ... }
  ```

## 3. Asynchronous Dynamic APIs (React 19 & Next.js 16)
* Methods like `cookies()` and `headers()` return **Promises**. You must `await` them before reading values:
  ```typescript
  const cookieStore = await cookies();
  const token = cookieStore.get('session');
  ```

## 4. React 19 Ref Usage in Render
* Reading `ref.current` during render is a violation of React 19 guidelines.
* To instantiate singletons or providers only once on the client without render-ref errors, use lazy state initialization:
  ```typescript
  const [store] = useState(() => makeStore());
  ```

## 5. Tailwind CSS v4 CSS-First Configuration
* Do not create a `tailwind.config.js` file.
* Configure custom theme tokens, theme colors, and animations using CSS properties inside `@theme` blocks in `app/globals.css`.

## 6. Type Safety & Catch Parameter Rules
* Never declare catch parameters or component props as `any`.
* Catch parameters must be typed as `unknown` and parsed safely:
  ```typescript
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
  }
  ```

## 7. Quality Assurances
* Before closing your turn, you must run the following validation scripts:
  * **TypeScript check**: `npx tsc --noEmit`
  * **ESLint check**: `npm run lint`
  * **Production check**: `npm run build`

