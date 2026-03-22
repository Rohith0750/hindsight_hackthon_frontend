"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { Bell, Sun, Moon, Flame, Menu, X } from 'lucide-react';
import { useState } from 'react';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/problems', label: 'Problems' },
  { href: '/progress', label: 'Progress' },
  { href: '/learning-path', label: 'Path' },
];

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-bg-card border-b border-accent-teal-glow/40 flex items-center px-4 lg:px-6">
      <Link href="/dashboard" className="font-display text-lg font-bold text-accent-teal mr-8 shrink-0">
        {'</>'} CodeMind
      </Link>

      <nav className="hidden md:flex items-center gap-1 flex-1">
        {navLinks.map(l => (
          <Link
            key={l.href}
            href={l.href}
            className={`px-3 py-1.5 rounded-md text-sm font-body transition-colors ${pathname?.startsWith(l.href) ? 'bg-bg-code text-text-primary' : 'text-text-secondary hover:text-text-primary'
              }`}
          >
            {l.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-3 ml-auto">
        {user && (
          <div className="flex items-center gap-1 text-fire-accent font-display text-sm animate-flicker">
            <Flame className="w-4 h-4" />
            <span>{user.streak}</span>
          </div>
        )}
        <button className="relative text-text-secondary hover:text-text-primary transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-badge-blue rounded-full" />
        </button>
        <button onClick={toggleTheme} className="text-text-secondary hover:text-text-primary transition-colors">
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        {user && (
          <button onClick={logout} className="w-8 h-8 rounded-full overflow-hidden border-2 border-accent-teal/50 flex items-center justify-center bg-bg-code">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name || user.email} className="w-full h-full object-cover" />
            ) : (
              <span className="text-accent-teal text-xs font-bold">
                {(user.name || user.email || 'U').charAt(0).toUpperCase()}
              </span>
            )}
          </button>
        )}
        <button className="md:hidden text-text-secondary" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="absolute top-16 left-0 right-0 bg-bg-card border-b border-border p-4 flex flex-col gap-2 md:hidden">
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-md text-sm font-body text-text-secondary hover:text-text-primary hover:bg-bg-code">
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};
