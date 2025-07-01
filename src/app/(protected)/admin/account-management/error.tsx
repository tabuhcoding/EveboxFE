'use client';

/* Package System */
import Image from "next/image";

/* Package Application */
import '@/styles/admin/pages/Error.css';

export default function Error() {
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
                <span>We can’t seem to find the page you are looking for</span>
            </div>


            <div className='m-12'>
                <button className="btn btn-back">Back to Homepage</button>
            </div>

            <div className="mt-4 mb-4">
                <span>Follow us on</span>

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