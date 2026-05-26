"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Heart, BarChart3, Star, MapPin, IndianRupee, Briefcase } from "lucide-react";
import { useSaved } from "@/hooks/useSaved";
import { useCompare } from "@/hooks/useCompare";
import { CollegeWithCount } from "@/types";

interface CollegeCardProps {
  college: CollegeWithCount;
}

export function CollegeCard({ college }: CollegeCardProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { isSaved, toggleSave, loading: saveLoading } = useSaved();
  const { isInCompare, addToCompare, removeFromCompare } = useCompare();

  const saved = isSaved(college.id);
  const compared = isInCompare(college.id);

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      router.push("/auth/login");
      return;
    }

    await toggleSave(college.id);
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (compared) {
      removeFromCompare(college.id);
    } else {
      const result = addToCompare(college.id);
      if (!result.success && result.error) {
        alert(result.error);
      }
    }
  };

  return (
    <div className="group bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full relative">
      {/* Top action badge actions */}
      <div className="absolute top-3 right-3 z-10 flex space-x-2">
        {/* Save/Favorite button */}
        <button
          onClick={handleSave}
          disabled={saveLoading}
          className={`p-2 rounded-xl border backdrop-blur-md shadow-sm transition-all duration-200 ${
            saved
              ? "bg-red-50/90 dark:bg-red-950/80 border-red-200 dark:border-red-900 text-red-600 dark:text-red-400"
              : "bg-white/80 dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 hover:text-slate-700"
          }`}
          title={saved ? "Remove from Saved" : "Save College"}
        >
          <Heart className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* College Image Banner */}
      <Link href={`/college/${college.id}`} className="relative h-48 w-full block overflow-hidden bg-slate-100">
        <img
          src={college.image}
          alt={college.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Absolute Rating Overlay */}
        <div className="absolute bottom-3 left-3 bg-slate-900/75 backdrop-blur-sm text-yellow-400 text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center space-x-1">
          <Star className="h-3.5 w-3.5 fill-current" />
          <span>{college.rating.toFixed(1)}</span>
        </div>
      </Link>

      {/* Card Content Body */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Name and Location */}
        <Link href={`/college/${college.id}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          <h3 className="font-bold text-base leading-snug line-clamp-2 text-slate-800 dark:text-slate-100 mb-1">
            {college.name}
          </h3>
        </Link>
        
        <div className="flex items-center text-slate-500 dark:text-slate-400 text-xs mb-4">
          <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0 text-slate-400" />
          <span className="truncate">{college.location}</span>
        </div>

        {/* Dynamic Key metrics */}
        <div className="grid grid-cols-2 gap-3 border-t border-slate-100 dark:border-slate-800/80 pt-4 mt-auto mb-5 text-slate-600 dark:text-slate-400">
          <div>
            <span className="block text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
              Annual Fees
            </span>
            <div className="flex items-center font-bold text-sm text-slate-800 dark:text-white mt-0.5">
              {college.fees >= 1000000 ? (
                <>
                  <IndianRupee className="h-3.5 w-3.5 mr-0.5" />
                  <span>{(college.fees / 100000).toFixed(1)} L</span>
                </>
              ) : college.fees >= 1000 ? (
                <>
                  <IndianRupee className="h-3.5 w-3.5 mr-0.5" />
                  <span>{college.fees.toLocaleString("en-IN")}</span>
                </>
              ) : (
                <span>TBD</span>
              )}
            </div>
          </div>
          <div>
            <span className="block text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
              Placements
            </span>
            <div className="flex items-center font-bold text-sm text-slate-800 dark:text-white mt-0.5">
              <Briefcase className="h-3.5 w-3.5 mr-1 text-emerald-500" />
              <span className="truncate">{college.placements}</span>
            </div>
          </div>
        </div>

        {/* Compare action button */}
        <button
          onClick={handleCompare}
          className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 border transition-all duration-200 ${
            compared
              ? "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 font-bold"
              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300"
          }`}
        >
          <BarChart3 className={`h-4 w-4 ${compared ? "fill-current" : ""}`} />
          <span>{compared ? "Remove Comparison" : "Compare College"}</span>
        </button>
      </div>
    </div>
  );
}
