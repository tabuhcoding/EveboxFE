'use client';

import { useTranslations } from "next-intl";
import { LocationTableProps } from "@/types/models/admin/locationManagement.interface";

export default function LocationTable({ locations }: LocationTableProps) {
  const t = useTranslations('common');

  const tableRows: JSX.Element[] = []

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    return !msg || msg.startsWith('common.') ? fallback : msg;
  };

  locations.forEach((location, locIdx) => {
    let totalRows = 0
    location.venues.forEach((venue) => {
      totalRows += venue.taxLocations.length
    })

    let currentRow = 0

    location.venues.forEach((venue, venueIndex) => {
      const venueRows = venue.taxLocations.length

      for (let i = 0; i < venueRows; i++) {
        const isFirstRowOfLocation = currentRow === 0
        const isFirstRowOfVenue = i === 0

        tableRows.push(
          <tr key={`${location.id}-${venueIndex}-${i}`} className="border-t border-gray-200 hover:bg-gray-200 transition-colors duration-200">
            {isFirstRowOfLocation && (
              <td className="py-3 px-4 text-center border-r border-gray-200 font-bold" rowSpan={totalRows}>
                {locIdx + 1}
              </td>
            )}

            {isFirstRowOfLocation && (
              <td className="py-3 px-4 border-r border-gray-200" rowSpan={totalRows}>
                {location.email}
              </td>
            )}

            {isFirstRowOfVenue && (
              <td className="py-3 px-4 border-r border-gray-200" rowSpan={venueRows}>
                {venue.name}
              </td>
            )}

            <td className="py-3 px-4 border-r border-gray-200">{venue.taxLocations[i]}</td>
            <td className="py-3 px-4 border-r border-gray-200">{venue.events[i]}</td>
            <td className="py-3 px-4 border-gray-200">{venue.organizers[i]}</td>
          </tr>,
        )
        currentRow++
      }
    })
  });

  return (
    <div className="table-event-management overflow-x-auto rounded-xl shadow-md mt-6">
      <table className="min-w-full border border-gray-200">
        <thead className="sticky top-0 z-10 bg-[#0C4762] text-white text-xs rounded-t-lg">
          <tr>
            <th className="px-4 py-3 text-center border-r border-[#0c4b78] min-w-[60px]">{transWithFallback('noStt', 'STT')}</th>
            <th className="px-4 py-3 text-center border-r border-[#0c4b78] min-w-[180px]">{transWithFallback('orgEmail', 'Email của nhà tổ chức')}</th>
            <th className="px-4 py-3 text-center border-r border-[#0c4b78] min-w-[140px]">{transWithFallback('location', 'Địa điểm tổ chức')}</th>
            <th className="px-4 py-3 text-center border-r border-[#0c4b78] min-w-[140px]">{transWithFallback('taxLocation', 'Địa điểm đăng ký thuế')}</th>
            <th className="px-4 py-3 text-center border-r border-[#0c4b78] min-w-[140px]">{transWithFallback('eventName', 'Tên sự kiện')}</th>
            <th className="px-4 py-3 text-center min-w-[140px]">{transWithFallback('orgName', 'Tên nhà tổ chức')}</th>
          </tr>
        </thead>
        <tbody className="text-xs">{tableRows}</tbody>
      </table>
    </div>
  )
}
