"use client";

import { useState, useEffect, useCallback } from "react";
import { FiltersSidebar, FilterState } from "@/components/filters-sidebar";
import { CollegeCard } from "@/components/college-card";
import { SkeletonLoader } from "@/components/skeleton-loader";
import { EmptyState } from "@/components/empty-state";
import { BookOpen, GraduationCap, ChevronLeft, ChevronRight } from "lucide-react";
import { CollegeWithCount, PaginationInfo } from "@/types";

const INITIAL_FILTERS: FilterState = {
  search: "",
  location: "",
  minFees: 0,
  maxFees: 99999999,
  minRating: 0,
  sortBy: "rating",
  sortOrder: "desc",
};

export default function ExplorePage() {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [page, setPage] = useState(1);
  const [colleges, setColleges] = useState<CollegeWithCount[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchColleges = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      if (filters.search) params.append("search", filters.search);
      if (filters.location) params.append("location", filters.location);
      if (filters.minFees > 0) params.append("minFees", filters.minFees.toString());
      if (filters.maxFees < 99999999) params.append("maxFees", filters.maxFees.toString());
      if (filters.minRating > 0) params.append("minRating", filters.minRating.toString());
      params.append("sortBy", filters.sortBy);
      params.append("sortOrder", filters.sortOrder);
      params.append("page", page.toString());
      params.append("limit", "6");

      const res = await fetch(`/api/colleges?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to fetch colleges. Please try again.");
      }

      const data = await res.json();
      setColleges(data.colleges);
      setPagination(data.pagination);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  // Fetch when filters or page changes
  useEffect(() => {
    fetchColleges();
  }, [fetchColleges]);

  // Reset page when filters change
  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (pagination && newPage >= 1 && newPage <= pagination.totalPages) {
      setPage(newPage);
      // Scroll to main listings grid
      window.scrollTo({ top: 300, behavior: "smooth" });
    }
  };

  return (
    <div className="flex-grow flex flex-col grid-bg min-h-screen">
      {/* Premium Hero section */}
      <section className="relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200/60 dark:border-slate-800/80 bg-white/50 dark:bg-slate-950/30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-300/10 dark:bg-blue-600/5 rounded-full blur-3xl -z-10" />
        
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide border border-blue-100 dark:border-blue-900/60">
            <GraduationCap className="h-4 w-4" />
            <span>Discover Your Academic Future</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight max-w-3xl mx-auto leading-[1.15] text-slate-900 dark:text-white">
            Explore &amp; Compare Top-Tier <span className="text-blue-600 dark:text-blue-400">Universities</span> Globally
          </h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Filter by tuition fees, locations, average placements, and ratings. Add multiple colleges side-by-side to compare structured details and make informed decisions.
          </p>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-grow">
          {/* Left filter column */}
          <div className="lg:col-span-1">
            <FiltersSidebar
              filters={filters}
              onChange={handleFiltersChange}
              onReset={handleResetFilters}
            />
          </div>

          {/* Right listings grid column */}
          <div className="lg:col-span-3 flex flex-col">
            {/* Status bar */}
            <div className="flex items-center justify-between mb-6 text-sm text-slate-500 dark:text-slate-400">
              <span className="font-semibold">
                {loading ? "Searching colleges..." : `${pagination?.total || 0} Colleges Match`}
              </span>
              {!loading && pagination && pagination.totalPages > 1 && (
                <span>
                  Page {pagination.page} of {pagination.totalPages}
                </span>
              )}
            </div>

            {/* Error or listing views */}
            {error ? (
              <div className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-4 rounded-xl border border-red-200 dark:border-red-900 text-center font-medium my-6">
                {error}
              </div>
            ) : loading ? (
              <SkeletonLoader />
            ) : colleges.length === 0 ? (
              <div className="my-auto">
                <EmptyState onReset={handleResetFilters} />
              </div>
            ) : (
              <div className="space-y-10 flex-grow flex flex-col">
                {/* College Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 flex-grow">
                  {colleges.map((college) => (
                    <CollegeCard key={college.id} college={college} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2 pt-6 border-t border-slate-200/60 dark:border-slate-800/80 mt-auto">
                    {/* Previous Button */}
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className="p-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>

                    {/* Page Numbers */}
                    {Array.from({ length: pagination.totalPages }).map((_, index) => {
                      const pageNum = index + 1;
                      const isCurrent = page === pageNum;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-9 h-9 rounded-xl text-xs font-semibold border transition-all ${
                            isCurrent
                              ? "bg-blue-600 border-blue-600 text-white font-bold shadow-md shadow-blue-500/20"
                              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    {/* Next Button */}
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === pagination.totalPages}
                      className="p-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
