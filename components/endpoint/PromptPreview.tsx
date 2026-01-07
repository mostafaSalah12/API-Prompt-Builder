'use client';

import { useState } from 'react';
import { Endpoint } from '@prisma/client';
import { Copy, Maximize2, Check, Minimize2 } from 'lucide-react';
import { generatePromptContent } from '@/lib/prompt-generator';

interface PromptPreviewProps {
  endpoint: Endpoint;
}

export function PromptPreview({ endpoint }: PromptPreviewProps) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [copied, setCopied] = useState(false);

  // Use the shared generation logic
  const content = generatePromptContent(endpoint);

  const handleCopy = () => {
      navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  if (isMaximized) {
      return (
          <div className="fixed inset-0 z-50 bg-[#0d131a] flex flex-col animate-in fade-in duration-200">
             <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#111a22]">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Prompt Preview</h3>
                <div className="flex gap-2">
                     <button 
                         onClick={handleCopy} 
                         className="flex items-center gap-2 px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-500 text-xs font-medium transition-colors"
                     >
                         {copied ? <Check size={14} /> : <Copy size={14} />}
                         {copied ? 'Copied' : 'Copy'}
                     </button>
                    <button onClick={() => setIsMaximized(false)} className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
                        <Minimize2 size={16} />
                    </button>
                </div>
             </div>
             <div className="flex-1 overflow-auto p-8">
                 <div className="max-w-4xl mx-auto">
                    <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-slate-300">
                        {content}
                    </pre>
                 </div>
             </div>
          </div>
      );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Live Preview</p>
            <div className="flex gap-1">
                <button 
                    onClick={handleCopy}
                    className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors" 
                    title="Copy"
                >
                    {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                </button>
                <button 
                    onClick={() => setIsMaximized(true)}
                    className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors" 
                    title="Maximize"
                >
                    <Maximize2 size={14} />
                </button>
            </div>
        </div>
        
        <div className="flex-1 overflow-y-auto bg-[#0d131a] p-4 font-mono text-xs leading-relaxed text-slate-300">
             {/* Tabs */}
             <div className="flex gap-2 mb-4">
                <span className="bg-blue-500/20 text-blue-400 text-[10px] font-bold px-2 py-1 rounded border border-blue-500/30">Prompt</span>
            </div>

            {/* Content MATCHING DESIGN STYLE */}
                <div className="pl-2 border-l-2 border-slate-700 mb-4 text-slate-400">
                    <pre className="whitespace-pre-wrap font-mono text-slate-300">
                        {content}
                    </pre>
                </div>
        </div>
    </div>
  );
}
