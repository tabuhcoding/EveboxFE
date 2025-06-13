export async function fetchEventDetail(eventId: string, accessToken?: string) {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/event/detail?eventId=${eventId}`,
      {
        method: "GET",
        headers,
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
  }
}
