'use client';

/* Package System */
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

/* Package Application */
import { generateDescription } from '../../../libs/functions/info-event/generateDescription';
import { DescriptionWithAIProps } from '../../../../../../../../types/models/event/createEvent.dto';
// import '@/styles/admin/chatbox.css';

export default function DescriptionWithAI({ isValid, eventDetails, onChange, currentDescription = '' }: DescriptionWithAIProps) {
  const t = useTranslations('common');
  const { data: session } = useSession();

  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userRequest, setUserRequest] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<'vi' | 'en'>('vi');

  const handleGenerate = async () => {
    if (!isValid) return;
    setIsLoading(true);
    try {
      const payload = {
        privatekey: process.env.NEXT_PUBLIC_OPENAI_USAGE_PRIVATE_KEY || '',
        Event: eventDetails,
        description: currentDescription,
        userRequest: userRequest,
        language: selectedLanguage,
      };

      const response = await generateDescription(payload, session?.user?.accessToken || "");

      if (response?.statusCode === 200) {
        onChange(response.data);
      } else {
        onChange(transWithFallback('errorGenerateDescription', 'Lỗi khi tạo mô tả'));
        toast.error(transWithFallback('errorGenerateDescription', 'Lỗi khi tạo mô tả'))
      }
    } catch (error) {
      onChange(transWithFallback('errorGenerateDescription', 'Lỗi khi tạo mô tả'));
      console.error('Error generating description', error);
    } finally {
      setIsLoading(false);
      setShowPopup(false);
    }
  }

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    return !msg || msg.startsWith('common.') ? fallback : msg;
  };

  return (
    <div className="flex justify-end mt-3 relative">
      {/* Button Generate AI */}
      <button
        className="absolute bottom-5 right-2 border-none bg-transparent focus:outline-none"
        onClick={() => {
          if (!isValid) {
            toast.error(transWithFallback('pleaseFillAll', 'Vui lòng hoàn tất các thông tin trước khi sử dụng tính năng này!'));
            return;
          }
          setUserRequest(transWithFallback('requestPlaceholder', 'Ví dụ: Tạo mô tả HTML hấp dẫn với ít nhất 2 ảnh'));
          setShowPopup(!showPopup)
        }}
        title={transWithFallback('generateWithAI', 'Tạo mô tả với AI')} type="button"
      >
        <img className="w-12 h-12 rounded-full object-cover shadow-md hover:shadow-xl transition-transform duration-300 hover:scale-110"
          alt="Generate with AI"
          src="https://res.cloudinary.com/de66mx8mw/image/upload/v1745247540/490290816_1085201386703010_7136785208945294009_n_liydh6.png?fbclid=IwY2xjawJzPNtleHRuA2FlbQIxMAABHiM5FBlgU0A6X_OeLF7Z8jD0nuAJiZPUH-d1ABorLq6ISwTX99sKCvTLgmNr_aem_s1PPSAKKFIP8jHpIQOeHrQ"
        />
      </button>

      {/* Popup */}
      {showPopup && (
        <div className="absolute bottom-20 right-2 w-80 bg-white border rounded-2xl shadow-xl p-4 z-50 space-y-4">
          {/* Header popup */}
          <div className="flex justify-between items-start">
            <p className="text-base font-medium text-gray-800">
              {transWithFallback('useAIToGen', 'Dùng AI để sinh nội dung cho phần mô tả dựa trên những gì bạn đang viết')}
            </p>
            <button onClick={() => setShowPopup(false)}
              className="text-gray-500 hover:bg-gray-100 p-1 rounded-full">
              <X size={20} />
            </button>
          </div>

          {/* Language selection */}
          <div className="flex items-center space-x-4">
            <p className="text-sm font-medium text-gray-700">
              {transWithFallback('language', 'Ngôn ngữ')}:
            </p>
            <div className="flex space-x-2">
              <button
                className={`px-3 py-1 rounded-full text-sm ${selectedLanguage === 'vi' ? 'bg-sky-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setSelectedLanguage('vi')}
              >
                <Image src="/images/dashboard/vietnam-icon.png" alt="flag" width={16} height={16} />
              </button>
              <button
                className={`px-3 py-1 rounded-full text-sm ${selectedLanguage === 'en' ? 'bg-sky-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setSelectedLanguage('en')}
              >
                <Image src="/images/dashboard/english-icon.png" alt="flag" width={16} height={16} />
              </button>
            </div>
          </div>

          {/* Input for user request */}
          <div className="space-y-2">
            <label htmlFor="ai-request" className="block text-sm font-medium text-gray-700">
              {transWithFallback('yourRequest', 'Yêu cầu cụ thể (nếu có)')}
            </label>
            <textarea
              id="ai-request"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
              placeholder={transWithFallback('requestPlaceholder', 'Ví dụ: Tạo mô tả HTML hấp dẫn với ít nhất 2 ảnh')}
              value={userRequest}
              onChange={(e) => setUserRequest(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              {transWithFallback('optionalField', 'Trường này không bắt buộc')}
            </p>
          </div>

          {/* Button Đồng ý */}
          <button className={`w-full rounded-full py-2 font-semibold transition-colors 
              ${(isValid && !isLoading) ? 'bg-sky-600 text-white hover:bg-sky-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            onClick={handleGenerate}
            disabled={!isValid || isLoading}
          >
            {isLoading ? (
              transWithFallback('generating', 'Đang tạo nội dung')
            ) : transWithFallback('iAgree', 'Đồng ý')}
          </button>
        </div>
      )}
    </div>
  );
}
