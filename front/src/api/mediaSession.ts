import { useEffect, useRef } from "react";

import type { Song as SongType } from "../types/Song";

interface MediaSessionProps {
  song: SongType | null;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  onNext: () => Promise<void>;
}

export function mediaSession({
  song,
  audioRef,
  onNext,
}: MediaSessionProps) {
  const onNextRef = useRef(onNext);

  /*
   * Keep the latest onNext callback without
   * re-registering Media Session handlers.
   */
  useEffect(() => {
    onNextRef.current = onNext;
  }, [onNext]);

  /*
   * Update lock-screen metadata whenever the song changes.
   *
   * This does NOT touch the action handlers.
   */
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

  /*
   * Register Media Session controls.
   *
   * IMPORTANT:
   * This effect does NOT depend on `song` or `onNext`.
   * The handlers stay registered while songs change.
   */
  useEffect(() => {
    if (!("mediaSession" in navigator)) {
      return;
    }

    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    const handlePlay = async () => {
      try {
        await audio.play();
      } catch (error) {
        console.error("Media Session play failed:", error);
      }
    };

    const handlePause = () => {
      audio.pause();
    };

    const handleNext = async () => {
      try {
        await onNextRef.current();
      } catch (error) {
        console.error("Media Session next failed:", error);
      }
    };

    navigator.mediaSession.setActionHandler("play", handlePlay);
    navigator.mediaSession.setActionHandler("pause", handlePause);
    navigator.mediaSession.setActionHandler("nexttrack", handleNext);

    return () => {
      navigator.mediaSession.setActionHandler("play", null);
      navigator.mediaSession.setActionHandler("pause", null);
      navigator.mediaSession.setActionHandler("nexttrack", null);
    };
  }, []);

  /*
   * Keep Media Session playback state synchronized
   * with the actual audio element.
   */
  useEffect(() => {
    if (!("mediaSession" in navigator)) {
      return;
    }

    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    const handlePlay = () => {
      navigator.mediaSession.playbackState = "playing";
    };

    const handlePause = () => {
      navigator.mediaSession.playbackState = "paused";
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, []);
}