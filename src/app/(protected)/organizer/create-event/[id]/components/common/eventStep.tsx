'use client';

/* Package System */
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

/* Package Application */
import InformationEventClientPage from '../info-event/page';
import TimeAndTypeTickets from '../time-type/page';
// import Setting from '../info-setting/page';
import CreateQuestions from '../info-regis/page';

interface EventStepProps {
    eventId: number;
    setEventId: (id: number) => void;
}

export default function EventStep({ eventId, setEventId }: EventStepProps) {
    const searchParams = useSearchParams();
    const step = searchParams?.get('step') || 'info';
    const router = useRouter();

    const [showingIds, setShowingIds] = useState<string[]>([]);

    useEffect(() => {
        const validSteps = ["info", "showing", "setting", "questions"];
        if (step && !validSteps.includes(step)) {
            router.replace(`/organizer/create-event/${eventId}?step=info`);
        }
    }, [step, router, eventId]);

    return (
        <>
            {step === 'info' && <InformationEventClientPage setEventId={setEventId} />}
            {step === 'showing' && <TimeAndTypeTickets setShowingIds={setShowingIds} />}
            {/* {step === 'setting' && <Setting eventId={eventId} />} */}
            {step === 'questions' && <CreateQuestions showingIds={showingIds} />}
        </>
    );
}
