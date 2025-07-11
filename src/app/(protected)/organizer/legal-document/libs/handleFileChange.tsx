import { ChangeEvent } from "react";

export function handleFileChange(
    e: ChangeEvent<HTMLInputElement>,
    setPdfUrl: (url: string) => void,
    setFileName: (name: string) => void,
    setOriginName: (name: string) => void,
    setError: (err: Error | null) => void
) {
    const file = e.target.files?.[0];
    if (file) {
        // Tạo URL cho file PDF mới
        const fileUrl = URL.createObjectURL(file);
        setPdfUrl(fileUrl);
        setError(null);

        setOriginName(file.name);

        const maxLength = 25; // Giới hạn tên file hiển thị (giới hạn 25 ký tự)
        const truncatedFileName =
            file.name.length > maxLength
                ? `${file.name.substring(0, maxLength)}...`
                : file.name;

        setFileName(truncatedFileName);
    }
}
