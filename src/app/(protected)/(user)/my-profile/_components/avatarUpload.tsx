"use client";

import { Camera } from "lucide-react";
import { useTranslations } from 'next-intl';
import { useRef, useState } from "react";

import { CircularProgress } from "./circularProgress";
import useAvatar from "./libs/hooks/useAvatar";
import { useImageUpload } from "./libs/hooks/useImageUpload";

export default function AvatarUpload({ initAvatarId, onChange }: { initAvatarId?: number; onChange?: (avatarId: number) => void }) {
    const {
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
    } = useImageUpload(onChange);

    const { imageUrl } = useAvatar({ avatar_id: initAvatarId });

    const cameraInputRef = useRef<HTMLInputElement>(null);
    const [viewMode, setViewMode] = useState<"menu" | "gallery">("menu");
    const handleOpenGallery = async () => {
        await fetchUserImages();
        setViewMode("gallery");
    };

    const t = useTranslations('common');

    const transWithFallback = (key: string, fallback: string) => {
        const msg = t(key);
        if (!msg || msg.startsWith('common.')) return fallback;
        return msg;
    };

    return (
        <div className="relative w-14 h-14">
            {/* Loading overlay cho avatar */}
            {(isUploading || isLoading) && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center z-10">
                    <CircularProgress size={24} className="text-white" />
                </div>
            )}

            {/* Avatar preview */}
            <img
                src={imageUrl || "/images/default_avt.png"}
                alt="Avatar"
                className="w-full h-full rounded-full border border-gray-300 object-cover"
            />

            {/* Hidden input cho camera */}
            <input
                type="file"
                ref={cameraInputRef}
                accept="image/*"
                capture="user"
                className="hidden"
                onChange={handleImageChange}
            />

            {/* Nút camera */}
            <button
                type="button"
                onClick={() => {
                    setIsDialogOpen(true);
                    setViewMode("menu");
                }}
                className="absolute bottom-0 right-0 bg-white p-1 rounded-full border shadow cursor-pointer"
            >
                <Camera size={16} className="text-gray-600" />
            </button>

            {/* Dialog chính */}
            {isDialogOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div
                        ref={dialogRef}
                        className="bg-white rounded-lg p-6 w-[90%] max-w-2xl shadow-xl"
                    >
                        {viewMode === "menu" ? (
                            // Menu lựa chọn
                            <>
                                <h3 className="text-lg font-medium mb-4">{transWithFallback('selectImageSource', 'Chọn ảnh')}</h3>
                                <div className="space-y-3">
                                    <button
                                        type="button"
                                        onClick={() => cameraInputRef.current?.click()}
                                        className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                                    >
                                        {transWithFallback('uploadImage', 'Tải ảnh lên')}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleOpenGallery}
                                        className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                                    >
                                        {transWithFallback('chooseUploadedImages', 'Chọn từ ảnh đã được tải lên')}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsDialogOpen(false)}
                                        className="w-full px-4 py-2 text-red-500 hover:bg-gray-100 rounded-md transition-colors"
                                    >
                                        {transWithFallback('cancel', 'Đóng')}
                                    </button>
                                </div>
                            </>
                        ) : (
                            // Gallery ảnh
                            <>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-medium">{transWithFallback('yourPhotos', 'Ảnh của bạn')}</h3>
                                    <div className="space-x-2">
                                        <button
                                            onClick={() => setViewMode("menu")}
                                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                                        >
                                            {transWithFallback('back', 'Quay lại')}
                                        </button>
                                        <button
                                            onClick={() => setIsDialogOpen(false)}
                                            className="px-4 py-2 text-red-500 hover:bg-gray-100 rounded-md"
                                        >
                                            {transWithFallback('close', 'Đóng')}
                                        </button>
                                    </div>
                                </div>

                                {isLoading && (
                                    <div className="text-center py-8">
                                        <CircularProgress size={32} className="text-blue-500" />
                                        <p className="mt-2">{transWithFallback('loadingImage', 'Đang tải ảnh lên')}</p>
                                    </div>
                                )}

                                {error && (
                                    <div className="text-red-500 text-center py-8">{error}</div>
                                )}

                                {!isLoading && !error && (
                                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[60vh] overflow-y-auto">
                                        {galleryImages.map((img) => (
                                            <div
                                                key={img.id}
                                                className="relative aspect-square cursor-pointer"
                                                role="button"
                                                tabIndex={0}
                                                onClick={() => handleImageSelection(img.imageUrl, img.id, false)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                        handleImageSelection(img.imageUrl, img.id, false);
                                                    }
                                                }}
                                            >
                                                <img
                                                    src={img.imageUrl}
                                                    alt="User uploaded"
                                                    className="w-full h-full object-cover rounded-lg hover:opacity-80 border"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Preview Dialog */}
            {isPreviewOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-[90%]">
                        <div className="relative aspect-square">
                            <img
                                src={previewImage}
                                alt="Preview"
                                className="w-full h-full object-contain rounded-lg"
                            />

                            {/* Loading overlay cho preview */}
                            {(isUploading || isLoading) && (
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                                    <CircularProgress size={48} className="text-white" />
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-4 mt-6">
                            <button
                                onClick={() => setIsPreviewOpen(false)}
                                className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                                disabled={isUploading || isLoading}
                            >
                                {transWithFallback('cancel', 'Đóng')}
                            </button>
                            <button
                                onClick={confirmImage}
                                className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md disabled:opacity-50"
                                disabled={isUploading || isLoading}
                            >
                                {isUploading ? transWithFallback('uploading', 'Đang tải...') : transWithFallback('confirm', 'Xác nhận')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
