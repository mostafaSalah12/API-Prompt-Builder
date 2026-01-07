'use client';

import { Box } from 'lucide-react';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterPage() {

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0b1116] p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#1e2936] rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8">
        <div className="flex flex-col items-center mb-8">
            <div className="size-12 flex items-center justify-center text-green-600 bg-green-50 dark:bg-green-500/10 rounded-xl mb-4">
                 <Box size={28} strokeWidth={3} />
            </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Setup Admin Account</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-center">
            Create your admin account to get started.
          </p>
        </div>

        <RegisterForm />
      </div>
    </div>
  );
}
