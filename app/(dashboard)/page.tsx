import Link from 'next/link';
import { Plus, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { prisma } from '@/lib/db';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { DashboardControls } from '@/components/dashboard/DashboardControls';

export default async function ProjectsDashboard({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const search = params?.search || '';
  const sort = params?.sort || 'recent';

  const projects = await prisma.project.findMany({
    where: {
      name: {
        contains: search,
      },
    },
    orderBy: sort === 'name' ? { name: 'asc' } : { updatedAt: 'desc' },
    include: {
      _count: {
        select: { endpoints: true },
      },
    },
  });

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Heading & Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-tight">
            My Projects
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base font-normal">
            Manage and organize your API request collections and flows.
          </p>
        </div>
        <Link href="/projects/new">
          <Button className="gap-2 shadow-lg shadow-blue-500/20">
            <Plus size={20} />
            <span>Create Project</span>
          </Button>
        </Link>
      </div>

      <DashboardControls />

      {projects.length === 0 ? (
        <EmptyState search={search} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}

          {/* New Project Card Placeholder */}
          <Link href="/projects/new">
            <button className="w-full h-full group flex flex-col items-center justify-center rounded-xl bg-transparent border-2 border-dashed border-slate-300 dark:border-slate-700 p-5 hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-[#1e2936]/50 transition-all duration-200 min-h-[180px]">
              <div className="flex items-center justify-center size-14 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-blue-500 group-hover:scale-110 transition-all mb-4">
                <Plus size={24} />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
                Create New Project
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                It&apos;s quiet here...om scratch
              </p>
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}

function EmptyState({ search }: { search: string }) {
  if (search) {
     return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 text-slate-300 dark:text-slate-600">
                <FolderOpen size={48} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No projects found for &quot;{search}&quot;</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto">
                Try adjusting your search criteria.
            </p>
            <Link href="/">
                <Button variant="secondary">Clear Search</Button>
            </Link>
        </div>
     );
  }

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 text-slate-300 dark:text-slate-600">
        <FolderOpen size={48} />
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No projects found</h3>
      <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto">
        You haven&apos;t created any API projects yet. Start building your first flow now.
      </p>
      <Link href="/projects/new">
        <Button size="lg" className="shadow-lg shadow-blue-500/20">
          <Plus size={20} className="mr-2" />
          Create First Project
        </Button>
      </Link>
    </div>
  );
}
