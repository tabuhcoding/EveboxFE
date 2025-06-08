'use client';

/* Package System */
import Image from "next/image";
import { GoogleMapsEmbed } from '@next/third-parties/google';

/* Package Application */
import { convertLocationToVietnamese } from "utils/helpers";
import { useTranslations } from "next-intl";
import { useI18n } from "app/providers/i18nProvider";
        
interface MoreInformationProps {
    title: string;
    location: string;
    locationsString: string;
}

export default function MoreInformation({ title, location, locationsString }: MoreInformationProps) {
    const t = useTranslations("common");
    const { locale } = useI18n(); // Get current locale
    
    return (
        <div className="col-lg-4 col-md-12" id="event-location">
            {/* Location */}
            <div className="flex mt-8 mr-2">
                <div className="w-full md:w-5/6">
                    <h2 className="text-xl md:text-2xl font-bold mb-2">
                    {t("locationAddress") || "Fallback Text"}
                    </h2>
                    <div className="ratio ratio-16x9">
                        {/* <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117996.95037632967!2d-74.05953969406828!3d40.75468158321536!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2588f046ee661%3A0xa0b3281fcecc08c!2sManhattan%2C%20Nowy%20Jork%2C%20Stany%20Zjednoczone!5e1!3m2!1spl!2spl!4v1672242444695!5m2!1spl!2spl" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe> */}
                        <GoogleMapsEmbed
                            apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ""}
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
                    <p className="card-text mt-2">
                        <i className="bi bi-geo-alt-fill mr-2"></i>
                        {location}
                    </p>
                    <p className="card-text text-body-secondary ml-6 mb-2" id="event-location" onClick={() => document.getElementById('info-ticket')?.scrollIntoView({ behavior: 'smooth' })}>
                        {locale === "vi" ? convertLocationToVietnamese(locationsString) : locationsString}
                    </p>
                </div>
            </div>

            {/* Tags */}
            <div className="flex mt-8 mr-2">
                <div className="w-full md:w-5/6">
                    <h2 className="text-xl md:text-2xl font-bold">
                        Tags
                    </h2>
                    <div className="mt-2">

                    </div>
                </div>
            </div>

            {/* Share with friends */}
            <div className="flex mt-8 mr-2">
                <div className="w-full md:w-5/6">
                    <h2 className="text-xl md:text-2xl font-bold">
                        {t("sharingTitle") || "Fallback Text"}
                    </h2>

                    <div className="row-app mt-3">
                        <Image
                            className="img-app mr-2"
                            src='/images/detail/Facebook.png'
                            alt="facebook-icon"
                            width={32}
                            height={32}
                        />
                        <Image
                            className="img-app mr-2 ml-2"
                            src='/images/detail/WhatsApp.png'
                            alt="WhatsApp-icon"
                            width={32}
                            height={32}
                        />
                        <Image
                            className="img-app mr-2 ml-2"
                            src='/images/detail/LinkedIn.png'
                            alt="LinkedIn-icon"
                            width={32}
                            height={32}
                        />
                        <Image
                            className="img-app ml-2"
                            src='/images/detail/Twitter.png'
                            alt="Twitter-icon"
                            width={32}
                            height={32}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
};

