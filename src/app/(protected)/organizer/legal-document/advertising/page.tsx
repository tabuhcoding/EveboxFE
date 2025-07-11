"use client";

/* Package System */
import 'tailwindcss/tailwind.css';
import { useEffect, useState, ChangeEvent } from "react";
import { useRouter } from 'next/navigation';
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { ArrowLeft } from "lucide-react"

/* Package Application */
import { handleFileChange as handleFileChangeUtil } from '../libs/handleFileChange';

export default function PdfViewerPage() {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [originName, setOriginName] = useState<string | null>("");
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        setIsClient(true);

        // Gọi API lấy đường dẫn file PDF hiện tại
        const url = "https://raw.githubusercontent.com/huethanh-2805/term-evebox/main/8.Evebox_Hang_hoa_dich_vu_cam_quang_cao_BTC.pdf";

        const checkPdf = async () => {
            try {
                const res = await fetch(url, { method: 'HEAD' });
                if (!res.ok) {
                    throw new Error("Không thể tải PDF từ URL.");
                }
                setPdfUrl(url);
            } catch (err) {
                setError(err as Error);
            }
        };

        checkPdf();
    }, []);

    if (error) throw error;

    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    // Nút thay đổi content -> call api để upload
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        handleFileChangeUtil(e, setPdfUrl, setFileName, setOriginName, setError);
    };

    return isClient ? (
        <div>
            <div className="flex items-center space-x-2">
                <ArrowLeft onClick={() => router.back()} size={30} className="text-[#0C4762] cursor-pointer hover:opacity-80 transition-opacity duration-200" />
                <h1 className=" text-2xl font-bold text-[#0C4762]">Danh mục hàng hóa, dịch vụ cấm quảng cáo</h1>
            </div>

            <div className="border-t-2 border-[#0C4762] mt-2 mb-6"></div>

            {/* Nút thay đổi content */}
            <div className="change-content-btn mb-6">
                <label title={originName || "Chọn file PDF"} htmlFor="pdf-upload" className="bg-[#51DACF] text-[#0C4762] px-6 py-3 rounded-lg cursor-pointer hover:bg-[#085a73] hover:text-white transition-colors duration-200">
                    {fileName ? `Đã chọn file: ${fileName}` : "Chọn File PDF"}
                </label>
                <input className="hidden" id="pdf-upload" type="file" accept=".pdf" onChange={handleFileChange} />
            </div>

            {pdfUrl ? (
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.js">
                    <div style={{ height: "100vh" }}>
                        <Viewer fileUrl={pdfUrl} plugins={[defaultLayoutPluginInstance]} />
                    </div>
                </Worker>
            ) : (
                <p>Loading PDF...</p>
            )}
        </div>
    ) : (
        <p>Loading...</p>
    );
}
