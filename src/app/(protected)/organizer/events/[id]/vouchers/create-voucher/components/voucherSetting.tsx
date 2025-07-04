"use client";
import React, { useState } from "react";

interface VoucherSettingsProps {
  voucherType: string;
}

export default function VoucherSettings({ voucherType }: VoucherSettingsProps) {
  const [discountType, setDiscountType] = useState("Theo số tiền");
  const [discountValue, setDiscountValue] = useState("");
  const [ticketLimit, setTicketLimit] = useState("");
  const [maxOrders, setMaxOrders] = useState("");
  const [minTickets, setMinTickets] = useState("");
  const [maxTickets, setMaxTickets] = useState("");
  const [isUnlimited, setIsUnlimited] = useState(false);
  const [errors] = useState<{ [key: string]: string }>({});

  // const validate = () => {
  //   let newErrors: { [key: string]: string } = {};

  //   if (!discountValue.trim()) newErrors.discountValue = "Vui lòng nhập mức giảm";
  //   if (!isUnlimited && !ticketLimit.trim()) newErrors.ticketLimit = "Vui lòng nhập số lượng vé";
  //   if (voucherType === "single") {
  //     if (!maxOrders.trim()) newErrors.maxOrders = "Vui lòng nhập số đơn hàng tối đa";
  //     if (!minTickets.trim()) newErrors.minTickets = "Vui lòng nhập số vé tối thiểu";
  //     if (!maxTickets.trim()) newErrors.maxTickets = "Vui lòng nhập số vé tối đa";
  //   }
  // };

  return (
    <div className="p-6 bg-[#E6F6F1] rounded-lg border border-[#BEE3DB] space-y-6 shadow-lg">
      <h2 className="text-lg font-semibold text-[#0C4762]">Thiết lập mã voucher</h2>

      {/* Hiển thị chung cho cả "single" và "multiple" */}
      <div>
        <p className="block font-semibold text-[#0C4762]">
          <span className="text-red-500">*</span> Loại khuyến mãi:
        </p>
        <div className="flex space-x-2">
          <select
            className={`p-2 border rounded text-sm w-1/2 ${errors.discountValue ? 'border-red-500' : 'border-gray-300'}`}
            value={discountType}
            onChange={(e) => setDiscountType(e.target.value)}
          >
            <option>Theo số tiền</option>
            <option>Theo phần trăm</option>
          </select>
          <input
            className={`p-2 border rounded text-sm w-1/2 ${errors.discountValue ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Nhập mức giảm"
            value={discountValue}
            onChange={(e) => setDiscountValue(e.target.value)}
          />
          {errors.discountValue && <p className="text-red-500 text-xs">{errors.discountValue}</p>}
        </div>
      </div>

      <div>
        <p className="block font-semibold text-[#0C4762]">
          <span className="text-red-500">*</span> Tổng số vé được áp dụng:
        </p>
        <div className="flex items-center space-x-2">
          <input type="radio" checked={!isUnlimited} onChange={() => setIsUnlimited(false)} />
          <span>Giới hạn</span>
          <input type="radio" checked={isUnlimited} onChange={() => setIsUnlimited(true)} />
          <span>Không giới hạn</span>
        </div>
        {!isUnlimited && (
          <input
            className={`w-full p-2 border rounded text-sm ${errors.ticketLimit ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Nhập số lượng vé"
            value={ticketLimit}
            onChange={(e) => setTicketLimit(e.target.value)}
          />
        )}
        {errors.ticketLimit && <p className="text-red-500 text-xs">{errors.ticketLimit}</p>}
        <p className="text-xs text-gray-500">Số vé được khuyến mãi của mỗi voucher</p>
      </div>

      {/* Chỉ hiển thị nếu voucherType là "single" */}
      {voucherType === "single" && (
        <>
          <div>
            <p className="block font-semibold text-[#0C4762]">
              <span className="text-red-500">*</span> Số đơn hàng tối đa/Người mua:
            </p>
            <input
              className={`w-full p-2 border rounded text-sm ${errors.maxOrders ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Nhập số đơn hàng tối đa"
              value={maxOrders}
              onChange={(e) => setMaxOrders(e.target.value)}
            />
            {errors.maxOrders && <p className="text-red-500 text-xs">{errors.maxOrders}</p>}
            <p className="text-xs text-gray-500">Tổng số đơn hàng mà người mua có thể áp dụng voucher</p>
          </div>

          <div>
            <p className="block font-semibold text-[#0C4762]">
              <span className="text-red-500">*</span> Số lượng vé tối thiểu:
            </p>
            <input
              className={`w-full p-2 border rounded text-sm ${errors.minTickets ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Nhập số lượng vé tối thiểu"
              value={minTickets}
              onChange={(e) => setMinTickets(e.target.value)}
            />
            {errors.minTickets && <p className="text-red-500 text-xs">{errors.minTickets}</p>}
            <p className="text-xs text-gray-500">Số lượng vé tối thiểu trong đơn hàng để có thể áp dụng voucher</p>
          </div>

          <div>
            <p className="block font-semibold text-[#0C4762]">
              <span className="text-red-500">*</span> Số lượng vé tối đa:
            </p>
            <input
              className={`w-full p-2 border rounded text-sm ${errors.maxTickets ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Nhập số lượng vé tối đa"
              value={maxTickets}
              onChange={(e) => setMaxTickets(e.target.value)}
            />
            {errors.maxTickets && <p className="text-red-500 text-xs">{errors.maxTickets}</p>}
            <p className="text-xs text-gray-500">Số lượng vé tối đa trong đơn hàng để có thể áp dụng voucher</p>
          </div>
        </>
      )}
    </div>
  );
}