'use client';

/* Pacakage System */
import { Calendar, ChevronLeft, ChevronRight, Eye, MapPin, Star } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useTranslations } from "next-intl";
import React from 'react';

/* Package Application */
import { useI18n } from 'app/providers/i18nProvider';

import { EventDetail } from '../../../../../types/models/event/eventdetail/event.interface';

const extractFirstParagraph = (html: string) => {
    // Tìm tất cả các <p>...</p>
    const matches = html.match(/<p[^>]*>(.*?)<\/p>/g);
    if (!matches) return '';

    for (const paragraph of matches) {
        // Bỏ qua đoạn chứa <img
        if (!/<img\s/i.test(paragraph)) {
            // Lấy nội dung trong thẻ <p>
            const contentMatch = paragraph.match(/<p[^>]*>(.*?)<\/p>/);
            return contentMatch ? contentMatch[1] : '';
        }
    }

    return '';
};


export default function EventBox({ event }: { event: EventDetail }) {
    const t = useTranslations("common");
    const { locale } = useI18n(); // Get current locale 
    const router = useRouter(); // Sử dụng useRouter
    const otherShowingsCount = Array.isArray(event.showing) ? event.showing.length - 1 : 0;

    return (
        <div className="event-box d-flex justify-content-center px-4">
            <div className="eve-image d-flex justify-content-center align-items-center">
                {/* Mask phủ lên hình ảnh */}
                <div
                    className="mask mask-img"
                    style={{
                        backgroundImage: `url(${event.imgPosterUrl || '/images/default-mask.png'})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        opacity: 0.5, // Adjust opacity for the overlay effect
                    }}
                ></div>

                {/* Nút "Quay lại" */}
                <div className="back-button-wrapper position-absolute mt-4">
                    <button type="button" className="btn-back flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur rounded-full shadow hover:bg-white transition" onClick={() => router.back()}>
                        <ChevronLeft size={20} />
                        {t("backBtn") || "Fallback Text"}
                    </button>
                </div>

                <div className="mt-8 eve-padding w-full">
                    <div className="flex flex-col lg:flex-row justify-between gap-6">
                        {/* Thông tin sự kiện */}
                        <div className="event-info w-full lg:w-7/12 mt-4 text-left flex items-center" style={{ zIndex: 2 }}>
                            <div>
                                <p className="txt-name-event-title">{event.title}</p>
                                <div
                                    className="card-text  text-white prose max-w-none"
                                    dangerouslySetInnerHTML={{ __html: extractFirstParagraph(event.description) }}
                                />
                                {(event.totalClicks !== undefined || event.lastScore !== undefined) && (
                                    <div className="mt-4 space-y-1 text-white text-sm">
                                        {typeof event.totalClicks === 'number' && (
                                            <div className="flex items-center gap-1"><Eye size={16} /> {t("totalClicksLabel") || "Tổng lượt xem"}: <strong>{event.totalClicks}</strong></div>
                                        )}

                                        {typeof event.lastScore === 'number' && event.lastScore > 7 && (
                                            <div className="flex items-center gap-1"><Star size={16} color="#FFD700" fill="#FFD700" /> {t("lastScoreLabel") || "Đánh giá"}: <strong>{event.lastScore}/10</strong></div>
                                        )}
                                    </div>
                                )}

                                <span role="button" tabIndex={0}
                                    className="mt-4 card-text view-location flex items-center gap-1 cursor-pointer"
                                    onClick={() => document.getElementById('event-location')?.scrollIntoView({ behavior: 'smooth' })}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            document.getElementById('event-location')?.scrollIntoView({ behavior: 'smooth' });
                                        }
                                    }}>
                                    <MapPin size={16} />
                                    {t("mapRedirect") || "Fallback Text"}
                                </span>
                            </div>
                        </div>

                        {/* Thông tin ngày & giờ, địa điểm */}
                        <div className="w-full lg:w-5/12 flex justify-center lg:justify-end items-center relative z-10" style={{ zIndex: 2 }}>
                            <div className="card w-full max-w-[385px]">
                                <div className="card-body px-4 mt-2 mb-3">
                                    <h5 className="card-title title-box">{t("dateTime") || "Thời gian"}</h5>
                                    <p className="card-text m-0 text-body-secondary flex items-center gap-1 cursor-pointer">
                                        <Calendar size={18} />
                                        {new Date(event.startDate).toLocaleString(locale === "vi" ? 'vi-VN' : 'en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                    {otherShowingsCount > 0 && (
                                        <button
                                            type="button"
                                            className="btn btn-outline-dark ml-6 mt-2 mb-2 btn-date"
                                            onClick={() =>
                                                document.getElementById('info-ticket')?.scrollIntoView({ behavior: 'smooth' })
                                            }
                                        >
                                            + {otherShowingsCount} ngày khác
                                        </button>
                                    )}

                                    <h5 className="card-title mt-2 title-box">{t("locationTitle") || "Địa điểm"}</h5>
                                    <span role="button" tabIndex={0}
                                        className="card-text text-body-secondary mb-2 flex items-center gap-1 cursor-pointer"
                                        onClick={() => document.getElementById('info-ticket')?.scrollIntoView({ behavior: 'smooth' })}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ") {
                                                document.getElementById('event-location')?.scrollIntoView({ behavior: 'smooth' });
                                            }
                                        }}
                                    >
                                        <MapPin size={18} />
                                        {event.venue}
                                    </span>

                                    <hr />

                                    <div className="d-flex justify-content-center align-items-center mt-3 mb-2">
                                        <h5 className="card-title title-box d-flex align-items-center gap-2" style={{ cursor: "default" }}>
                                            {t("priceTitle") || "Fallback Text"}
                                            <span className="text-teal-400 d-flex align-items-center" style={{ cursor: "pointer" }}>
                                                {event.minPrice?.toLocaleString('vi-VN')}đ
                                                <ChevronRight size={22} className='ml-1' style={{ position: 'relative', top: '1px' }} />
                                            </span>
                                        </h5>
                                    </div>

                                    <div className="d-flex justify-content-center">
                                        {(() => {
                                            switch (event.status) {
                                                case "AVAILABLE":
                                                    return (
                                                        <button
                                                            type="button"
                                                            className="btn-buy-now"
                                                            onClick={() => document.getElementById('info-ticket')?.scrollIntoView({ behavior: 'smooth' })}
                                                        >
                                                            {t("bookNow") || "Mua vé ngay"}
                                                        </button>
                                                    );

                                                case "NOT_OPEN":
                                                    return (
                                                        <button type="button" className="btn-disable-event cursor-not-allowed" disabled>
                                                            {t("notOpen") || "Vé chưa mở bán"}
                                                        </button>
                                                    );

                                                case "SALE_CLOSE":
                                                    return (
                                                        <button type="button" className="btn-disable-event cursor-not-allowed" disabled>
                                                            {t("saleClosed") || "Vé ngừng bán"}
                                                        </button>
                                                    );

                                                case "REGISTER_CLOSE":
                                                    return (
                                                        <button type="button" className="btn-disable-event cursor-not-allowed" disabled>
                                                            {t("registerClosed") || "Đã đóng đăng ký"}
                                                        </button>
                                                    );

                                                case "SOLD_OUT":
                                                    return (
                                                        <button type="button" className="btn-sold-out cursor-not-allowed" disabled>
                                                            {t("soldOut") || "Hết vé"}
                                                        </button>
                                                    );

                                                case "EVENT_OVER":
                                                    return (
                                                        <button type="button" className="btn-disable-event cursor-not-allowed" disabled>
                                                            {t("eventOver") || "Sự kiện đã kết thúc"}
                                                        </button>
                                                    );

                                                default:
                                                    return (
                                                        <button type="button" className="btn-disable-event cursor-not-allowed" disabled>
                                                            {t("unavailable") || "Không khả dụng"}
                                                        </button>
                                                    );
                                            }
                                        })()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
