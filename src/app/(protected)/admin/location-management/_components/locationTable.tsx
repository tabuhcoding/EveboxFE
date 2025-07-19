'use client';

import { useTranslations } from "next-intl";
import { FlatEventRow } from "@/types/models/admin/locationManagement.interface";

interface LocationTableProps {
  rows: FlatEventRow[];
}

export default function LocationTable({ rows }: LocationTableProps) {
  const t = useTranslations('common');

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    return !msg || msg.startsWith('common.') ? fallback : msg;
  };

  return (
    <div className="table-location-management overflow-x-auto rounded-xl shadow-md mt-4">
      <table className="min-w-full border border-gray-200">
        <thead className="sticky top-0 z-10 bg-[#0C4762] text-white text-xs rounded-t-lg">
          <tr>
            <th className="px-4 py-3 text-center border-r border-[#0c4b78] min-w-[60px]">{transWithFallback('noStt', 'STT')}</th>
            <th className="px-4 py-3 text-center border-r border-[#0c4b78] min-w-[140px]">{transWithFallback('eventName', 'Tên sự kiện')}</th>
            <th className="px-4 py-3 text-center border-r border-[#0c4b78] min-w-[140px]">{transWithFallback('location', 'Địa điểm tổ chức')}</th>
            <th className="px-4 py-3 text-center border-r border-[#0c4b78] min-w-[140px]">{transWithFallback('taxLocation', 'Địa điểm đăng ký thuế')}</th>
            <th className="px-4 py-3 text-center min-w-[140px]">{transWithFallback('orgName', 'Tên nhà tổ chức')}</th>
            <th className="px-4 py-3 text-center border-r border-[#0c4b78] min-w-[180px]">{transWithFallback('orgEmail', 'Email của nhà tổ chức')}</th>
          </tr>
        </thead>
        <tbody className="text-xs">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-6 text-center text-gray-500">
                {transWithFallback('noDataSearch', 'Không có kết quả tìm kiếm phù hợp')}
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr key={`${row.locationId}-${index}`} className="border-t border-gray-200 hover:bg-gray-200 transition-colors duration-200">
                <td className="py-3 px-4 text-center border-r border-gray-200 font-bold">{index + 1}</td>
                <td className="py-3 px-4 border-r border-gray-200">{row.eventName}</td>
                <td className="py-3 px-4 border-r border-gray-200">{row.venueName}</td>
                <td className="py-3 px-4 border-r border-gray-200">{row.taxLocation}</td>
                <td className="py-3 px-4">{row.organizerName}</td>
                <td className="py-3 px-4 border-r border-gray-200">{row.organizerEmail}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
