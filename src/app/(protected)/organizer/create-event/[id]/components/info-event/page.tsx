'use client';

/* Package System */
import React, { useEffect, useState } from 'react';
import 'tailwindcss/tailwind.css';
import { Divider } from '@nextui-org/react';
import { useParams, useRouter, useSearchParams, usePathname } from 'next/navigation';
import toast from 'react-hot-toast';
import { CircularProgress } from '@mui/material';

/* Package Application */
import NoteDialog from '../dialogs/noteDialog';
import FormInformationEventClient from './components/formInfoEvent';
import Navigation from '../common/navigation';
import { useAuth } from '../../../../../../../contexts/auth.context';
import { CreateEventDto } from 'types/models/event/createEvent.dto';
import { createEvent } from 'services/event.service';
import { useTranslations } from 'next-intl';

export default function InformationEventClientPage() {
    // const { data: session } = useSession();
    const { user } = useAuth();
    const router = useRouter();
    const [open, setOpen] = useState(true);
    const [step] = useState(1);
    const [btnValidate, setBtnValidate] = useState("");
    const t = useTranslations('common');
    const params = useParams();
    const currentEventId = params?.id;
    const [isContinuing, setIsContinuing] = useState(false);
    const pathname = usePathname();
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [previousPath, setPreviousPath] = useState(pathname);

    const transWithFallback = (key: string, fallback: string) => {
        const msg = t(key);
        if (!msg || msg.startsWith('common.')) return fallback;
        return msg;
    };

    const searchParams = useSearchParams();
    useEffect(() => {
        if (!searchParams?.get('step')) {
            router.replace('/organizer/create-event?step=infor');
        }
    }, [searchParams, router]);

    const handleContinue = () => {
        setBtnValidate("Continue");
    }

    const handleNextStep = async (payload: CreateEventDto) => {
        const access_token = user?.accessToken;
        if (!access_token) return;
        if (btnValidate === "Continue") {
            setIsContinuing(true);
        }

        try {
            const result = await createEvent(payload, access_token);

            const newEventId = result.id;

            if (btnValidate === "Continue") {
                setIsRedirecting(true);
                setPreviousPath(pathname);
                router.push(`/organizer/create-event/${newEventId}?step=showing`);
            } else {
                toast.success(transWithFallback('createEventSuccess', 'Tạo sự kiện thành công!'));
            }
        } catch (error: any) {
            toast.error(error.message || transWithFallback('createEventError', 'Có lỗi xảy ra trong quá trình tạo sự kiện.'));
            console.error("Error creating event:", error);
            setIsContinuing(false);
        }
    };

    useEffect(() => {
        if (isRedirecting && pathname !== previousPath) {
            setIsContinuing(false);
            setIsRedirecting(false);
        }
    }, [pathname, previousPath, isRedirecting]);

    return (
        <>
            <div className="flex flex-col items-center justify-center p-10 relative">
                <span className="text-3xl font-semibold mb-6">{currentEventId ? transWithFallback('editEvent', 'Chỉnh sửa sự kiện') : transWithFallback('createEvent', 'Tạo sự kiện')}</span>
                <div className="w-full flex justify-center">
                    <ol className="flex space-x-6">
                        <Navigation step={step} />

                        <div className="flex gap-4 mt-4 mb-6">
                            <button className="flex items-center justify-center gap-1 text-xs w-30 border-2 border-[#51DACF] text-[#0C4762] font-bold py-2 px-4 rounded bg-[#51DACF] hover:bg-[#0C4762] hover:border-[#0C4762] hover:text-white transition-all"
                                type="submit" form="event-form" onClick={handleContinue} disabled={isContinuing}>
                                {isContinuing && (
                                    <CircularProgress size={16} color="inherit" aria-label="Loading" />
                                )}
                                {transWithFallback('continue', 'Tiếp tục')}
                            </button>
                        </div>
                    </ol>
                </div>

                <Divider />
            </div>

            <NoteDialog open={open} onClose={() => setOpen(false)}></NoteDialog>

            <FormInformationEventClient onNextStep={handleNextStep} btnValidate={btnValidate} />
        </>
    )
}
