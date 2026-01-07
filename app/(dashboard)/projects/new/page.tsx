'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { ProjectIconSelector } from '@/components/project/ProjectIconSelector';
import { createProject } from '../actions';

export default function NewProjectPage() {
  const [appearance, setAppearance] = useState({ icon: 'Folder', color: 'blue' });

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-4 transition-colors">
          <ChevronLeft size={16} className="mr-1" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Create New Project</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Start a new collection of API endpoints.
        </p>
      </div>

      <div className="bg-white dark:bg-[#1e2936] p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <form action={createProject} className="flex flex-col gap-6">
            <input type="hidden" name="icon" value={appearance.icon} />
            <input type="hidden" name="color" value={appearance.color} />
            
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              Project Name <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              name="name"
              id="name"
              placeholder="e.g. E-commerce API"
              required
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              Description <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <textarea
              name="description"
              id="description"
              rows={4}
              className="block w-full rounded-lg border-0 py-2.5 px-3 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-200 dark:ring-slate-700 placeholder:text-slate-400 bg-slate-50 dark:bg-[#111a22] focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-shadow"
              placeholder="What is this project for?"
            />
          </div>

          <ProjectIconSelector value={appearance} onChange={setAppearance} />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Link href="/">
              <Button type="button" variant="ghost">Cancel</Button>
            </Link>
            <Button type="submit">Create Project</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
