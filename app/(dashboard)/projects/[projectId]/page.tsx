import Link from 'next/link';
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import { 
    Plus, Lock, Globe, Edit, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Endpoint } from '@prisma/client';
import { EndpointListControls } from '@/components/project/EndpointListControls';
import { CopyPromptButton } from '@/components/endpoint/CopyPromptButton';
import { DeleteEndpointButton } from '@/components/endpoint/DeleteEndpointButton';

/**
 * Projects Details Page
 * Lists all endpoints for a specific project.
 */
export default async function ProjectDetailsPage({ params, searchParams }: { params: Promise<{ projectId: string }>, searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const { projectId } = await params;
  const query = await searchParams; // Await searchParams in Next 15

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
        endpoints: {
            orderBy: { updatedAt: 'desc' }
        }
    }
  });

  if (!project) {
    notFound();
  }

  // In-memory filtering
  const searchTerm = query.search?.toLowerCase();
  const filterMethod = query.method;
  const filterSecurity = query.security;
  const filterRole = query.role;

  const filteredEndpoints = project.endpoints.filter((endpoint: Endpoint) => {
    // Search Text
    if (searchTerm) {
        const matchesTitle = endpoint.title.toLowerCase().includes(searchTerm);
        const matchesPath = endpoint.path.toLowerCase().includes(searchTerm);
        if (!matchesTitle && !matchesPath) return false;
    }

    // Filter Method
    if (filterMethod && endpoint.method !== filterMethod) {
        return false;
    }

    // Filter Security
    if (filterSecurity) {
        if (filterSecurity === 'secure' && endpoint.security !== 'secure') return false;
        // 'public' could be null or 'public' or anything else. Assuming 'secure' means secure, everything else is public-ish? 
        // Based on logic below: security === 'secure' ? Secured : Public. So public is anything not 'secure'.
        if (filterSecurity === 'public' && endpoint.security === 'secure') return false; 
    }

    // Filter Role
    if (filterRole) {
        const roles = (endpoint.roles as string[]) || [];
        if (!roles.includes(filterRole)) return false;
    }

    return true;
  });

  return (
    <div className="flex-1 flex flex-col items-center py-8 px-6 sm:px-10 lg:px-20 text-slate-900 dark:text-white">
      <div className="w-full max-w-[1200px] flex flex-col gap-6">
        {/* Breadcrumbs */}
        <nav className="flex flex-wrap gap-2 text-sm">
            <Link className="text-slate-500 hover:text-blue-600 transition-colors font-medium" href="/">Projects</Link>
            <span className="text-slate-500 font-medium">/</span>
            <span className="text-slate-900 dark:text-white font-medium">{project.name}</span>
        </nav>

        {/* Page Heading & Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div className="flex flex-col gap-2 max-w-2xl">
                <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">{project.name}</h1>
                <div className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
                    <p className="text-base font-normal leading-normal">{project.description || "No description provided."}</p>
                    <Edit size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            </div>
            <Link href={`/projects/${projectId}/endpoints/new`}>
                <button className="flex items-center justify-center gap-2 rounded-lg h-11 px-5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold tracking-wide transition-all shadow-lg shadow-blue-900/20">
                    <Plus size={20} />
                    <span>Add Endpoint</span>
                </button>
            </Link>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 dark:border-slate-800">
            <div className="flex gap-8">
                <a className="flex items-center justify-center border-b-[3px] border-blue-600 text-slate-900 dark:text-white pb-3 px-1" href="#">
                    <p className="text-sm font-bold tracking-wide">Endpoints</p>
                </a>
                <a className="flex items-center justify-center border-b-[3px] border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700 transition-all pb-3 px-1" href="#">
                    <p className="text-sm font-bold tracking-wide">Project Settings</p>
                </a>
            </div>
        </div>

        {/* Toolbar (Search & Filter) */}
        <EndpointListControls />

        {/* Endpoints Table */}
        <div className="flex flex-col rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1e2936] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-[#1a2632] border-b border-slate-200 dark:border-slate-800">
                            <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 w-24">Method</th>
                            <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Title</th>
                            <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Path</th>
                            <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Security</th>
                            <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Roles</th>
                            <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 text-right">Updated</th>
                            <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 w-20 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {filteredEndpoints.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="p-12 text-center text-slate-500">
                                    No endpoints found matching your filters.
                                </td>
                            </tr>
                        ) : (
                            filteredEndpoints.map((endpoint: Endpoint) => {
                                const roles = (endpoint.roles as string[]) || [];
                                return (
                                    <tr key={endpoint.id} className="group hover:bg-slate-50 dark:hover:bg-[#1c2a38] transition-colors">
                                        <td className="p-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded text-xs font-bold w-16 text-center border
                                                ${endpoint.method === 'GET' ? 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20' : ''}
                                                ${endpoint.method === 'POST' ? 'bg-green-50 text-green-600 border-green-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' : ''}
                                                ${endpoint.method === 'PUT' ? 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20' : ''}
                                                ${endpoint.method === 'DELETE' ? 'bg-red-50 text-red-600 border-red-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20' : ''}
                                                ${endpoint.method === 'PATCH' ? 'bg-yellow-50 text-yellow-600 border-yellow-100 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20' : ''}
                                            `}>
                                                {endpoint.method}
                                            </span>
                                        </td>
                                        <td className="p-4 whitespace-nowrap font-medium text-slate-900 dark:text-white">
                                            <Link href={`/projects/${projectId}/endpoints/${endpoint.id}`} className="hover:text-blue-600 transition-colors">
                                                {endpoint.title}
                                            </Link>
                                        </td>
                                        <td className="p-4 whitespace-nowrap">
                                            <code className="font-mono text-xs text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-black/20 px-1.5 py-1 rounded border border-slate-200 dark:border-white/5">
                                                {endpoint.path}
                                            </code>
                                        </td>
                                        <td className="p-4 whitespace-nowrap">
                                            <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
                                                {endpoint.security === 'secure' ? (
                                                    <>
                                                        <Lock size={16} className="text-emerald-500" />
                                                        <span>Secured</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Globe size={16} className="text-slate-400" />
                                                        <span>Public</span>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 whitespace-nowrap">
                                            <div className="flex gap-1 flex-wrap max-w-[200px]">
                                                {roles.length > 0 ? roles.slice(0, 2).map((role, i) => (
                                                    <span key={i} className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#111a22] text-xs text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/5">
                                                        {role}
                                                    </span>
                                                )) : <span className="text-slate-400 text-xs italic">--</span>}
                                                {roles.length > 2 && (
                                                     <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#111a22] text-xs text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/5">+{roles.length - 2}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 whitespace-nowrap text-right text-xs text-slate-500">
                                            {formatDistanceToNow(new Date(endpoint.updatedAt), { addSuffix: true })}
                                        </td>
                                        <td className="p-4 whitespace-nowrap text-center">
                                            <div className="flex items-center justify-center gap-1 opacity-100">
                                                <Link href={`/projects/${projectId}/endpoints/${endpoint.id}`}>
                                                    <button className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" title="Edit">
                                                        <Edit size={16} />
                                                    </button>
                                                </Link>
                                                
                                                <CopyPromptButton endpoint={endpoint} />
                                                <DeleteEndpointButton endpointId={endpoint.id} projectId={projectId} />
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Table Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-sm text-slate-500 bg-slate-50 dark:bg-[#15202b]">
                <span>Showing {filteredEndpoints.length} endpoints</span>
                <div className="flex gap-1">
                    <button className="p-1 rounded hover:bg-slate-200 dark:hover:bg-white/5 disabled:opacity-50" disabled>
                        <ChevronLeft size={16} />
                    </button>
                    <button className="p-1 rounded hover:bg-slate-200 dark:hover:bg-white/5 disabled:opacity-50" disabled>
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
