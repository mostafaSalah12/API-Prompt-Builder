'use client';

interface PersonaSelectorProps {
  mode: string | null;
  personaKey: string | null;
  onChange: (field: string, value: unknown) => void;
}

export function PersonaSelector({ personaKey, onChange }: PersonaSelectorProps) {
    const currentKey = personaKey || 'senior';

    const personas = [
        { id: 'senior', name: 'Senior Engineer', desc: 'Balanced, pragmatic' },
        { id: 'staff', name: 'Staff Engineer', desc: 'Scalable, robust' },
        { id: 'security', name: 'Security Expert', desc: 'Paranoid, secure' },
        { id: 'minimalist', name: 'Minimalist', desc: 'Code golf, short' },
    ];

    return (
        <div className="flex items-center gap-2">
             <div className="relative">
                 <select 
                    value={currentKey}
                    onChange={(e) => onChange('personaKey', e.target.value)}
                    className="h-9 pl-3 pr-8 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                 >
                     {personas.map(p => (
                         <option key={p.id} value={p.id}>{p.name}</option>
                     ))}
                 </select>
                 <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-slate-500">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                 </div>
             </div>
        </div>
    );
}
