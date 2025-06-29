'use client';

/* Package System */
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import 'tailwindcss/tailwind.css';

/* Package Application */
import AccountTable from "./accountTable";
import SearchBar from "./searchBar";
import FilterBar from "./filter";

export default function AccountPage() {
  const t = useTranslations('common');

  const [searchKeyword, setSearchKeyword] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [roleFilter, setRoleFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(searchKeyword);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [searchKeyword]);

  const handleResetFilter = () => {
    setRoleFilter('');
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
      <>
        <h1 className="text-2xl font-bold text-[#0C4762] mb-1">{transWithFallback('accountManagement', 'Quản lý Account')}</h1>
        <p>{transWithFallback('infoAndAccStatusManagement', 'Quản lý thông tin và trạng thái tài khoản')}</p>
        <div className="border-t-2 border-[#0C4762] mt-2"></div>

        <div className="flex justify-between items-center mt-6 mb-2">
          <SearchBar onSearch={setSearchKeyword} />
          <FilterBar
            roleFilter={roleFilter}
            onRoleChange={setRoleFilter}
            dateFrom={dateFrom}
            dateTo={dateTo}
            onDateFromChange={setDateFrom}
            onDateToChange={setDateTo}
            onReset={handleResetFilter}
          />
        </div>

        <AccountTable
          searchKeyword={debouncedSearch}
          roleFilter={roleFilter}
          dateFrom={dateFrom}
          dateTo={dateTo}
        />
      </>
    </>
  )
}