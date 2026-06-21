import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { Shield, ArrowRight, CheckCircle2 } from 'lucide-react';

/**
 * Main Application Landing Page (Server Component)
 * 
 * WHO SHOULD USE IT: Public visitors.
 * WHEN TO MODIFY: Customizing landing hero titles, features checklist, or marketing CTAs.
 */
export default async function Home() {
  // Check active user session on the server
  const session = await getServerSession(authOptions);

  // Auto-redirect to dashboard if already authenticated
  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      {/* Navbar header */}
      <header className="h-16 flex items-center justify-between px-6 md:px-12 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white">
            <Shield className="h-4.5 w-4.5" />
          </div>
          <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">
            Enterprise Starter
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors cursor-pointer"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="text-sm font-semibold px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary-hover transition-all cursor-pointer shadow-md shadow-primary/10"
          >
            Register
          </Link>
        </div>
      </header>

      {/* Hero section */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 text-center max-w-4xl mx-auto space-y-8 my-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 dark:bg-primary/5 text-primary text-xs font-bold border border-primary/20">
          <span>Introducing next_js_starter template v0.1.0</span>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Production-Ready <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Next.js Starter Kit
            </span>
          </h1>
          <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Kickstart your client portal SaaS applications with pre-configured authentication, Redux states, Axios request handlers, route RBAC filters, and Docker support.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-xs sm:max-w-none">
          <Link
            href="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-white hover:bg-primary-hover font-semibold transition-all shadow-lg shadow-primary/15 cursor-pointer"
          >
            Explore Client Dashboard <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="https://github.com"
            target="_blank"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl border border-slate-300 bg-white dark:border-slate-800 dark:bg-slate-900 text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850 font-semibold transition-all cursor-pointer"
          >
            Read Github Docs
          </Link>
        </div>

        {/* Feature Grid highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 text-left w-full">
          {[
            { title: 'NextAuth Protection', desc: 'Secure session handling with built-in login redirects and role access checks.' },
            { title: 'Global Redux Store', desc: 'Pre-linked slices coordinating user info, notification queues, and layout actions.' },
            { title: 'Axios Interceptors', desc: 'API clients queueing expired requests for automatic JWT Token Refresh flows.' },
          ].map((feature, idx) => (
            <div key={idx} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/30 backdrop-blur-sm space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                <h4 className="font-bold text-slate-900 dark:text-white">{feature.title}</h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer credits */}
      <footer className="h-16 flex items-center justify-center border-t border-slate-200/50 dark:border-slate-800/50 text-xs text-slate-400 dark:text-slate-500">
        &copy; {new Date().getFullYear()} NextJS Starter Template. Created by Antigravity.
      </footer>
    </div>
  );
}
