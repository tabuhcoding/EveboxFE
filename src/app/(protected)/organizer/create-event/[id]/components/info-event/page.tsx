'use client';

/* Package System */
import React, { useEffect } from 'react';
import 'tailwindcss/tailwind.css';
import { useState } from 'react';
// import { useRef } from 'react';
import { Divider } from '@nextui-org/react';
import { useRouter, useSearchParams } from 'next/navigation';
// import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

/* Package Application */
import NoteDialog from '../dialogs/noteDialog';
import FormInformationEventClient from './components/formInfoEvent';
import Navigation from '../common/navigation';
import { useAuth } from '../../../../../../../contexts/auth.context';
import { CreateEventDto } from 'types/models/event/createEvent.dto';
import { createEvent } from 'services/event.service';

interface InformationEventClientPageProps {
    setEventId?: (id: number) => void;
}

export default function InformationEventClientPage({ setEventId } : InformationEventClientPageProps) {
    // const { data: session } = useSession();
    const { user } = useAuth();
    const router = useRouter();
    const [open, setOpen] = useState(true);
    const [step] = useState(1);
    const [btnValidate, setBtnValidate] = useState("");

    const searchParams = useSearchParams(); 
    useEffect(() => {
        if (!searchParams?.get('step')) {
            router.replace('/organizer/create-event?step=infor');
        }
    }, [searchParams, router]);

    const handleSave = () => {
        setBtnValidate("Save");
    }

    const handleContinue = () => {
        setBtnValidate("Continue");
    }

    const handleNextStep = async (payload: CreateEventDto) => {
  const access_token = user?.accessToken;
  if (!access_token) return;

  try {
    const result = await createEvent(payload, access_token);

    const newEventId = result.id;
    if (setEventId) setEventId(newEventId);

    if (btnValidate === "Continue") {
      router.push(`/organizer/create-event/${newEventId}?step=showing`);
    } else {
      toast.success("Tạo sự kiện thành công!");
    }
  } catch (error: any) {
    toast.error(error.message || "Có lỗi xảy ra trong quá trình tạo sự kiện.");
    console.error("Error creating event:", error);
  }
};

    return (
        <>
            <div className="flex flex-col items-center justify-center p-10 relative">
                <span className="text-3xl font-semibold mb-6">Tạo sự kiện</span>
                <div className="w-full flex justify-center">
                    <ol className="flex space-x-6">
                        <Navigation step={step} />

                        <div className="flex gap-4 mt-4 mb-6">
                            <button className="text-xs w-18 border-2 border-[#0C4762] text-[#0C4762] font-bold py-2 px-4 rounded bg-white hover:bg-[#0C4762] hover:text-white transition-all"
                                type="submit" form="event-form" onClick={handleSave}>
                                Lưu
                            </button>
                        </div>

                        <div className="flex gap-4 mt-4 mb-6">
                            <button className="text-xs w-30 border-2 border-[#51DACF] text-[#0C4762] font-bold py-2 px-4 rounded bg-[#51DACF] hover:bg-[#0C4762] hover:border-[#0C4762] hover:text-white transition-all"
                                type="submit" form="event-form" onClick={handleContinue}>
                                Tiếp tục
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
