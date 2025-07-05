"use client";

/* Package System */
import { CalendarDate } from "@internationalized/date";
import { RangeValue } from "@react-types/shared";
import { ChevronDown, Search, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from "next-intl";
import { useEffect, useRef, useState } from 'react';


/* Package Application */
import { getAllCategories, getAllProvinces, Location } from 'services/event.service';
import { Category } from 'types/models/dashboard/frontDisplay';

import { mapCategoryName } from "../libs/functions/mapCategoryName";

import DatePicker from './datePicker';
import '../../../../styles/global.css';

export default function SearchControls() {
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState<RangeValue<CalendarDate> | null>(null);
  const [isEventTypeOpen, setIsEventTypeOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const dropdownEventRef = useRef(null);
  const dropdownLocationRef = useRef(null);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const router = useRouter();
  const locale = useLocale();

  const t = useTranslations("common");

  const handleSearch = () => {
    setIsSearching(true);

    const queryParams: Record<string, string> = {};

    if (searchText) queryParams.title = searchText;
    if (selectedOptions.length > 0) queryParams.type = selectedOptions.join(',');
    if (selectedLocation) queryParams.provinceId = selectedLocation.id.toString();
    if (dateRange?.start) queryParams.startDate = dateRange.start.toString();
    if (dateRange?.end) queryParams.endDate = dateRange.end.toString();

    const params = new URLSearchParams(queryParams).toString();
    router.push(`/search?${params}`);
  };

  useEffect(() => {
    const loadLocations = async () => {
      const data = await getAllProvinces();
      setLocations(data);
    };
    loadLocations();
  }, []);


  useEffect(() => {
    const loadCategories = async () => {
      const data = await getAllCategories();
      setCategories(data);
    };

    loadCategories();
  }, []);

  const toggleOption = (option: string) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith('common.')) return fallback;
    return msg;
  };

  return (
    <div className="absolute left-0 right-0 -bottom-20 mx-auto w-full md:w-11/12 px-4">
      <div className="bg-sky-900 text-white p-4 md:p-6 rounded-lg shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:flex gap-4 w-full">
          <div className=" min-w-[150px] w-full">
            <label className="md:text-sm text-xs font-medium mb-2 whitespace-nowrap">
              {transWithFallback("searchTitle", "Tên sự kiện, ...")}</label>
            <div className="mt-2 relative">
              <input
                className="w-full bg-white text-gray-800 rounded p-2 appearance-none pr-8 small-text"
                type="text"
                placeholder={transWithFallback('searchHint', "Nhập tên sự kiện, ...")}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />
            </div>
          </div>
          <div className="min-w-[150px] w-full">
            <label className="text-sm font-medium mb-2">{transWithFallback('categoryTitle', "Loại sự kiện")}</label>
            <div className="mt-2 relative w-full" ref={dropdownEventRef}>
              <button
                onClick={() => setIsEventTypeOpen(!isEventTypeOpen)}
                className="w-full bg-white border border-gray-300 rounded p-2 flex justify-between items-center text-gray-500 small-text"
              >
                <span className='truncate'>
                  {selectedOptions.length > 0
                    ? selectedOptions.join(", ")
                    : transWithFallback('categoryHint', "Loại sự kiện")}
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
                      {mapCategoryName(option.name, transWithFallback)}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className=" min-w-[150px] w-full">
            <label className="text-xs md:text-sm font-medium mb-2 whitespace-nowrap">
              {transWithFallback('locationTitle', "Địa điểm")}</label>
            <div className="mt-2 relative" ref={dropdownLocationRef}>
              <button
                onClick={() => setIsLocationOpen(!isLocationOpen)}
                className="w-full bg-white border border-gray-300 rounded p-2 flex justify-between items-center text-gray-500 small-text"
              >
                <span>
                  {selectedLocation
                    ? (locale === 'en' ? selectedLocation.nameEn : selectedLocation.nameVi)
                    : transWithFallback('locationHint', "Chọn địa điểm")}

                </span>
                <ChevronDown size={16} className="text-gray-500" />
              </button>

              {isLocationOpen && (
                <div className="absolute z-10 w-full bg-white border border-gray-300 rounded shadow-lg text-[#0C4762] small-text max-h-64 overflow-y-auto">
                  {locations.map((location) => (
                    <div
                      key={location.id}
                      role="button"
                      tabIndex={0}
                      className="p-2 hover:bg-[#0C4762] hover:bg-opacity-[0.31] cursor-pointer"
                      onClick={() => {
                        setSelectedLocation(location);
                        setIsLocationOpen(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setSelectedLocation(location);
                          setIsLocationOpen(false);
                        }
                      }}
                    >
                      {locale === 'en' ? location.nameEn : location.nameVi}
                    </div>
                  ))}

                </div>
              )}
            </div>

          </div>
          <div className="min-w-[180px] w-full">
            <label className="text-sm font-medium mb-2">{transWithFallback('timeTitle', "Thời gian")}</label>
            <div className="mt-2 relative bg-white border border-gray-300 rounded min-w-[180px] overflow-hidden text-sm">
              <DatePicker
                value={dateRange}
                onDateRangeChange={setDateRange}
              />
            </div>
          </div>
          <div className="flex w-full md:w-auto md:items-end justify-center md:justify-start">
            <button
              onClick={handleSearch}
              className="h-10 w-full md:w-auto md:min-w-[56px] px-4 bg-teal-400 hover:bg-teal-300 rounded flex items-center justify-center shadow-md transition-colors duration-200"
            >
              {isSearching ? (
                <Loader2 size={20} className="text-white animate-spin" />
              ) : (
                <Search size={20} className="text-white" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}