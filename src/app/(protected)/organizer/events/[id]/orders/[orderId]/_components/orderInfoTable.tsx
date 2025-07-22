/* Package System */
import { useTranslations } from "next-intl";

/* Package Application */
import { IUserTicketById } from "@/types/models/ticket/ticketInfoById";

export default function OrderInfoTable({ order }: { order: IUserTicketById }) {
  const t = useTranslations('common');
  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith('common.')) return fallback;
    return msg;
  };
  return (
    <table className="w-full border-collapse border border-gray-300">
      <tbody>
        <tr className="border-b">
          <td className="py-2 pr-3 pl-1 font-semibold text-gray-700 w-40">{transWithFallback('orderId', 'Mã đơn hàng')}</td>
          <td className="p-2 text-gray-600">{order.id}</td>
        </tr>
        <tr className="border-b">
          <td className="py-2 pr-3 pl-1 font-semibold text-gray-700 w-40">{transWithFallback('customer', 'Khách hàng')}</td>
          <td className="p-2 text-gray-600">{order.ownerId}</td>
        </tr>
        <tr className="border-b">
          <td className="py-2 pr-3 pl-1 font-semibold text-gray-700">{transWithFallback('orderStatus', 'Tình trạng')}</td>
          <td className="p-2 text-gray-600 font-bold">
            {order.status}
          </td>
        </tr>
        <tr className="border-b">
          <td className="py-2 pr-3 pl-1 font-semibold text-gray-700">{transWithFallback('orderDate', 'Ngày đặt')}</td>
          <td className="p-2 text-gray-600">
            {order?.PaymentInfo
              ? new Date(order.PaymentInfo?.paidAt).toLocaleString("vi-VN")
              : ""}
          </td>
        </tr>
        <tr className="border-b">
          <td className="py-2 pr-3 pl-1 font-semibold text-gray-700">{transWithFallback('paymentMethod', 'Phương thức thanh toán')}</td>
          <td className="p-2 text-gray-600 font-bold">{order.PaymentInfo?.method}</td>
        </tr>
        <tr className="border-b">
          <td className="py-2 pr-3 pl-1 font-semibold text-gray-700">{transWithFallback('total', 'Tổng cộng')}</td>
          <td className="p-2 text-gray-600 font-bold">{order.price}</td>
        </tr>
      </tbody>
    </table>
  );
}
