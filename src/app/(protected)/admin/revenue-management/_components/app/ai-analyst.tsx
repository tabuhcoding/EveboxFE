"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Markdown from "react-markdown";
import { useTranslations } from "next-intl";

interface AIAnalystProps {
  type: string;
}

interface AIAnalystResponse {
  query: string;
  result: string;
  expanded: boolean;
  created_at: Date;
}

export function AIAnalyst({ type }: AIAnalystProps) {
  const t = useTranslations('common');
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiAnalystResponse, setAIAnalystResponse] = useState<AIAnalystResponse[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [dontAskAgain, setDontAskAgain] = useState(false);
  const limit = 5;

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith('common.')) return fallback;
    return msg;
  };

  useEffect(() => {
    setAIAnalystResponse([]);
    setPage(1);
    setTotalPages(1);
    setResult(null);
    setLoading(false);
  }, [type]);

  useEffect(() => {
    const fetchStoredResponses = async () => {
      setLoading(true);
        try {
          const storedResponses = await axios.get(`${process.env.NEXT_PUBLIC_API_URL!}/api/admin/revenue-${type}-ai`,{
          params: { page, limit }
        });

        if (storedResponses.data && storedResponses.data.data) {
          const responses = storedResponses.data.data.map((item: any) => ({
            query: item.query,
            result: item.content,
            expanded: false,
            created_at: new Date(item.created_at),
          }));
          setAIAnalystResponse([
            ...aiAnalystResponse,
            ...responses
          ]);
          setTotalPages(storedResponses.data.pagination.totalPages || 1);
        }
      } catch (error) {
        console.error("Error fetching stored responses:", error);
        setResult(`❌ ${transWithFallback('errorWhenFetchStoredResponses', 'Có lỗi xảy ra khi tải dữ liệu.')}`);
      } finally {
        setLoading(false);
      }
    };
    fetchStoredResponses();
  }, [type, page]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL!}/api/admin/revenue-${type}-ai`, { query });
      if (res?.data?.data){
        setAIAnalystResponse([
          {
            query: query,
            result: res.data.data,
            expanded: true,
            created_at: new Date(),
          },
          ...aiAnalystResponse,
        ]);
        setQuery("");
        setResult(null);
      } else {
        setResult(transWithFallback('noResult', 'Không có kết quả.'));
      }
    } catch (error) {
      setLoading(false);
      console.error("Fetch AI error:", error);
      setResult(`❌ ${transWithFallback('errorWhenAnalyze', 'Có lỗi xảy ra khi gửi yêu cầu.')}`)
    } finally {
      setLoading(false);
    }
  };
  const handleAnalyzeClick = () => {
    if (dontAskAgain) {
      handleSearch();
    } else {
      setShowConfirmModal(true);
    }
  };
  const handleConfirm = () => {
    if (dontAskAgain) {
      localStorage.setItem("ai_confirmed", "true");
    }
    setShowConfirmModal(false);
    handleSearch();
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold text-[#0C4762] mb-2">
        {transWithFallback('AIStatisticsAnalystWithAI', 'Phân tích thống kê của bạn với AI')}
      </h3>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder={transWithFallback('askQuestion', 'Nhập câu hỏi')}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          onClick={handleAnalyzeClick}
          disabled={loading || !query.trim()}
          className="px-4 py-2 bg-[#0C4762] text-white rounded-md hover:bg-[#09394f] transition disabled:opacity-50"
        >
          {loading ? transWithFallback('analyzing', 'Đang phân tích...') : transWithFallback('analysis', 'Phân tích')}
        </button>
      </div>

      {/* Modal Xác Nhận */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h4 className="text-lg font-bold text-red-800 mb-4">{transWithFallback('note','Lưu ý')}</h4>
            <p className="text-gray-700 mb-4">
              {transWithFallback('AIConfirm', 'Dữ liệu sự kiện và doanh thu của bạn sẽ được chia sẻ với nhà cung cấp AI. Bạn có đồng ý tiếp tục không?')}
            </p>
            <label className="flex items-center space-x-2 mb-4">
              <input
                type="checkbox"
                checked={dontAskAgain}
                onChange={() => setDontAskAgain(!dontAskAgain)}
                className="form-checkbox h-4 w-4 text-blue-600"
              />
              <span className="text-sm text-gray-600">{transWithFallback('dontAskAgain','Không hỏi lại lần sau')}</span>
            </label>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                {transWithFallback('cancel', 'Hủy')}
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-[#0C4762] text-white rounded-md hover:bg-[#09394f]"
              >
                {transWithFallback('iAgree', 'Đồng ý')}
              </button>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="overflow-x-auto border border-gray-300 shadow rounded-lg p-4">
          <div className="prose max-w-none">
            <Markdown>{result}</Markdown>
          </div>
        </div>
      )}
      {aiAnalystResponse.length > 0 && (
        <div className="mt-6 space-y-4">
          {aiAnalystResponse.map((item, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded-md shadow-sm"
            >
              <button
                onClick={() => {
                  setAIAnalystResponse(prev =>
                    prev.map((item, i) =>
                      i === index ? { ...item, expanded: !item.expanded } : item
                    )
                  );
                }}
                className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-t-md font-medium text-[#0C4762]"
              >
                <div className="flex justify-between items-center">
                  <span>{transWithFallback('query:','Truy vấn: ')} {item.query}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(item.created_at).toLocaleString("vi-VN")}
                  </span>
                </div>
              </button>
              {item.expanded && (
                <div className="px-4 py-2 border-t">
                  <div className="prose max-w-none">
                    <Markdown>{item.result}</Markdown>
                  </div>
                </div>
              )}
            </div>
          ))}
          {page < totalPages && (
            <button
              onClick={() => setPage(prev => prev + 1)}
              className="mt-4 px-4 py-2 bg-[#0C4762] text-white rounded-md hover:bg-[#09394f] transition"
              disabled={loading}
            >
              {loading ? 'Đang tải thêm...' :  'Tải thêm'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
