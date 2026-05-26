import { BookOpen } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
        <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
          <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-semibold tracking-tight">CollegeHub &copy; {new Date().getFullYear()}</span>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500 text-center md:text-right">
          Built with Next.js 15, TypeScript, TailwindCSS, Prisma ORM &amp; NextAuth.
        </p>
      </div>
    </footer>
  );
}
