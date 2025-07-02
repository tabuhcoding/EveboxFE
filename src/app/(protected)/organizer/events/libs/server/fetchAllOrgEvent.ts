export async function fetchAllOrgEvent(accessToken: string | null) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/org/event`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        next: {
          revalidate: 60, // ISR: Cập nhật dữ liệu mỗi 60s
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch all user events");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching all user events:", error);
  }
}