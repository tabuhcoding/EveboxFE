"use client";

/* Package System */
import { ChangeEvent, useState } from 'react';
import { useTranslations } from 'next-intl';

/* Package Application */
import { Search } from 'lucide-react';
import { SearchBarProps } from '@/types/models/admin/accountManagement.interface';

export default function SearchBar({ onSearch }: SearchBarProps) {
  const t = useTranslations('common');
  const [searchTerm, setSearchTearm] = useState('');

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith('common.')) return fallback;
    return msg;
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTearm(value);
    onSearch(value);
  }

  return (
    <div className="searchbar-account-management flex items-center border border-gray-300 rounded-md overflow-hidden w-1/3 bg-white">
      <input type="text" className="w-full px-3 py-2 outline-none"
        placeholder={transWithFallback('findByNameOrEmail', 'Tìm kiếm theo tên hoặc email')}
        value={searchTerm}
        onChange={handleInputChange}
      />
      <button className="bg-[#51DACF] px-3 py-2 border-l border-gray-300 transition duration-200 hover:bg-[#3AB5A3]">
        <Search size={24} color="white" />
      </button>
    </div>
  )
}