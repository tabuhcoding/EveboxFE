"use client"

import useSWR from "swr";

import { getAllCategories } from "services/event.service";
import { Category } from "types/models/dashboard/frontDisplay";

export const useCategories = () => {
  const fetcher = async (): Promise<Category[]> => {
    const res = await getAllCategories();
    return res;
  };

  const { data, error, isLoading, mutate } = useSWR<Category[]>(
    "categories", // Key cho SWR
    fetcher,
    {
      revalidateOnFocus: false, // Không tự động revalidate khi focus lại trang
    }
  );

  return {
    // categories: data ?? [], 
    categories: data, 
    isLoading,
    error,
    mutate,
  };
};