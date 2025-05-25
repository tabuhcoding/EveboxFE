"use client";

/* Packagae system */
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { gatewayService } from "services/instance.service";

/* Package application */

export default function useAvatar({ avatar_id }: { avatar_id?: number }) {
    const imageUrlDefault = process.env.NEXT_PUBLIC_DEFAULT_AVATAR_URL || ""; 
    const { data: session } = useSession();
    const [imageUrl, setImageUrl] = useState<string>(imageUrlDefault);
    if (!avatar_id) {
        return { imageUrl };
    }
    
    const fetchAvatar = async () => {
        try {
            const response = await gatewayService.get(`/api/images/${avatar_id}`);
            if (response.status !== 200) {
                throw new Error("Failed to fetch images");
            }
            setImageUrl(response.data.data.imageUrl);
        } catch (err) {
            console.error("Profile fetch error:", err);
        }
    };

    useEffect(() => {
        if (session?.user?.accessToken) {
            fetchAvatar();
        }
    }, [session]);

    return {
        imageUrl
    };
}