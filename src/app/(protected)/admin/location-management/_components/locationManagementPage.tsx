'use client';

/* Package System */
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Search, RotateCcw, Loader } from "lucide-react";
import { useTranslations } from "next-intl";
import { CircularProgress } from "@mui/material";

/* Package Application */
import LocationTable from "./locationTable";
import FilterDropdown from "./filter";
import { useI18n } from "@/app/providers/i18nProvider";
import { Province } from "@/types/models/event/location.interface";
import { OrganizerLocationGroup, Venue, Location } from "@/types/models/admin/locationManagement.interface";
import { getAllDistricts, getAllLocations } from "@/services/event.service";
import { useAuth } from "@/contexts/auth.context";
import EventPagination from "../../event-management/_components/common/pagination";
import { FlatEventRow } from "@/types/models/admin/locationManagement.interface";

export default function LocationManagementClient() {
  const { session } = useAuth();
  const t = useTranslations('common');
  const { locale } = useI18n();
  const [isConfirming, setIsConfirming] = useState(false);

  const [locations, setLocations] = useState<Location[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedOrganizer, setSelectedOrganizer] = useState<string | null>(null)
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [organizers, setOrganizers] = useState<string[]>([]);
  const [allOrganizers, setAllOrganizers] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [cityToProvinceId, setCityToProvinceId] = useState<Record<string, number>>({});

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    return !msg || msg.startsWith('common.') ? fallback : msg;
  };

  const filteredLocations = locations
    .map((location) => {
      const query = searchQuery.toLowerCase();

      const filteredVenues = location.venues.filter((venue) =>
        venue.name.toLowerCase().includes(query) ||
        venue.events.some(event => event.toLowerCase().includes(query))
      );

      // Only return location if it has matching venues
      if (filteredVenues.length > 0) {
        return {
          ...location,
          venues: filteredVenues,
        };
      }

      return null;
    })
    .filter((location): location is Location => location !== null); // Type guard

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const res: Province[] = await getAllDistricts();

        //Debug log: See what res looks like
        console.log("Fetched district response:", res);

        // Build mapping from province name to province id
        const provinceMap: Record<string, number> = {};
        const citySet: Set<string> = new Set();

        res.forEach((province) => {
          let provinceName = locale === "vi" ? province.name.vi : province.name.en
          provinceName = removeQuotes(provinceName);
          provinceMap[provinceName] = province.id;
          citySet.add(provinceName);
        });

        setCities(Array.from(citySet));
        setCityToProvinceId(provinceMap);
      } catch (err) {
        console.error("Failed to fetch districts and provinces", err);
      }
    };

    fetchDistricts();
  }, []);

  const mapApiToClientLocations = (data: OrganizerLocationGroup[]): Location[] => {
    return data.map((group) => {
      const venueMap: Record<string, Venue> = {}

      group.venues.forEach((v) => {
        const fullAddress = `${v.street}, ${v.ward}, ${v.district}, ${removeQuotes(v.province)}`

        if (!venueMap[fullAddress]) {
          venueMap[fullAddress] = {
            name: fullAddress,
            taxLocations: [`${v.ward}, ${v.district}`],
            events: [],
            organizers: [],
          }
        }

        // Avoid duplicates in arrays
        if (v.event?.title && !venueMap[fullAddress].events.includes(v.event.title)) {
          venueMap[fullAddress].events.push(v.event.title)
        }

        if (v.event?.orgName && !venueMap[fullAddress].organizers.includes(v.event.orgName)) {
          venueMap[fullAddress].organizers.push(v.event.orgName)
        }
      })

      return {
        id: group.id,
        email: group.organizerId, // email not present in API response
        venues: Object.values(venueMap),
      }
    })
  }

  const fetchLocations = async (organizerId?: string, provinceId?: number) => {
    try {
      setLoading(true);
      const res = await getAllLocations(session?.user?.accessToken || "", organizerId, provinceId);

      const mapped = mapApiToClientLocations(res.data);
      setLocations(mapped);

      // Extract unique organizer IDs (emails)
      const uniqueOrganizers = Array.from(new Set(res.data.map(loc => loc.organizerId)));
      setOrganizers(uniqueOrganizers);
    } catch (error) {
      console.error("Error loading locations:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllOrganizers = async () => {
    try {
      const res = await getAllLocations(session?.user?.accessToken || "");
      const unique = Array.from(new Set(res.data.map(loc => loc.organizerId)));
      setAllOrganizers(unique);
    } catch (error) {
      console.error("Error fetching all organizers:", error);
    }
  };

  useEffect(() => {
    // Load all on mount
    fetchLocations()
    fetchAllOrganizers();
  }, [])

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  const handleResetFilter = async () => {
    setSelectedOrganizer("")
    setSelectedCity("")
    await fetchLocations()
  }

  const removeQuotes = (str: string) => str?.replace(/^"(.*)"$/, '$1').replace(/"/g, '');

  const handleConfirmFilter = async () => {
    setIsConfirming(true);

    try {
      const provinceId = selectedCity ? cityToProvinceId[selectedCity] : undefined;
      const organizerId = selectedOrganizer ? selectedOrganizer : undefined;
      await fetchLocations(organizerId, provinceId);
    } catch (error) {
      console.error("Error filtering:", error);
    } finally {
      setIsConfirming(false);
    }
  };

  const flattenedEventRows = useMemo(() => {
    const rows: FlatEventRow[] = [];

    filteredLocations.forEach((location) => {
      location.venues.forEach((venue) => {
        venue.events.forEach((eventName, index) => {
          rows.push({
            locationId: location.id,
            organizerEmail: location.email,
            venueName: venue.name,
            taxLocation: venue.taxLocations[index] || "",
            eventName,
            organizerName: venue.organizers[index] || "",
          });
        });
      });
    });

    return rows;
  }, [filteredLocations]);

  const paginatedEventRows = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return flattenedEventRows.slice(start, start + itemsPerPage);
  }, [flattenedEventRows, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedOrganizer, selectedCity]);

  return (
    <>
      <h1 className="text-2xl font-bold text-[#0C4762]">{transWithFallback('locationManagement', 'Quản lý địa điểm')}</h1>
      <div className="h-0.5 w-full bg-[#0C4762] mt-4"></div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-2 mt-6">
        <FilterDropdown label={transWithFallback('city', 'Thành phố')} options={cities} value={selectedCity} onChange={setSelectedCity} />

        <FilterDropdown label={transWithFallback('org', 'Nhà tổ chức')} options={selectedCity ? organizers : allOrganizers} value={selectedOrganizer} onChange={setSelectedOrganizer} />


        <button
          onClick={handleConfirmFilter}
          disabled={isConfirming}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${isConfirming ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#0a3d62] hover:bg-[#0C4762]'
            } text-white`}
        >
          {isConfirming ? (
            <>
              <CircularProgress size={18} color="inherit" />
            </>
          ) : (
            null
          )}
          {transWithFallback('confirm', 'Xác nhận')}
        </button>

        <button
          onClick={handleResetFilter}
          className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors flex items-center"
        >
          <span>{transWithFallback('resetFilter', 'Đặt lại')}</span>
          <RotateCcw className="ml-2 w-4 h-4 text-red-500" />
        </button>
      </div>

      {/* Search and Export */}
      <div className="flex flex-wrap justify-between items-center mb-6">
        <form onSubmit={handleSearch} className="flex w-full sm:w-auto mb-4 sm:mb-0">
          <input
            type="text"
            placeholder={transWithFallback('findByLocation', "Tìm kiếm theo tên địa điểm")}
            className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg w-full sm:w-80 focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-teal-400 text-white rounded-r-lg hover:bg-teal-500 transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader className="w-6 h-6 animate-spin text-gray-500" />
        </div>
      ) : (
        <LocationTable rows={paginatedEventRows} />
      )}

      <EventPagination
        currentPage={currentPage}
        totalItems={flattenedEventRows.length}
        eventsPerPage={itemsPerPage}
        onPageChange={(page) => {
          if (page >= 1 && page <= Math.ceil(flattenedEventRows.length / itemsPerPage)) {
            setCurrentPage(page);
          }
        }}
        setEventsPerPage={() => { }} // optional
      />

    </>
  )
}
