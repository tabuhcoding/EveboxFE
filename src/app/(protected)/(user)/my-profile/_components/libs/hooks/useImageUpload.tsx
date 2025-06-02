"use client";

/* Package system */
import axios from "axios";
import { useState, useRef, useEffect } from "react";

/* Package application */
import { gatewayService } from "services/instance.service";

import useProfile from "./useProfile";

type GalleryImage = {
  id: number;
  imageUrl: string;
};

export const useImageUpload = (onChange?: (avatarId: number) => void) => {
    const {updateProfile} = useProfile();
    const [image, setImage] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    // TODO: replace any with a proper type if known
    const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | undefined>(undefined);
    const [imageId, setImageId] = useState<number | 0>(0);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isNewImage, setIsNewImage] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const dialogRef = useRef<HTMLDivElement>(null);

    const fetchUserImages = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await gatewayService.get("/api/image");

            if (response.status !== 200) {
                throw new Error("Failed to fetch images");
            }
            setGalleryImages(response.data.data);
        } catch (err) {
            let errorMessage = "Failed to fetch images";

            if (err instanceof Error) {
                errorMessage = err.message;
            } else if (typeof err === "string") {
                errorMessage = err;
            } else if (axios.isAxiosError(err)) {
                errorMessage = err.response?.data?.message || err.message;
            }

            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleImageSelection(file, 0 ,true);
        }
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
                setIsDialogOpen(false);
            }
        };

        if (isDialogOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isDialogOpen]);

    const uploadImage = async (file: File) => {
        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const uploadResponse = await gatewayService.post('/api/image/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', 
                    'X-Requested-With': 'XMLHttpRequest',
                }
            });

            if (uploadResponse.status !== 201) {
                throw new Error('Upload failed');
            }

            setGalleryImages(prev => [uploadResponse.data.data, ...prev]);
            await changeAvatar(uploadResponse.data.data.imageUrl, uploadResponse.data.data.id);

            return uploadResponse.data.data.imageUrl;
        } finally {
            setIsUploading(false);
        }
    };

    const changeAvatar = async (imageUrl: string, imageId: number) => {
        try {
            setIsLoading(true);
            setImageId(imageId);
            
            const result = await updateProfile({
                avatar_id: imageId,
            });

            if (result.success) {
                setImage(imageUrl);  
                if (onChange) {
                    onChange(imageId);
                }
            } else {
                setError("Cập nhật ảnh đại diện thất bại");
            } 
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageSelection = (fileOrUrl: File | string, imageId: number, isNew: boolean) => {
        if (isNew) {
            const file = fileOrUrl as File;
            const previewUrl = URL.createObjectURL(file);
            setPreviewImage(previewUrl);
            setSelectedFile(file);
        } else {
            setPreviewImage(fileOrUrl as string);
            setImageId(imageId);
            setSelectedFile(null);
        }
        setIsNewImage(isNew);
        setIsPreviewOpen(true);
    };

    const confirmImage = async () => {
        if (!previewImage) return;

        try {
            if (isNewImage && selectedFile) {
                await uploadImage(selectedFile);
            } else {
                await changeAvatar(previewImage, imageId);
            }
        } finally {
            setIsPreviewOpen(false);
            setPreviewImage(undefined);
            setSelectedFile(null);
            if (isNewImage && previewImage) {
                URL.revokeObjectURL(previewImage);
            }
        }
    };

    return {
        image,
        isDialogOpen,
        setIsDialogOpen,
        dialogRef,
        handleImageChange,
        fetchUserImages,
        galleryImages,
        isLoading,
        error,
        isUploading,
        previewImage,
        isPreviewOpen,
        setIsPreviewOpen,
        handleImageSelection,
        confirmImage,
    };
};