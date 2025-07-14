'use client';

import { useRef, useState } from 'react';
import CardButton from './CardButton';
import UserInstruction from './UserInstruction';

export default function InstructionClient() {
  const [tab, setTab] = useState<'user' | 'organizer'>('user');
  const [activeDetail, setActiveDetail] = useState<string | null>(null);

   const [leftWidth, setLeftWidth] = useState(320); // Initial width in px
  const isDragging = useRef(false);

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;
    const newWidth = Math.min(Math.max(e.clientX, 200), 600); // min 200, max 600
    setLeftWidth(newWidth);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  // Attach global mouse events
  if (typeof window !== 'undefined') {
    window.onmousemove = handleMouseMove;
    window.onmouseup = handleMouseUp;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Hướng Dẫn Sử Dụng</h1>

      {/* Tabs */}
      <div className="flex justify-center mb-6 bg-gray-100 rounded-lg p-1">
  <button
    onClick={() => { setTab('user'); setActiveDetail(null); }}
    className={`px-4 py-2 font-medium rounded-md transition-colors ${
      tab === 'user'
        ? 'bg-sky-800 text-white shadow'
        : 'text-sky-700 hover:bg-sky-100'
    }`}
  >
    Hướng dẫn cho Người dùng
  </button>
  <button
    onClick={() => { setTab('organizer'); setActiveDetail(null); }}
    className={`ml-2 px-4 py-2 font-medium rounded-md transition-colors ${
      tab === 'organizer'
        ? 'bg-sky-800 text-white shadow'
        : 'text-sky-700 hover:bg-sky-100'
    }`}
  >
    Hướng dẫn cho Nhà tổ chức
  </button>
</div>

      {/* Two Column Layout */}
      <div className="flex w-full min-h-[400px]">
        {/* Left Column - Expanders */}
         <div style={{ width: leftWidth }} className="border-r border-gray-300 bg-gray-50 p-4 overflow-y-auto">
          {tab === 'user' && (
            <>
              <details className="border rounded-md p-4">
                <summary className="font-semibold cursor-pointer text-sky-900">Quản lý tài khoản</summary>
                <div className="mt-3 space-y-2 ml-4">
                    <CardButton label="Đăng ký" onClick={() => setActiveDetail('sign-up')} />
                    <CardButton label="Đăng nhập" onClick={() => setActiveDetail('sign-in')} />
                    <CardButton label="Cập nhật thông tin và mật khẩu" onClick={() => setActiveDetail('update-profile')} />
                </div>
              </details>

              <details className="border rounded-md p-4">
  <summary className="font-semibold cursor-pointer text-sky-900">Tương tác và Khám phá sự kiện</summary>
  <div className="mt-3 space-y-2 ml-4">
    <CardButton label="Cách tìm kiếm sự kiện" onClick={() => setActiveDetail('search-event')} />
    <CardButton label="Theo dõi sự kiện" onClick={() => setActiveDetail('follow-event')} />
  </div>
</details>

              <details className="border rounded-md p-4">
  <summary className="font-semibold cursor-pointer text-sky-900">Mua vé và Quản lý vé</summary>
  <div className="mt-3 space-y-2 ml-4">
    <CardButton label="Quy trình mua vé" onClick={() => setActiveDetail('buy-ticket')} />
    <CardButton label="Xem vé và Mã QR (ứng dụng di động)" onClick={() => setActiveDetail('view-qr')} />
  </div>
</details>
            </>
          )}

          {tab === 'organizer' && (
            <>
              <details className="border rounded-md p-4">
  <summary className="font-semibold cursor-pointer text-sky-900">Tạo và Quản lý sự kiện</summary>
  <div className="mt-3 space-y-2 ml-4">
    <CardButton label="Quy trình tạo mới sự kiện" onClick={() => setActiveDetail('create-event')} />
    <CardButton label="Quản lý cho organizer" onClick={() => setActiveDetail('org-management')} />
  </div>
</details>

              <div className="border rounded-md p-4 bg-gray-50">
                <button
                  className="text-sky-900 hover:underline font-medium bg-white-900 text-left w-full"
                  onClick={() => setActiveDetail('organizer-analytics')}
                >
                  Vận hành và Thống kê
                </button>

              </div>
            </>
          )}
        </div>

        <div
    onMouseDown={handleMouseDown}
    className="w-1 cursor-col-resize bg-sky-900 hover:bg-sky-600 transition-colors"
  />

        {/* Right Column - Detail Viewer */}
       <UserInstruction activeDetail={activeDetail ? activeDetail : ""}/>
      </div>
    </div>
  );
}
