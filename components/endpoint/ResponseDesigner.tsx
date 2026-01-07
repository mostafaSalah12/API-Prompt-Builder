'use client';

import { useState } from 'react';
import { SchemaNode } from '@/types/schema';
import { Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { RequestDesigner } from './RequestDesigner';

interface ResponseSpec {
  [statusCode: string]: SchemaNode;
}

interface ResponseDesignerProps {
  value: ResponseSpec;
  onChange: (value: ResponseSpec) => void;
}

export function ResponseDesigner({ value, onChange }: ResponseDesignerProps) {
  // Ensure value is object
  const specs = value || {};

  const addStatus = (code: string) => {
    if (specs[code]) return;
    onChange({
      ...specs,
      [code]: { type: 'object', properties: [] }
    });
  };

  const removeStatus = (code: string) => {
    const newSpecs = { ...specs };
    delete newSpecs[code];
    onChange(newSpecs);
  };

  const updateSchema = (code: string, schema: SchemaNode) => {
    onChange({
      ...specs,
      [code]: schema
    });
  };

  return (
    <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1e2936] p-5 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-slate-900 dark:text-white font-bold text-base flex items-center gap-2">
            Output
            Response Builder
        </h3>
        <div className="flex gap-2">
             <select 
                className="h-8 rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#111a22] text-xs font-bold px-2 focus:ring-2 focus:ring-blue-500"
                onChange={(e) => {
                    if(e.target.value) {
                        addStatus(e.target.value);
                        e.target.value = '';
                    }
                }}
             >
                <option value="">Add Status...</option>
                <option value="200">200 OK</option>
                <option value="201">201 Created</option>
                <option value="204">204 No Content</option>
                <option value="400">400 Bad Request</option>
                <option value="401">401 Unauthorized</option>
                <option value="403">403 Forbidden</option>
                <option value="404">404 Not Found</option>
                <option value="500">500 Server Error</option>
             </select>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {Object.entries(specs).length === 0 && (
            <div className="text-center py-8 text-slate-400 text-sm border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                No responses defined. Add a status code to start.
            </div>
        )}
        {Object.entries(specs).map(([code, schema]) => (
            <ResponseStatusBlock 
                key={code} 
                code={code} 
                schema={schema} 
                onUpdate={(s) => updateSchema(code, s)}
                onDelete={() => removeStatus(code)}
            />
        ))}
      </div>
    </section>
  );
}

function ResponseStatusBlock({ code, schema, onUpdate, onDelete }: { code: string, schema: SchemaNode, onUpdate: (s: SchemaNode) => void, onDelete: () => void }) {
    const [expanded, setExpanded] = useState(false);
    
    let colorClass = 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300';
    if (code.startsWith('2')) colorClass = 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 border-green-200 dark:border-green-500/30';
    if (code.startsWith('4')) colorClass = 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400 border-orange-200 dark:border-orange-500/30';
    if (code.startsWith('5')) colorClass = 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 border-red-200 dark:border-red-500/30';

    return (
        <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-white dark:bg-[#16202a]">
            <div 
                className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-white/[0.02]"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center gap-3">
                    <span className="text-slate-400">
                        {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold border ${colorClass}`}>
                        {code}
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                        {/* Description mapping could go here */}
                        Response Body
                    </span>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={(e) => { e.stopPropagation(); onDelete(); }}
                        className="p-1 hover:text-red-500 text-slate-400 transition-colors"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
            
            {expanded && (
                <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#111a22]/50">
                     <RequestDesigner 
                        mode="response"
                        value={schema} 
                        onChange={(_, val) => onUpdate(val)} 
                     />
                </div>
            )}
        </div>
    );
}
