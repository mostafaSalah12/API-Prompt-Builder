'use client';

import { useState } from 'react';
import { SchemaNode } from '@/types/schema';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SchemaRow } from './schema/SchemaRow';

interface RequestDesignerProps {
    value: SchemaNode; // Body
    query?: SchemaNode; // Query Params
    headers?: SchemaNode; // Headers
    mode?: 'request' | 'response'; // Defaults to 'request'
    onChange: (field: 'requestSpec' | 'requestQuery' | 'requestHeaders', value: SchemaNode) => void;
}

export function RequestDesigner({ value, query, headers, mode = 'request', onChange }: RequestDesignerProps) {
    const [activeTab, setActiveTab] = useState<'body' | 'query' | 'headers'>('body');

    // Get the active schema to render
    const activeSchema = 
        activeTab === 'body' ? (value && value.type ? value : { type: 'object' as const, properties: [] }) :
        activeTab === 'query' ? (query && query.type ? query : { type: 'object' as const, properties: [] }) :
        (headers && headers.type ? headers : { type: 'object' as const, properties: [] });

    const handleUpdate = (newRoot: SchemaNode) => {
        // Map tab to parent field name
        const fieldName = 
            activeTab === 'body' ? 'requestSpec' : 
            activeTab === 'query' ? 'requestQuery' : 'requestHeaders';
        
        onChange(fieldName, newRoot);
    };

    return (
        <section className={`rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1e2936] shadow-sm ${mode === 'response' ? 'border-0 shadow-none bg-transparent' : ''}`}>
            <div className={`border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#111a22] px-5 pt-4 ${mode === 'response' ? 'bg-transparent px-0 border-0' : ''}`}>
                <div className="flex items-center justify-between mb-4">
                    {mode === 'request' && (
                        <h3 className="text-slate-900 dark:text-white font-bold text-base flex items-center gap-2">
                            Request Configuration
                        </h3>
                    )}
                    <Button size="sm" variant="ghost" className="text-blue-600 gap-1 hover:bg-blue-50 dark:hover:bg-blue-500/10" onClick={() => {
                         console.log('Adding new field...');
                         const newProps = [...(activeSchema.properties || [])];
                         const newId = `field_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
                         newProps.push({ 
                            id: newId, 
                            type: 'string', 
                            name: 'newField', 
                            required: true 
                         });
                         console.log('New props:', newProps);
                         handleUpdate({ ...activeSchema, properties: newProps });
                    }}>
                        <Plus size={16} />
                        Add Field
                    </Button>
                </div>
                 {mode === 'request' && (
                    <div className="flex gap-6">
                        <button 
                            onClick={() => setActiveTab('body')}
                            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'body' ? 'text-blue-600 border-blue-600' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 border-transparent hover:border-slate-300'}`}
                        >
                            Body Params
                        </button>
                        <button 
                            onClick={() => setActiveTab('query')}
                            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'query' ? 'text-blue-600 border-blue-600' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 border-transparent hover:border-slate-300'}`}
                        >
                            Query Params
                        </button>
                        <button 
                            onClick={() => setActiveTab('headers')}
                            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'headers' ? 'text-blue-600 border-blue-600' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 border-transparent hover:border-slate-300'}`}
                        >
                            Headers
                        </button>
                    </div>
                )}
            </div>

            {/* Tree Header */}
            <div className="grid grid-cols-12 gap-2 px-5 py-2 bg-slate-100 dark:bg-[#16202a] border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                <div className="col-span-5 pl-8">Field Name</div>
                <div className="col-span-3">Type</div>
                <div className="col-span-2 text-center">Required</div>
                <div className="col-span-2 text-right">Actions</div>
            </div>

            <div className="bg-white dark:bg-[#1e2936]">
                 <SchemaRow 
                    key={activeTab} // Force re-render on tab switch
                    node={activeSchema} 
                    path={[]} 
                    isRoot
                    activeTab={activeTab} 
                    onUpdate={(path, node) => {
                        // Root update
                        handleUpdate(node!);
                    }} 
                 />
                 {(!activeSchema.properties || activeSchema.properties.length === 0) && (
                     <div className="p-8 text-center text-slate-400 text-sm">
                         No {activeTab === 'headers' ? 'headers' : activeTab === 'query' ? 'parameters' : 'fields'} defined. Click &quot;Add Field&quot; to start.
                     </div>
                 )}
            </div>
        </section>
    );
}
