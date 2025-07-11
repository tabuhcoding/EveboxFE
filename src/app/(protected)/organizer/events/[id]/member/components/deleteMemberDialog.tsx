"use client";

import { deleteEventMember } from "@/services/org.service";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

interface DeleteMemberDialogProps {
  eventId: number;
  email: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function DeleteMemberDialog({ eventId, email, onClose, onSuccess }: DeleteMemberDialogProps) {
  
    const t = useTranslations("common");
  const transWithFallback = (key: string, fallback: string) =>
    t(key).startsWith("common.") ? fallback : t(key);

  const handleDelete = async () => {
    try {
      const response = await deleteEventMember(eventId, email);
      if (response?.statusCode === 200) {
        toast.success(transWithFallback("deleteSuccess", "Xoá thành viên thành công!"));
        onSuccess?.();
        onClose();
      } else {
        toast.error(response?.message || transWithFallback("deleteFailed", "Xoá thất bại"));
      }
    } catch {
      toast.error(transWithFallback("deleteError", "Lỗi khi xoá thành viên"));
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-[500px] px-8 py-6 rounded-lg shadow-lg relative">
        <button className="absolute top-4 right-4 text-gray-500" onClick={onClose}>
          <X size={24} />
        </button>

        <h2 className="text-xl font-semibold text-[#0C4762] text-center mb-4">
          {transWithFallback("confirmDeleteMember", "Xác nhận xoá thành viên")}
        </h2>
        <p className="text-center text-gray-700">
          {transWithFallback("confirmDeleteMessage", `Bạn có chắc chắn muốn xoá thành viên ${email} khỏi sự kiện?`)}
        </p>

        <div className="mt-6 flex justify-end gap-4">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100">
            {transWithFallback("cancel", "Huỷ")}
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            {transWithFallback("delete", "Xoá")}
          </button>
        </div>
      </div>
    </div>
  );
}
