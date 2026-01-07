'use server';

import { prisma } from '@/lib/db';
import { hashPassword, verifyPassword, setSession, clearSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function login(prevState: any, formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username || !password) {
    return { error: 'Missing fields' };
  }

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user || !(await verifyPassword(password, user.password))) {
    return { error: 'Invalid credentials' };
  }

  await setSession({ id: user.id, name: user.name, username: user.username });
  redirect('/');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function register(prevState: any, formData: FormData) {
  const name = formData.get('name') as string;
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!name || !username || !password) {
    return { error: 'Missing fields' };
  }

  // Security Check: Only allow registration if NO users exist
  const userCount = await prisma.user.count();
  if (userCount > 0) {
    return { error: 'Registration is closed.' };
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      username,
      password: hashedPassword,
    },
  });

  await setSession({ id: user.id, name: user.name, username: user.username });
  redirect('/');
}

export async function logout() {
  await clearSession();
  redirect('/login');
}
