export async function getAlbum(albumId: number) {
  const response = await fetch(`/api/albums/${albumId}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch album");
  }

  return response.json();
}

export async function getArtist(artistId: number) {
  const response = await fetch(`/api/artists/${artistId}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch artist");
  }

  return response.json();
}