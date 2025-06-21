import { useState } from "react";
import { gatewayService } from "services/instance.service";

export const useEventImageUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File) => {
    try {
      setIsUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);

      const res = await gatewayService.post("/api/image/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.status !== 201) throw new Error("Upload failed");

      return {
        imageUrl: res.data.data.imageUrl,
        imageId: res.data.data.id
      };
    } catch (err) {
      setError("Upload failed");
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadImage, isUploading, error };
};
