"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCompare } from "@/hooks/useCompare";
import { useSaved } from "@/hooks/useSaved";
import {
  BarChart3,
  MapPin,
  Star,
  IndianRupee,
  Briefcase,
  Trash2,
  Bookmark,
  Sparkles,
  ArrowRight,
  Loader2,
  Save,
} from "lucide-react";
import { CollegeWithCourses } from "@/types";

export default function ComparePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { comparedIds, removeFromCompare, clearCompare, saveComparisonToDb } = useCompare();
  const { isSaved, toggleSave } = useSaved();

  const [colleges, setColleges] = useState<CollegeWithCourses[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fetchComparedColleges = useCallback(async () => {
    if (comparedIds.length === 0) {
      setColleges([]);
      return;
    }
    setLoading(true);
    setError("");

    try {
      // Fetch details for all compared IDs
      const fetched = await Promise.all(
        comparedIds.map(async (id) => {
          const res = await fetch(`/api/college/${id}`);
          if (!res.ok) throw new Error(`Failed to load college ID: ${id}`);
          const data = await res.json();
          return data.college;
        })
      );
      setColleges(fetched);
    } catch (err: any) {
      console.error(err);
      setError("Failed to load details for some colleges. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, [comparedIds]);

  useEffect(() => {
    fetchComparedColleges();
  }, [fetchComparedColleges]);

  const handleSaveComparison = async () => {
    setSaveLoading(true);
    setSaveSuccess(false);
    const result = await saveComparisonToDb();
    if (result.success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      alert(result.error || "Failed to save comparison.");
    }
    setSaveLoading(false);
  };

  const handleToggleFavorite = async (collegeId: string) => {
    if (!session) {
      router.push("/auth/login");
      return;
    }
    await toggleSave(collegeId);
    // Refresh to update saved states locally
    fetchComparedColleges();
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center py-24">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto" />
          <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold">Generating comparison table...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col grid-bg min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full flex-grow flex flex-col">
        
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800/85 mb-8 space-y-4 md:space-y-0">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider mb-2">
              <BarChart3 className="h-4.5 w-4.5" />
              <span>Side-by-Side Comparison</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Compare Colleges
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Analyze structured metrics, course fees, placements, and ratings side-by-side.
            </p>
          </div>

          {colleges.length > 0 && (
            <div className="flex items-center space-x-3">
              {session && (
                <button
                  onClick={handleSaveComparison}
                  disabled={saveLoading}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                    saveSuccess
                      ? "bg-emerald-500 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {saveLoading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : saveSuccess ? (
                    <span>Comparison Saved!</span>
                  ) : (
                    <>
                      <Save className="h-3.5 w-3.5" />
                      <span>Save Comparison</span>
                    </>
                  )}
                </button>
              )}
              <button
                onClick={clearCompare}
                className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border border-slate-200 dark:border-slate-700"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear All</span>
              </button>
            </div>
          )}
        </div>

        {/* Empty state when no items selected */}
        {colleges.length === 0 ? (
          <div className="my-auto max-w-xl mx-auto text-center bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-10 rounded-2xl shadow-sm space-y-6">
            <div className="bg-blue-50 dark:bg-blue-950/40 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto text-blue-600 dark:text-blue-400">
              <BarChart3 className="h-8 w-8 stroke-[1.5]" />
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">Comparison List is Empty</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                Add 2 or 3 colleges from the explore panel to compare program durations, average placement packages, and total fees side-by-side.
              </p>
            </div>
            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-5 py-3 rounded-xl shadow-md shadow-blue-500/10 transition-all hover:shadow-blue-500/20"
            >
              <span>Explore Colleges</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex-grow space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-4 rounded-xl border border-red-200 dark:border-red-900 text-center font-medium">
                {error}
              </div>
            )}

            {/* Side-by-side Table Layout */}
            <div className="overflow-x-auto bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm">
              <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800 text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/60">
                    {/* Fixed empty corner */}
                    <th className="px-6 py-8 min-w-[200px] border-r border-slate-100 dark:border-slate-800" />
                    
                    {/* College Headers */}
                    {colleges.map((college) => {
                      const fav = isSaved(college.id);
                      return (
                        <th
                          key={college.id}
                          className="px-6 py-8 min-w-[280px] align-top relative border-r border-slate-100 dark:border-slate-800 last:border-r-0"
                        >
                          <div className="space-y-4">
                            <button
                              onClick={() => removeFromCompare(college.id)}
                              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-red-500 transition-colors"
                              title="Remove from compare"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                            
                            <img
                              src={college.image}
                              alt={college.name}
                              className="h-28 w-full object-cover rounded-xl border border-slate-200/40 dark:border-slate-700/60"
                            />
                            
                            <div>
                              <h3 className="font-bold text-sm sm:text-base text-slate-800 dark:text-white line-clamp-2">
                                {college.name}
                              </h3>
                              <p className="text-xs text-slate-400 flex items-center mt-1">
                                <MapPin className="h-3 w-3 mr-0.5" />
                                <span>{college.location}</span>
                              </p>
                            </div>

                            {/* Row specific quick actions */}
                            <div className="flex space-x-2 pt-2">
                              <button
                                onClick={() => handleToggleFavorite(college.id)}
                                className={`flex-1 py-1.5 px-3 border rounded-lg text-[10px] uppercase font-bold tracking-wider flex items-center justify-center space-x-1.5 transition-colors ${
                                  fav
                                    ? "bg-red-50/80 dark:bg-red-950/20 border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400"
                                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
                                }`}
                              >
                                <Bookmark className={`h-3 w-3 ${fav ? "fill-current" : ""}`} />
                                <span>{fav ? "Saved" : "Save"}</span>
                              </button>
                              
                              <button
                                onClick={() => router.push(`/college/${college.id}`)}
                                className="flex-1 py-1.5 px-3 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-[10px] uppercase font-bold tracking-wider flex items-center justify-center space-x-1.5 transition-colors"
                              >
                                <span>Details</span>
                                <ArrowRight className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-semibold">
                  
                  {/* Rating comparison row */}
                  <tr>
                    <td className="px-6 py-4 bg-slate-50/50 dark:bg-slate-900/40 text-slate-400 font-bold border-r border-slate-100 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                      Rating
                    </td>
                    {colleges.map((college) => (
                      <td
                        key={college.id}
                        className="px-6 py-4 border-r border-slate-100 dark:border-slate-800 last:border-r-0"
                      >
                        <div className="flex items-center space-x-1.5 text-yellow-500 font-extrabold text-sm">
                          <Star className="h-4.5 w-4.5 fill-current" />
                          <span>{college.rating.toFixed(1)} / 5.0</span>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Fees comparison row */}
                  <tr>
                    <td className="px-6 py-4 bg-slate-50/50 dark:bg-slate-900/40 text-slate-400 font-bold border-r border-slate-100 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                      Annual Tuition Fees
                    </td>
                    {colleges.map((college) => (
                      <td
                        key={college.id}
                        className="px-6 py-4 border-r border-slate-100 dark:border-slate-800 last:border-r-0 font-extrabold text-slate-900 dark:text-white"
                      >
                        <div className="flex items-center text-sm">
                          <IndianRupee className="h-3.5 w-3.5 mr-0.5 text-slate-500" />
                          <span>{college.fees.toLocaleString("en-IN")}</span>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Placements comparison row */}
                  <tr>
                    <td className="px-6 py-4 bg-slate-50/50 dark:bg-slate-900/40 text-slate-400 font-bold border-r border-slate-100 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                      Average Placements
                    </td>
                    {colleges.map((college) => (
                      <td
                        key={college.id}
                        className="px-6 py-4 border-r border-slate-100 dark:border-slate-800 last:border-r-0"
                      >
                        <div className="flex items-center space-x-1 text-emerald-500 font-bold">
                          <Briefcase className="h-4 w-4" />
                          <span>{college.placements}</span>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Program Courses comparison row */}
                  <tr>
                    <td className="px-6 py-4 bg-slate-50/50 dark:bg-slate-900/40 text-slate-400 font-bold border-r border-slate-100 dark:border-slate-800 uppercase tracking-wider text-[10px] align-top">
                      Offered Programs
                    </td>
                    {colleges.map((college) => (
                      <td
                        key={college.id}
                        className="px-6 py-4 border-r border-slate-100 dark:border-slate-800 last:border-r-0 align-top"
                      >
                        {college.courses.length === 0 ? (
                          <span className="text-slate-400 italic">No programs listed</span>
                        ) : (
                          <div className="space-y-1.5">
                            {college.courses.map((course) => (
                              <div
                                key={course.id}
                                className="bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-200/50 dark:border-slate-800/80"
                              >
                                <span className="block font-bold text-slate-800 dark:text-slate-200 text-xs">
                                  {course.name}
                                </span>
                                <span className="block text-[10px] text-slate-400 mt-0.5">
                                  {course.duration} | ₹{course.fees.toLocaleString("en-IN")}/yr
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>

                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
