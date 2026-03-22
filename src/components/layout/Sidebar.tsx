"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  Code2,
  TrendingUp,
  Route,
  Flame,
  User,
} from "lucide-react";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/problems", label: "Problems", icon: Code2 },
  { href: "/progress", label: "My Progress", icon: TrendingUp },
  { href: "/learning-path", label: "Learning Path", icon: Route },
  { href: "/gamification/streaks", label: "Streaks", icon: Flame },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <aside className="hidden lg:flex fixed left-0 top-16 bottom-0 w-60 bg-bg-card border-r border-border flex-col z-40">
      {user && (
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <div className="w-full h-full rounded-full border-2 border-accent-teal/50 flex items-center justify-center bg-bg-code">
                <User className="w-5 h-5 text-text-secondary" />
              </div>
            </div>
            <div>
              <p className="font-display text-sm text-text-primary">
                {user.username}
              </p>
            </div>
          </div>
        </div>
      )}
      <nav className="flex-1 p-2 flex flex-col gap-0.5 overflow-y-auto">
        {items.map((item) => {
          const active = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-body transition-all ${
                active
                  ? "bg-bg-code text-text-primary border-l-2 border-accent-teal"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-code/50 border-l-2 border-transparent"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
