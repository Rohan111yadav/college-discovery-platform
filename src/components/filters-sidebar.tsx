"use client";

import { Star, MapPin, IndianRupee, RotateCcw, SlidersHorizontal } from "lucide-react";

export interface FilterState {
  search: string;
  location: string;
  minFees: number;
  maxFees: number;
  minRating: number;
  sortBy: string;
  sortOrder: string;
}

interface FiltersSidebarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
}

export function FiltersSidebar({ filters, onChange, onReset }: FiltersSidebarProps) {
  const handleTextChange = (key: keyof FilterState, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  const handleSelectChange = (key: keyof FilterState, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  const handleRatingChange = (rating: number) => {
    onChange({ ...filters, minRating: filters.minRating === rating ? 0 : rating });
  };

  const handleFeesChange = (min: number, max: number) => {
    onChange({ ...filters, minFees: min, maxFees: max });
  };

  const handleSortChange = (sortBy: string, sortOrder: string) => {
    onChange({ ...filters, sortBy, sortOrder });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center space-x-2 text-slate-800 dark:text-white font-bold text-sm uppercase tracking-wider">
          <SlidersHorizontal className="h-4.5 w-4.5 text-blue-600 dark:text-blue-400" />
          <span>Filters &amp; Sort</span>
        </div>
        <button
          onClick={onReset}
          className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          title="Reset all filters"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      {/* Sorting Section */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
          Sort By
        </label>
        <select
          value={`${filters.sortBy}-${filters.sortOrder}`}
          onChange={(e) => {
            const [by, order] = e.target.value.split("-");
            handleSortChange(by, order);
          }}
          className="block w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        >
          <option value="rating-desc">Rating: High to Low</option>
          <option value="fees-asc">Fees: Low to High</option>
          <option value="fees-desc">Fees: High to Low</option>
          <option value="name-asc">Name: A to Z</option>
        </select>
      </div>

      {/* Search keywords */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
          Keyword Search
        </label>
        <input
          type="text"
          placeholder="e.g. computer, IIT, BITS"
          value={filters.search}
          onChange={(e) => handleTextChange("search", e.target.value)}
          className="block w-full px-3 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
        />
      </div>

      {/* Location Filter */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
          Location
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
            <MapPin className="h-4 w-4" />
          </span>
          <select
            value={filters.location}
            onChange={(e) => handleSelectChange("location", e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          >
            <option value="">All Locations</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Goa">Goa</option>
            <option value="California">California, USA</option>
            <option value="Ahmedabad">Ahmedabad</option>
            <option value="Vellore">Vellore</option>
            <option value="Delhi">Delhi</option>
          </select>
        </div>
      </div>

      {/* Fees range */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
          Annual Fees Limit
        </label>
        <div className="space-y-2">
          {[
            { label: "All Budget Ranges", min: 0, max: 99999999 },
            { label: "Under ₹1 Lakh", min: 0, max: 100000 },
            { label: "₹1 Lakh - ₹3 Lakhs", min: 100000, max: 300000 },
            { label: "₹3 Lakhs - ₹10 Lakhs", min: 300000, max: 1000000 },
            { label: "Above ₹10 Lakhs", min: 1000000, max: 99999999 },
          ].map((range) => {
            const isSelected = filters.minFees === range.min && filters.maxFees === range.max;
            return (
              <button
                key={range.label}
                onClick={() => handleFeesChange(range.min, range.max)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between border transition-all ${
                  isSelected
                    ? "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <span>{range.label}</span>
                <IndianRupee className="h-3 w-3 stroke-[2.5]" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Ratings filter */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
          Minimum Rating
        </label>
        <div className="flex flex-col space-y-1.5">
          {[4.8, 4.5, 4.0].map((rating) => {
            const isSelected = filters.minRating === rating;
            return (
              <button
                key={rating}
                onClick={() => handleRatingChange(rating)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between border transition-all ${
                  isSelected
                    ? "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center space-x-1.5">
                  <Star className="h-3.5 w-3.5 fill-current text-yellow-400" />
                  <span>{rating.toFixed(1)} &amp; Above</span>
                </div>
                {isSelected && <span className="h-1.5 w-1.5 bg-blue-600 rounded-full" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
