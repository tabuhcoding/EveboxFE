'use client';

import { X, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { AddEventMemberDto, EventRoleItem } from '@/types/models/org/member.interface';
import { addEventMember, getEventRoles } from '@/services/org.service';

interface AddMemberFormProps {
    eventId: number;
    onClose: () => void;
    onSuccess?: () => void;
  }

export default function AddMemberForm({eventId, onClose, onSuccess }: AddMemberFormProps) {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [emailError, setEmailError] = useState('');
    const [roleError, setRoleError] = useState('');
    const [permissionMatrix, setPermissionMatrix] = useState<boolean[][]>([]);


   useEffect(() => {
  const fetchRoles = async () => {
    try {
      console.log(eventId);
      console.log(onSuccess);

      const roles: EventRoleItem[] = await getEventRoles();

      const matrix: boolean[][] = [
        roles.map(role => role.isEdited),
        roles.map(role => role.isSummarized),
        roles.map(role => role.viewVoucher),
        roles.map(role => role.marketing),
        roles.map(role => role.viewOrder),
        roles.map(role => role.viewSeatmap),
        roles.map(role => role.viewMember),
        roles.map(role => role.checkin),
        roles.map(role => role.checkout),
        roles.map(role => role.redeem),
      ];

      setPermissionMatrix(matrix);
    } catch (error) {
      console.error("Failed to fetch roles:", error);
      toast.error("Không thể tải quyền vai trò");
    }
  };

  fetchRoles();
}, []);

    const roleMap: { [key: string]: number } = {
        admin: 2,
        marketer: 3,
        "check-in": 4,
        analyst: 6,
      };

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSave = async () => {
        let isValid = true;
      
        if (!email.trim()) {
          setEmailError("Vui lòng nhập email");
          isValid = false;
        } else if (!validateEmail(email)) {
          setEmailError("Email không hợp lệ");
          isValid = false;
        } else {
          setEmailError("");
        }
      
        if (!role) {
          setRoleError("Vui lòng chọn vai trò!");
          isValid = false;
        } else {
          setRoleError("");
        }
      
        if (!isValid) return;
      
        const roleNumber = roleMap[role];
        if (!roleNumber) {
          setRoleError("Vai trò không hợp lệ");
          return;
        }
      
        try {
  const payload: AddEventMemberDto = {
    email,
    role: roleNumber,
  };

  const response = await addEventMember(eventId, payload);

  if (response?.statusCode === 201 || response?.statusCode === 200) {
    toast.success("Thêm thành viên thành công!");
    if (onSuccess) onSuccess();
    onClose();
  } else {
    toast.error(response?.message || "Thêm thất bại");
  }
} catch (error) {
  console.error("Add member failed:", error);
  toast.error("Lỗi khi thêm thành viên");
}
      };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
            <div className="bg-white w-[800px] max-h-[80vh] mt-9 px-10 py-6 rounded-lg shadow-lg relative flex flex-col">
                {/* Nút đóng */}
                <button className="absolute top-4 right-4 text-gray-500" onClick={onClose}>
                    <X size={24} />
                </button>

                {/* Tiêu đề cố định */}
                <div className="sticky top-0 bg-white pb-4">
                    <h2 className="text-2xl font-semibold text-[#0C4762] text-center">Thêm thành viên</h2>
                </div>

                {/* Nội dung cuộn được */}
                <div className="overflow-y-auto flex-1">
                    <div className="mt-4">
                        <p className="block font-medium">Email <span className="text-red-500">*</span></p>
                        <input
                            type="email"
                            className={`w-full border rounded-md px-3 py-2 mt-1 outline-none ${emailError ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Nhập email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
                    </div>

                    <div className="mt-4">
                        <p className="block font-medium">Vai trò <span className="text-red-500">*</span></p>
                        <select
                            className={`w-full border rounded-md px-3 py-2 mt-1 outline-none ${roleError ? 'border-red-500' : 'border-gray-300'}`}
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                           <option value="">Thêm vai trò</option>
                           <option value="admin">Quản trị viên</option>
                           <option value="check-in">Nhân viên check-in</option>
                           <option value="analyst">Phân tích viên</option>
                           <option value="marketer">Marketer</option>
                        </select>
                        {roleError && <p className="text-red-500 text-sm mt-1">{roleError}</p>}
                    </div>

                    <button onClick={handleSave} className="mt-6 w-full bg-[#51DACF] text-[#0C4762] py-2 rounded-md hover:bg-[#3AB5A3]">
                        Lưu
                    </button>

                    {/* Bảng quyền */}
                    <div className="mt-6 overflow-x-auto">
                    {permissionMatrix.length > 0 && (
  <table className="w-full border-collapse border border-gray-300">
    <thead>
      <tr className="bg-[#0C4762] text-white text-sm">
        <th className="p-2 border w-1/7"></th>
        <th className="p-2 border w-1/7">Chủ sự kiện</th>
        <th className="p-2 border w-1/7">Quản trị viên</th>
        <th className="p-2 border w-1/7">Marketer</th>
        <th className="p-2 border w-1/7">Nhân viên check-in</th>
        <th className="p-2 border w-1/7">Người xem</th>
        <th className="p-2 border w-1/7">Phân tích viên</th>
      </tr>
    </thead>
    <tbody>
      {['Chỉnh sửa', 'Tổng kết', 'Voucher', 'Marketing', 'Đơn hàng', 'Seat map', 'Thành viên', 'Check in', 'Check out', 'Redeem'].map((perm, idx) => (
        <tr key={idx} className="text-center">
          <td className="border p-2 text-sm w-1/7">{perm}</td>
          {permissionMatrix[idx].map((hasPermission, i) => (
            <td key={i} className="border p-2 w-1/7">
              <div className="flex justify-center">
                {hasPermission && <CheckCircle className="text-[#48C3CD]" size={16} strokeWidth={1.5} />}
              </div>
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
)}
                    </div>
                </div>
            </div>
        </div>
    );
}
