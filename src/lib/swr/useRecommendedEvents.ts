"use client"

import useSWR from "swr";

import { getRecommendedEvents } from "services/event.service";
import { BaseApiResponse } from "types/baseApiResponse";

// Hook sử dụng SWR để fetch dữ liệu recommended events
export const useRecommendedEvents = (timeWindow: string) => {
  const fetcher = async (): Promise<BaseApiResponse<Event[]>> => {
    const res = await getRecommendedEvents(timeWindow);
    return res;
  };

  const { data, error, isLoading, mutate } = useSWR<BaseApiResponse<Event[]>>(
    ["recommended-events", timeWindow],
    fetcher,
    {
      revalidateOnFocus: false, // Không tự động revalidate khi focus lại trang
    }
  );

  return {
    recommendedEvents: data?.data ?? [], 
    isLoading,
    error,
    mutate,
  };
};