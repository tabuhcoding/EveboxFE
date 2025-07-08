"use client";

import { useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { UpdateEventMemberDto } from "@/types/models/org/member.interface";
import { updateEventMember } from "@/services/org.service";

interface EditMemberDialogProps {
  eventId: number;
  member: {
    email: string;
    role: number;
  };
  onClose: () => void;
  onSuccess?: () => void;
}

const roleMap: { [key: number]: string } = {
  2: "admin",
  3: "marketer",
  4: "check-in",
  6: "analyst",
};

const reverseRoleMap: { [key: string]: number } = Object.fromEntries(
  Object.entries(roleMap).map(([k, v]) => [v, parseInt(k)])
);

export default function EditMemberDialog({ eventId, member, onClose, onSuccess }: EditMemberDialogProps) {
  const [role, setRole] = useState(roleMap[member.role] || "");
  const [roleError, setRoleError] = useState("");

  const handleUpdate = async () => {
    if (!role) {
      setRoleError("Vui lòng chọn vai trò!");
      return;
    }

    const roleNumber = reverseRoleMap[role];
    if (!roleNumber) {
      setRoleError("Vai trò không hợp lệ");
      return;
    }

    try {
      console.log(eventId);
      console.log(onSuccess);
      const payload: UpdateEventMemberDto = {
    email: member.email,
    role: roleNumber,
  };

  const response = await updateEventMember(eventId, payload);


      if (response?.statusCode === 200) {
        toast.success("Cập nhật thành viên thành công!");
        onSuccess?.();
        onClose();
      } else {
        toast.error(response?.message || "Cập nhật thất bại");
      }
    } catch (error) {
      console.error("Update member failed:", error);
      toast.error("Lỗi khi cập nhật thành viên");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-[600px] px-10 py-6 rounded-lg shadow-lg relative">
        <button className="absolute top-4 right-4 text-gray-500" onClick={onClose}>
          <X size={24} />
        </button>

        <h2 className="text-2xl font-semibold text-[#0C4762] text-center">Chỉnh sửa thành viên</h2>

        <div className="mt-6">
          <p className="text-left block font-medium">Email</p>
          <input
            type="email"
            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 bg-gray-100 text-gray-500 cursor-not-allowed"
            value={member.email}
            disabled
          />
        </div>

        <div className="mt-4">
          <p className="text-left block font-medium">Vai trò <span className="text-red-500">*</span></p>
          <select
            className={`w-full border rounded-md px-3 py-2 mt-1 outline-none ${roleError ? 'border-red-500' : 'border-gray-300'}`}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Chọn vai trò</option>
             <option value="admin">Quản trị viên</option>
                           <option value="check-in">Nhân viên check-in</option>
                           <option value="analyst">Phân tích viên</option>
                           <option value="marketer">Marketer</option>
          </select>
          {roleError && <p className="text-red-500 text-sm mt-1">{roleError}</p>}
        </div>

        <button
          onClick={handleUpdate}
          className="mt-6 w-full bg-[#51DACF] text-[#0C4762] py-2 rounded-md hover:bg-[#3AB5A3]"
        >
          Cập nhật
        </button>
      </div>
    </div>
  );
}
