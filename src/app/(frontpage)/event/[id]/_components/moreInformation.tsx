'use client';

/* Package System */
import { GoogleMapsEmbed } from '@next/third-parties/google';
import { MapPin } from "lucide-react";
import { useTranslations } from "next-intl";

/* Package Application */
import { useI18n } from "app/providers/i18nProvider";
import { convertLocationToVietnamese } from "utils/helpers";

import { MoreInformationProps } from '../../../../../types/models/event/eventdetail/event.interface';
import { useEffect } from 'react';

export default function MoreInformation({ title, location, locationsString }: MoreInformationProps) {
    const t = useTranslations("common");
    const { locale } = useI18n(); // Get current locale

    useEffect(() => {
        console.log('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY', process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);
    }, []);

    return (
        <div className="col-lg-4 col-md-12" id="event-location">
            {/* Location */}
            <div className="flex mt-8 mr-2">
                <div className="w-full md:w-5/6">
                    <h2 className="text-xl md:text-2xl font-bold mb-2">
                        {t("locationAddress") || "Fallback Text"}
                    </h2>
                    <div className="ratio ratio-16x9">
                        <GoogleMapsEmbed
                            apiKey="AIzaSyCNU7igk_2x8_JPATXGJs3oIzcZQSVQHxQ"
                            mode="place"
                            q={location}
                            language={locale}
                            width="100%"
                            height="100%"
                        />
                    </div>
                    <h5 className="card-title font-bold mt-2">
                        {title}
                    </h5>
                    <p className="card-text !mb-0 mt-2 flex items-center gap-1 cursor-pointer">
                        <MapPin size={16} />
                        {location}
                    </p>
                    <div className='ml-5'>
                        <span role="button" tabIndex={0}
                            className="card-text text-body-secondary mb-2" id="event-location" onClick={() => document.getElementById('info-ticket')?.scrollIntoView({ behavior: 'smooth' })}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    document.getElementById('info-ticket')?.scrollIntoView({ behavior: 'smooth' });
                                }
                            }}>
                            {locale === "vi" ? convertLocationToVietnamese(locationsString).replace(/"/g, "") : locationsString.replace(/"/g, "")}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
};

