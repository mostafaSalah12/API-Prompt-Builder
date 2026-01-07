'use client';

import { Search, ChevronDown, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

// Debounce helper
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
  let timeout: NodeJS.Timeout;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function EndpointListControls() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState<{method: boolean, security: boolean, role: boolean}>({
    method: false, security: false, role: false
  });

  // Refs for click outside
  const methodRef = useRef<HTMLDivElement>(null);
  const securityRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (methodRef.current && !methodRef.current.contains(event.target as Node)) {
        setIsOpen(prev => ({ ...prev, method: false }));
      }
      if (securityRef.current && !securityRef.current.contains(event.target as Node)) {
        setIsOpen(prev => ({ ...prev, security: false }));
      }
      if (roleRef.current && !roleRef.current.contains(event.target as Node)) {
        setIsOpen(prev => ({ ...prev, role: false }));
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set('search', term);
    } else {
      params.delete('search');
    }
    router.replace(`?${params.toString()}`);
  };

  const handleFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.replace(`?${params.toString()}`);
    setIsOpen(prev => ({ ...prev, [key]: false }));
  };

  const debouncedSearch = debounce(handleSearch, 300);

  const currentMethod = searchParams.get('method');
  const currentSecurity = searchParams.get('security');
  const currentRole = searchParams.get('role');

  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
  const securities = ['secure', 'public'];
  // Roles could be dynamic, but hardcoding common ones for filter UI or free text if needed.
  // For now let's assume standard 'admin', 'user'. Ideally we'd scan available roles or allow free input.
  // Let's stick to a few presets + maybe allow custom in future.
  const roles = ['admin', 'user', 'guest']; 

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-[#1e2936] p-1 rounded-xl border border-slate-200 dark:border-slate-800">
        {/* Search */}
        <div className="relative w-full md:max-w-md h-12 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600">
                <Search size={20} />
            </div>
            <input 
                className="block w-full h-full pl-10 pr-3 py-2 bg-slate-50 dark:bg-[#111a22] border-transparent rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all sm:text-sm" 
                placeholder="Search endpoints by path or title..." 
                type="text"
                defaultValue={searchParams.get('search') || ''}
                onChange={(e) => debouncedSearch(e.target.value)}
            />
        </div>
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto font-medium">
            
            {/* Method Filter */}
            <div className="relative" ref={methodRef}>
                <div 
                    onClick={() => setIsOpen(prev => ({...prev, method: !prev.method}))}
                    className={`flex items-center gap-2 px-3 h-10 rounded-lg border cursor-pointer transition-colors whitespace-nowrap ${currentMethod ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400' : 'bg-slate-50 dark:bg-[#111a22] border-transparent hover:border-slate-300 dark:hover:border-slate-600'}`}
                >
                    <span className="text-slate-500 text-sm">Method:</span>
                    <span className={`text-sm font-semibold ${currentMethod ? '' : 'text-slate-900 dark:text-white'}`}>{currentMethod || 'All'}</span>
                    {currentMethod ? <X size={14} className="hover:text-red-500" onClick={(e) => { e.stopPropagation(); handleFilter('method', null); }}/> : <ChevronDown size={16} className="text-slate-400" />}
                </div>
                {isOpen.method && (
                    <div className="absolute top-full right-0 mt-2 w-32 bg-white dark:bg-[#1e2936] rounded-lg shadow-xl border border-slate-200 dark:border-slate-800 z-10 py-1">
                        <div onClick={() => handleFilter('method', null)} className="px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer text-slate-500">All</div>
                        {methods.map(m => (
                            <div key={m} onClick={() => handleFilter('method', m)} className="px-4 py-2 text-sm text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer font-medium">
                                {m}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Security Filter */}
            <div className="relative" ref={securityRef}>
                <div 
                    onClick={() => setIsOpen(prev => ({...prev, security: !prev.security}))}
                    className={`flex items-center gap-2 px-3 h-10 rounded-lg border cursor-pointer transition-colors whitespace-nowrap ${currentSecurity ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400' : 'bg-slate-50 dark:bg-[#111a22] border-transparent hover:border-slate-300 dark:hover:border-slate-600'}`}
                >
                    <span className="text-slate-500 text-sm">Security:</span>
                    <span className={`text-sm font-semibold ${currentSecurity ? '' : 'text-slate-900 dark:text-white'}`}>{currentSecurity === 'secure' ? 'Secured' : currentSecurity === 'public' ? 'Public' : 'Any'}</span>
                    {currentSecurity ? <X size={14} className="hover:text-red-500" onClick={(e) => { e.stopPropagation(); handleFilter('security', null); }}/> : <ChevronDown size={16} className="text-slate-400" />}
                </div>
                {isOpen.security && (
                    <div className="absolute top-full right-0 mt-2 w-32 bg-white dark:bg-[#1e2936] rounded-lg shadow-xl border border-slate-200 dark:border-slate-800 z-10 py-1">
                        <div onClick={() => handleFilter('security', null)} className="px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer text-slate-500">Any</div>
                        {securities.map(s => (
                            <div key={s} onClick={() => handleFilter('security', s)} className="px-4 py-2 text-sm text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer font-medium">
                                {s === 'secure' ? 'Secured' : 'Public'}
                            </div>
                        ))}
                    </div>
                )}
            </div>

             {/* Role Filter */}
             <div className="relative" ref={roleRef}>
                <div 
                    onClick={() => setIsOpen(prev => ({...prev, role: !prev.role}))}
                    className={`flex items-center gap-2 px-3 h-10 rounded-lg border cursor-pointer transition-colors whitespace-nowrap ${currentRole ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400' : 'bg-slate-50 dark:bg-[#111a22] border-transparent hover:border-slate-300 dark:hover:border-slate-600'}`}
                >
                    <span className="text-slate-500 text-sm">Role:</span>
                    <span className={`text-sm font-semibold ${currentRole ? '' : 'text-slate-900 dark:text-white'}`}>{currentRole || 'All'}</span>
                    {currentRole ? <X size={14} className="hover:text-red-500" onClick={(e) => { e.stopPropagation(); handleFilter('role', null); }}/> : <ChevronDown size={16} className="text-slate-400" />}
                </div>
                {isOpen.role && (
                    <div className="absolute top-full right-0 mt-2 w-32 bg-white dark:bg-[#1e2936] rounded-lg shadow-xl border border-slate-200 dark:border-slate-800 z-10 py-1">
                        <div onClick={() => handleFilter('role', null)} className="px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer text-slate-500">All</div>
                        {roles.map(r => (
                            <div key={r} onClick={() => handleFilter('role', r)} className="px-4 py-2 text-sm text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer font-medium">
                                {r}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    </div>
  );
}
