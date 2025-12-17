'use client';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <nav className="w-full flex items-center bg-primary text-secondary px-4 sm:px-6 md:px-8 py-4">
      <Link
        href="/"
        className="text-md md:text-xl font-extrabold"
      >
        Mongo SSO
      </Link>

      <div className='hidden md:flex items-center gap-0 ml-auto [&>a]:text-sm [&>a]:font-medium [&>a]:transition-colors 
        [&>a]:hover:opacity-80 [&>a]:text-primary-foreground [&>a]:px-6 [&>a]:py-2 [&>a]:rounded-full'>
        <Link 
          href="/"
          className={pathname === '/' ? 'bg-white text-primary! font-bold!' : ''}
        >Home</Link>
        <Link
          href="/sign-in"
          className={pathname === '/sign-in' ? 'bg-white text-primary! font-bold!' : ''}
        >Sign In</Link>
        <Link
          href="/sign-up"
          className={pathname === '/sign-up' ? 'bg-white text-primary! font-bold!' : ''}
        >Sign Up</Link>
      </div>

      <button 
        type="button"
        className='material-symbols-outlined ml-auto md:ml-10'
        onClick={() => setIsDarkMode(!isDarkMode)}
      >light_mode</button>

      <button 
        type="button" 
        className='material-symbols-outlined ml-5 md:ml-10' 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        menu
      </button>
    </nav>
  );
}