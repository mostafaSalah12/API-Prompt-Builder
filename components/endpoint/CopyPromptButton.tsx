'use client';

import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Endpoint } from '@prisma/client';
import { generatePromptContent } from '@/lib/prompt-generator';

interface CopyPromptButtonProps {
  endpoint: Endpoint;
}

export function CopyPromptButton({ endpoint }: CopyPromptButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const content = generatePromptContent(endpoint);
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
        onClick={handleCopy}
        className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" 
        title="Copy Prompt"
    >
        {copied ? (
            <Check size={16} className="text-green-500" />
        ) : (
            <Copy size={16} />
        )}
    </button>
  );
}
