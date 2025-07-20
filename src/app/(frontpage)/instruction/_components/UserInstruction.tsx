"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"

interface UserInstructionProps {
  activeDetail: string
}

export default function UserInstruction({ activeDetail }: UserInstructionProps) {
  const t = useTranslations("common")

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key)
    return !msg || msg.startsWith("common.") ? fallback : msg
  }

  return (
    <div className="flex-1 border-l border-gray-300 p-6 overflow-y-auto max-h-[80vh]">
      {!activeDetail && (
        <p className="text-gray-500 text-sm italic">
          {transWithFallback("viewDetailInstruction", "Chọn một mục để xem hướng dẫn chi tiết tại đây.")}
        </p>
      )}

      {activeDetail === "sign-up" && (
        <>
          <h2 className="text-xl font-semibold mb-2">{transWithFallback("register", "Đăng ký")}</h2>
          <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
            <li>
              {transWithFallback(
                "toSignUpAccount",
                'Người dùng truy cập trang "Đăng ký", điền các thông tin bắt buộc như họ tên, email, số điện thoại và mật khẩu.',
              )}
            </li>
            <div className="flex justify-center my-2">
              <Image src="/images/instruction/user/signup1.png" alt="Sign Up Step 1" width={500} height={400} />
            </div>
            <li>{transWithFallback("systemSendsVerificationEmail", "Hệ thống sẽ gửi email xác thực để hoàn tất.")}</li>
            <div className="flex justify-center my-2">
              <Image src="/images/instruction/user/signup2.png" alt="Sign Up Step 2" width={500} height={400} />
            </div>
          </ul>
        </>
      )}

      {activeDetail === "sign-in" && (
        <>
          <h2 className="text-xl font-semibold mb-2">{transWithFallback("signIn", "Đăng nhập")}</h2>
          <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
            <li>
              {transWithFallback(
                "signInMethods",
                "Người dùng có thể đăng nhập bằng tài khoản email đã đăng ký hoặc sử dụng phương thức đăng nhập nhanh qua Google.",
              )}
            </li>
            <div className="flex justify-center my-2">
              <Image src="/images/instruction/user/signin1.png" alt="Sign In Methods" width={500} height={400} />
            </div>
          </ul>
        </>
      )}

      {activeDetail === "update-profile" && (
        <>
          <h2 className="text-xl font-semibold mb-2">
            {transWithFallback("updateProfileTitle", "Cập nhật thông tin và mật khẩu")}
          </h2>
          <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
            <li>
              {transWithFallback(
                "accessAccountManagementInstruction",
                'Sau khi đăng nhập, truy cập vào mục "Quản lý tài khoản" bằng cách mở thanh bên và bấm vào nút "Quản lý tài khoản" hoặc bấm vào tên đăng nhập ở góc trên bên phải',
              )}
            </li>
            <div className="flex justify-center my-2">
              <Image
                src="/images/instruction/user/account1.png"
                alt="Access Account Management"
                width={500}
                height={400}
              />
            </div>
            <li>
              {transWithFallback(
                "defaultProfileTabInstruction",
                'Mặc định là sẽ ở tab "Thông tin cá nhân", có thể xem và chỉnh sửa họ tên, số điện thoại cùng ảnh đại diện.',
              )}
            </li>
            <div className="flex justify-center my-2">
              <Image
                src="/images/instruction/user/account2.png"
                alt="Personal Information Tab"
                width={500}
                height={400}
              />
            </div>
            <li>
              {transWithFallback(
                "updateAvatarInstruction",
                'Khi cập nhật ảnh đại diện, có thể lựa chọn "Tải ảnh lên" để tải ảnh lên từ máy tính hoặc "Chọn từ ảnh đã tải lên" để chọn ảnh đã được tải lên trước đó',
              )}
            </li>
            <div className="flex justify-center my-2">
              <Image src="/images/instruction/user/account3.png" alt="Update Avatar 1" width={500} height={400} />
            </div>
            <div className="flex justify-center my-2">
              <Image src="/images/instruction/user/account4.png" alt="Update Avatar 2" width={500} height={400} />
            </div>
            <li>
              {transWithFallback(
                "changePasswordInstruction",
                'Ở thanh bên, bấm nút "Đổi mật khẩu mới" để cập nhật mật khẩu mới sau khi xác thực mật khẩu cũ',
              )}
            </li>
            <div className="flex justify-center my-2">
              <Image src="/images/instruction/user/account5.png" alt="Change Password 1" width={500} height={400} />
            </div>
            <div className="flex justify-center my-2">
              <Image src="/images/instruction/user/account6.png" alt="Change Password 2" width={500} height={400} />
            </div>
          </ul>
        </>
      )}

      {activeDetail === "search-event" && (
        <>
          <h2 className="text-xl font-semibold mb-2">
            {transWithFallback("searchAndFilterEventsTitle", "Tìm kiếm và Lọc sự kiện")}
          </h2>
          <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
            <li>
              {transWithFallback(
                "useSearchBarInstruction",
                "Sử dụng thanh tìm kiếm ở trang chủ để tìm sự kiện theo tên hoặc từ khóa",
              )}
            </li>
            <div className="flex justify-center my-2">
              <Image src="/images/instruction/user/search1.png" alt="Search Bar" width={500} height={400} />
            </div>
            <li>
              {transWithFallback(
                "useAdvancedFiltersInstruction",
                "Sử dụng các bộ lọc nâng cao để tìm kiếm theo danh mục (âm nhạc, hội thảo...), địa điểm, khoảng thời gian, giá vé",
              )}
            </li>
            <div className="flex justify-center my-2">
              <Image src="/images/instruction/user/search2.png" alt="Advanced Filters" width={500} height={400} />
            </div>
          </ul>
          <h2 className="text-xl font-semibold mb-2 mt-2">
            {transWithFallback("useAIChatbotTitle", "Sử dụng trợ lý ảo (AI Chatbot)")}
          </h2>
          <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
            <li>
              {transWithFallback("clickAIChatbotIconInstruction", "Nhấn vào biểu tượng AI Chatbot trên giao diện")}
            </li>
            <div className="flex justify-center my-2">
              <Image src="/images/instruction/user/ai1.png" alt="AI Chatbot Icon" width={500} height={400} />
            </div>
            <div className="flex justify-center my-2">
              <Image src="/images/instruction/user/ai2.png" alt="AI Chatbot Interface" width={500} height={400} />
            </div>
            <li>
              {transWithFallback(
                "aiChatbotUsageInstruction",
                'Có thể chọn các lựa chọn có sẵn của hệ thống hoặc nhập các câu hỏi bằng ngôn ngữ tự nhiên để tìm kiếm sự kiện (ví dụ: "Tìm cho tôi các sự kiện âm nhạc diễn ra ở Đà Lạt"). Chatbot sẽ phân tích và trả về kết quả phù hợp.',
              )}
            </li>
            <p>{transWithFallback("selectPredefinedOptions", "Chọn các lựa chọn có sẵn:")}</p>
            <div className="flex justify-center my-2">
              <Image src="/images/instruction/user/ai3.png" alt="AI Predefined Options 1" width={500} height={400} />
            </div>
            <div className="flex justify-center my-2">
              <Image src="/images/instruction/user/ai4.png" alt="AI Predefined Options 2" width={500} height={400} />
            </div>
            <p>{transWithFallback("enterNaturalLanguageQuery", "Nhập yêu cầu bằng ngôn ngữ tự nhiên:")}</p>
            <div className="flex justify-center my-2">
              <Image
                src="/images/instruction/user/ai5.png"
                alt="AI Natural Language Query 1"
                width={500}
                height={400}
              />
            </div>
            <div className="flex justify-center my-2">
              <Image
                src="/images/instruction/user/ai6.png"
                alt="AI Natural Language Query 2"
                width={500}
                height={400}
              />
            </div>
          </ul>
        </>
      )}

      {activeDetail === "follow-event" && (
        <>
          <h2 className="text-xl font-semibold mb-2 mt-2">
            {transWithFallback("manageFavoritesTitle", "Quản lý Danh sách Yêu thích")}
          </h2>
          <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
            <li>
              {transWithFallback(
                "addToFavoritesInstruction",
                'Tại trang chi tiết của một sự kiện hoặc nhà tổ chức, nhấn vào biểu tượng "Trái tim" để thêm vào danh sách yêu thích hoặc có thêm nhanh bằng cách nhấn vào biểu tượng trái tim ở các sự kiện tại trang chủ để thêm vào danh sách yêu thích.',
              )}
            </li>
            <div className="flex justify-center my-2">
              <Image src="/images/instruction/user/fav1.png" alt="Add to Favorites" width={500} height={400} />
            </div>
            <li>
              {transWithFallback(
                "viewFavoritesInstruction",
                'Truy cập mục "Tài khoản" - "Danh sách yêu thích" để xem lại các mục đã lưu và quản lý nhận thông báo.',
              )}
            </li>
            <div className="flex justify-center my-2">
              <Image src="/images/instruction/user/fav2.png" alt="View Favorites List" width={500} height={400} />
            </div>
          </ul>
        </>
      )}

      {activeDetail === "buy-ticket" && (
        <>
          <h2 className="text-xl font-semibold mb-2 mt-2">{transWithFallback("buyTicketTitle", "Mua vé")}</h2>
          <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
            <li>
              {transWithFallback(
                "selectShowingInstruction",
                "Tại trang chi tiết sự kiện, chọn một suất diễn (Showing) phù hợp",
              )}
            </li>
            <div className="flex justify-center my-2">
              <Image src="/images/instruction/user/buy1.png" alt="Select Showing" width={500} height={400} />
            </div>
            <li>
              {transWithFallback(
                "selectTicketTypeAndQuantity",
                "Chọn loại vé và số lượng. Nếu sự kiện có sơ đồ ghế, người dùng có thể trực tiếp chọn vị trí mong muốn.",
              )}
            </li>
            <div className="flex justify-center my-2">
              <Image src="/images/instruction/user/buy2.png" alt="Select Ticket Type" width={500} height={400} />
            </div>
            <li>
              {transWithFallback(
                "ticketHoldInstruction",
                "Hệ thống sẽ tạm giữ vé trong 20 phút. Người dùng tiến hành điền thông tin vào form (nếu có) và chuyển đến bước thanh toán.",
              )}
            </li>
            <div className="flex justify-center my-2">
              <Image src="/images/instruction/user/buy3.png" alt="Ticket Hold" width={500} height={400} />
            </div>
            <div className="flex justify-center my-2">
              <Image src="/images/instruction/user/buy4.png" alt="Payment Step" width={500} height={400} />
            </div>
            <li>
              {transWithFallback(
                "selectPaymentMethod",
                "Lựa chọn phương thức thanh toán qua PayOS và hoàn tất giao dịch.",
              )}
            </li>
            <div className="flex justify-center my-2">
              <Image src="/images/instruction/user/buy5.png" alt="Select PayOS" width={500} height={400} />
            </div>
            <li>
              {transWithFallback("redirectToPayOS", "Hệ thống sẽ dẫn qua trang PayOS để tiến hành quét mã thanh toán")}
            </li>
            <div className="flex justify-center my-2">
              <Image src="/images/instruction/user/buy6.png" alt="PayOS QR Code" width={500} height={400} />
            </div>
            <div className="flex justify-center my-2">
              <Image src="/images/instruction/user/buy7.png" alt="PayOS Scan" width={500} height={400} />
            </div>
            <li>
              {transWithFallback(
                "paymentSuccessInstruction",
                "Sau khi thanh toán thành công, hệ thống sẽ gửi email xác nhận kèm vé điện tử có mã QR, sau đó dẫn đến trang thanh toán thành công",
              )}
            </li>
            <div className="flex justify-center my-2">
              <Image src="/images/instruction/user/buy8.png" alt="Payment Success" width={500} height={400} />
            </div>
            <h2 className="text-xl font-semibold mb-2 mt-2">{transWithFallback("buyTicketTitle", "Mua vé")}</h2>
            <div className="w-full aspect-video mb-4">
              <iframe
                className="w-full h-full rounded-md"
                src="https://www.youtube.com/embed/7WYNCYs4-5M"
                title={transWithFallback("user-booking", "Hướng dẫn mua vé sự kiện trên di động")}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </ul>
        </>
      )}

      {activeDetail === "view-qr" && (
        <>
          <h2 className="text-xl font-semibold mb-2 mt-2">
            {transWithFallback("viewTicketAndQRTitle", "Xem vé và mã QR")}
          </h2>
          <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
            <li>
              {transWithFallback(
                "manageTicketsInstruction",
                'Ở thanh bên có nút "Quản lý vé", bấm vào đây để đến trang danh sách các vé đã mua',
              )}
            </li>
            <div className="flex justify-center my-2">
              <Image src="/images/instruction/user/qr1.png" alt="Manage Tickets Button" width={500} height={400} />
            </div>
            <li>
              {transWithFallback(
                "viewPurchasedTicketsInstruction",
                "Hiển thị danh sách các vé đã mua, có thể tìm kiếm theo sự kiện của vé, lọc theo tình trạng của vé (Tất cả, Thành công, Đang xử lý, Đã hủy) hoặc là thời gian diễn ra sự kiện (Sắp diễn ra, Đã kết thúc)",
              )}
            </li>
            <div className="flex justify-center my-2">
              <Image src="/images/instruction/user/qr2.png" alt="Purchased Tickets List" width={500} height={400} />
            </div>
            <li>
              {transWithFallback(
                "viewTicketDetails",
                "Khi bấm vào từng vé, sẽ xem được thông tin chi tiết của vé đã mua",
              )}
            </li>
            <div className="flex justify-center my-2">
              <Image src="/images/instruction/user/qr3.png" alt="Ticket Details 1" width={500} height={400} />
            </div>
            <div className="flex justify-center my-2">
              <Image src="/images/instruction/user/qr4.png" alt="Ticket Details 2" width={500} height={400} />
            </div>
            <li>{transWithFallback("viewQRMobilInstruction", "Xem mã QR (dành cho ứng dụng di động)")}</li>
            <div className="w-full aspect-video mb-4">
              <iframe
                className="w-full h-full rounded-md"
                src="https://youtube.com/embed/h7XOm25p2qA"
                title={transWithFallback("view-qrcode", "Hướng dẫn người dùng xem mã QR")}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </ul>
        </>
      )}

      {activeDetail === "create-event" && (
        <>
          <h2 className="text-xl font-semibold mb-2">{transWithFallback("createEventTitle", "Tạo mới sự kiện")}</h2>
          <div className="w-full aspect-video mb-4">
            <iframe
              className="w-full h-full rounded-md"
              src="https://www.youtube.com/embed/mzEw-JrKGts"
              title={transWithFallback("eventCreationGuide", "Hướng dẫn tạo sự kiện")}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
            <li>
              {transWithFallback(
                "createEventSidebarButton",
                'Sau khi đã đăng nhập thành công, tại thanh bên người dùng bấm "Tạo sự kiện"',
              )}
            </li>
            <div className="flex justify-center my-2">
              <Image src="/images/instruction/org/cr1.png" alt="Create Event Button" width={500} height={400} />
            </div>
            <p>
              {transWithFallback(
                "organizerInfoPopup",
                'Một popup với nội dung "Bạn chưa đăng ký thông tin thanh toán với tư cách nhà tổ chức" hiển thị với 2 sự lựa chọn: "Tiếp tục tạo sự kiện" hoặc "Đăng ký tổ chức"',
              )}
            </p>
            <div className="flex justify-center my-2">
              <Image src="/images/instruction/org/cr2.png" alt="Organizer Info Popup" width={500} height={400} />
            </div>
            {/* Continue with rest of create-event content... */}
          </ul>
        </>
      )}

      {activeDetail === "org-checkin" && (
        <>
          <h2 className="text-xl font-semibold mb-2">{transWithFallback("org-checkin", "Checkin QR code")}</h2>
          <div className="w-full aspect-video mb-4">
            <iframe
              className="w-full h-full rounded-md"
              src="https://youtube.com/embed/BMiloThu5Ng?si=_ZIeLiv_qhh3mSF6"
              title={transWithFallback("org-checkin", "Checkin QR code")}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </>
      )}

      {activeDetail === "org-management" && (
        <>
          <h2 className="text-xl font-semibold mb-2">
            {transWithFallback("organizerManagementTitle", "Quản lý cho organizer")}
          </h2>
          <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
            <li>{transWithFallback("manageEvents", "Quản lý sự kiện")}</li>
            <p>
              {transWithFallback(
                "manageEventsByStatus",
                'Người dùng có thể quản lý các sự kiện của mình với 3 trạng thái tương ứng 3 tab "Sắp tới / Đã qua / Chờ duyệt"',
              )}
            </p>
            <div className="flex justify-center my-2">
              <Image src="/images/instruction/org/mn1.png" alt="Manage Events by Status" width={500} height={400} />
            </div>
            {/* Continue with rest of org-management content... */}
          </ul>
        </>
      )}

      {activeDetail === "organizer-analytics" && (
        <>
          <h2 className="text-xl font-semibold mb-2">
            {transWithFallback("mobileOpsAndStatsTitle", "Vận hành và Thống kê (trên ứng dụng di động)")}
          </h2>
          <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
            <li>{transWithFallback("viewRevenueAndTicketsSold", "Xem doanh thu, lượt vé đã bán.")}</li>
            <li>{transWithFallback("trackVisitsAndInteractions", "Theo dõi lượt truy cập và tương tác.")}</li>
            <li>{transWithFallback("exportReportsAndAnalyze", "Xuất báo cáo và phân tích hiệu quả.")}</li>
          </ul>
        </>
      )}
    </div>
  )
}
