'use client';


// import { Toggle } from '@/components/ui/Toggle';

interface PromptPreferencesProps {
  value: Record<string, boolean>;
  onChange: (val: Record<string, boolean>) => void;
}

export function PromptPreferences({ value, onChange }: PromptPreferencesProps) {
  const prefs = value || {};

  const toggle = (key: string) => {
    onChange({ ...prefs, [key]: !prefs[key] });
  };

  const options = [
    { key: 'cleanCode', label: 'Clean Code', desc: 'No comments, concise' },
    { key: 'bestPractice', label: 'Best Practices', desc: 'Follow community standards' },
    { key: 'noExtraComments', label: 'No Extra Comments', desc: 'Code only' },
    { key: 'unitTests', label: 'Unit Tests', desc: 'Include Jest specs' },
    { key: 'apiTests', label: 'API Tests', desc: 'Include E2E tests' },
  ];

  return (
    <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1e2936] p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-900 dark:text-white font-bold text-base">
                Additional Preferences
            </h3>
        </div>
        <div className="flex flex-col gap-3">
            {options.map((opt) => (
                <label key={opt.key} className="flex items-center gap-2 cursor-pointer group">
                    <input 
                        type="checkbox" 
                        checked={prefs[opt.key] || false} 
                        onChange={() => toggle(opt.key)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 bg-white dark:bg-[#0b1116] dark:border-slate-700"
                    />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                        {opt.label}
                    </span>
                </label>
            ))}
        </div>
    </section>
  );
}
