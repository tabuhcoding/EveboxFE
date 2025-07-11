"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { TicketOrderData } from "@/types/models/org/orders.interface";
import { useTranslations } from "next-intl";

export default function TicketSection({ ordersData = [] }: { ordersData?: TicketOrderData[] }) {
  const t = useTranslations("common");
  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    return msg.startsWith("common.") ? fallback : msg;
  };

  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    console.log("TicketSection received data:", ordersData);
  }, [ordersData]);

  const safeOrdersData = Array.isArray(ordersData) ? ordersData : [];

  const filteredTickets = safeOrdersData.filter((order) => {
    const formResponses = order.FormResponse?.FormAnswer || [];
    const nameField = formResponses.find((answer) => {
      const fieldName = answer.FormInput?.fieldName?.toLowerCase() || "";
      return fieldName.includes("name") || fieldName.includes("tên");
    });

    const name = nameField?.value || "";
    return name.toLowerCase().includes(search.toLowerCase()) || order.id.toLowerCase().includes(search.toLowerCase());
  });

  const getCustomerName = (order: TicketOrderData): string => {
    const formResponses = order.FormResponse?.FormAnswer || [];
    const nameField = formResponses.find((answer) => {
      const fieldName = answer.FormInput?.fieldName?.toLowerCase() || "";
      return fieldName.includes("name") || fieldName.includes("tên");
    });

    return nameField?.value || "-";
  };

  const getCustomerEmail = (order: TicketOrderData): string => {
    const formResponses = order.FormResponse?.FormAnswer || [];
    const emailField = formResponses.find((answer) => {
      const fieldName = answer.FormInput?.fieldName?.toLowerCase() || "";
      return fieldName.includes("email");
    });

    return emailField?.value || "-";
  };

  if (!mounted) return null;

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-between items-center pt-6">
        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden w-1/3 bg-white">
          <input
            type="text"
            className="w-full px-3 py-2 outline-none"
            placeholder={transWithFallback("searchByName", "Tìm kiếm theo tên")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="bg-[#51DACF] px-3 py-2 border-l border-gray-300 transition duration-200 hover:bg-[#3AB5A3]">
            <Search size={24} color="white" />
          </button>
        </div>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-[#0C4762] text-white text-left">
            <th className="py-2 px-4">{transWithFallback("ticketId", "Mã vé")}</th>
            <th className="py-2 px-4">{transWithFallback("customer", "Khách hàng")}</th>
            <th className="py-2 px-4">{transWithFallback("email", "Email")}</th>
            <th className="py-2 px-4">{transWithFallback("ticketType", "Loại vé")}</th>
            <th className="py-2 px-4">{transWithFallback("status", "Trạng thái")}</th>
            <th className="py-2 px-4">{transWithFallback("emailSent", "Email đã gửi")}</th>
          </tr>
        </thead>
        <tbody>
          {filteredTickets.length > 0 ? (
            filteredTickets.map((ticket) => (
              <tr key={ticket.id} className="border-t hover:bg-gray-50">
                <td className="py-2 px-4">{ticket.id}</td>
                <td className="py-2 px-4">{getCustomerName(ticket)}</td>
                <td className="py-2 px-4">{getCustomerEmail(ticket)}</td>
                <td className="py-2 px-4">{ticket.type}</td>
                <td className="py-2 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      ticket.status === 1
                        ? "bg-green-100 text-green-800"
                        : ticket.status === 0
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {ticket.status === 1
                      ? transWithFallback("completed", "Hoàn thành")
                      : ticket.status === 0
                      ? transWithFallback("processing", "Đang xử lý")
                      : transWithFallback("cancelled", "Đã hủy")}
                  </span>
                </td>
                <td className="py-2 px-4">
                  {ticket.mailSent ? (
                    <span className="px-2 py-1 rounded-full text-sm bg-green-100 text-green-800">
                      {transWithFallback("emailSentYes", "Đã gửi")}
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                      {transWithFallback("emailSentNo", "Chưa gửi")}
                    </span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-4 text-gray-500">
                {safeOrdersData.length === 0
                  ? transWithFallback("noTicketData", "Không có dữ liệu vé.")
                  : transWithFallback("noTicketSearchResult", "Không tìm thấy vé nào phù hợp với tìm kiếm.")}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
