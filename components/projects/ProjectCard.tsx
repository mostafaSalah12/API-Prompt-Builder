'use client';

import { useState } from 'react';
import Link from 'next/link';
import * as Icons from 'lucide-react';
import { MoreVertical, Clock, Layers } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { deleteProject } from '@/app/(dashboard)/projects/actions';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ProjectCard({ project }: { project: any }) {
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const Icon = (Icons as unknown as Record<string, React.ComponentType<{ size?: number }>>)[project.icon] || Icons.Folder;
  const color = project.color || 'blue';
  
  const getColorClasses = (c: string) => {
      const map: Record<string, string> = {
        blue: "text-blue-600 dark:text-blue-500 bg-blue-500/10 group-hover:text-blue-600 dark:group-hover:text-blue-400 hover:border-blue-500/50",
        purple: "text-purple-600 dark:text-purple-500 bg-purple-500/10 group-hover:text-purple-600 dark:group-hover:text-purple-400 hover:border-purple-500/50",
        green: "text-green-600 dark:text-green-500 bg-green-500/10 group-hover:text-green-600 dark:group-hover:text-green-400 hover:border-green-500/50",
        orange: "text-orange-600 dark:text-orange-500 bg-orange-500/10 group-hover:text-orange-600 dark:group-hover:text-orange-400 hover:border-orange-500/50",
        pink: "text-pink-600 dark:text-pink-500 bg-pink-500/10 group-hover:text-pink-600 dark:group-hover:text-pink-400 hover:border-pink-500/50",
        red: "text-red-600 dark:text-red-500 bg-red-500/10 group-hover:text-red-600 dark:group-hover:text-red-400 hover:border-red-500/50",
        slate: "text-slate-600 dark:text-slate-500 bg-slate-500/10 group-hover:text-slate-600 dark:group-hover:text-slate-400 hover:border-slate-500/50",
      };
      return map[c] || map.blue;
  };

  const classes = getColorClasses(color);
  // Split classes for specific elements
  const iconBgClass = classes.split(' ').slice(0, 3).join(' '); 
  const titleHoverClass = classes.split(' ').slice(3, 5).join(' ');
  const borderHoverClass = classes.split(' ').pop();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
        await deleteProject(project.id);
        window.location.reload();
    } catch {
        setIsDeleting(false);
        alert('Failed to delete');
    }
  };

  return (
    <>
    <div className={`group relative flex flex-col justify-between h-full rounded-xl bg-white dark:bg-[#1e2936] border border-slate-200 dark:border-slate-800 p-5 ${borderHoverClass} hover:shadow-lg transition-all duration-300`}>
        {/* Clickable Link Overlay */}
        <Link href={`/projects/${project.id}`} className="absolute inset-0 z-0" />

        <div className="relative z-10 pointer-events-none">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
              <div className={`flex items-center justify-center size-10 rounded-lg ${iconBgClass}`}>
                <Icon size={20} />
              </div>
              <div>
                <h3 className={`text-lg font-bold text-slate-900 dark:text-white leading-tight ${titleHoverClass} transition-colors`}>
                  {project.name}
                </h3>
              </div>
            </div>
             <div className="relative pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowMenu(!showMenu);
                  }}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                   <MoreVertical size={18} />
                </button>
                
                {showMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                    <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-[#111a22] border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl z-20 py-1">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setShowMenu(false);
                          setIsDeleteModalOpen(true);
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2"
                      >
                        <Icons.Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </>
                )}
             </div>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-6 min-h-[40px]">
            {project.description || "No description provided."}
          </p>
        </div>
        
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-700/50 pt-4 mt-auto relative z-10 pointer-events-none">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 font-mono">
            <Clock size={14} />
            <span>{formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <Layers size={14} className={iconBgClass.split(' ')[0]} />
            <span>{project._count.endpoints} Endpoints</span>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Project?"
        description="This action cannot be undone. This will permanently delete the project and all its endpoints."
        footer={
            <>
                <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
                    {isDeleting ? 'Deleting...' : 'Delete Project'}
                </Button>
            </>
        }
      />
    </>
  );
}
