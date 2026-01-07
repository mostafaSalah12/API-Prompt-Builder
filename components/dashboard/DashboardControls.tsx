"use client";

import { Search, ArrowUpDown } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export function DashboardControls() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || 'recent';

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('search', term);
    } else {
      params.delete('search');
    }
    router.replace(`/?${params.toString()}`);
  };

  // Simple debounce
  const debouncedSearch = debounce(handleSearch, 300);

  const handleSort = (sort: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', sort);
    router.replace(`/?${params.toString()}`);
  };

  return (
    <div className="bg-white dark:bg-[#1e2936] border border-slate-200 dark:border-slate-800 rounded-xl p-4 mb-8 shadow-sm">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search projects..."
            defaultValue={currentSearch}
            onChange={(e) => debouncedSearch(e.target.value)}
            className="block w-full rounded-lg border-0 py-2.5 pl-10 pr-4 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-200 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 bg-slate-50 dark:bg-[#111a22] sm:text-sm sm:leading-6 transition-shadow"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          <button 
            onClick={() => handleSort('recent')}
            className={`group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap ${currentSort === 'recent' ? 'bg-blue-500/10 text-blue-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
          >
            <span>Most Recent</span>
            {currentSort === 'recent' && <ArrowUpDown size={14} />}
          </button>
          <button 
            onClick={() => handleSort('name')}
            className={`group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap ${currentSort === 'name' ? 'bg-blue-500/10 text-blue-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
          >
            <span>Name (A-Z)</span>
            {currentSort === 'name' && <ArrowUpDown size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
}

function debounce(func: Function, wait: number) {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
