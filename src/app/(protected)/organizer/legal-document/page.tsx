import 'tailwindcss/tailwind.css';
import Link from 'next/link';

export default function Event() {

    return (
        <main>
            <h1 className="text-2xl font-bold text-[#0C4762]">Điều khoản cho Ban tổ chức</h1>
            <div className="border-t-2 border-[#0C4762] mt-2"></div>

            {/* Điều khoản cho Ban tổ chức */}
            <div className="bg-[#0C4762] p-4 mt-6 rounded-lg">
                <div className="bg-white text-[#0C4762] p-4 rounded-lg">
                    <ol className="list-decimal list-inside space-y-2">
                        <li>
                            <Link href="/organizer/legal-document/business" className="text-[#0C4762] hover:underline hover:text-blue-800">
                                Danh mục hàng hoá, dịch vụ cấm kinh doanh
                            </Link>
                        </li>
                        <li>
                            <Link href="/organizer/legal-document/advertising" className="text-[#0C4762] hover:underline hover:text-blue-800">
                                Danh mục hàng hoá, dịch vụ cấm quảng cáo
                            </Link>
                        </li>
                        <li>
                            <Link href="/organizer/legal-document/contentImage" className="text-[#0C4762] hover:underline hover:text-blue-800">
                                Quy định kiểm duyệt nội dung & hình ảnh
                            </Link>
                        </li>
                    </ol>
                </div>
            </div>
        </main>
    );
}