'use client';

import { useState } from 'react';
import { SchemaNode } from '@/types/schema';
import { ChevronRight, ChevronDown, Plus, Trash2, GripVertical, Settings } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface RowProps {
    node: SchemaNode;
    path: number[];
    isRoot?: boolean;
    activeTab?: 'body' | 'query' | 'headers';
    onUpdate: (path: number[], node: SchemaNode | null) => void;
}

export function SchemaRow({ node, path, isRoot, activeTab, onUpdate }: RowProps) {
    const isObject = node.type === 'object';
    const isArray = node.type === 'array';
    // Always expand root, otherwise default to type check
    const [expanded, setExpanded] = useState(isRoot || isObject || isArray);
    
    // Depth for indentation
    const depth = path.length;
    const paddingLeft = depth === 0 ? 20 : depth * 20 + 20;

    const handleChange = (field: keyof SchemaNode, val: unknown) => {
        onUpdate(path, { ...node, [field]: val });
    };

    const handleChildUpdate = (childIndex: number, childNode: SchemaNode | null) => {
        const newProps = [...(node.properties || [])];
        if (childNode === null) {
            newProps.splice(childIndex, 1);
        } else {
            newProps[childIndex] = childNode;
        }
        handleChange('properties', newProps);
    };

    const addChild = () => {
        const currentProps = Array.isArray(node.properties) ? node.properties : [];
        const newProps = [...currentProps];
        newProps.push({ type: 'string', name: 'childField', required: true });
        handleChange('properties', newProps);
    };

    return (
        <div>
            <div className="group border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="grid grid-cols-12 gap-2 px-5 py-3 items-center">
                    {/* Name & Expansion */}
                    <div className="col-span-5 flex items-center gap-2" style={{ paddingLeft: isRoot ? 20 : paddingLeft }}>
                        {isObject && !isRoot && (
                            <button onClick={() => setExpanded(!expanded)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                                {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </button>
                        )}
                        {!isObject && !isRoot && <div className="w-3.5" />} {/* Spacer */}
                        
                        {/* Name Input - Always Visible */}
                        <>
                           {!isRoot && <GripVertical size={14} className="text-slate-300 cursor-move opacity-0 group-hover:opacity-100 flex-shrink-0" />}
                           <input 
                              type="text" 
                              value={node.name || (isRoot ? 'root' : '')} 
                              onChange={(e) => handleChange('name', e.target.value)}
                              className={`bg-slate-100 dark:bg-[#111a22] border-none rounded px-2 py-1 text-sm font-mono ${isRoot ? 'font-bold text-slate-500' : 'text-slate-900 dark:text-white'} w-full focus:ring-1 focus:ring-blue-500 shadow-sm`}
                              placeholder="field_name"
                           />
                        </>
                    </div>

                    {/* Type & Format */}
                    <div className="col-span-3 flex gap-1">
                        <select 
                            value={node.type}
                            onChange={(e) => {
                                const newType = e.target.value as SchemaNode['type'];
                                const updates: Partial<SchemaNode> = { type: newType };
                                if (newType === 'object' && !node.properties) updates.properties = [];
                                
                                // Auto-expand when switching to object/array
                                if (newType === 'object' || newType === 'array') {
                                    setExpanded(true);
                                }

                                handleChange('type', newType);
                                onUpdate(path, { ...node, type: newType, ...(newType === 'object' && !node.properties ? { properties: [] } : {}) });
                            }}
                            className="flex-1 bg-slate-100 dark:bg-[#111a22] border-none rounded text-xs px-2 py-1.5 text-slate-700 dark:text-slate-300 focus:ring-1 focus:ring-blue-500 font-medium"
                        >
                            <option value="string">String</option>
                            <option value="number">Number</option>
                            <option value="boolean">Boolean</option>
                            <option value="object">Object</option>
                            <option value="array">Array</option>
                        </select>
                        
                        {/* String Formats */}
                        {node.type === 'string' && (
                            <select 
                                value={(node as unknown as { format?: string }).format || ''}
                                onChange={(e) => handleChange('format', e.target.value)}
                                className="flex-1 bg-slate-100 dark:bg-[#111a22] border-none rounded text-xs px-2 py-1.5 text-slate-500 dark:text-slate-400 focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="">Any</option>
                                <option value="email">Email</option>
                                <option value="date-time">DateTime</option>
                                <option value="date">Date</option>
                                <option value="uuid">UUID</option>
                                <option value="password">Password</option>
                                <option value="byte">Byte</option>
                            </select>
                        )}

                        {/* Number Formats */}
                        {node.type === 'number' && (
                            <select 
                                value={(node as unknown as { format?: string }).format || ''}
                                onChange={(e) => handleChange('format', e.target.value)}
                                className="flex-1 bg-slate-100 dark:bg-[#111a22] border-none rounded text-xs px-2 py-1.5 text-slate-500 dark:text-slate-400 focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="">Any</option>
                                <option value="int32">Int32</option>
                                <option value="int64">Int64</option>
                                <option value="float">Float</option>
                                <option value="double">Double</option>
                            </select>
                        )}
                    </div>

                    {/* Required */}
                    <div className="col-span-2 flex justify-center">
                        {(!isRoot || (activeTab === 'query' || activeTab === 'headers')) && (
                            <input 
                                type="checkbox" 
                                checked={!!node.required} 
                                onChange={(e) => handleChange('required', e.target.checked)}
                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                            />
                        )}
                    </div>

                    {/* Actions */}
                    <div className="col-span-2 flex justify-end gap-1 opacity-100 transition-opacity">
                         {isObject && (
                            <button onClick={addChild} className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-500/20 text-blue-600 hover:text-blue-700 rounded transition-all" title="Add Child Property">
                                <Plus size={20} strokeWidth={3} />
                            </button>
                         )}
                        
                        {/* Settings Button */}
                        {!isObject && !isArray && (
                            <button 
                                onClick={() => node.type !== 'boolean' && setExpanded(!expanded)} 
                                className={`p-1.5 rounded transition-all ${expanded ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-500' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600'}`}
                                title="Validation Rules"
                                disabled={node.type === 'boolean'}
                            >
                                <Settings size={16} />
                            </button>
                        )}

                        {!isRoot && (
                            <button onClick={() => onUpdate(path, null)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-500/20 text-slate-400 hover:text-red-500 rounded transition-all">
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Validation Rules Section */}
            {!isObject && !isArray && expanded && node.type !== 'boolean' && (
                <div className="bg-slate-50 dark:bg-[#16202a] border-b border-slate-100 dark:border-slate-800/50 px-5 py-3 ml-[20px]">
                    <div className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-2">
                        <Settings size={12} />
                        Validation Rules
                    </div>
                    <div className="flex flex-wrap gap-4">
                        {node.type === 'number' && (
                            <>
                                <div className="flex flex-col gap-1 w-24">
                                    <label className="text-[10px] text-slate-500 font-medium">Min Value</label>
                                    <input 
                                        type="number" 
                                        value={node.validation?.min ?? ''} 
                                        onChange={(e) => handleChange('validation', { ...node.validation, min: e.target.valueAsNumber })}
                                        className="bg-white dark:bg-[#111a22] border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-xs"
                                        placeholder="Min"
                                    />
                                </div>
                                <div className="flex flex-col gap-1 w-24">
                                    <label className="text-[10px] text-slate-500 font-medium">Max Value</label>
                                    <input 
                                        type="number" 
                                        value={node.validation?.max ?? ''} 
                                        onChange={(e) => handleChange('validation', { ...node.validation, max: e.target.valueAsNumber })}
                                        className="bg-white dark:bg-[#111a22] border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-xs"
                                        placeholder="Max"
                                    />
                                </div>
                            </>
                        )}

                        {node.type === 'string' && (
                            <>
                                <div className="flex flex-col gap-1 w-24">
                                    <label className="text-[10px] text-slate-500 font-medium">Min Length</label>
                                    <input 
                                        type="number" 
                                        value={node.validation?.minLength ?? ''} 
                                        onChange={(e) => handleChange('validation', { ...node.validation, minLength: e.target.valueAsNumber })}
                                        className="bg-white dark:bg-[#111a22] border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-xs"
                                        placeholder="0"
                                    />
                                </div>
                                <div className="flex flex-col gap-1 w-24">
                                    <label className="text-[10px] text-slate-500 font-medium">Max Length</label>
                                    <input 
                                        type="number" 
                                        value={node.validation?.maxLength ?? ''} 
                                        onChange={(e) => handleChange('validation', { ...node.validation, maxLength: e.target.valueAsNumber })}
                                        className="bg-white dark:bg-[#111a22] border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-xs"
                                        placeholder="255"
                                    />
                                </div>
                                <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
                                    <label className="text-[10px] text-slate-500 font-medium">Regex Pattern</label>
                                    <input 
                                        type="text" 
                                        value={node.validation?.pattern ?? ''} 
                                        onChange={(e) => handleChange('validation', { ...node.validation, pattern: e.target.value })}
                                        className="bg-white dark:bg-[#111a22] border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-xs font-mono text-slate-600 dark:text-orange-400"
                                        placeholder="^[a-zA-Z0-9]+$"
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
            
            {/* Recursion for Object Properties */}
            {isObject && expanded && Array.isArray(node.properties) && (
                <div>
                    {node.properties.map((child, idx) => (
                        <SchemaRow
                            key={child.id || `idx_${idx}`} 
                            node={child}
                            path={[...path, idx]} 
                            onUpdate={(p, n) => handleChildUpdate(idx, n)}
                        />
                    ))}
                </div>
            )}
            
             {/* Recursion for Array Items */}
            {isArray && expanded && (
                <div className="pl-8 py-2">
                     <div className="text-xs text-slate-400 italic mb-1">Array Items Schema:</div>
                     {node.items ? (
                         <div className="border-l-2 border-slate-200 dark:border-slate-700 pl-4">
                             <SchemaRow 
                                node={node.items} 
                                path={[...path, 0]} 
                                onUpdate={(p, n) => handleChange('items', n)}
                             />
                         </div>
                     ) : (
                         <Button size="sm" variant="ghost" className="text-xs h-7" onClick={() => handleChange('items', { type: 'string' })}>
                             Define Items
                         </Button>
                     )}
                </div>
            )}
        </div>
    );
}
