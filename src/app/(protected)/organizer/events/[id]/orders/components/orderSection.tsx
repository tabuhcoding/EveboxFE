"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { TicketOrderData } from "@/types/models/org/orders.interface";
import { useTranslations } from "next-intl";

export default function OrderSection({ ordersData = [] }: { ordersData?: TicketOrderData[] }) {
  const t = useTranslations("common");
  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    return msg.startsWith("common.") ? fallback : msg;
  };

  const [search, setSearch] = useState("");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setSelectedOrders([]);
  }, [ordersData]);

  const getCustomerName = (order: TicketOrderData): string => {
    const formAnswers = order.FormResponse?.FormAnswer || [];
    const nameAnswer = formAnswers.find((answer) => {
      const fieldName = answer.FormInput?.fieldName?.toLowerCase() || "";
      return fieldName.includes("name") || fieldName.includes("tên");
    });
    return nameAnswer?.value || "-";
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getStatusDisplay = (status: number | string): { text: string; className: string } => {
    const statusValue = String(status).toLowerCase();
    switch (statusValue) {
      case "1":
        return { text: transWithFallback("completed", "Hoàn thành"), className: "bg-green-100 text-green-800" };
      case "0":
        return { text: transWithFallback("processing", "Đang xử lý"), className: "bg-yellow-100 text-yellow-800" };
      case "2":
        return { text: transWithFallback("cancelled", "Đã hủy"), className: "bg-red-100 text-red-800" };
      default:
        return { text: statusValue, className: "bg-gray-100 text-gray-800" };
    }
  };

  const getQuantity = (order: TicketOrderData): number => {
    return order.PaymentInfo?.OrderInfo?.quantity || 1;
  };

  const getSeatInfo = (order: TicketOrderData): string => {
    const seatId = order.PaymentInfo?.OrderInfo?.seatId;
    if (!seatId) return "-";
    return Array.isArray(seatId) ? seatId.join(", ") : String(seatId);
  };

  const safeOrdersData = Array.isArray(ordersData) ? ordersData : [];

  const filteredOrders = safeOrdersData.filter((order) => {
    const customerName = getCustomerName(order).toLowerCase();
    const orderId = order.id ?? "";
    const keyword = search.toLowerCase();
    return customerName.includes(keyword) || orderId.includes(keyword);
  });

  const toggleCheckbox = (orderId: string) => {
    setSelectedOrders((prev) => (prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]));
  };

  if (!mounted) return null;

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-between items-center pt-6">
        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden w-1/3 bg-white">
          <input
            type="text"
            className="w-full px-3 py-2 outline-none"
            placeholder={transWithFallback("searchByNameOrOrderId", "Tìm kiếm theo tên hoặc mã đơn hàng")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="bg-[#51DACF] px-3 py-2 border-l border-gray-300 transition duration-200 hover:bg-[#3AB5A3]">
            <Search size={24} color="white" />
          </button>
        </div>

        <div className="flex gap-3">
          <button className="px-4 py-2 bg-[#48D1CC] text-[#0C4762] rounded-md transition duration-200 hover:bg-[#51DACF]">
            {transWithFallback("sendAllEmails", "Gửi tất cả email")}
          </button>
          <button
            className={`px-4 py-2 rounded-md transition duration-200 ${selectedOrders.length > 0
              ? "bg-[#48D1CC] text-[#0C4762] hover:bg-[#51DACF]"
              : "bg-gray-300 text-gray-700 cursor-not-allowed"
              }`}
            disabled={selectedOrders.length === 0}
          >
            {transWithFallback("sendSelectedEmails", "Email đã chọn")} ({selectedOrders.length})
          </button>
        </div>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-[#0C4762] text-white text-left">
            <th className="py-2 px-2">
              <input
                type="checkbox"
                onChange={(e) => setSelectedOrders(e.target.checked ? filteredOrders.map((o) => o.id) : [])}
                checked={filteredOrders.length > 0 && selectedOrders.length === filteredOrders.length}
              />
            </th>
            <th className="py-2 px-4">{transWithFallback("orderId", "Mã đơn hàng")}</th>
            <th className="py-2 px-4">{transWithFallback("customer", "Khách hàng")}</th>
            <th className="py-2 px-4">{transWithFallback("ticketType", "Loại vé")}</th>
            <th className="py-2 px-4">{transWithFallback("quantity", "Số lượng")}</th>
            <th className="py-2 px-4">{transWithFallback("seat", "Ghế")}</th>
            <th className="py-2 px-4">{transWithFallback("status", "Trạng thái")}</th>
            <th className="py-2 px-4">{transWithFallback("total", "Tổng cộng")}</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => {
              const status = getStatusDisplay(order.status);
              return (
                <tr key={order.id} className="border-t hover:bg-gray-50">
                  <td className="py-2 px-2">
                    <input
                      type="checkbox"
                      onChange={() => toggleCheckbox(order.id)}
                      checked={selectedOrders.includes(order.id)}
                    />
                  </td>
                  <td className="py-2 px-4">{order.id}</td>
                  <td className="py-2 px-4">{getCustomerName(order)}</td>
                  <td className="py-2 px-4">{order.type}</td>
                  <td className="py-2 px-4">{getQuantity(order)}</td>
                  <td className="py-2 px-4">{getSeatInfo(order)}</td>
                  <td className="py-2 px-4">
                    <span className={`px-2 py-1 rounded-full text-sm ${status.className}`}>{status.text}</span>
                  </td>
                  <td className="py-2 px-4">{formatPrice(order.price)}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={8} className="text-center py-4 text-gray-500">
                {safeOrdersData.length === 0
                  ? transWithFallback("noOrderData", "Không có dữ liệu đơn hàng.")
                  : transWithFallback("noOrderSearchResult", "Không tìm thấy đơn hàng nào phù hợp với tìm kiếm.")}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
