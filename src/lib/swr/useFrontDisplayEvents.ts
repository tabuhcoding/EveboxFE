"use client"

import useSWR from "swr";

import { getFrontDisplayEvents } from "services/event.service";
import { FrontDisplayResponse } from "types/models/dashboard/frontDisplay";

export const useFrontDisplayEvents = () => {
  const fetcher = async (): Promise<FrontDisplayResponse> => {
    const res = await getFrontDisplayEvents();
    return res;
  };

  const { data, error, isLoading, mutate } = useSWR<FrontDisplayResponse>(
    "front-display-events", // Key cho SWR
    fetcher,
    {
      revalidateOnFocus: false, // Không tự động revalidate khi focus lại trang
    }
  );

  return {
    // frontDisplayEvents: data?.data ?? [], // Trả về mảng sự kiện từ response
    frontDisplayEvents: data?.data, // Trả về mảng sự kiện từ response
    isLoading,
    error,
    mutate,
  };
};