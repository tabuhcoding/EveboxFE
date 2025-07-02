'use client';

/* Package System */
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

/* Package Application */
import InformationEventClientPage from '../info-event/page';
import TimeAndTypeTickets from '../time-type/page';
// import Setting from '../info-setting/page';
import CreateQuestions from '../info-regis/page';

interface EventStepProps {
    eventId: number;
}

export default function EventStep({ eventId }: EventStepProps) {
    const searchParams = useSearchParams();
    const step = searchParams?.get('step') || 'info';
    const router = useRouter();

    useEffect(() => {
        const validSteps = ["info", "showing", "setting", "questions"];
        if (step && !validSteps.includes(step)) {
            router.replace(`/organizer/create-event/${eventId}?step=info`);
        }
    }, [step, router, eventId]);

    return (
        <>
            {step === 'info' && <InformationEventClientPage/>}
            {step === 'showing' && <TimeAndTypeTickets />}
            {/* {step === 'setting' && <Setting eventId={eventId} />} */}
            {step === 'questions' && <CreateQuestions/>}
        </>
    );
}
