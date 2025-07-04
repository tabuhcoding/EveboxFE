"use client";
import React, { useState } from "react";
import DateRangePicker from "./datePicker";

interface BasicInfoProps {
  voucherType: string;
}


export default function BasicInfo({ voucherType }: BasicInfoProps) {
  const [promoName, setPromoName] = useState("");
  const [voucherCode, setVoucherCode] = useState("");
  const [quantity, setQuantity] = useState("");
  const [prefix, setPrefix] = useState("");
  const [errors] = useState<Record<string, string>>({});

  // const validate = () => {
  //   const newErrors: Record<string, string> = {};

  //   if (!promoName.trim()) newErrors.promoName = "Vui lòng nhập tên chương trình khuyến mãi!";
  //   if (!voucherCode.trim()) {
  //     newErrors.voucherCode = "Vui lòng nhập mã voucher!";
  //   } else if (!/^[A-Z0-9]{6,12}$/.test(voucherCode)) {
  //     newErrors.voucherCode = "Mã voucher chỉ gồm A-Z, 0-9 và từ 6-12 ký tự!";
  //   }

  //   if (voucherType === "multiple") {
  //     if (!quantity.trim()) newErrors.quantity = "Vui lòng nhập số lượng mã voucher!";
  //     if (!prefix.trim()) newErrors.prefix = "Vui lòng nhập tiền tố mã!";
  //   }

  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };

  // const handleSubmit = () => {
  //   if (validate()) {
  //     //todo
  //   }
  // };

  return (
    <div className="p-6 bg-[#E6F6F1] rounded-lg border border-[#BEE3DB] space-y-6 shadow-lg">
      <h2 className="text-lg font-semibold text-[#0C4762]">Thông tin cơ bản</h2>

      <div>
        <p className="block font-semibold text-[#0C4762]">
          <span className="text-red-500">*</span> Tên chương trình khuyến mãi:
        </p>
        <div className="relative">
          <input
            className={`w-full p-2 border rounded text-sm ${errors.promoName ? "border-red-500" : "border-gray-300"
              }`}
            placeholder="Nhập tên chương trình khuyến mãi"
            maxLength={80}
            value={promoName}
            onChange={(e) => setPromoName(e.target.value)}
          />
          <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
            {promoName.length}/80
          </span>
        </div>
        {errors.promoName && <p className="text-red-500 text-sm">{errors.promoName}</p>}
        <p className="text-xs text-gray-500">Tên chương trình sẽ không hiển thị cho người mua</p>
      </div>

      <div>
        <p className="block font-semibold text-[#0C4762]"><span className="text-red-500">*</span> Mã voucher:</p>
        <div className="relative">
          <input
            className={`w-full p-2 border rounded text-sm ${errors.voucherCode ? "border-red-500" : "border-gray-300"
              }`}
            placeholder="Nhập mã voucher"
            maxLength={12}
            value={voucherCode}
            onChange={(e) => setVoucherCode(e.target.value)}
          />
          <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
            {voucherCode.length}/12
          </span>
        </div>
        {errors.voucherCode && <p className="text-red-500 text-sm">{errors.voucherCode}</p>}
        <p className="text-xs text-gray-500">Chỉ cho phép những giá trị sau (A-Z và 0-9), tối thiểu 6 và tối đa 12 ký tự</p>
      </div>

      {/* Hiển thị trường khác nếu là 'multiple' */}
      {voucherType === "multiple" && (
        <>
          {/* Số lượng mã voucher */}
          <div>
            <p className="block font-semibold text-[#064E3B]">
              <span className="text-red-500">*</span> Số lượng mã voucher:
            </p>
            <input
              className={`w-full p-2 border rounded text-sm ${errors.quantity ? "border-red-500" : "border-gray-300"
                }`}
              type="number"
              placeholder="Nhập số lượng mã cần tạo"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity}</p>}
            <p className="text-xs text-gray-500">Có thể tạo tối đa 5000 mã. Mỗi mã chỉ áp dụng 1 lần.</p>
          </div>

          {/* Prefix */}
          <div>
            <p className="block font-semibold text-[#064E3B]">
              <span className="text-red-500">*</span> Prefix:
            </p>
            <input
              className={`w-full p-2 border rounded text-sm ${
                errors.prefix ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Nhập tiền tố mã"
              maxLength={10}
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
            />
            {errors.prefix && <p className="text-red-500 text-sm">{errors.prefix}</p>}
            <p className="text-xs text-gray-500">Mã sẽ tạo theo mẫu: {prefix || "HELLO"} + &lt;random&gt;</p>
          </div>
        </>
      )}

      <div className="flex space-x-4 items-center">
        <p className="block font-semibold text-[#0C4762]"><span className="text-red-500">*</span> Thời gian sử dụng mã:</p>
        {/* <input
          className="w-full p-2 border rounded border-gray-300 text-sm"
          placeholder="Từ ngày | Đến ngày"
        /> */}
        <DateRangePicker/>
      </div>

      {/* <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-[#48D1CC] text-[#0C4762] rounded-md transition duration-200 hover:bg-[#51DACF] w-full"
      >
        Xác nhận
      </button> */}
    </div>

    
  );
}
