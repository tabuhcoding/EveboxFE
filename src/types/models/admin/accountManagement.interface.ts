import { BaseApiResponse, PaginationData } from "@/types/baseApiResponse";

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED',
}

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
  SYSTEM_ADMIN = 'SYSTEM_ADMIN',
  ORGANIZER = 'ORGANIZER',
}

export enum UserRoleNum {
  SYSTEM_ADMIN = 0,
  ADMIN = 1,
  ORGANIZER = 2,
  CUSTOMER = 3,
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: number;
  created_at: string;
  status: UserStatus;
  avatar_id?: number;
};

export interface Role {
  id: number;
  role_name: string;
}

export interface UserAdminData {
  id: string;
  name: string;
  email: string;
  status: string;
  created_at: string;
  role: Role;
}

export interface UserAdminApiResponse {
  data: UserAdminData[];
  pagination: PaginationData;
}

export interface UserAdminParams {
  page: number;
  limit: number;
  search?: string;
  createdFrom?: string;
  createdTo?: string;
  status?: string;
  role_id?: number;
}

export interface UsersData {
  users: User[];
  total: number;
}

export type UsersResponse = BaseApiResponse<UsersData>;

export interface ConfirmActiveProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  currentStatus: string;
}

export interface SortConfig<T> {
  key: keyof T;
  direction: 'asc' | 'desc';
}

export interface SortIconProps<T> {
  field: keyof T;
  sortConfig: SortConfig<T> | null;
}

//Search 
export interface SearchBarProps {
  onSearch: (keyword: string) => void;
}

export interface AccountTableProps {
  searchKeyword: string;
  roleFilter: string;
  dateFrom: string;
  dateTo: string;
}

//Filter
export interface FilterProps {
  roleFilter: string;
  onRoleChange: (value: string) => void;
  dateFrom: string;
  dateTo: string;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onReset: () => void;
}

export interface ConfirmStatusDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  currentStatus: string;
  isLoading: boolean;
}

export interface FormInputProps {
  label: string;
  value: string;
  disabled?: boolean;
  type?: string;
}
