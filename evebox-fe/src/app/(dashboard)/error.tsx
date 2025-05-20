'use client';

/* Package System */
import Image from "next/image";
import { useTranslations } from "next-intl";

/* Package Application */
import '../../styles/admin/pages/Error.css';
import '../../styles/global.css';
// import 'tailwindcss/tailwind.css';

export default function Error() {
  const trans = useTranslations('common');

  return (
    <div className="container-custom">
      <Image
        src="/images/dashboard/error_404.png"
        alt="Error 404"
        width={500}
        height={300}
        className="mt-8 mb-12"
      />

      <div className='txt-error'>
        <span className='mt-4 mb-4'>Oops!</span>
      </div>

      <div className='txt-content mt-4 mb-8'>
        <span>{trans('notFindPage') ?? "Không thể tìm thấy trang bạn muốn"}</span>
      </div>


      <div className='m-12'>
        <button className="btn btn-back">{trans('backToHome') ?? "Trở về trang chủ"}</button>
      </div>

      <div className="mt-4 mb-4">
        <span>{trans('followUs') ?? "Theo dõi chúng tôi trên các nền tảng"}</span>

        <div className="social-icons">
          <Image
            src="/images/dashboard/icons/instagram.png"
            alt="Instagram"
            width={65}
            height={65}
          />

          <Image
            src="/images/dashboard/icons/facebook.png"
            alt="Facebook"
            width={65}
            height={65}
          />

          <Image
            src="/images/dashboard/icons/linkedin.png"
            alt="Linkedin"
            width={65}
            height={65}
          />

          <Image
            src="/images/dashboard/icons/twitter.png"
            alt="Twitter"
            width={65}
            height={65}
          />

          <Image
            src="/images/dashboard/icons/youtube.png"
            alt="Youtube"
            width={65}
            height={65}
          />
        </div>
      </div>
    </div>
  )
}