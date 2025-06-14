'use client'

/* Package System */
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'tailwindcss/tailwind.css';

/* Package Application */
import 'styles/admin/pages/EventDetail.css'
import 'styles/admin/pages/Dashboard.css';
import EventSlider from 'app/(frontpage)/_components/dashboard/eventSlider';
import { Event } from 'types/models/dashboard/dashboard.interface';

import { EventDetail } from '../../../../../types/models/event/eventdetail/event.interface';

import Description from "./description";
import EventBox from './eventBox';
import MoreInformation from './moreInformation';
import TicketDetails from "./ticketDetails";

// Client component
export default function EventDetailClient({ event: events, recommendedEvent: recommendedEvents }: { event: EventDetail, recommendedEvent: Event[]}) {
    return (
        <div className="event-detail-page mt-5 mb-5">
            <EventBox event={events} />

            <div className="row align-items-start">
                <div className="col-lg-8 col-md-12 custom-col-left ">
                    <Description description={events.description} />
                    <TicketDetails showings={events.showing} event={events} />
                </div>
                <MoreInformation title={events.title} location={events.venue} locationsString={events.locationsString} />
            </div>

            {/* Events Section */}
            <div className="d-flex justify-center mt-8">
                <div className="w-full md:w-5/6">
                    <EventSlider
                        title="anotherEvents"
                        subtitle="mayLike"
                        events={recommendedEvents}
                        showViewMore={true}
                    />
                </div>
            </div>
        </div>
    );
}

