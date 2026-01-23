import { PropsWithChildren, ReactNode } from 'react';

import { User } from '@/types';
import Navbar from '@/Pages/Components/Navbar';


export default function AppLayout({ user, children }: PropsWithChildren<{ user: User, header?: ReactNode }>) {
  return (
    <div>
      <Navbar user={user} />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
