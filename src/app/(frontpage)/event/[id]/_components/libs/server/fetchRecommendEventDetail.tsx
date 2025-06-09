export const fetchRecommendEventDetail = async (eventId: string, limit = 10) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/event/detail/recommended-events?eventId=${eventId}&limit=${limit}`,
      {
        next: {
          revalidate: 60, // ISR: Tự động làm mới mỗi 60s
        },
      }
    );

    if (!response.ok) throw new Error('Failed to fetch recommended events');
    return response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};