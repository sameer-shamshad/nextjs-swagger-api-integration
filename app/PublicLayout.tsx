'use client';
import { usePathname } from 'next/navigation';
import Navigation from '@/components/Navigation';

/**
 * PublicLayout component that conditionally renders Navigation
 * for public routes only. Dashboard routes will not show Navigation
 * as they have their own header in the dashboard layout.
 */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Don't show Navigation for dashboard routes (they have their own header)
  const isDashboardRoute = pathname?.startsWith('/dashboard');
  
  return (
    <>
      {!isDashboardRoute && <Navigation />}
      {children}
    </>
  );
}

