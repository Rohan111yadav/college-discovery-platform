"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { BookOpen, Heart, BarChart3, LogIn, LogOut, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full glass border-b border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 font-bold text-xl tracking-tight">
          <BookOpen className="h-6 w-6 stroke-[2.5]" />
          <span>CollegeHub</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <Link
            href="/"
            className={`transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
              isActive("/") ? "text-blue-600 dark:text-blue-400 font-semibold" : "text-slate-600 dark:text-slate-300"
            }`}
          >
            Explore Colleges
          </Link>
          <Link
            href="/compare"
            className={`flex items-center space-x-1.5 transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
              isActive("/compare") ? "text-blue-600 dark:text-blue-400 font-semibold" : "text-slate-600 dark:text-slate-300"
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span>Compare</span>
          </Link>
          {isMounted && status === "authenticated" && (
            <Link
              href="/saved"
              className={`flex items-center space-x-1.5 transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                isActive("/saved") ? "text-blue-600 dark:text-blue-400 font-semibold" : "text-slate-600 dark:text-slate-300"
              }`}
            >
              <Heart className="h-4 w-4" />
              <span>Saved Items</span>
            </Link>
          )}
        </nav>

        {/* Auth Button/Profile */}
        <div className="flex items-center space-x-4">
          {!isMounted ? (
            <div className="h-8 w-20 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-md" />
          ) : status === "loading" ? (
            <div className="h-8 w-20 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-md" />
          ) : session ? (
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-300">
                <User className="h-4 w-4 text-slate-400" />
                <span className="max-w-[150px] truncate">{session.user?.email}</span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all border border-slate-200 dark:border-slate-700"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                href="/auth/login"
                className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all shadow-md shadow-blue-500/10 hover:shadow-blue-500/20"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Sign In</span>
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile Nav Subbar for clean UX */}
      <div className="md:hidden border-t border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 h-10 flex items-center justify-around text-xs font-medium">
        <Link href="/" className={isActive("/") ? "text-blue-600 dark:text-blue-400 font-semibold" : "text-slate-500"}>
          Explore
        </Link>
        <Link href="/compare" className={isActive("/compare") ? "text-blue-600 dark:text-blue-400 font-semibold" : "text-slate-500"}>
          Compare
        </Link>
        {isMounted && status === "authenticated" && (
          <Link href="/saved" className={isActive("/saved") ? "text-blue-600 dark:text-blue-400 font-semibold" : "text-slate-500"}>
            Saved
          </Link>
        )}
      </div>
    </header>
  );
}
