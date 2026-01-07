import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import EndpointEditor from '@/components/endpoint/EndpointEditor';

export default async function EndpointEditorPage({ params }: { params: Promise<{ projectId: string; endpointId: string }> }) {
  const { projectId, endpointId } = await params;

  const endpoint = await prisma.endpoint.findUnique({
    where: { id: endpointId },
  });

  if (!endpoint) {
    notFound();
  }

  // Pass initial data to client component
  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-[#0b1116]">
       <EndpointEditor initialData={endpoint} />
    </div>
  );
}
