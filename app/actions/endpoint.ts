'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateEndpoint(id: string, data: any) {
  try {
     const session = await getSession();
     if (!session) {
         return { success: false, error: 'Unauthorized' };
     }

     const { projectId: _projectId, ...rest } = data; // Don't update projectId usually, or handle it carefully
     
     console.log('Server Action updateEndpoint data keys:', Object.keys(rest));
     // console.log('Server Action requestSpec:', rest.requestSpec);
     
     // TODO: Check if user owns project
     
     // Clean up data if needed
     const updated = await prisma.endpoint.update({
       where: { id },
       data: {
          ...rest,
          updatedAt: new Date(),
       },
     });
     
     // Revalidate the page
     revalidatePath(`/projects/${updated.projectId}/endpoints/${id}`);
     revalidatePath(`/projects/${updated.projectId}`);
     
     return { success: true, data: updated };
  } catch (error) {
     console.error('Failed to update endpoint:', error);
     return { success: false, error: 'Failed to update endpoint' };
  }
}

export async function deleteEndpoint(id: string, projectId: string) {
  try {
    const session = await getSession();
    if (!session) {
        return { success: false, error: 'Unauthorized' };
    }
    
    // TODO: Verify ownership

    await prisma.endpoint.delete({
      where: { id },
    });
    
    revalidatePath(`/projects/${projectId}`);
    return { success: true };
  } catch (error) {
    console.error('Failed to delete endpoint:', error);
    return { success: false, error: 'Failed to delete endpoint' };
  }
}
