'use client'

import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { Icon } from "@iconify/react";
import { NoteDialogProps } from "../../libs/interface/dialog.interface";

export default function NoteDialog({ open, onClose }: NoteDialogProps) {
    return (
        <Dialog open={open} onClose={onClose}>
            <div className="text-white dialog-header px-6 py-4 justify-center items-center flex relative" style={{ background: '#0C4762' }}>
                <DialogTitle className="!m-0 !p-0 text-lg text-center font-bold">Lưu ý khi đăng tải sự kiện</DialogTitle>
                <button onClick={onClose} className="absolute right-2 top-2 px-1 py-1 close-btn">
                    <Icon icon="ic:baseline-close" width="20" height="20" />
                </button>
            </div>

            <DialogContent className="p-6 flex flex-col justify-center items-center">
                <Icon icon="material-symbols:warning" width="50" height="50" color="#f59e0b" className="relative z-50"/>

                <div className="content mx-4 mt-4">
                    <p>1. Vui lòng <b>không hiển thị thông tin liên lạc của Ban Tổ Chức</b> (ví dụ: Số điện thoại/ Email/ Website/ Facebook/ Instagram…) <b>trên banner và trong nội dung bài đăng.</b> Chỉ sử dụng duy nhất Hotline Ticketbox - 1900.6408.</p>
                    <p>2. Trong trường hợp Ban tổ chức <b>tạo mới hoặc cập nhật sự kiện không đúng theo quy định nêu trên, Ticketbox có quyền từ chối phê duyệt sự kiện.</b></p>
                    <p>3. Ticketbox sẽ liên tục kiểm tra thông tin các sự kiện đang được hiển thị trên nền tảng, <b>nếu phát hiện có sai phạm liên quan đến hình ảnh/ nội dung bài đăng, Ticketbox có quyền gỡ bỏ hoặc từ chối cung cấp dịch vụ đối với các sự kiện này,</b> dựa theo điều khoản 2.9 trong Hợp đồng dịch vụ.</p>
                </div>

                <div className="flex gap-4 mt-4 mb-4">
                    <button
                        onClick={onClose}
                        className="w-40 border-2 border-[#0C4762] text-[#0C4762] font-bold py-2 px-4 rounded bg-white hover:bg-[#0C4762] hover:text-white transition-all"
                    >
                        OK
                    </button>
                </div>

            </DialogContent>
        </Dialog>
    );
}