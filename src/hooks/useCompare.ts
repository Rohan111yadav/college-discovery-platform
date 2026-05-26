import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

const LOCAL_STORAGE_KEY = "collegehub_compared_ids";

export function useCompare() {
  const { data: session } = useSession();
  const [comparedIds, setComparedIds] = useState<string[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setComparedIds(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load compared colleges from localStorage:", e);
    }
  }, []);

  // Save to localStorage whenever comparedIds changes
  const updateComparedIds = useCallback((ids: string[]) => {
    setComparedIds(ids);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(ids));
    } catch (e) {
      console.error("Failed to save compared colleges to localStorage:", e);
    }
  }, []);

  const isInCompare = useCallback((id: string) => {
    return comparedIds.includes(id);
  }, [comparedIds]);

  const addToCompare = useCallback((id: string): { success: boolean; error?: string } => {
    if (comparedIds.includes(id)) {
      return { success: false, error: "College is already in the comparison list." };
    }
    if (comparedIds.length >= 3) {
      return { success: false, error: "You can compare up to 3 colleges side-by-side." };
    }
    const newIds = [...comparedIds, id];
    updateComparedIds(newIds);
    return { success: true };
  }, [comparedIds, updateComparedIds]);

  const removeFromCompare = useCallback((id: string) => {
    const newIds = comparedIds.filter((item) => item !== id);
    updateComparedIds(newIds);
  }, [comparedIds, updateComparedIds]);

  const clearCompare = useCallback(() => {
    updateComparedIds([]);
  }, [updateComparedIds]);

  const saveComparisonToDb = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    if (!session) {
      return { success: false, error: "You must be logged in to save comparisons." };
    }
    if (comparedIds.length === 0) {
      return { success: false, error: "Add some colleges to compare before saving." };
    }

    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ collegeIds: comparedIds }),
      });

      const data = await res.json();
      if (res.ok) {
        return { success: true };
      } else {
        return { success: false, error: data.error || "Failed to save comparison" };
      }
    } catch (error) {
      console.error("Save comparison API error:", error);
      return { success: false, error: "Network error. Please try again." };
    }
  }, [session, comparedIds]);

  return {
    comparedIds,
    isInCompare,
    addToCompare,
    removeFromCompare,
    clearCompare,
    saveComparisonToDb,
  };
}
