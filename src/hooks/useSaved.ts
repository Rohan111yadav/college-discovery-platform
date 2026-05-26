import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

export function useSaved() {
  const { data: session, status } = useSession();
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSavedColleges = useCallback(async () => {
    if (status !== "authenticated") return;
    try {
      const res = await fetch("/api/save");
      if (res.ok) {
        const data = await res.json();
        const ids = data.savedColleges.map((c: any) => c.id);
        setSavedIds(ids);
      }
    } catch (error) {
      console.error("Failed to fetch saved college IDs:", error);
    }
  }, [status]);

  useEffect(() => {
    fetchSavedColleges();
  }, [fetchSavedColleges]);

  const isSaved = useCallback((collegeId: string) => {
    return savedIds.includes(collegeId);
  }, [savedIds]);

  const toggleSave = useCallback(async (collegeId: string): Promise<boolean> => {
    if (status !== "authenticated") {
      // Redirect or return false so the caller knows they need to log in
      return false;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ collegeId }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.saved) {
          setSavedIds((prev) => [...prev, collegeId]);
        } else {
          setSavedIds((prev) => prev.filter((id) => id !== collegeId));
        }
        setLoading(false);
        return true;
      }
    } catch (error) {
      console.error("Error toggling saved college:", error);
    }
    setLoading(false);
    return false;
  }, [status]);

  return {
    savedIds,
    isSaved,
    toggleSave,
    loading,
    refreshSaved: fetchSavedColleges,
  };
}
