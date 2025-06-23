'use client';

/* Package System */
import { useEffect, useState } from 'react';

/* Package Application */
import { IUserTicketById } from '@/types/models/ticket/ticketInfoById';

import { fetchTicketById } from '../server/fetchTicketById';


export function useTicketById(id: string) {
  const [ticket, setTicket] = useState<IUserTicketById | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getTicket() {
      try {
        setLoading(true);
        const data = await fetchTicketById(id);
        setTicket(data);
      } catch (err) {
        console.error('Lỗi khi fetch ticket:', err);
        setError('Không thể tải dữ liệu vé.');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      getTicket();
    }
  }, [id]);

  return { ticket, loading, error };
}
