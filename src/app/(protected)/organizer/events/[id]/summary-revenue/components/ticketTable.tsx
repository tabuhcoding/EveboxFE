"use client";

import { ITicketTypeSummary } from "@/types/models/org/orgEvent.interface";

interface TicketTableProps {
  ticketTypes: ITicketTypeSummary[]
}

export const TicketTable = ({ ticketTypes }: TicketTableProps) => {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold text-[#0C4762] mb-2">Danh sách loại vé</h3>
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 shadow-lg">
          <thead className="bg-[#0C4762] text-white rounded-t-lg">
            <tr>
              <th className="py-3 px-4 text-left">Tên loại vé</th>
              <th className="py-3 px-4 text-left">Giá vé</th>
              <th className="py-3 px-4 text-left">Số vé đã bán</th>
              <th className="py-3 px-4 text-left">Tỉ lệ</th>
            </tr>
          </thead>
          <tbody>
            {ticketTypes.map((ticket, index) => (
              <tr key={index} className="border-b">
                <td className="py-3 px-4">{ticket.typeName}</td>
                <td className="py-3 px-4">{ticket.price.toLocaleString()} đ</td>
                <td className="py-3 px-4">{ticket.sold}</td>
                <td className="py-3 px-4">{ticket.ratio}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
