"use client";

import { useState } from "react";
import axios from "axios";
import Markdown from "react-markdown";
import { useTranslations } from "next-intl";

interface AIAnalystProps {
  eventId: string;
}

export function AIAnalyst({ eventId }: AIAnalystProps) {
  const t = useTranslations('common');
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith('common.')) return fallback;
    return msg;
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL!}/api/org/statistics/analytic-ai/${eventId}`, { query });
      setResult(res.data.data || transWithFallback('noResult', 'Không có kết quả.'));
    } catch (error) {
      setLoading(false);
      console.error("Fetch AI error:", error);
      setResult(`❌ ${transWithFallback('errorWhenAnalyze', 'Có lỗi xảy ra khi gửi yêu cầu.')}`)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold text-[#0C4762] mb-2">
        {transWithFallback('AIStatisticsAnalystWithAI', 'Phân tích thống kê của bạn với AI')}
      </h3>

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

      {result && (
        <div className="overflow-x-auto border border-gray-300 shadow rounded-lg p-4">
          <div className="prose max-w-none">
            <Markdown>{result}</Markdown>
          </div>
        </div>
      )}
    </div>
  );
}
