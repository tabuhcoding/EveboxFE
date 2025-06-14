"use client"

import { X } from "lucide-react"
import { useState, ChangeEvent } from "react"
import { createOrgPaymentInfo } from "services/org.service";

interface OrganizerRegistrationPopupProps {
  onClose: () => void
  onSuccess: () => void
}

export default function OrganizerRegistrationPopup({ onClose, onSuccess }: OrganizerRegistrationPopupProps) {
  const [paymentForm, setPaymentForm] = useState({
    accName: "",
    accNum: "",
    bankName: "",
    bankBranch: "",
    typeBusiness: "Cá nhân",
    perName: "",
    perAddress: "",
    taxCode: "",
    companyName: "",
    companyAddress: "",
    companyTaxCode: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handlePaymentInputChange = (e: ChangeEvent<HTMLInputElement>, field: string) => {
    setPaymentForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }))
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value

    setPaymentForm((prev) => {
      if (value === "Cá nhân") {
        return {
          ...prev,
          typeBusiness: value,
          companyName: "",
          companyAddress: "",
          companyTaxCode: "",
        }
      } else {
        return {
          ...prev,
          typeBusiness: value,
          perName: "",
          perAddress: "",
          taxCode: "",
        }
      }
    })
  }

  const handleSubmitPayment = async () => {
  const newErrors: Record<string, string> = {};

  if (!paymentForm.accName.trim()) newErrors.accName = "Vui lòng nhập tên chủ tài khoản";
  if (!paymentForm.accNum.trim()) newErrors.accNum = "Vui lòng nhập số tài khoản";
  if (!paymentForm.bankName.trim()) newErrors.bankName = "Vui lòng nhập tên ngân hàng";
  if (!paymentForm.bankBranch.trim()) newErrors.bankBranch = "Vui lòng nhập chi nhánh";

  const isPersonal = paymentForm.typeBusiness === "Cá nhân";

  if (isPersonal) {
    if (!paymentForm.perName.trim()) newErrors.perName = "Vui lòng nhập họ tên";
    if (!paymentForm.perAddress.trim()) newErrors.perAddress = "Vui lòng nhập địa chỉ";
    if (!paymentForm.taxCode.trim()) newErrors.taxCode = "Vui lòng nhập mã số thuế";
  } else {
    if (!paymentForm.companyName.trim()) newErrors.companyName = "Vui lòng nhập tên công ty";
    if (!paymentForm.companyAddress.trim()) newErrors.companyAddress = "Vui lòng nhập địa chỉ công ty";
    if (!paymentForm.companyTaxCode.trim()) newErrors.companyTaxCode = "Vui lòng nhập mã số thuế";
  }

  setErrors(newErrors);

  if (Object.keys(newErrors).length === 0) {
    try {
      const payload = {
        accountName: paymentForm.accName,
        accountNumber: paymentForm.accNum,
        bankName: paymentForm.bankName,
        branch: paymentForm.bankBranch,
        businessType: isPersonal ? 1 : 2,
        fullName: isPersonal ? paymentForm.perName : paymentForm.companyName,
        address: isPersonal ? paymentForm.perAddress : paymentForm.companyAddress,
        taxCode: isPersonal ? paymentForm.taxCode : paymentForm.companyTaxCode,
      };

      await createOrgPaymentInfo(payload);
      onSuccess(); // success callback (e.g., redirect or close popup)
    } catch (error) {
      console.error("Create payment info failed:", error);
      alert("Đăng ký thông tin thanh toán thất bại. Vui lòng thử lại!");
    }
  }
};


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative flex items-center justify-center mb-4 rounded-t-lg">
          <h3 className="text-lg font-bold text-[#0C4762]">Đăng ký làm Nhà Tổ chức</h3>
          <button
            onClick={onClose}
            className="absolute right-2 hover:bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
            aria-label="Đóng"
          >
            <X size={18} />
          </button>
        </div>

        <div
          className="p-4 rounded-lg mb-4"
          style={{ backgroundColor: "rgba(158, 245, 207, 0.2)", border: "1.5px solid #9EF5CF" }}
        >
          <label htmlFor="paymentInfo" className="text-base font-bold block mb-2">Thông tin thanh toán</label>
          <span className="text-sm block mb-3">
            Evebox sẽ chuyển tiền bán vé đến tài khoản của bạn. Tiền bán vé (sau khi trừ phí dịch vụ cho Evebox) sẽ vào
            tài khoản của bạn sau khi xác nhận sale report từ 7 - 10 ngày.
          </span>

          <div className="mb-4">
            <label htmlFor="accName" className="block text-sm font-medium mb-1">
              Chủ tài khoản: <span className="text-red-500">*</span>
            </label>
            <input
              id="accName"
              type="text"
              value={paymentForm.accName}
              onChange={(e) => handlePaymentInputChange(e, "accName")}
              className={`w-full border p-2 rounded-md bg-white ${errors.accName ? "border-red-500" : ""}`}
              maxLength={100}
            />
            {errors.accName && <p className="text-red-500 text-xs mt-1">{errors.accName}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="accNum" className="block text-sm font-medium mb-1">
              Số tài khoản: <span className="text-red-500">*</span>
            </label>
            <input
              id="accNum"
              type="text"
              value={paymentForm.accNum}
              onChange={(e) => handlePaymentInputChange(e, "accNum")}
              className={`w-full border p-2 rounded-md bg-white ${errors.accNum ? "border-red-500" : ""}`}
            />
            {errors.accNum && <p className="text-red-500 text-xs mt-1">{errors.accNum}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="bankName" className="block text-sm font-medium mb-1">
              Tên ngân hàng: <span className="text-red-500">*</span>
            </label>
            <input
              id="bankName"
              type="text"
              value={paymentForm.bankName}
              onChange={(e) => handlePaymentInputChange(e, "bankName")}
              className={`w-full border p-2 rounded-md bg-white ${errors.bankName ? "border-red-500" : ""}`}
              maxLength={100}
            />
            {errors.bankName && <p className="text-red-500 text-xs mt-1">{errors.bankName}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="bankBranch" className="block text-sm font-medium mb-1">
              Chi nhánh: <span className="text-red-500">*</span>
            </label>
            <input
              id="bankBranch"
              type="text"
              value={paymentForm.bankBranch}
              onChange={(e) => handlePaymentInputChange(e, "bankBranch")}
              className={`w-full border p-2 rounded-md bg-white ${errors.bankBranch ? "border-red-500" : ""}`}
              maxLength={100}
            />
            {errors.bankBranch && <p className="text-red-500 text-xs mt-1">{errors.bankBranch}</p>}
          </div>

          <label htmlFor="redBill" className="text-base font-bold block mt-4 mb-2">Hoá đơn đỏ</label>

          <div className="mb-4">
            <label htmlFor="typeBusiness" className="block text-sm font-medium mb-1">
              Loại hình kinh doanh: <span className="text-red-500">*</span>
            </label>
            <select
              id="typeBusiness"
              value={paymentForm.typeBusiness}
              onChange={handleSelectChange}
              className="w-full border p-2 rounded-md bg-white"
            >
              <option value="Cá nhân">Cá nhân</option>
              <option value="Doanh nghiệp/Tổ chức">Doanh nghiệp/Tổ chức</option>
            </select>
          </div>

          {paymentForm.typeBusiness === "Cá nhân" && (
            <div className="infoOfPersonal">
              <div className="mb-4">
                <label htmlFor="perName" className="block text-sm font-medium mb-1">
                  Họ tên: <span className="text-red-500">*</span>
                </label>
                <input
                  id="perName"
                  type="text"
                  value={paymentForm.perName}
                  onChange={(e) => handlePaymentInputChange(e, "perName")}
                  className={`w-full border p-2 rounded-md bg-white ${errors.perName ? "border-red-500" : ""}`}
                  maxLength={100}
                />
                {errors.perName && <p className="text-red-500 text-xs mt-1">{errors.perName}</p>}
              </div>

              <div className="mb-4">
                <label htmlFor="perAddress" className="block text-sm font-medium mb-1">
                  Địa chỉ: <span className="text-red-500">*</span>
                </label>
                <input
                  id="perAddress"
                  type="text"
                  value={paymentForm.perAddress}
                  onChange={(e) => handlePaymentInputChange(e, "perAddress")}
                  className={`w-full border p-2 rounded-md bg-white ${errors.perAddress ? "border-red-500" : ""}`}
                  maxLength={100}
                />
                {errors.perAddress && <p className="text-red-500 text-xs mt-1">{errors.perAddress}</p>}
              </div>

              <div className="mb-4">
                <label htmlFor="taxCode" className="block text-sm font-medium mb-1">
                  Mã số thuế: <span className="text-red-500">*</span>
                </label>
                <input
                  id="taxCode"
                  type="text"
                  value={paymentForm.taxCode}
                  onChange={(e) => handlePaymentInputChange(e, "taxCode")}
                  className={`w-full border p-2 rounded-md bg-white ${errors.taxCode ? "border-red-500" : ""}`}
                />
                {errors.taxCode && <p className="text-red-500 text-xs mt-1">{errors.taxCode}</p>}
              </div>
            </div>
          )}

          {paymentForm.typeBusiness === "Doanh nghiệp/Tổ chức" && (
            <div className="infoOfCompany">
              <div className="mb-4">
                <label htmlFor="companyName" className="block text-sm font-medium mb-1">
                  Tên công ty: <span className="text-red-500">*</span>
                </label>
                <input
                  id="companyName"
                  type="text"
                  value={paymentForm.companyName}
                  onChange={(e) => handlePaymentInputChange(e, "companyName")}
                  className={`w-full border p-2 rounded-md bg-white ${errors.companyName ? "border-red-500" : ""}`}
                  maxLength={100}
                />
                {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
              </div>

              <div className="mb-4">
                <label htmlFor="companyAddress" className="block text-sm font-medium mb-1">
                  Địa chỉ công ty: <span className="text-red-500">*</span>
                </label>
                <input
                  id="companyAddress"
                  type="text"
                  value={paymentForm.companyAddress}
                  onChange={(e) => handlePaymentInputChange(e, "companyAddress")}
                  className={`w-full border p-2 rounded-md bg-white ${errors.companyAddress ? "border-red-500" : ""}`}
                  maxLength={100}
                />
                {errors.companyAddress && <p className="text-red-500 text-xs mt-1">{errors.companyAddress}</p>}
              </div>

              <div className="mb-4">
                <label htmlFor="companyTaxCode" className="block text-sm font-medium mb-1">
                  Mã số thuế: <span className="text-red-500">*</span>
                </label>
                <input
                  id="companyTaxCode"
                  type="text"
                  value={paymentForm.companyTaxCode}
                  onChange={(e) => handlePaymentInputChange(e, "companyTaxCode")}
                  className={`w-full border p-2 rounded-md bg-white ${errors.companyTaxCode ? "border-red-500" : ""}`}
                />
                {errors.companyTaxCode && <p className="text-red-500 text-xs mt-1">{errors.companyTaxCode}</p>}
              </div>
            </div>
          )}
        </div>


        <div className="flex justify-center gap-4">
          <button
            onClick={handleSubmitPayment}
            className="bg-[#51DACF] text-[#0C4762] px-4 py-2 rounded-md hover:bg-teal-300 transition"
          >
            Xác nhận
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}