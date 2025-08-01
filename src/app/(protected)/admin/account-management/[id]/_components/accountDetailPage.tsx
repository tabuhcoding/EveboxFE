'use client';

/* Package System */
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { ChevronDown, ArrowLeft } from "lucide-react";
import { CircularProgress } from "@mui/material";
import toast from "react-hot-toast";

/* Package Application */
import FormInput from "./formInput";
import AlertDialog from "@/components/common/alertDialog";
import Loading from "../loading";

import { User, UserRole, UserStatus, AreaCode } from "@/types/models/admin/accountManagement.interface";
import useAvatar from "@/app/(protected)/(user)/my-profile/_components/libs/hooks/useAvatar";
import { getUserById, updateUserRole, updateUserStatus, updateUserArea } from "@/services/auth.service";
import { mapRoleNumberToString, mapRoleStringToNumber } from "@/utils/helpers";
import { useAuth } from "@/contexts/auth.context";

export default function AccountDetailPage({ id }: { id: string }) {
  const t = useTranslations('common');
  const router = useRouter();
  const { session } = useAuth();

  const roles = Object.values(UserRole);
  const status = Object.values(UserStatus);
  const areas = Object.values(AreaCode);

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState(false);
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [editedRole, setEditedRole] = useState<UserRole | null>(null)
  const [editedStatus, setEditedStatus] = useState<UserStatus | null>(null);
  const [editedArea, setEditedArea] = useState<AreaCode | null>(null);
  const [isDirty, setIsDirty] = useState(false)
  const [avatarId, setAvatarId] = useState<number | undefined>(undefined);
  const { imageUrl } = useAvatar({ avatar_id: avatarId });

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    return !msg || msg.startsWith('common.') ? fallback : msg;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const res = await getUserById(id);
        if (res?.statusCode === 200) {
          setUser(res.data);
          setEditedRole(mapRoleNumberToString(res.data.role));
          setEditedStatus(res.data.status)
          setEditedArea(res.data.area as AreaCode);
          setAvatarId(res.data.avatar_id);
        } else {
          setAlertMessage(res.message.toString());
          setAlertOpen(true);
        }
      } catch (error: any) {
        setAlertMessage(error.toString());
        setAlertOpen(true);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchUserData();
  }, [id]);

  useEffect(() => {
    if (user) {
      if (editedRole !== mapRoleNumberToString(user.role) || editedStatus !== user.status) {
        setIsDirty(true)
      } else {
        setIsDirty(false)
      }
    }
  }, [editedRole, editedStatus, user]);

  useEffect(() => {
    const handleWindowClose = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    const handleBeforeRouteChange = () => {
      if (isDirty && !confirm(`${transWithFallback('unsavedChanges', 'Bạn có thay đổi chưa lưu')}. ${transWithFallback('uWantToLeave?', 'Bạn có chắc muốn rời đi?')}`)) {
        return false
      }
    }

    window.addEventListener('beforeunload', handleWindowClose)
    window.addEventListener('popstate', handleBeforeRouteChange)

    return () => {
      window.removeEventListener('beforeunload', handleWindowClose)
      window.removeEventListener('popstate', handleBeforeRouteChange)
    }
  }, [isDirty])

  const handleSave = async () => {
    setIsDirty(false)
    // toast.success(transWithFallback('saveChangesSuccessfully', 'Lưu thay đổi thành công!'));
    if (!user) return;

    let hasChange = false;
    setIsSaving(true);

    try {

      if (editedRole !== mapRoleNumberToString(user.role)) {
        hasChange = true;
        const roleNumber = mapRoleStringToNumber(editedRole as UserRole);
        const res = await updateUserRole(user.email, roleNumber, session?.user?.accessToken || "");
        if (res?.statusCode === 200) {
          toast.success(transWithFallback('updateRoleSuccess', 'Cập nhật vai trò thành công!'));
        } else {
          toast.error(transWithFallback('errorWhenUpdateRole', 'Lỗi khi cập nhật vai trò'));
        }
      }

      if (editedStatus !== user.status) {
        hasChange = true;
        const res = await updateUserStatus(user.email, editedStatus as string, session?.user?.accessToken || "");
        if (res?.statusCode === 200) {
          toast.success(transWithFallback('updateStatusSuccess', 'Cập nhật trạng thái thành công!'));
        } else {
          toast.error(transWithFallback('errorWhenUpdateAccountStatus', 'Lỗi khi cập nhật trạng thái tài khoản'));
          // return;
        }
      }

      if (editedArea !== user.area) {
        hasChange = true;
        const res = await updateUserArea(user.email, editedArea as string, session?.user?.accessToken || "");
        if (res?.statusCode === 200) {
          toast.success(transWithFallback('updateAreaSuccess', 'Cập nhật khu vực quản lý của tài khoản thành công!'));
        } else {
          toast.error(transWithFallback('errorWhenUpdateAccountArea', 'Lỗi khi cập nhật khu vực quản lý của tài khoản'));
          // return;
        }
      }

      // 3. Reload lại data nếu có đổi, và reset isDirty
      if (hasChange) {
        setIsDirty(false);
        // Reload user data
        const res = await getUserById(user.id);
        if (res?.statusCode === 200) {
          setUser(res.data);
          setEditedRole(mapRoleNumberToString(res.data.role));
          setEditedStatus(res.data.status);
          setEditedArea(res.data.area as AreaCode);
          setAvatarId(res.data.avatar_id);
        }
      } else {
        toast(transWithFallback('noChangesToSave', 'Không có thay đổi nào để lưu.'), { icon: '⚠️' });
        setIsDirty(false);
      }
    } catch (error) {
      console.log("🚀 ~ handleSave ~ error:", error)
      toast.error(transWithFallback('errorWhenSave', 'Có lỗi khi lưu thay đổi'));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    loading ? (
      <Loading />
    ) : (
      <>
        <div className="flex items-center space-x-2">
          <ArrowLeft onClick={() => router.back()} size={30} className="text-[#0C4762] cursor-pointer hover:opacity-80 transition-opacity duration-200" />
          <h1 className="text-2xl font-bold text-[#0C4762] mb-1">{transWithFallback('detailInfo', 'Thông tin chi tiết')}</h1>
        </div>

        <div className="border-t-2 border-[#0C4762] mt-2"></div>

        {user && (
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-12 mt-10 mb-10">
            <div className="flex justify-center mb-8">
              <div className="relative w-24 h-24">
                <img
                  src={!imageUrl || imageUrl === "" ? '/images/default_avt.png' : imageUrl}
                  alt="Avatar"
                  className="object-cover rounded-full w-full h-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormInput label={transWithFallback('fullName', 'Họ và tên')} value={user.name} disabled type="text" />
              <FormInput label={transWithFallback('emailAddress', 'Địa chỉ email')} value={user.email} disabled type="email" />
              <FormInput label={transWithFallback('phone', 'Số điện thoại')} value={user.phone} disabled type="phone" />
              <FormInput label={transWithFallback('createdDate', 'Ngày tạo')} value={new Date(user.created_at).toLocaleDateString('vi-VN')} disabled type="text" />

              <div>
                <label htmlFor="role-select" className="block text-sm font-medium text-gray-700">{transWithFallback('role', 'Vai trò')}</label>
                <div className="relative">
                  <select id="role-select" className="appearance-none mt-1 w-full px-4 py-2 pr-10 border rounded-md"
                    value={editedRole || ''} onChange={(e) => setEditedRole(e.target.value as UserRole)}>
                    {roles.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 mt-1">
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="status-select" className="block text-sm font-medium text-gray-700">{transWithFallback('status', 'Trạng thái')}</label>
                <div className="relative">
                  <select id="status-select" className="appearance-none mt-1 w-full px-4 py-2 pr-10 border rounded-md"
                    value={editedStatus || ''} onChange={(e) => setEditedStatus(e.target.value as UserStatus)} >
                    {status.map(s => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 mt-1">
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {user.area && (
                <div>
                  <label htmlFor="area-select" className="block text-sm font-medium text-gray-700">{transWithFallback('area', 'Khu vực')}</label>
                  <div className="relative">
                    <select id="area-select" className="appearance-none mt-1 w-full px-4 py-2 pr-10 border rounded-md"
                      value={editedArea || ''} onChange={(e) => setEditedArea(e.target.value as AreaCode)} >
                      {areas.map(s => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 mt-1">
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-10 mb-4 text-center">
              <button onClick={handleSave} disabled={isSaving} className="items-center justify-center bg-[#51DACF] text-[#0C4762] font-semibold px-6 py-2 rounded-md hover:text-white hover:bg-[#0C4762] transition w-60">
                {isSaving ? (
                  <>
                    <div className="flex items-center justify-center gap-2">
                      <CircularProgress size={20} />
                      <span className="text-white">{transWithFallback('saving', 'Đang lưu...')}</span>
                    </div>
                  </>
                ) : (
                  transWithFallback('saveChanges', 'Lưu thay đổi')
                )}
              </button>
            </div>
          </div>
        )}

        <AlertDialog
          message={alertMessage}
          open={alertOpen}
          onClose={() => setAlertOpen(false)}
        />
      </>
    )
  )
}