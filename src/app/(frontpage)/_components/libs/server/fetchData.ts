/* Package System */
import axios from 'axios';

export const fetchProvinces = async () => {
  try {
    const response = await axios.get('https://provinces.open-api.vn/api/p/');
    return response.data || [];
  } catch (error) {
    console.error("Error fetching provinces:", error);
    return [];
  }
};

export const fetchEvents = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/event/front-display`,
      {
        next: {
          revalidate: 60 // ISR: Cập nhật dữ liệu mỗi 60s
        },
        // cache: "no-store",
      }
    );

    if (!response.ok) throw new Error('Failed to fetch events');

    return response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error; // Sẽ được xử lý bởi error.tsx
  }
};

export const fetchRecommendEvents = async (time: string) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/event/recommended-events?timeWindow=${time}`,
            {
                next: {
                    revalidate: 60 // ISR: Cập nhật dữ liệu mỗi 60s
                },
                // cache: "no-store",
            }
        );

        if (!response.ok) throw new Error('Failed to fetch slider events');
        return response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error; // Sẽ được xử lý bởi error.tsx
    }
};

interface FetchSearchEventsParams {
  title: string;
  type?: string;       // comma-separated category names
  startDate?: string;  // in YYYY-MM-DD format
  endDate?: string;    // in YYYY-MM-DD format
  minPrice?: number;
  maxPrice?: number;
}

export async function fetchSearchEvents({
  title,
  type,
  startDate,
  endDate,
  minPrice,
  maxPrice,
}: FetchSearchEventsParams) {
  try {
    const params = new URLSearchParams();
    params.append("title", title);
    if (type) params.append("type", type);
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    if (minPrice !== undefined) params.append("minPrice", minPrice.toString());
    if (maxPrice !== undefined) params.append("maxPrice", maxPrice.toString());

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/event/search?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        next: {
          revalidate: 60, // ISR: Cập nhật dữ liệu mỗi 60s
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch event details");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching event details:", error);
    return [];
  }
}

