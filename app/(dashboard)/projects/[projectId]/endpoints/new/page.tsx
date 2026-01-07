import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default async function NewEndpointPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;

  async function createEndpoint(formData: FormData) {
    'use server';
    
    const title = formData.get('title') as string;
    const method = formData.get('method') as string;
    const path = formData.get('path') as string;
    
    if (!title || !path) return;

    // Ensure path starts with /
    const safePath = path.startsWith('/') ? path : `/${path}`;

    const endpoint = await prisma.endpoint.create({
      data: {
        projectId,
        title,
        method,
        path: safePath,
        security: 'secure',
        roles: [], // default empty roles
        requestSpec: { type: 'object', properties: [] }, // Default empty object body
        responseSpec: {},
        promptPrefs: { cleanCode: true, bestPractice: true, noExtraComments: true },
        techNotes: '',
        personaMode: 'auto',
      },
    });

    redirect(`/projects/${projectId}/endpoints/${endpoint.id}`);
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <div className="mb-8">
        <Link href={`/projects/${projectId}`} className="inline-flex items-center text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-4 transition-colors">
          <ChevronLeft size={16} className="mr-1" />
          Back to Project
        </Link>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">New Endpoint</h1>
      </div>

      <div className="bg-white dark:bg-[#1e2936] p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <form action={createEndpoint} className="flex flex-col gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              Endpoint Title <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              name="title"
              id="title"
              placeholder="e.g. Get User Profile"
              required
              autoFocus
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
                <label htmlFor="method" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Method
                </label>
                <select
                name="method"
                id="method"
                className="block w-full rounded-lg border-0 py-2.5 px-3 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-200 dark:ring-slate-700 bg-slate-50 dark:bg-[#111a22] focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="PATCH">PATCH</option>
                    <option value="DELETE">DELETE</option>
                </select>
            </div>
            <div className="md:col-span-3">
                <label htmlFor="path" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Path <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        /
                    </div>
                    <Input
                    type="text"
                    name="path"
                    id="path"
                    placeholder="users/{id}"
                    className="pl-7"
                    required
                    />
                </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Link href={`/projects/${projectId}`}>
              <Button type="button" variant="ghost">Cancel</Button>
            </Link>
            <Button type="submit">Create & Design</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
