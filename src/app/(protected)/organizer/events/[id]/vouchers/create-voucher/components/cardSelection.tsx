"use client";
import React from "react";

interface CardSelectionProps {
  voucherType: string;
  setVoucherType: (type: string) => void;
}

export default function CardSelection({ voucherType, setVoucherType }: CardSelectionProps) {
  return (
    <div className="flex space-x-4">
      <div
        className={`flex-1 p-6 rounded-xl shadow-md cursor-pointer transition-all duration-300 ${
          voucherType === "single" ? "bg-[#0C4762] text-white" : "bg-white text-black border"
        }`}
        onClick={() => setVoucherType("single")}
      >
        <h2 className="text-lg font-bold">Tạo 1 mã</h2>
        <p className="text-sm">Tạo 1 mã voucher duy nhất cho sự kiện của bạn</p>
      </div>
      <div
        className={`flex-1 p-6 rounded-xl shadow-md cursor-pointer transition-all duration-300 ${
          voucherType === "multiple" ? "bg-[#0C4762] text-white" : "bg-white text-black border"
        }`}
        onClick={() => setVoucherType("multiple")}
      >
        <h2 className="text-lg font-bold">Tạo nhiều mã</h2>
        <p className="text-sm">
          Mã voucher sẽ được tạo ngẫu nhiên hàng loạt và các thiết lập bên dưới sẽ áp dụng cho tất cả các mã voucher
        </p>
      </div>
    </div>
  );
}
