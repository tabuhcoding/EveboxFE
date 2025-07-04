export default function ApplyScope() {
    return (
      <div className="p-6 bg-[#E6F6F1] rounded-lg border border-[#BEE3DB] space-y-6 shadow-lg">
        <h2 className="text-lg font-semibold">Phạm vi áp dụng</h2>
        <div className="flex space-x-4">
          <label className="flex items-center space-x-2">
            <input type="radio" name="scope" defaultChecked />
            <span>Toàn bộ sự kiện</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="radio" name="scope" />
            <span>Giới hạn sự kiện</span>
          </label>
        </div>
      </div>
    );
  }