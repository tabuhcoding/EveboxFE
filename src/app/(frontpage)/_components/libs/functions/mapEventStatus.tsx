const mapEventStatus = (status: string): string => {
  const statusMapping: Record<string, string> = {
    AVAILABLE: "Đang mở bán",
    NOT_OPEN: "Chưa mở bán",
    SALE_CLOSE: "Đã ngừng bán vé",
    REGISTER_CLOSE: "Đã đóng đăng ký",
    SOLD_OUT: "Đã bán hết vé",
    EVENT_OVER: "Sự kiện đã kết thúc"
  };

  return statusMapping[status] || status;
};

export default mapEventStatus;
