import { useEffect } from "react";

import type { Song as SongType } from "../types/Song";

interface MediaSessionProps {
  song: SongType | null;
  onNext: () => void;
}

export function useMediaSession({
  song,
  onNext,
}: MediaSessionProps) {

  // Update metadata whenever the song changes
  useEffect(() => {
    if (!("mediaSession" in navigator) || !song) {
      return;
    }

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

  //set actionHandlers
  useEffect(() => {
  if (!("mediaSession" in navigator)) {
    return;
  }

  navigator.mediaSession.setActionHandler(
    "nexttrack",
    onNext
  );

  return () => {
    navigator.mediaSession.setActionHandler(
      "nexttrack",
      null
    );
  };
}, [onNext]);
}
