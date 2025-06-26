'use client';

/* Package System */
import 'tailwindcss/tailwind.css';
import { useState, useEffect } from "react";

/* Package Application */
import SpecialEventTable from './specialEventTable';
import FilterBar from './common/filter';
import SearchBar from '../../event-management/_components/common/searchBar';

export default function SpecialEventPage() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<number | '__onlyOnEve' | '__special' | ''>('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(searchKeyword);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [searchKeyword]);

  const handleResetFilter = () => {
    setCategoryFilter('');
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-[#0C4762] mb-1">Quản lý Sự kiện đặc biệt</h1>
      <div className="border-t-2 border-[#0C4762] mt-2"></div>

      <div className="flex justify-between items-center mt-6 mb-2">
        <SearchBar onSearch={setSearchKeyword} />
        <FilterBar
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          onReset={handleResetFilter}
        />
      </div>

      <SpecialEventTable searchKeyword={debouncedSearch} categoryFilter={categoryFilter} />
    </>
  )
}