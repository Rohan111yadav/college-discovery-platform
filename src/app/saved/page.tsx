"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Heart,
  BarChart3,
  Bookmark,
  ChevronRight,
  Loader2,
  Trash2,
  Lock,
  ExternalLink,
} from "lucide-react";
import { CollegeCard } from "@/components/college-card";
import { CollegeWithCount, ComparisonWithColleges } from "@/types";

export default function SavedItemsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [activeSection, setActiveSection] = useState<"colleges" | "comparisons">("colleges");

  const [savedColleges, setSavedColleges] = useState<CollegeWithCount[]>([]);
  const [comparisons, setComparisons] = useState<ComparisonWithColleges[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    if (status !== "authenticated") return;
    setLoading(true);
    setError("");

    try {
      // Parallel fetch for saved colleges and comparisons
      const [collegesRes, comparisonsRes] = await Promise.all([
        fetch("/api/save"),
        fetch("/api/compare"),
      ]);

      if (!collegesRes.ok || !comparisonsRes.ok) {
        throw new Error("Failed to load saved items. Please try again.");
      }

      const collegesData = await collegesRes.json();
      const comparisonsData = await comparisonsRes.json();

      setSavedColleges(collegesData.savedColleges);
      setComparisons(comparisonsData.comparisons);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load details.");
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (status === "authenticated") {
      fetchData();
    }
  }, [status, router, fetchData]);

  const handleRemoveSave = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const res = await fetch("/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collegeId: id }),
      });

      if (res.ok) {
        setSavedColleges((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (err) {
      console.error("Failed to remove saved college:", err);
    }
  };

  const handleLoadComparison = (collegeIds: string[]) => {
    // Write compared IDs directly to localStorage and navigate to compare
    try {
      localStorage.setItem("collegehub_compared_ids", JSON.stringify(collegeIds));
      router.push("/compare");
    } catch (e) {
      console.error(e);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex-grow flex items-center justify-center py-24">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto" />
          <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold">Loading saved workspace...</p>
        </div>
      </div>
    );
  }

  if (status !== "authenticated") {
    return (
      <div className="flex-grow flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-8 rounded-2xl text-center shadow-sm">
          <Lock className="h-10 w-10 text-slate-400 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Access Denied</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Please register or sign in to save your favorite universities and active college comparison tables.
          </p>
          <button
            onClick={() => router.push("/auth/login")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 rounded-xl transition-all"
          >
            Sign In Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col grid-bg min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full flex-grow flex flex-col">
        
        {/* Header section */}
        <div className="pb-6 border-b border-slate-200 dark:border-slate-800/85 mb-8">
          <div className="inline-flex items-center space-x-1.5 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider mb-2">
            <Heart className="h-4.5 w-4.5" />
            <span>User Saved Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Saved Items
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Access and manage your bookmarked colleges and customized comparative graphs.
          </p>
        </div>

        {/* Section Tabs Selector */}
        <div className="flex space-x-3 mb-8">
          <button
            onClick={() => setActiveSection("colleges")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
              activeSection === "colleges"
                ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/10"
                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            Saved Colleges ({savedColleges.length})
          </button>
          
          <button
            onClick={() => setActiveSection("comparisons")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
              activeSection === "comparisons"
                ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/10"
                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            Saved Comparisons ({comparisons.length})
          </button>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-4 rounded-xl border border-red-200 dark:border-red-900 text-center font-medium my-4">
            {error}
          </div>
        )}

        {/* Saved Colleges View */}
        {activeSection === "colleges" && (
          savedColleges.length === 0 ? (
            <div className="my-auto text-center py-16 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-8 max-w-md mx-auto space-y-4">
              <Heart className="h-10 w-10 text-slate-350 mx-auto" />
              <h3 className="font-bold text-slate-800 dark:text-white">No Saved Colleges</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Bookmarked universities will appear in this workspace for quick access. Go to the search explorer to save items.
              </p>
              <button
                onClick={() => router.push("/")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2 rounded-xl transition-all"
              >
                Browse Explorer
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedColleges.map((college) => (
                <div key={college.id} className="relative group">
                  <CollegeCard college={college} />
                  {/* Absolute override for unsave */}
                  <button
                    onClick={(e) => handleRemoveSave(college.id, e)}
                    className="absolute top-3 right-12 z-25 p-2 rounded-xl border bg-red-500 hover:bg-red-600 text-white border-red-500 backdrop-blur-md shadow-sm transition-all"
                    title="Remove from Saved"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )
        )}

        {/* Saved Comparisons View */}
        {activeSection === "comparisons" && (
          comparisons.length === 0 ? (
            <div className="my-auto text-center py-16 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-8 max-w-md mx-auto space-y-4">
              <BarChart3 className="h-10 w-10 text-slate-350 mx-auto" />
              <h3 className="font-bold text-slate-800 dark:text-white">No Saved Comparisons</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Save active side-by-side comparison tables to reload them instantly anytime from your profile workspace.
              </p>
              <button
                onClick={() => router.push("/")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2 rounded-xl transition-all"
              >
                Go to Explorer
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {comparisons.map((comp) => (
                <div
                  key={comp.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        Comparative Group
                      </span>
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                        {comp.colleges.length} Colleges
                      </span>
                    </div>

                    {/* Quick list of university names */}
                    <div className="space-y-2">
                      {comp.colleges.map((col) => (
                        <div
                          key={col.id}
                          className="flex items-center justify-between text-xs sm:text-sm font-semibold border-b border-slate-100 dark:border-slate-850 pb-2 last:border-b-0 last:pb-0"
                        >
                          <span className="text-slate-800 dark:text-slate-200 truncate pr-4">
                            {col.name}
                          </span>
                          <span className="text-slate-400 text-xs shrink-0">{col.location.split(",")[0]}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleLoadComparison(comp.collegeIds)}
                    className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold border border-slate-250/60 dark:border-slate-800 flex items-center justify-center space-x-1.5 transition-all"
                  >
                    <span>Load Comparison Grid</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )
        )}

      </div>
    </div>
  );
}
