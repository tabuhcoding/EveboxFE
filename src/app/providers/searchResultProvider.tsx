'use client';

import { createContext, useContext, useState, ReactNode } from "react";

// Định nghĩa kiểu dữ liệu cho context
type SearchContextType = {
  eventIds: number[];
  setEventIds: (ids: number[]) => void;
};

// Tạo context mặc định
const SearchContext = createContext<SearchContextType | undefined>(undefined);
SearchContext.displayName = "SearchContext";

// Props cho Provider
type SearchResultProviderProps = {
  children: ReactNode;
};

// Component Provider
export const SearchResultProvider = ({ children }: SearchResultProviderProps) => {
  const [eventIds, setEventIds] = useState<number[]>([]);

  return (
    <SearchContext.Provider value={{ eventIds, setEventIds }}>
      {children}
    </SearchContext.Provider>
  );
};

// Custom hook để sử dụng context
export const useSearchResults = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearchResults must be used within a SearchResultProvider");
  }
  return context;
};