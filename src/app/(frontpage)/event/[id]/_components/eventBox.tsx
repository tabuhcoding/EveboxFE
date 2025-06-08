'use client';

/* Pacakage System */
import React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from "next-intl";
import { Calendar, ChevronLeft, ChevronRight, MapPin } from "lucide-react";

/* Package Application */
import { EventDetail } from '../../../../../types/models/event/eventdetail/event.interface';
import { useI18n } from 'app/providers/i18nProvider';

const extractFirstParagraph = (html: string) => {
    // Match the first <p>...</p> and extract its content
    const match = html.match(/<p[^>]*>(.*?)<\/p>/);
    return match ? match[1] : ''; // Return content inside first <p> or empty string
};

export default function EventBox({ event }: { event: EventDetail }) {
    const t = useTranslations("common");
    const { locale } = useI18n(); // Get current locale 
    const router = useRouter(); // Sử dụng useRouter

    return (
        <div className="event-box d-flex justify-content-center px-4">
            <div className="eve-image d-flex justify-content-center align-items-center">
                {/* Mask phủ lên hình ảnh */}
                <div
                    className="mask mask-img"
                    style={{
                        backgroundImage: `url(${event.imgLogoUrl || '/images/default-mask.png'})`,
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
                    <div className="row justify-content-between">
                        {/* Thông tin sự kiện */}
                        <div className="event-info col-lg-7 col-md-12 mt-4mt-4 p-0 d-flex align-items-center text-left" style={{ zIndex: 2 }}>
                            <div>
                                <p className="txt-name-event-title">{event.title}</p>
                                <div
                                    className="card-text  text-white prose max-w-none"
                                    dangerouslySetInnerHTML={{ __html: extractFirstParagraph(event.description) }}
                                />
                                <p className="mt-4 card-text view-location flex items-center gap-1 cursor-pointer" onClick={() => document.getElementById('event-location')?.scrollIntoView({ behavior: 'smooth' })}>
                                    <MapPin size={16} />
                                    {t("mapRedirect") || "Fallback Text"}
                                </p>
                            </div>
                        </div>

                        {/* Thông tin ngày & giờ, địa điểm */}
                        <div className="col-lg-5 col-md-12 p-0 d-flex justify-content-end align-items-center" style={{ zIndex: 2 }}>
                            <div className="card" style={{ width: '385px' }}>
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
                                        {/* <button
                                            type="button" className="btn btn-outline-dark ml-6 mt-2 mb-2 btn-date"
                                            onClick={() => document.getElementById('info-ticket')?.scrollIntoView({ behavior: 'smooth' })}
                                        >
                                            + 4 ngày khác
                                        </button> */}
                                    </p>

                                    <h5 className="card-title mt-2 title-box">{t("locationTitle") || "Địa điểm"}</h5>
                                    <p className="card-text text-body-secondary mb-2 flex items-center gap-1 cursor-pointer" onClick={() => document.getElementById('info-ticket')?.scrollIntoView({ behavior: 'smooth' })}>
                                        <MapPin size={18}/>
                                        {event.venue}
                                    </p>

                                    <hr />

                                    <div className="d-flex justify-content-center align-items-center mt-3 mb-2">
                                        <h5 className="card-title title-box d-flex align-items-center gap-2" style={{ cursor: "default" }}>
                                            {t("priceTitle") || "Fallback Text"}
                                            <span className="text-teal-400 d-flex align-items-center" style={{ cursor: "pointer" }}>
                                                {event.minPrice?.toLocaleString('vi-VN')}đ
                                                <ChevronRight size={22} className='ml-1' style={{ position: 'relative', top: '1px' }}/>
                                            </span>
                                        </h5>
                                    </div>

                                    <div className="d-flex justify-content-center">
                                        <button type="button" className="btn-buy-now" onClick={() => document.getElementById('info-ticket')?.scrollIntoView({ behavior: 'smooth' })}>
                                            {t("bookNow") || "Fallback Text"}
                                        </button>
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
