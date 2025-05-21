"use client";

/* Package System */
import { ChevronDown, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { CalendarDate } from "@internationalized/date";
import Link from 'next/link';
import { RangeValue } from "@react-types/shared";
import { useTranslations } from "next-intl";

/* Package Application */
import DatePicker from './datePicker';
import { Category } from 'types/models/dashboard/frontDisplay';
import mapCategoryName from 'app/(frontpage)/_components/libs/functions/mapCategoryName';
import { fetchProvinces } from '../libs/server/fetchData';
import { getAllCategories } from 'services/event.service';
import '../../../../styles/global.css';
// import 'tailwindcss/tailwind.css';

export default function SearchControls() {
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState<RangeValue<CalendarDate> | null>(null);
  const [isEventTypeOpen, setIsEventTypeOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [locations, setLocations] = useState<{ name: string; code: number }[]>([]);
  const dropdownEventRef = useRef(null);
  const dropdownLocationRef = useRef(null);
  const t = useTranslations("common");

  const queryParams: Record<string, string> = {};

  if (searchText) queryParams.q = searchText;
  if (selectedOptions.length > 0) queryParams.types = selectedOptions.join(',');
  if (dateRange?.start) queryParams.startDate = dateRange.start.toString();
  if (dateRange?.end) queryParams.endDate = dateRange.end.toString();

  useEffect(() => {
    const loadCategories = async () => {
      const data = await getAllCategories();
      setCategories(data);
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const loadLocations = async () => {
      const data = await fetchProvinces();
      setLocations(data);
    };
    loadLocations();
  }, []);

  const toggleOption = (option: string) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  return (
    <div className="absolute left-0 right-0 -bottom-20 mx-auto w-full md:w-11/12 px-4">
      <div className="bg-sky-900 text-white p-4 md:p-6 rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-[1.5] text-left">
            <label className="text-sm font-medium mb-2"> {t("searchTitle") || "Fallback Text"}</label>
            <div className="mt-2 relative">
              <input className="w-full bg-white text-gray-800 rounded p-2 appearance-none pr-8 small-text" type="text"
                placeholder={t('searchHint')}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}>
              </input>
            </div>
          </div>
          <div className="md:w-48 sm:flex-1 text-left">
            <label className="text-sm font-medium mb-2">{t('categoryTitle')}</label>
            <div className="mt-2 relative w-full" ref={dropdownEventRef}>
              <button
                onClick={() => setIsEventTypeOpen(!isEventTypeOpen)}
                className="w-full bg-white border border-gray-300 rounded p-2 flex justify-between items-center text-gray-500 small-text"
              >
                <span className='truncate'>
                  {selectedOptions.length > 0
                    ? selectedOptions.join(", ")
                    : t('categoryHint')}
                </span>
                <ChevronDown size={16} className="text-gray-500" />
              </button>

              {/* Dropdown menu */}
              {isEventTypeOpen && (
                <div className="absolute z-10 w-full bg-white border border-gray-300 rounded shadow-lg text-[#0C4762] small-text">
                  {categories.map((option) => (
                    <label
                      key={option.id}
                      className="flex items-center p-2 hover:bg-[#0C4762] hover:bg-opacity-[0.31] cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedOptions.includes(option.name)}
                        onChange={() => toggleOption(option.name)}
                        className="mr-2"
                      />
                      {mapCategoryName(option.name)}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="md:w-48 sm:flex-1 text-left">
            <label className="text-sm font-medium mb-2">{t('locationTitle')}</label>
            <div className="mt-2 relative" ref={dropdownLocationRef}>
              <button
                onClick={() => setIsLocationOpen(!isLocationOpen)}
                className="w-full bg-white border border-gray-300 rounded p-2 flex justify-between items-center text-gray-500 small-text"
              >
                <span>
                  {selectedLocation ? selectedLocation : t('locationHint')}
                </span>
                <ChevronDown size={16} className="text-gray-500" />
              </button>

              {/* Dropdown menu */}
              {isLocationOpen && (
                <div className="absolute z-10 w-full bg-white border border-gray-300 rounded shadow-lg text-[#0C4762] small-text max-h-64 overflow-y-auto">                                    {locations.map((location) => (
                  <div
                    key={location.code}
                    className="p-2 hover:bg-[#0C4762] hover:bg-opacity-[0.31] cursor-pointer"
                    onClick={() => {
                      setSelectedLocation(location.name);
                      setIsLocationOpen(false);
                    }}
                  >
                    {location.name}
                  </div>
                ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex-[1.5] text-left">
            <label className="text-sm font-medium mb-2">{t('timeTitle')}</label>
            <div className="mt-2 relative">
              <DatePicker onDateRangeChange={setDateRange} />
            </div>
          </div>
          <div className="flex md:items-end">
            <Link
              href={{
                pathname: "/search",
                query: queryParams,
              }}
            >
              <button className="w-full md:w-14 h-10 bg-teal-400 hover:bg-teal-300 rounded flex items-center justify-center">
                <Search size={20} className="text-white" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}