import { useState, useEffect, useMemo } from "react";
import type { SearchablePage } from "@/types/navigations";
import { SEARCHABLE_PAGES } from "@/lib/constants/navigation";

export function useSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchablePage[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length > 0) {
        const query = searchQuery.toLowerCase().trim();
        const filtered = SEARCHABLE_PAGES.filter(page => 
          page.label.toLowerCase().includes(query) ||
          page.description.toLowerCase().includes(query) ||
          page.keywords.some(keyword => keyword.includes(query))
        );
        setResults(filtered);
      } else {
        setResults([]);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const clearSearch = () => {
    setSearchQuery("");
    setResults([]);
  };

  return {
    searchQuery,
    setSearchQuery,
    results,
    clearSearch,
    hasResults: results.length > 0,
    resultCount: results.length,
  };
}