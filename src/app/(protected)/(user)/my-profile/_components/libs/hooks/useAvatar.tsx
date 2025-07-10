"use client";

/* Packagae system */
import { useEffect, useState } from "react";

import { gatewayService } from "services/instance.service";

/* Package application */
import { useAuth } from "@/contexts/auth.context";

export default function useAvatar({ avatar_id }: { avatar_id?: number }) {
    const imageUrlDefault = process.env.NEXT_PUBLIC_DEFAULT_AVATAR_URL || ""; 
    const { session } = useAuth();
    const [imageUrl, setImageUrl] = useState<string>(imageUrlDefault);

    useEffect(() => {
        const fetchAvatar = async () => {
            try {
                const response = await gatewayService.get(`/api/image/${avatar_id}`);
                if (response.status !== 200) {
                    throw new Error("Failed to fetch images");
                }
                setImageUrl(response.data.data.imageUrl);
            } catch (err) {
                console.error("Profile fetch error:", err);
            }
        };

        if (avatar_id && session?.user?.accessToken) {
            fetchAvatar();
        }
    }, [avatar_id, session]);

    return { imageUrl };
}