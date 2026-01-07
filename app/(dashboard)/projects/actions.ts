'use server';

import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';

export async function createProject(formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const icon = (formData.get('icon') as string) || 'Folder';
  const color = (formData.get('color') as string) || 'blue';
  
  if (!name) return;

  try {
    const project = await prisma.project.create({
      data: {
        name,
        description,
        icon,
        color,
      },
    });
    
    redirect(`/projects/${project.id}`);
  } catch (error) {
    console.error("Failed to create project:", error);
    // In a real app we would return { error: ... }
    throw error;
  }
  }


export async function deleteProject(id: string) {
  try {
    await prisma.project.delete({
      where: { id },
    });
    return { success: true };
  } catch (error) {
    console.error('Failed to delete project:', error);
    return { success: false, error: 'Failed to delete project' };
  }
}
