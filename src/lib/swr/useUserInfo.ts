import useSWR from "swr";

import { useAuth } from "contexts/auth.context";
import { gatewayService } from "../../services/instance.service";
import { UserInfo, UserInfoResponse } from "../../types/models/userInfo";

const fetcher = async (url: string): Promise<UserInfo> => {
  const response = await gatewayService.get<UserInfoResponse>(url);
  const userData = response.data.data;

  if (userData?.name) {
    localStorage.setItem("name", userData.name);
  }

  return userData;
};

export const useUserInfo = () => {
  const { isAuthenticated, user } = useAuth();

  const {
    data: userInfo,
    error,
    isLoading,
    mutate,
  } = useSWR(
    // Chỉ fetch khi authenticated và có accessToken từ AuthContext
    isAuthenticated && user?.accessToken ? "/api/user/me" : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false, // Tắt revalidate on reconnect
      dedupingInterval: 600000, // Tăng lên 10 phút
      errorRetryCount: 1, // Giảm retry
      refreshInterval: 0, // Tắt auto refresh
      shouldRetryOnError: (error) => {
        return ![401, 403].includes(error?.response?.status);
      },
    }
  );

  return {
    userInfo,
    isLoading: isLoading && isAuthenticated, // Chỉ loading khi authenticated
    userInfoFetched: userInfo !== undefined,
    error,
    refetch: mutate,
    updateUserInfo: (newData: Partial<UserInfo>) => {
      if (userInfo) {
        mutate({ ...userInfo, ...newData }, false);
      }
    },
  };
};
