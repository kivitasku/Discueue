import { useEffect } from "react";

import type { Song as SongType } from "../types/Song";

interface MediaSessionProps {
  song: SongType | null;
}

export function useMediaSession({
  song,
}: MediaSessionProps) {
  // Initialize Media Session once
  useEffect(() => {
    if (!("mediaSession" in navigator)) {
      return;
    }

    console.log("MEDIA SESSION INITIALIZED");
  }, []);

  // Update metadata whenever the song changes
  useEffect(() => {
    if (!("mediaSession" in navigator) || !song) {
      return;
    }

    console.log("MEDIA SESSION UPDATE:", song.title);

    navigator.mediaSession.metadata = new MediaMetadata({
      title: song.title ?? "Unknown song",
      artist: song.artists?.name ?? "Unknown artist",
      album: song.albums?.title ?? "",
      artwork: song.albums?.cover_path
        ? [
            {
              src: song.albums.cover_path,
              sizes: "512x512",
            },
          ]
        : [],
    });
  }, [song]);
}
