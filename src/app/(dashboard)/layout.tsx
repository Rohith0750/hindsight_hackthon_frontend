"use client";

import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (mounted && !isAuthenticated) {
      router.replace('/auth');
    }
  }, [isAuthenticated, router, mounted]);

  if (!mounted || !isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-bg-main">
      <Navbar />
      <Sidebar />
      <main className="lg:ml-60 mt-16 p-4 lg:p-6">
        {children}
      </main>
    </div>
  );
}
