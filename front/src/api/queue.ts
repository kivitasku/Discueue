export async function getQueue() {
  const response = await fetch("/api/queue", {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch queue");
  }

  return response.json();
}


export async function removeFromQueue(queueId: number) {
  const response = await fetch(`/api/queue/${queueId}`, {
    method: "DELETE",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to remove song");
  }

  return data;
}