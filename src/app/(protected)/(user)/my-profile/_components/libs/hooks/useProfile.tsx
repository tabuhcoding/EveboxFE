"use client";

/* Packagae system */
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

/* Package application */
import { gatewayService } from "services/instance.service";
import { UserInfo } from "types/models/userInfo";

export default function useProfile() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<UserInfo | null>(null);

  const fetchProfile = async () => {
    try {
      const response = await gatewayService.get("/api/user/me");
      setProfile(response.data.data);
    } catch (err) {
      console.error("Profile fetch error:", err);
    } 
  };
  
  useEffect(() => {
    if (session?.user?.accessToken) {
      fetchProfile();
    } 
  }, [session]);

  const updateProfile = async (updatedData: Partial<UserInfo>) => {
    try {
      const response = await gatewayService.put("/api/user/me", updatedData);
      setProfile(prev => ({ ...prev, ...response.data.data }));
      return { success: true };
    } catch (err) {
      console.error("Profile update error:", err);
      return { success: false };
    } 
  };

  return {
    profile,
    updateProfile,
    refresh: fetchProfile,
  };
}