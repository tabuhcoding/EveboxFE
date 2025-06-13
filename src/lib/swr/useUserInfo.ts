import { useSession } from 'next-auth/react';
import useSWR from 'swr';

import { gatewayService } from '../../services/instance.service';
import { UserInfo, UserInfoResponse } from '../../types/models/userInfo';

const fetcher = async (url: string): Promise<UserInfo> => {
  const response = await gatewayService.get<UserInfoResponse>(url);
  const userData = response.data.data;
  
  if (userData?.name) {
    localStorage.setItem("name", userData.name);
  }
  
  return userData;
};

export const useUserInfo = () => {
  const { data: session } = useSession();
  
  const { data: userInfo, error, isLoading, mutate } = useSWR(
    session?.user?.accessToken ? '/api/user/me' : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 300000, 
      errorRetryCount: 2,
      shouldRetryOnError: (error) => {
        return ![401, 403].includes(error?.response?.status);
      }
    }
  );

  return {
    userInfo,
    isLoading,
    userInfoFetched: userInfo !== undefined,
    error,
    refetch: mutate,
    updateUserInfo: (newData: Partial<UserInfo>) => {
      if (userInfo) {
        mutate({ ...userInfo, ...newData }, false);
      }
    }
  };
};