import Link from 'next/link';
import { Box, LogOut } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { logout } from '@/app/actions/auth';

export function Header() {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111a22] px-6 py-3 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="size-8 flex items-center justify-center text-blue-600 bg-blue-50 dark:bg-blue-500/10 rounded-lg group-hover:scale-105 transition-transform">
            <Box size={20} strokeWidth={3} />
          </div>
          <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight">
            Prompt Builder
          </h2>
        </Link>
      </div>

      <div className="flex flex-1 justify-end gap-6 items-center">
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-500 text-sm font-medium transition-colors">
            Dashboard
          </Link>
          <Link href="/docs" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-500 text-sm font-medium transition-colors">
            Documentation
          </Link>

        </nav>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden md:block"></div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-green-500 font-medium bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
            Local Sync Active
          </div>

          <ThemeToggle />

          <form action={logout}>
            <button className="text-slate-400 hover:text-red-500 transition-colors p-1" title="Logout">
              <LogOut size={20} />
            </button>
          </form>
          
          <div className="size-9 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden ring-2 ring-slate-100 dark:ring-slate-800 cursor-pointer hover:ring-blue-500 transition-all">
             {/* Robot Avatar */}
             <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Robot" alt="User" />
          </div>
        </div>
      </div>
    </header>
  );
}
