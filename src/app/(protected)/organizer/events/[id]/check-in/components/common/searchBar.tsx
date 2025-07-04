"use client";

/* Package System */
import { ChangeEvent, useState } from 'react';

/* Package Application */
import { Search } from 'lucide-react';
import { SearchBarProps } from '../../lib/interface/check-in.interface';

export default function SearchBar({ onSearch }: SearchBarProps) {
    const [searchTerm, setSearchTearm] = useState('');

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTearm(value);
        onSearch(value);
    }

    return (
        <div className="searchbar-account-management flex items-center border border-gray-300 rounded-md overflow-hidden w-1/3 bg-white">
            <input type="text" className="w-full px-3 py-2 outline-none"
                placeholder="Tìm kiếm theo mã đơn hàng"
                value={searchTerm}
                onChange={handleInputChange}
            />
            <button className="bg-[#51DACF] px-3 py-2 border-l border-gray-300 transition duration-200 hover:bg-[#3AB5A3]">
                <Search size={24} color="white" />
            </button>
        </div>
    )
}