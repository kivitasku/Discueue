export async function updatePlayback(
  songId: number,
  fromQueue: boolean
) {
  const response = await fetch(`/api/playback/${songId}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fromQueue,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ?? "Failed to update playback"
    );
  }

  return data;
}