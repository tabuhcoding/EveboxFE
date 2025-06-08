'use client'

/* Package System */
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap-icons/font/bootstrap-icons.css';
import 'tailwindcss/tailwind.css';

/* Package Application */
import 'styles/admin/pages/EventDetail.css'
import 'styles/admin/pages/Dashboard.css';
import Comment from "./comment";
import Description from "./description";
import TicketDetails from "./ticketDetails";
import MoreInformation from './moreInformation';
import EventSlider from 'app/(frontpage)/_components/dashboard/eventSlider';
import EventBox from './eventBox';
import { Event } from 'types/models/dashboard/dashboard.interface';
import { EventDetail } from './libs/interface/event.interface';

// Client component
export default function EventDetailClient({ event: events, recommendedEvent: recommendedEvents }: { event: EventDetail, recommendedEvent: Event[]}) {
    return (
        <div className="mt-5 mb-5">
            <EventBox event={events} />

            <div className="row align-items-start">
                <div className="col-lg-8 col-md-12 custom-col-left ">
                    <Description description={events.description} />
                    <TicketDetails event={events} showings={events.Showing} />
                </div>
                <MoreInformation title={events.title} location={events.venue} locationsString={events.locationsString} />
            </div>

            <Comment />

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

