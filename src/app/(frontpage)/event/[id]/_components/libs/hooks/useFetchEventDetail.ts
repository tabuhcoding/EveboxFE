'use client';

/* Package System */
import { useEffect, useState } from 'react';

/* Package Application */
import { Event } from 'types/models/event/event';

import { fetchEventDetail } from '../server/fetchEventDetail';

export function useFetchEventDetail(eventId: string) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const eventData = await fetchEventDetail(eventId);
      if (!eventData) {
        setError('Error loading event details');
      }
      setEvent(eventData);
      setLoading(false);
    }

    fetchData();
  }, [eventId]);

  return { event, loading, error };
}
