export interface Image {
  id: number;
  imageUrl: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface EventSpecial {
  id: number;
  title: string;
  Images_Events_imgPosterIdToImages?: Image | null;
  isOnlyOnEve: boolean;
  isSpecial: boolean;
  categoryIds: Category[];
}

export interface EventSpecialTableProps {
  searchKeyword: string;
  categoryFilter: string | number
}

//Pagination
export interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPrevious: () => void;
  onNext: () => void;
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

export interface SortConfig<T> {
  key: keyof T;
  direction: 'asc' | 'desc';
}

//Search
export interface SearchBarProps {
  onSearch: (keyword: string) => void;
}
