'use client';

/* Package System */
import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { HttpStatusCode } from "axios";
import toast from "react-hot-toast";

/* Package Application */
import { sortUsers } from "../libs/function/sortUsers";
import { UserAdminData, UserStatus, AccountTableProps, UserRole } from "@/types/models/admin/accountManagement.interface";
import { getUsersByAdmin, updateUserStatus } from "@/services/auth.service";
import { useAuth } from "@/contexts/auth.context";
import AlertDialog from "@/components/common/alertDialog";
import SortIcon from "./sortIcon";
import AccountSkeletonLoading from "../loading";
import EventPagination from "../../event-management/_components/common/pagination";
import ConfirmStatusDialog from "./confirmStatusDialog";

export default function AccountTable({ searchKeyword, roleFilter, dateFrom, dateTo }: AccountTableProps) {
  const router = useRouter();
  const t = useTranslations('common');
  const { session } = useAuth();

  const [users, setUsers] = useState<UserAdminData[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(true);
  const [isLoadingAction, setIsLoadingAction] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<UserAdminData | null>(null);

  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof UserAdminData; direction: 'asc' | 'desc' } | null>(null);

  const [usersPerPage, setUsersPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  function getRoleIdByName(role: UserRole | string): number | null {
    switch (role) {
      case UserRole.SYSTEM_ADMIN:
      case "SYSTEM_ADMIN":
        return 0;
      case UserRole.ADMIN:
      case "ADMIN":
        return 1;
      case UserRole.ORGANIZER:
      case "ORGANIZER":
        return 2;
      case UserRole.CUSTOMER:
      case "CUSTOMER":
        return 3;
      default:
        return null;
    }
  }

  const fetchUsers = useCallback(async () => {
    setIsLoadingUsers(true);

    const adjustedDateTo = dateTo ? new Date(dateTo) : undefined;
    if (adjustedDateTo) {
      adjustedDateTo.setHours(23, 59, 59, 999);
    }

    try {
      const res = await getUsersByAdmin({
        page: currentPage,
        limit: usersPerPage,
        createdFrom: dateFrom || undefined,
        createdTo: adjustedDateTo?.toISOString() || undefined,
        role_id: getRoleIdByName(roleFilter) || undefined,
        search: searchKeyword
      }, session?.user?.accessToken || "");

      if (res?.statusCode === HttpStatusCode.Ok) {
        setUsers(res.data.data);
        setTotalItems(res.data.pagination.totalItems);
        setTotalPages(res.data.pagination.totalPages);
      }
      else {
        setUsers([]);
        setAlertMessage(`${transWithFallback('errorWhenFetchUsers', 'Lỗi xảy ra khi lấy dữ liệu người dùng')}: ${res.message}`);
        setAlertOpen(true);
      }
    } catch (error) {
      console.error('Error when fetch users data:', error);
      setAlertMessage(`${transWithFallback('errorWhenFetchUsers', 'Lỗi xảy ra khi lấy dữ liệu người dùng')}: ${error}`);
      setAlertOpen(true);
    } finally {
      setIsLoadingUsers(false);
    }
  }, [searchKeyword, roleFilter, currentPage, dateFrom, dateTo, usersPerPage]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const sortedUsers = sortUsers(users, sortConfig);
  const paginatedData = sortedUsers;

  const handleSort = (key: keyof UserAdminData) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      } else {
        return { key, direction: 'asc' };
      }
    });
  };

  const handleStatusClick = (user: UserAdminData) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleConfirmStatusChange = async () => {
    if (!selectedUser) return;
    const newStatus = selectedUser.status === UserStatus.ACTIVE ? UserStatus.BLOCKED : UserStatus.ACTIVE;

    try {
      setIsLoadingAction(true);
      const res = await updateUserStatus(selectedUser.email, newStatus, session?.user?.accessToken || "");

      if (res?.statusCode === 200) {
        toast.success(transWithFallback('updateStatusSuccess', 'Cập nhật trạng thái tài khoản thành công'))
        setIsDialogOpen(false);
        fetchUsers();
      }
      else {
        toast.error(`${transWithFallback('errorWhenUpdateAccountStatus', 'Lỗi khi cập nhật trạng thái tài khoản')}: ${res.message}`)
        setIsDialogOpen(false);
      }
    } catch (error) {
      toast.error(`${transWithFallback('errorWhenUpdateAccountStatus', 'Lỗi khi cập nhật trạng thái tài khoản')}: ${error}`);
      setIsDialogOpen(false);
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    return !msg || msg.startsWith('common.') ? fallback : msg;
  };

  return (
    isLoadingUsers ? (
      <AccountSkeletonLoading />
    ) : (
      <>
        <div className="table-account-management overflow-x-auto rounded-xl shadow-md mt-6">
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr className="bg-[#0C4762] text-white text-sm text-left rounded-t-lg">
                <th className="px-4 py-3 text-center">{transWithFallback("noStt", "STT")}</th>
                <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort('name')} >
                  {transWithFallback('fullName', 'Họ và tên')} <SortIcon field="name" sortConfig={sortConfig} />
                </th>
                <th className="px-4 py-3 cursor-pointer">
                  Email
                </th>
                <th className="px-4 py-3 cursor-pointer">
                  {transWithFallback('role', 'Vai trò')}
                </th>
                <th className="px-4 py-3 cursor-pointer text-center" onClick={() => handleSort('created_at')}>
                  {transWithFallback('createdDate', 'Ngày tạo')} <SortIcon field="created_at" sortConfig={sortConfig} />
                </th>
                <th className="px-4 py-3 cursor-pointer text-center" >
                  {transWithFallback('status', 'Trạng thái')}
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {paginatedData.length > 0 ? (
                paginatedData.map((user, index) => (
                  <tr key={user.id ?? index} className="border-t border-gray-200 hover:bg-gray-200 transition-colors duration-200">
                    <td className="px-4 py-3 text-center border-r border-gray-200">{(currentPage - 1) * usersPerPage + index + 1}</td>
                    <td className="px-4 py-3 border-r border-gray-200 cursor-pointer"
                      onClick={() => router.push(`/admin/account-management/${user.id}`)}>
                      {user.name}
                    </td>
                    <td className="px-4 py-3 border-r border-gray-200">{user.email}</td>
                    <td className="px-4 py-3 border-r border-gray-200">{user.role.role_name}</td>

                    <td className="px-4 py-3 text-center border-r border-gray-200">
                      {new Date(user.created_at).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-4 py-3 text-center cursor-pointer">
                      <span
                        title={`${transWithFallback('changeTo', 'Chuyển thành')} ${user.status === UserStatus.ACTIVE ? UserStatus.BLOCKED : UserStatus.ACTIVE}`}
                        className={`min-w-[100px] text-center inline-block px-4 py-1 rounded-full text-xs font-semibold border 
                                                        ${user.status === UserStatus.ACTIVE
                            ? 'bg-teal-100 text-teal-500 border-teal-500'
                            : 'bg-gray-200 text-gray-500 border-gray-500'}`}
                        onClick={() => handleStatusClick(user)}>
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="text-center py-4 text-gray-500">
                    {users.length === 0 && transWithFallback('noUserMatchForKeyword', 'Không có tài khoản nào khớp với từ khóa tìm kiếm')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <EventPagination
          currentPage={currentPage}
          totalItems={totalItems}
          eventsPerPage={usersPerPage}
          onPageChange={handlePageChange}
          setEventsPerPage={(num) => {
            setUsersPerPage(num);
            setCurrentPage(1);
          }}
        />

        {selectedUser && (
          <ConfirmStatusDialog
            open={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            onConfirm={handleConfirmStatusChange}
            isLoading={isLoadingAction}
            currentStatus={selectedUser.status}
          />
        )}

        <AlertDialog
          open={alertOpen}
          onClose={() => setAlertOpen(false)}
          message={alertMessage}
        />
      </>
    )
  )
}
