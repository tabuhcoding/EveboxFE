'use client';

/* Package System */
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import 'tailwindcss/tailwind.css';

/* Package Application */
import EventTable from "./eventTable";
import Tabs from "./common/tab";
import SearchBar from "./common/searchBar";
import FilterBar from "./common/filter";

export default function EventPage() {
  const t = useTranslations('common');

  const [activeTab, setActiveTab] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(searchKeyword);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [searchKeyword]);

  const handleResetFilter = () => {
    setCategoryFilter('');
    setDateFrom('');
    setDateTo('');
  };

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith('common.')) return fallback;
    return msg;
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-[#0C4762] mb-1">{transWithFallback('eventManagement', 'Quản lý sự kiện')}</h1>
      <div className="border-t-2 border-[#0C4762] mt-2"></div>

      <div className="flex justify-between items-center mt-6 mb-2">
        <SearchBar onSearch={setSearchKeyword} />
        <FilterBar
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          dateFrom={dateFrom} dateTo={dateTo}
          onDateFromChange={setDateFrom}
          onDateToChange={setDateTo}
          onReset={handleResetFilter}
        />
      </div>

      <Tabs
        activeTab={activeTab}
        setActiveTab={(tabId: string) => {
          setLoading(true); // start spinner
          setActiveTab(tabId);
        }}
        loading={loading}
      />

      <EventTable
        activeTab={activeTab}
        searchKeyword={debouncedSearch}
        categoryFilter={categoryFilter}
        dateFrom={dateFrom} dateTo={dateTo}
        onLoadFinish={() => setLoading(false)}
      />
    </>
  )
}