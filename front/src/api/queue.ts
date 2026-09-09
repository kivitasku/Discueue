export async function getNextQueueSong() {
  const response = await fetch("/api/queue/next", {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

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

export async function addToQueue(songId: number) {
  const response = await fetch("/api/queue/add", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      songId,
    }),
  });

  const data = await response.json();

  if (response.status === 409) {
    throw new Error("QUEUE_FULL");
  }

  if (!response.ok) {
    throw new Error(data.error ?? "Failed to add song to queue");
  }

  return data;
}