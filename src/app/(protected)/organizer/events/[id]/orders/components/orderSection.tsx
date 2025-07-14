"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { TicketOrderData } from "@/types/models/org/orders.interface";
import { useTranslations } from "next-intl";
import { getOrdersByShowingId } from "@/services/org.service";
import { sendEmail } from "@/services/booking.service";
import toast from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";

interface OrderSectionProps {
  showingId: string;
}

export default function OrderSection({ showingId }: OrderSectionProps) {
  const t = useTranslations("common");
  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    return msg.startsWith("common.") ? fallback : msg;
  };

  const [search, setSearch] = useState("");
  const [ordersData, setOrdersData] = useState<TicketOrderData[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const fetchOrders = async (emailFilter?: string) => {
    try {
      setLoading(true);
      const data = await getOrdersByShowingId(showingId, emailFilter);
      setOrdersData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(); // initial load
  }, [showingId]);

  const handleSearch = async () => {
    const trimmed = search.trim().toLowerCase();
    if (trimmed.includes("@")) {
      await fetchOrders(trimmed);
    }
  };

  const handleSendSelectedEmail = async () => {
    try {
      await sendEmail(selectedOrders);
      toast.success(transWithFallback('sendEmailSuccess', 'Gửi email thành công!'));
    } catch (error) {
      toast.error("Error sending email!")
      console.error("Failed to fetch orders:", error);
    }
  };

  const handleSendAllEmails = async () => {
    try {
      const unsendOrders = ordersData.filter(order => !order?.mailSent && order?.status?.toLowerCase() === "success");
      if (unsendOrders.length === 0) {
        toast.error("No order selected to send!")
      }
      else {
        await sendEmail(unsendOrders.map(order => order.id));
        toast.success(transWithFallback('sendEmailSuccess', 'Gửi email thành công!'));

      }
    } catch (error) {
      toast.error("Error sending email!");
      console.error("Failed to fetch orders:", error);
    }
  };

  const handleRowClick = (orderId: number) => {
    router.push(`${pathname}/${orderId}`);
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      handleSearch();
    }, 500);

    return () => clearTimeout(debounce);
  }, [search]);



  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setSelectedOrders([]);
  }, [ordersData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#0C4762]" />
      </div>
    );
  }

  const getCustomerName = (order: TicketOrderData): string => {
    const formAnswers = order.formResponse?.FormAnswer || [];
    const nameAnswer = formAnswers.find((answer) => {
      const fieldName = answer.FormInput?.fieldName?.toLowerCase() || "";
      return fieldName.includes("name") || fieldName.includes("tên");
    });
    return nameAnswer?.value ?? order.userId ?? "-";
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
      case "success":
        return { text: transWithFallback("success", "Thành công"), className: "bg-green-100 text-green-800" };
      case "giveaway":
        return { text: transWithFallback("giveaway", "Đã tặng"), className: "bg-green-100 text-green-800" };
      case "processing":
        return { text: transWithFallback("processing", "Đang xử lý"), className: "bg-yellow-100 text-yellow-800" };
      case "cancelled":
        return { text: transWithFallback("cancelled", "Đã hủy"), className: "bg-red-100 text-red-800" };
      default:
        return { text: statusValue, className: "bg-gray-100 text-gray-800" };
    }
  };

  const getQuantity = (order: TicketOrderData): number => {
    let quantity = 0;
    order?.Ticket?.forEach(ticket => {
      quantity += ticket.tickets.length;
    });
    return quantity;
  };

  const safeOrdersData = Array.isArray(ordersData) ? ordersData : [];

  const toggleCheckbox = (orderId: number) => {
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
            placeholder={transWithFallback("searchByNameOrOrderId", "Tìm kiếm theo email khach hang")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={() => handleSearch()}
            className="bg-[#51DACF] px-3 py-2 border-l border-gray-300 transition duration-200 hover:bg-[#3AB5A3]"
          >
            <Search size={24} color="white" />
          </button>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => handleSendAllEmails()}
            className="px-4 py-2 bg-[#48D1CC] text-[#0C4762] rounded-md transition duration-200 hover:bg-[#51DACF]">
            {transWithFallback("sendAllEmails", "Gửi tất cả email")}
          </button>
          <button
            onClick={() => handleSendSelectedEmail()}
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
                onChange={(e) => setSelectedOrders(e.target.checked ? ordersData.map((o) => o.id) : [])}
                checked={ordersData.length > 0 && selectedOrders.length === ordersData.length}
              />
            </th>
            <th className="py-2 px-4">{transWithFallback("orderId", "Mã đơn hàng")}</th>
            <th className="py-2 px-4">{transWithFallback("customer", "Khách hàng")}</th>
            <th className="py-2 px-4">{transWithFallback("owner", "Chủ sở hữu")}</th>
            <th className="py-2 px-4">{transWithFallback("ticketType", "Loại vé")}</th>
            <th className="py-2 px-4">{transWithFallback("quantity", "Số lượng")}</th>
            <th className="py-2 px-4">{transWithFallback("payment", "Thanh toán")}</th>
            <th className="py-2 px-4">{transWithFallback("status", "Trạng thái")}</th>
            <th className="py-2 px-4">{transWithFallback("total", "Tổng cộng")}</th>
          </tr>
        </thead>
        <tbody>
          {ordersData.length > 0 ? (
            ordersData.map((order) => {
              const status = getStatusDisplay(order.status);
              return (
                <tr
                  key={order.id}
                  className="border-t hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleRowClick(order.id)}
                >
                  <td className="py-2 px-2">
                    {
                      order?.status?.toLowerCase() === 'success' && !order?.mailSent
                        ? <input
                          type="checkbox"
                          onChange={() => toggleCheckbox(order.id)}
                          checked={selectedOrders.includes(order.id)}
                        />
                        : <></>
                    }
                  </td>
                  <td className="py-2 px-4">{order.id}</td>
                  <td className="py-2 px-4">{getCustomerName(order)}</td>
                  <td className="py-2 px-4">{order.ownerId}</td>
                  <td className="py-2 px-4">{order.type}</td>
                  <td className="py-2 px-4">{getQuantity(order)}</td>
                  <td className="py-2 px-4">{order.paymentInfo?.method}</td>
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
