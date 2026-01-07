'use client';

import { Endpoint } from '@prisma/client';
import { Input } from '@/components/ui/Input';
import { Info, Shield, X } from 'lucide-react';

interface MetadataEditorProps {
  data: Endpoint;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (field: keyof Endpoint, value: any) => void;
}

export function MetadataEditor({ data, onChange }: MetadataEditorProps) {
  // Roles handling
  const roles = (data.roles as string[]) || [];

  const addRole = (role: string) => {
    if (!role) return;
    if (!roles.includes(role)) {
      onChange('roles', [...roles, role]);
    }
  };

  const removeRole = (role: string) => {
    onChange('roles', roles.filter(r => r !== role));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Endpoint Configuration</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Define the contract and logic for your API route.</p>
        </div>
      </div>

      {/* General Info */}
      <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1e2936] p-5 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-slate-900 dark:text-white font-bold text-base flex items-center gap-2">
            <Info size={18} className="text-blue-500" />
            General Information
          </h3>
        </div>
        <div className="grid gap-5">
          <div className="flex gap-4">
            <div className="w-32">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1.5 block">Method</label>
              <select
                value={data.method}
                onChange={(e) => onChange('method', e.target.value)}
                className={`w-full h-10 rounded-lg border-slate-200 dark:border-slate-700 dark:bg-[#111a22] px-3 text-sm focus:ring-2 focus:ring-blue-500 font-mono font-bold
                  ${data.method === 'GET' ? 'text-blue-600 dark:text-blue-400' : ''}
                  ${data.method === 'POST' ? 'text-green-600 dark:text-green-400' : ''}
                  ${data.method === 'PUT' ? 'text-orange-600 dark:text-orange-400' : ''}
                  ${data.method === 'DELETE' ? 'text-red-600 dark:text-red-400' : ''}
                `}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="PATCH">PATCH</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1.5 block">Endpoint Path</label>
              <div className="relative">
                <Input
                  value={data.path}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('path', e.target.value)}
                  className="font-mono text-sm"
                  placeholder="/api/v1/..."
                />
              </div>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1.5 block">Business Scenario</label>
            <textarea
              value={data.businessDesc || ''}
              onChange={(e) => onChange('businessDesc', e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#111a22] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white p-3 text-sm focus:ring-2 focus:ring-blue-500 resize-none h-20 placeholder:text-slate-400"
              placeholder="Describe the business logic and goals for this endpoint..."
            />
          </div>
        </div>
      </section>

      {/* Module Info */}
      <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1e2936] p-5 shadow-sm">
        <div className="flex items-center justify-between mb-5">
            <h3 className="text-slate-900 dark:text-white font-bold text-base flex items-center gap-2">
                Module Information
            </h3>
        </div>
        <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1.5 block">Module / Package Name</label>
            <Input
              value={data.moduleName || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('moduleName', e.target.value)}
              className="font-mono text-sm max-w-md"
              placeholder="e.g. auth, payments, users"
            />
        </div>
      </section>

      {/* Security */}
      <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1e2936] p-5 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-slate-900 dark:text-white font-bold text-base flex items-center gap-2">
            <Shield size={18} className="text-blue-500" />
            Security & Access
          </h3>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={data.security === 'secure'}
              onChange={(e) => onChange('security', e.target.checked ? 'secure' : 'open')}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            <span className="ms-3 text-sm font-medium text-slate-700 dark:text-slate-300">Secured Route</span>
          </label>
        </div>


        {data.security === 'secure' && (
          <div className="mb-5 p-4 bg-slate-50 dark:bg-[#111a22] rounded-lg border border-slate-200 dark:border-slate-700">
             <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2 block">
                Authentication Mechanism
             </label>
             <select
                value={data.authMechanism || ''}
                onChange={(e) => onChange('authMechanism' as keyof Endpoint, e.target.value)}
                className="w-full h-10 rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e2936] px-3 text-sm focus:ring-2 focus:ring-blue-500"
             >
                <option value="">Select Mechanism (Default)</option>
                <option value="jwt">JWT (JSON Web Token)</option>
                <option value="bearer">Bearer Token</option>
                <option value="cookie">Session Cookie</option>
                <option value="api_key">API Key (Header)</option>
                <option value="basic">Basic Auth</option>
                <option value="oauth2">OAuth 2.0</option>
             </select>
          </div>
        )}

        <div>
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1.5 block">Required Roles</label>
          <div 
            className="w-full min-h-[40px] bg-slate-50 dark:bg-[#111a22] border border-slate-200 dark:border-slate-700 rounded-lg flex flex-wrap items-center gap-2 p-2 cursor-text"
            onClick={() => document.getElementById('roles-input')?.focus()}
          >
            {roles.map((role) => (
              <span key={role} className="bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 text-xs font-medium px-2.5 py-1 rounded border border-blue-200 dark:border-blue-500/30 flex items-center gap-1">
                {role}
                <button onClick={() => removeRole(role)} className="hover:text-blue-900 dark:hover:text-white">
                    <X size={14} />
                </button>
              </span>
            ))}
            <input
              id="roles-input"
              className="bg-transparent text-sm text-slate-900 dark:text-white focus:outline-none flex-1 min-w-[80px] placeholder:text-slate-400"
              placeholder="Add role + Enter"
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addRole(e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
