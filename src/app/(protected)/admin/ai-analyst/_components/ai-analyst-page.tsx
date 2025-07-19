'use client';

/* Package System */
import axios from "axios";
import { useTranslations } from "next-intl";
import { useState } from "react";
import 'tailwindcss/tailwind.css';
import Markdown from "react-markdown";

/* Package Application */

export default function AIAnalystPage() {
  const t = useTranslations('common');
  const showingId = 'clone31370137035742231370';

  const [query, setQuery] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL!}/api/org/statistics/summary-ai/${showingId}`, { query });
      setResult(res.data.data || transWithFallback('noResult', 'Không có kết quả.'));
    } catch (error) {
      console.error("Fetch AI error:", error);
      setResult(`❌ ${transWithFallback('errorWhenAnalyze', 'Có lỗi xảy ra khi gửi yêu cầu.')}`)
    } finally {
      setLoading(false);
    }
  };

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith('common.')) return fallback;
    return msg;
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-[#0C4762] mb-1">{transWithFallback('AIRevenueAnalyst', 'Phân tích doanh thu với AI')}</h1>
      <div className="border-t-2 border-[#0C4762] mt-2"></div>

      <div className="mt-8">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Nhập câu hỏi"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-4 py-2 bg-[#0C4762] text-white rounded-md hover:bg-[#09394f] transition disabled:opacity-50"
          >
            {loading ? transWithFallback('analyzing', 'Đang phân tích...') : transWithFallback('analysis', 'Phân tích')}
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#0C4762]" />
          </div>
        ) : result && (
          <div className="overflow-x-auto border border-gray-300 shadow rounded-lg p-4">
            <div className="prose max-w-none">
              <Markdown>{result}</Markdown>
            </div>
          </div>
        )}
      </div>
    </>
  )
}