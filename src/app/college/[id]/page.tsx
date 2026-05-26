"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  MapPin,
  Star,
  IndianRupee,
  Briefcase,
  Clock,
  BookOpen,
  Heart,
  BarChart3,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Users,
} from "lucide-react";
import { useSaved } from "@/hooks/useSaved";
import { useCompare } from "@/hooks/useCompare";
import { CollegeWithCourses } from "@/types";

export default function CollegeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const id = params?.id as string;

  const [college, setCollege] = useState<CollegeWithCourses | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "courses" | "placements" | "reviews">("overview");

  const { isSaved, toggleSave, loading: saveLoading } = useSaved();
  const { isInCompare, addToCompare, removeFromCompare } = useCompare();

  const saved = college ? isSaved(college.id) : false;
  const compared = college ? isInCompare(college.id) : false;

  const fetchCollegeDetails = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/college/${id}`);
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("College not found.");
        }
        throw new Error("Failed to fetch college details.");
      }
      const data = await res.json();
      setCollege(data.college);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load college.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCollegeDetails();
  }, [fetchCollegeDetails]);

  const handleSave = async () => {
    if (!college) return;
    if (!session) {
      router.push("/auth/login");
      return;
    }
    await toggleSave(college.id);
  };

  const handleCompare = () => {
    if (!college) return;
    if (compared) {
      removeFromCompare(college.id);
    } else {
      const result = addToCompare(college.id);
      if (!result.success && result.error) {
        alert(result.error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center py-24">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto" />
          <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold">Loading college details...</p>
        </div>
      </div>
    );
  }

  if (error || !college) {
    return (
      <div className="flex-grow flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-8 rounded-2xl text-center shadow-sm">
          <div className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 border border-red-100 dark:border-red-900/60">
            <Star className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Error Loading College</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{error || "The college details could not be found."}</p>
          <button
            onClick={() => router.push("/")}
            className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl mx-auto transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Explorer</span>
          </button>
        </div>
      </div>
    );
  }

  // Mock reviews for premium UI layout as requested
  const mockReviews = [
    {
      author: "Aditya Sharma",
      role: "Alumni (Class of 2024)",
      rating: 4.8,
      comment: "Absolutely outstanding campus life and industry support. The practice school (internship path) model paved the way for my corporate conversion. Highly recommend!",
      date: "Jan 12, 2026",
    },
    {
      author: "Sneha Patel",
      role: "B.Tech Undergrad (Year 3)",
      rating: 4.5,
      comment: "Academic rigor is highly intense but absolutely rewarding. Peer group is top-notch, keeping you constantly motivated and inspired. Hostels are modern and well maintained.",
      date: "Mar 28, 2026",
    },
  ];

  return (
    <div className="flex-grow flex flex-col grid-bg min-h-screen">
      {/* College Banner & Title Area */}
      <div className="relative h-64 sm:h-80 md:h-96 w-full bg-slate-900 overflow-hidden">
        <img src={college.image} alt={college.name} className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/45 to-transparent" />
        
        {/* Banner Details Overlay */}
        <div className="absolute bottom-0 left-0 right-0 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-4">
            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center space-x-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/10 transition-all mb-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Listings</span>
            </button>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              {college.name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-slate-200">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1 text-slate-300" />
                <span>{college.location}</span>
              </div>
              <div className="flex items-center text-yellow-400">
                <Star className="h-4 w-4 mr-1 fill-current" />
                <span className="font-bold">{college.rating.toFixed(1)} / 5.0 Rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabbed and Detail Column Layout */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Columns (Overview, Courses, Placements, Reviews tabs) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs Selector Navigation */}
            <div className="flex border-b border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-1.5 rounded-xl border">
              {(["overview", "courses", "placements", "reviews"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    activeTab === tab
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/10"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab content body */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm min-h-[350px]">
              
              {/* Tab 1: Overview */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-3">About the University</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed text-justify">
                      {college.description}
                    </p>
                  </div>
                  <div className="border-t border-slate-100 dark:border-slate-800/80 pt-6">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Highlights</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        "Highly Ranked Research Infrastructure",
                        "Elite Alumni Connections",
                        "Comprehensive Professional Support",
                        "Diverse Extracurricular Activities",
                      ].map((item) => (
                        <div key={item} className="flex items-center space-x-2.5 text-slate-600 dark:text-slate-300">
                          <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 flex-shrink-0" />
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Courses & Fee Structure */}
              {activeTab === "courses" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">Academic Programs</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
                      Explore detailed course structures and duration details.
                    </p>
                  </div>

                  {college.courses.length === 0 ? (
                    <p className="text-slate-500 text-sm text-center py-6">No courses listed currently.</p>
                  ) : (
                    <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
                      <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-900/80 text-xs font-bold uppercase tracking-wider text-slate-400">
                          <tr>
                            <th className="px-4 py-3">Course Name</th>
                            <th className="px-4 py-3">Duration</th>
                            <th className="px-4 py-3 text-right">Annual Fees</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                          {college.courses.map((course) => (
                            <tr key={course.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                              <td className="px-4 py-3.5 font-semibold text-slate-800 dark:text-slate-100">
                                {course.name}
                              </td>
                              <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400">
                                <span className="inline-flex items-center space-x-1.5">
                                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                                  <span>{course.duration}</span>
                                </span>
                              </td>
                              <td className="px-4 py-3.5 text-right font-bold text-slate-800 dark:text-white">
                                ₹{course.fees.toLocaleString("en-IN")}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Placements */}
              {activeTab === "placements" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Corporate Support &amp; Placements</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed text-justify">
                      The university prides itself on its robust industry linkages, practice schools, and placement support cells. Placements have consistently been a strong aspect of our reputation, with multiple leading firms actively recruiting every recruitment cycle.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-slate-100 dark:border-slate-800/80 pt-6">
                    <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-4 flex items-center space-x-4">
                      <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-xl text-emerald-500">
                        <Briefcase className="h-6 w-6" />
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          Average Salary Package
                        </span>
                        <span className="font-extrabold text-base text-slate-800 dark:text-white">
                          {college.placements}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-4 flex items-center space-x-4">
                      <div className="bg-blue-50 dark:bg-blue-950/40 p-3 rounded-xl text-blue-500">
                        <Users className="h-6 w-6" />
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          Top Recruiter Domains
                        </span>
                        <span className="font-bold text-sm text-slate-800 dark:text-white">
                          Software, Analytics, Consulting
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Reviews */}
              {activeTab === "reviews" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Student &amp; Alumni Reviews</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
                      Hear directly from peers who experienced this university.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    {mockReviews.map((rev, index) => (
                      <div
                        key={index}
                        className="bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/80 p-5 rounded-2xl space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-bold text-sm text-slate-800 dark:text-white">{rev.author}</h4>
                            <span className="text-xs text-slate-500 dark:text-slate-400">{rev.role}</span>
                          </div>
                          <div className="flex items-center space-x-1.5 bg-yellow-400/10 text-yellow-600 dark:text-yellow-400 px-2 py-0.5 rounded-lg text-xs font-bold">
                            <Star className="h-3 w-3 fill-current" />
                            <span>{rev.rating.toFixed(1)}</span>
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                          &ldquo;{rev.comment}&rdquo;
                        </p>
                        <span className="block text-[10px] text-slate-400 text-right">{rev.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right column (Quick facts & Direct actions) */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Quick Actions Panel */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 space-y-4 shadow-sm">
              <h3 className="font-bold text-sm text-slate-800 dark:text-white uppercase tracking-wider">Quick Actions</h3>
              
              <button
                onClick={handleSave}
                disabled={saveLoading}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 border transition-all duration-200 ${
                  saved
                    ? "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900 text-red-600 dark:text-red-400"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <Heart className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
                <span>{saved ? "Saved to Favorites" : "Save to Favorites"}</span>
              </button>

              <button
                onClick={handleCompare}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 border transition-all duration-200 ${
                  compared
                    ? "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                <span>{compared ? "Remove Comparison" : "Compare College"}</span>
              </button>
            </div>

            {/* Quick Facts Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 space-y-4 shadow-sm">
              <h3 className="font-bold text-sm text-slate-800 dark:text-white uppercase tracking-wider">Quick Facts</h3>
              
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                <div className="py-3 flex justify-between text-xs sm:text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Location</span>
                  <span className="font-semibold text-slate-800 dark:text-white text-right max-w-[150px] truncate">
                    {college.location}
                  </span>
                </div>
                
                <div className="py-3 flex justify-between text-xs sm:text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Average Placement</span>
                  <span className="font-semibold text-slate-800 dark:text-white text-right">
                    {college.placements}
                  </span>
                </div>

                <div className="py-3 flex justify-between text-xs sm:text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Annual Tuition Fee</span>
                  <span className="font-bold text-slate-850 dark:text-white text-right">
                    ₹{college.fees.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="py-3 flex justify-between text-xs sm:text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Total Courses</span>
                  <span className="font-semibold text-slate-800 dark:text-white text-right">
                    {college.courses.length} Programs
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
