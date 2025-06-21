import { useTranslations } from 'next-intl';
import React, { useState } from 'react';


interface CollapsibleDescriptionProp {
  htmlContent: string;
  maxHeight?: number;
}

export default function CollapsibleDescription({ htmlContent, maxHeight = 100 }: CollapsibleDescriptionProp) {
  const [isExpanded, setIsExpanded] = useState(false);

  const t = useTranslations('common');

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith('common.')) return fallback;
    return msg;
  };

  return (
    <div className='relative'>
      <div
        className={`text-sm text-gray-600 mt-2 event-description transition-all duration-300 ease-in-out ${isExpanded ? '' : 'overflow-hidden'}`}
        style={{ maxHeight: isExpanded ? 'none' : `${maxHeight}px` }}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />

      <button onClick={() => setIsExpanded((prev) => !prev)} className='mt-2 text-gray-900 text-sm flex items-center'>
        {isExpanded ? (
          <>
            <span>{transWithFallback('showLess', 'Ẩn bớt')}</span>
            <svg
              className="w-4 h-4 ml-1 transform rotate-180"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </>
        ) : (
          <>
            <span>{transWithFallback('showMore', 'Hiện thêm')}</span>
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </>
        )}
      </button>
    </div>
  );
}