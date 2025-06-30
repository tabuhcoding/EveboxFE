import { Category } from "./eventManagement.interface";

export interface EventSpecial {
  id: number;
  title: string;
  imgPosterUrl: string;
  isOnlyOnEve: boolean;
  isSpecial: boolean;
  categoryIds: Category[];
}

export interface EventSpecialTableProps {
  searchKeyword: string;
  categoryFilter: string | number
}

export interface SpecialEventApiResponse {
  data: EventSpecial[];
  pagination: {
    totalItems: number;
    totalPages: number;
    page: number;
    limit: number;
  };
}

export interface SpecialEventAdminParams {
  isSpecial?: boolean;
  isOnlyOnEve?: boolean;
  page: number;
  categoryId?: number;
  limit: number;
  search?: string;
}

//Filter
export interface FilterProps {
  categoryFilter: number | "" | "__onlyOnEve" | "__special";
  onCategoryChange: (value: number | "" | "__onlyOnEve" | "__special") => void;
  onReset: () => void;
}

export interface OptionType {
  label: string;
  value: string | number;
  isSeparator?: boolean;
};