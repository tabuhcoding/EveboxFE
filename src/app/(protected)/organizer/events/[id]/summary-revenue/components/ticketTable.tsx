"use client";

import { TicketType } from "@/types/models/admin/showingManagement.interface";
import { ITicketTypeSummary } from "@/types/models/org/orgEvent.interface";
import { useTranslations } from "next-intl";

interface TicketTableProps {
  ticketTypes: ITicketTypeSummary[];
  ticketTypesInfo?: TicketType[];
}

export const TicketTable = ({ ticketTypes, ticketTypesInfo }: TicketTableProps) => {
  const t = useTranslations("common");
  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    return msg.startsWith("common.") ? fallback : msg;
  };

  const formatRatio = (ratio: number) =>{
    return (ratio*100).toFixed(2);
  }

  const formatDateTime = (dateTime?: string | Date) => {
      if (!dateTime) return ""
      try {
        const date = new Date(dateTime)
        return date.toLocaleDateString() + " " + date.toLocaleTimeString();
      } catch (error) {
        console.error("Error formatting date:", error)
        return String(dateTime)
      }
    }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold text-[#0C4762] mb-2">
        {transWithFallback("ticketTypeList", "Danh sách loại vé")}
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 shadow-lg">
          <thead className="bg-[#0C4762] text-white rounded-t-lg">
            <tr>
              <th className="py-3 px-4 text-left">
                {transWithFallback("ticketTypeName", "Tên loại vé")}
              </th>
              <th className="py-3 px-4 text-left">
                {transWithFallback("ticketPrice", "Giá vé")}
              </th>
              <th className="py-3 px-4 text-left">
                {transWithFallback("startTime", "Thời gian bắt đầu")}
              </th>
              <th className="py-3 px-4 text-left">
                {transWithFallback("endTime", "Thời gian kết thúc")}
              </th>
              <th className="py-3 px-4 text-left">
                {transWithFallback("ticketQuantity", "Số lượng vé")}
              </th>
              <th className="py-3 px-4 text-left">
                {transWithFallback("ticketSold", "Số vé đã bán")}
              </th>
              <th className="py-3 px-4 text-left">
                {transWithFallback("ticketRatio", "Tỉ lệ")}
              </th>
            </tr>
          </thead>
          <tbody>
            {ticketTypes.map((ticket, index) => (
              <tr key={index} className="border-b">
                <td className="py-3 px-4">{ticket.typeName}</td>
                <td className="py-3 px-4">{ticket.price.toLocaleString()} đ</td>
                <td className="py-3 px-4">{formatDateTime(ticketTypesInfo?.at(index)?.startTime)}</td>
                <td className="py-3 px-4">{formatDateTime(ticketTypesInfo?.at(index)?.endTime)}</td>
                <td className="py-3 px-4">{ticketTypesInfo?.at(index)?.quantity}</td>
                <td className="py-3 px-4">{ticket.sold}</td>
                <td className="py-3 px-4">{formatRatio(ticket.ratio)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
