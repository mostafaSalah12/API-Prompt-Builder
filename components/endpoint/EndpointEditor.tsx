'use client';

import { useState } from 'react';
import { Endpoint } from '@prisma/client';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ArrowLeft, Database, Save, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { updateEndpoint, deleteEndpoint } from '@/app/actions/endpoint';
import { MetadataEditor } from './MetadataEditor';
import { RequestDesigner } from './RequestDesigner';
import { ResponseDesigner } from './ResponseDesigner';
import { PromptPreview } from './PromptPreview';
import { SchemaNode } from '@/types/schema';

import { PromptPreferences } from './PromptPreferences';
import { PersonaSelector } from './PersonaSelector';


interface EndpointEditorProps {
  initialData: Endpoint;
}

export default function EndpointEditor({ initialData }: EndpointEditorProps) {
  const router = useRouter();
  const [data, setData] = useState<Endpoint>(initialData);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Helper helper to cast Json to SchemaNode safely
  const requestSpec = (data.requestSpec as unknown as SchemaNode) || { type: 'object', properties: [] };

  const handleChange = (field: keyof Endpoint, value: any) => {
    console.log(`EndpointEditor handleChange: ${field}`, value);
    setData((prev) => ({ ...prev, [field]: value }));
    setDirty(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const res = await updateEndpoint(data.id, data);
    setSaving(false);
    if (res.success) {
      setDirty(false);
      // Optional: Show toast
    } else {
      alert('Failed to save');
    }
  };

  const handleDelete = async () => {
      setIsDeleting(true);
      const res = await deleteEndpoint(data.id, data.projectId);
      if (res.success) {
          router.push(`/projects/${data.projectId}`);
          router.refresh();
      } else {
          setIsDeleting(false);
          setIsDeleteModalOpen(false);
          alert('Failed to delete endpoint');
      }
  };

  return (
    <>
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111a22] px-6 py-3 shrink-0 z-20">
        <div className="flex items-center gap-4">
          <Link href={`/projects/${data.projectId}`} className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>
          <div className="flex items-center gap-4">
            <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight">
              {data.title || 'Untitled Endpoint'}
            </h2>
             <PersonaSelector 
                mode={data.personaMode} 
                personaKey={data.personaKey} 
                onChange={(field, val) => handleChange(field as keyof Endpoint, val)}
             />
            {dirty && (
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-500 border border-yellow-200 dark:border-yellow-500/20">
                Unsaved Changes
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-3 items-center">
            {/* Delete Button */}
            <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600"
                onClick={() => setIsDeleteModalOpen(true)}
            >
                <Trash2 size={16} />
            </Button>
            
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>

            <div className="flex items-center gap-2 mr-4 text-sm text-slate-500 dark:text-slate-400">
                <Database size={16} className="text-green-500" />
                <span>Local Storage</span>
            </div>
            <Button variant="secondary" size="sm">Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="shadow-[0_0_15px_rgba(19,127,236,0.3)]">
                <Save size={16} className="mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
            </Button>
        </div>
      </header>
      
      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Center Editor - No Sidebar */}
        <main className="flex-1 bg-slate-50 dark:bg-[#0b1116] overflow-y-auto relative">
             <div className="max-w-5xl mx-auto p-8 pb-32 flex flex-col gap-6">
                <MetadataEditor data={data} onChange={handleChange} />
                
                <RequestDesigner 
                    value={requestSpec} 
                    query={(data.requestQuery as unknown as SchemaNode) || { type: 'object', properties: [] }}
                    headers={(data.requestHeaders as unknown as SchemaNode) || { type: 'object', properties: [] }}
                    onChange={(field, val) => handleChange(field as keyof Endpoint, val)} 
                />

                <ResponseDesigner 
                    value={data.responseSpec as any} 
                    onChange={(val) => handleChange('responseSpec', val)} 
                />

                <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1e2936] p-5 shadow-sm">
                    <div className="mb-3">
                         <h3 className="text-slate-900 dark:text-white font-bold text-base mb-1">
                            Technical Recommendations
                        </h3>
                         <p className="text-xs text-slate-500 dark:text-slate-400">
                             Add specific technical constraints or architectural notes for the LLM.
                         </p>
                    </div>
                    <textarea 
                        value={data.techNotes || ''} 
                        onChange={(e) => handleChange('techNotes', e.target.value)}
                        placeholder="e.g. Use a transaction for these operations, ensure idempotency..."
                        className="w-full bg-slate-50 dark:bg-[#0b1116] border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 min-h-[250px]"
                    />
                </section>

                <PromptPreferences 
                    value={data.promptPrefs as any} 
                    onChange={(val) => handleChange('promptPrefs', val)}
                />
             </div>
        </main>
        
        {/* Right Preview - Wider */}
        <div className="w-[500px] border-l border-slate-200 dark:border-slate-800 h-full flex flex-col shrink-0 bg-white dark:bg-[#111a22]">
             <PromptPreview endpoint={data} />
        </div>
      </div>
    </div>

    <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Endpoint?"
        description="Are you sure you want to delete this endpoint? This action cannot be undone."
        footer={
            <>
                <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
                    {isDeleting ? 'Deleting...' : 'Delete Endpoint'}
                </Button>
            </>
        }
    />
    </>
  );
}
