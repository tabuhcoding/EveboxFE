"use client";

import { useState, useEffect } from "react";
import 'tailwindcss/tailwind.css';
import Sidebar from "../create-event/_components/sidebar";
import { Search } from 'lucide-react';
import { FaEdit, FaTrash } from "react-icons/fa";

export default function Report() {
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const files = [
        { id: "#AD-001234", file: "user1@example.com", createdDate: "26/10/2024", creator: "A", processing: "C" },
        { id: "#AD-001235", file: "user2@example.com", createdDate: "30/02/2025", creator: "B", processing: "D" }
    ];

    const toggleCheckbox = (fileId: string) => {
        setSelectedFiles((prev) =>
            prev.includes(fileId) ? prev.filter((id) => id !== fileId) : [...prev, fileId]
        );
    };

    if (!mounted) return null; // Ngăn SSR render khác với Client


    return (
        <main>
            <div className="flex min-h-screen bg-gray-100">
                <div className="w-64 bg-gray-900 text-white">
                    <Sidebar/>
                </div>
                <div className="flex-1 p-6">
                    <h1 className=" text-2xl font-bold text-[#0C4762]">Quản lý báo cáo</h1>
                    <div className="border-t-2 border-[#0C4762] mt-2"></div>

                    {/* Thanh tìm kiếm và các tab */}
                    <div className="mt-6 flex justify-between items-center">
                        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden w-1/3 bg-white">
                            <input
                                type="text"
                                className="w-full px-3 py-2 outline-none"
                                placeholder="Tìm kiếm tên file"
                            />
                            <button className="bg-[#51DACF] px-3 py-2 border-l border-gray-300 transition duration-200 hover:bg-[#3AB5A3]">
                                <Search size={24} color="white" />
                            </button>
                        </div>
                    </div>

                    {/* Danh sách sự kiện */}
                    <table className="w-full border mt-6">
                        <thead>
                            <tr className="bg-[#0C4762] text-white text-left">
                                <th className="py-2 px-2 text-left">
                                    <input
                                        type="checkbox"
                                        onChange={(e) =>
                                            setSelectedFiles(e.target.checked ? files.map((o) => o.id) : [])
                                        }
                                        checked={selectedFiles.length === files.length}
                                    />
                                </th>
                                <th>File</th>
                                <th>Ngày tạo</th>
                                <th>Người tạo</th>
                                <th>Trạng thái xử lí</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {files.map((file) => (
                                <tr key={file.id} className="border-t">
                                    <td className="py-2 px-2">
                                        <input
                                            type="checkbox"
                                            onChange={() => toggleCheckbox(file.id)}
                                            checked={selectedFiles.includes(file.id)}
                                        />
                                    </td>
                                    <td className="py-2">{file.file}</td>
                                    <td>{file.createdDate}</td>
                                    <td>{file.creator}</td>
                                    <td>{file.processing}</td>
                                    <td>
                                        <button className="text-blue-500 hover:text-blue-700 mx-1">
                                            <FaEdit />
                                        </button>
                                        <button className="text-red-500 hover:text-red-700 mx-1">
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}