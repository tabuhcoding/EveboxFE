'use client';

/* Package System */
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

/* Package Application */
import { IUserTicketById } from '@/types/models/ticket/ticketInfoById';

import { fetchTicketById } from '../server/fetchTicketById';
import { getTicketById } from '@/services/booking.service';


export function useTicketById(id: string) {
  const [ticket, setTicket] = useState<IUserTicketById | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    async function getTicket() {
      try {
        setLoading(true);
        const response = await getTicketById(id, session?.user?.accessToken || "");
        if (response?.statusCode === 200) {
          setTicket(response.data);
        }
        else {
          setTicket(null);
        }
        // const data = await fetchTicketById(id);
        // setTicket(data);
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
