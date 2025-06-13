"use client";

/* Package system */
import { useState } from "react";

/* Package application */
import { useUserInfo } from "lib/swr/useUserInfo";
import { gatewayService } from "services/instance.service";
import { UserInfo } from "types/models/userInfo";

export default function useProfile() {
  const [isUpdating, setIsUpdating] = useState(false);
  const { userInfo, refetch, updateUserInfo } = useUserInfo();

  const updateProfile = async (updatedData: Partial<UserInfo>) => {
    setIsUpdating(true);
    
    try {
      // Optimistic update
      updateUserInfo(updatedData);
      
      const response = await gatewayService.put("/api/user/me", updatedData);
      
      // Revalidate data từ server
      await refetch();
      
      return { success: true, data: response.data.data };
    } catch (err) {
      console.error("Profile update error:", err);
      
      // Revert optimistic update on error
      await refetch();
      
      return { success: false, error: err };
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    profile: userInfo,
    updateProfile,
    isUpdating,
    refresh: refetch,
  };
}