'use client';

import { useActionState, useState } from 'react';
import { register } from '@/app/actions/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function RegisterForm() {
  const [state, action, isPending] = useActionState(register, null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const isValid = username.length > 0 && password.length > 0 && name.length > 0;

  return (
    <form action={action} className="space-y-4">
      {state?.error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-900/50 rounded-lg">
          {state.error}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
        <Input 
            name="name" 
            type="text" 
            placeholder="e.g. John Doe" 
            required 
            className="w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isPending}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Username</label>
        <Input 
            name="username" 
            type="text" 
            placeholder="Choose a username" 
            required 
            className="w-full" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isPending}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
        <Input 
            name="password" 
            type="password" 
            placeholder="••••••••" 
            required 
            className="w-full" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isPending}
        />
      </div>
      
      <Button 
        type="submit" 
        disabled={!isValid || isPending}
        className={`w-full mt-6 transition-all duration-300 ${isValid && !isPending ? 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/20' : 'opacity-50 cursor-not-allowed'}`}
      >
        {isPending ? 'Creating Account...' : 'Create Admin Account'}
      </Button>
    </form>
  );
}
