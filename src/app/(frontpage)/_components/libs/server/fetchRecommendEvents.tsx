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