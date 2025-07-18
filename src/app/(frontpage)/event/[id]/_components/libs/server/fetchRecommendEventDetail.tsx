export const fetchRecommendEventDetail = async (eventId: string, limit = 20) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/event/detail/recommended-events?eventId=${eventId}&limit=${limit}`,
      {
        next: {
          revalidate: 60, // ISR: Tự động làm mới mỗi 60s
        },
      }
    );

    if (!response.ok) {
      return { error: 'Failed to fetch recommended events' };
    }
    return response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};