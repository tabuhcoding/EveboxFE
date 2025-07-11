'use client';

import { X, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { AddEventMemberDto, EventRoleItem } from '@/types/models/org/member.interface';
import { addEventMember, getEventRoles } from '@/services/org.service';
import { useTranslations } from 'next-intl';

interface AddMemberFormProps {
    eventId: number;
    onClose: () => void;
    onSuccess?: () => void;
  }

export default function AddMemberForm({eventId, onClose, onSuccess }: AddMemberFormProps) {
    const t = useTranslations("common");
  const transWithFallback = (key: string, fallback: string) =>
    t(key).startsWith("common.") ? fallback : t(key);

  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [emailError, setEmailError] = useState('');
  const [roleError, setRoleError] = useState('');
  const [permissionMatrix, setPermissionMatrix] = useState<boolean[][]>([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
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
        toast.error(transWithFallback("failedToLoadPermissions", "Không thể tải quyền vai trò"));
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

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSave = async () => {
    let isValid = true;

    if (!email.trim()) {
      setEmailError(transWithFallback("enterEmail", "Vui lòng nhập email"));
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError(transWithFallback("invalidEmail", "Email không hợp lệ"));
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!role) {
      setRoleError(transWithFallback("pleaseSelectRole", "Vui lòng chọn vai trò!"));
      isValid = false;
    } else {
      setRoleError('');
    }

    if (!isValid) return;

    const roleNumber = roleMap[role];
    if (!roleNumber) {
      setRoleError(transWithFallback("invalidRole", "Vai trò không hợp lệ"));
      return;
    }

    try {
      const payload: AddEventMemberDto = { email, role: roleNumber };
      const response = await addEventMember(eventId, payload);

      if (response?.statusCode === 201 || response?.statusCode === 200) {
        toast.success(transWithFallback("addSuccess", "Thêm thành viên thành công!"));
        onSuccess?.();
        onClose();
      } else {
        toast.error(response?.message || transWithFallback("addFailed", "Thêm thất bại"));
      }
    } catch {
      toast.error(transWithFallback("addError", "Lỗi khi thêm thành viên"));
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
      <div className="bg-white w-[800px] max-h-[80vh] mt-9 px-10 py-6 rounded-lg shadow-lg relative flex flex-col">
        <button className="absolute top-4 right-4 text-gray-500" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="sticky top-0 bg-white pb-4">
          <h2 className="text-2xl font-semibold text-[#0C4762] text-center">
            {transWithFallback("addMember", "Thêm thành viên")}
          </h2>
        </div>

        <div className="overflow-y-auto flex-1">
          <div className="mt-4">
            <p className="font-medium">
              {transWithFallback("email", "Email")} <span className="text-red-500">*</span>
            </p>
            <input
              type="email"
              className={`w-full border rounded-md px-3 py-2 mt-1 outline-none ${emailError ? 'border-red-500' : 'border-gray-300'}`}
              placeholder={transWithFallback("enterEmail", "Nhập email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
          </div>

          <div className="mt-4">
            <p className="font-medium">
              {transWithFallback("role", "Vai trò")} <span className="text-red-500">*</span>
            </p>
            <select
              className={`w-full border rounded-md px-3 py-2 mt-1 outline-none ${roleError ? 'border-red-500' : 'border-gray-300'}`}
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">{transWithFallback("selectRole", "Thêm vai trò")}</option>
              <option value="admin">{transWithFallback("admin", "Quản trị viên")}</option>
              <option value="check-in">{transWithFallback("checkin", "Nhân viên check-in")}</option>
              <option value="analyst">{transWithFallback("analyst", "Phân tích viên")}</option>
              <option value="marketer">{transWithFallback("marketer", "Marketer")}</option>
            </select>
            {roleError && <p className="text-red-500 text-sm mt-1">{roleError}</p>}
          </div>

          <button
            onClick={handleSave}
            className="mt-6 w-full bg-[#51DACF] text-[#0C4762] py-2 rounded-md hover:bg-[#3AB5A3]"
          >
            {transWithFallback("save", "Lưu")}
          </button>

          {/* Permission Table */}
          <div className="mt-6 overflow-x-auto">
            {permissionMatrix.length > 0 && (
              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead>
                  <tr className="bg-[#0C4762] text-white">
                    <th className="p-2 border">{transWithFallback("permission", "Quyền")}</th>
                    <th className="p-2 border">{transWithFallback("organizer", "Chủ sự kiện")}</th>
                    <th className="p-2 border">{transWithFallback("admin", "Quản trị viên")}</th>
                    <th className="p-2 border">{transWithFallback("marketer", "Marketer")}</th>
                    <th className="p-2 border">{transWithFallback("checkin", "Check-in")}</th>
                    <th className="p-2 border">{transWithFallback("viewer", "Người xem")}</th>
                    <th className="p-2 border">{transWithFallback("analyst", "Phân tích viên")}</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    "Chỉnh sửa", "Tổng kết", "Voucher", "Marketing", "Đơn hàng",
                    "Seat map", "Thành viên", "Check in", "Check out", "Redeem"
                  ].map((perm, idx) => (
                    <tr key={idx} className="text-center">
                      <td className="border p-2">{transWithFallback(`perm-${perm}`, perm)}</td>
                      {permissionMatrix[idx].map((hasPermission, i) => (
                        <td key={i} className="border p-2">
                          <div className="flex justify-center">
                            {hasPermission && (
                              <CheckCircle className="text-[#48C3CD]" size={16} strokeWidth={1.5} />
                            )}
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
