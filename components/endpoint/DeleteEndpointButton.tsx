'use client';

import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { deleteEndpoint } from '@/app/actions/endpoint';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface DeleteEndpointButtonProps {
  endpointId: string;
  projectId: string;
}

export function DeleteEndpointButton({ endpointId, projectId }: DeleteEndpointButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteEndpoint(endpointId, projectId);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to delete endpoint', error);
      // Ideally show a toast here
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-500/20 text-slate-400 hover:text-red-500 transition-colors" 
        title="Delete"
      >
        <Trash2 size={16} />
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Delete Endpoint"
        description="Are you sure you want to delete this endpoint? This action cannot be undone."
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsOpen(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button 
                variant="danger" 
                onClick={handleDelete} 
                disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </>
        }
      />
    </>
  );
}
