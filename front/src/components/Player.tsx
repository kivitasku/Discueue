import { useCallback, useEffect, useRef, useState } from "react";
import type { Song as SongType } from "../types/Song";
import "./styles/Player.css";
import QueuePanel from "./QueuePanel";
import { mediaSession } from "../api/mediaSession";

interface PlayerProps {
  song: SongType | null;
  autoPlay?: boolean;
  onSongEnded: () => Promise<SongType | null>;
  onSelectArtist: (artistId: number) => void;
  onSelectAlbum: (albumId: number) => void;
  playingFromQueue: boolean;
}


export default function Player({
  song,
  autoPlay = true,
  onSongEnded,
  onSelectArtist,
  onSelectAlbum,
  playingFromQueue,
}: PlayerProps) {

  const [queueOpen, setQueueOpen] = useState(false);


const audioRef = useRef<HTMLAudioElement | null>(null);

useEffect(() => {
  console.log("AUDIO ELEMENT:", audioRef.current);
}, []);


useEffect(() => {
  console.log(
    "audio element:",
    audioRef.current,
    "src:",
    audioRef.current?.src
  );
}, [song]);

  /*
   * IMPORTANT:
   *
   * This callback is also used by the Android/iOS
   * lock-screen "Next" button.
   */
  const handleNext = useCallback(async () => {
    await onSongEnded();
  }, [onSongEnded]);

  mediaSession({
    song,
    audioRef,
    onNext: handleNext,
  });

    /*
   * Play whenever the song changes.
   */
  useEffect(() => {
    if (!song || !audioRef.current || !autoPlay) {
      return;
    }

    const playSong = async () => {
      try {
        console.log("Trying to play:", song.title);

        await audioRef.current?.play();

        console.log("Playback started:", song.title);
      } catch (error) {
        console.error("AUTOPLAY FAILED:", error);
      }
    };

    playSong();
  }, [song, autoPlay]);




const handleSongEnded = async () => {
    console.log(
    "================ SONG ENDED ================"
  );

  console.log(
    "Screen state:",
    document.visibilityState
  );

  console.log(
    "Current song:",
    song?.title
  );
  if (!song) {
    return;
  }
  await onSongEnded();
  console.log(
    "Next song should be playing now:",
    song?.title
  );
};



  if (!song) {
    return (
      <div className="player">
        <div className="player-info">
          <p>No song selected</p>
        </div>
      </div>
    );
  }
   
  return (
    <div className="player">

      <div className="player-album-cover">
        {song.albums?.cover_path ? (
            <img
              className="album-cover"
              src={song.albums.cover_path}
              alt={`${song.albums.title} album cover`}
            />
          ) : (
            <div
              className="album-cover-placeholder"
              aria-label="No album cover available"
            />
        )}
      </div>

      <div className="player-info">
        <h3>{song.title ?? "No song"}</h3>

        <p
          className="song-artist-link"
          onClick={() => onSelectArtist(song.artists.id)}
          role="button"
          tabIndex={0}
        >
          {song.artists.name ?? "No artist"}
        </p>


        <p
          className="song-album-link"
          onClick={() => {
            if (song.albums) {
              onSelectAlbum(song.albums.id);
            }
          }}
          role="button"
          tabIndex={0}
        >
          {song.albums?.title ?? "No album"}
        </p>
      </div>

      <audio
        id="main-audio"
        ref={audioRef}
        controls
        src={song.file_path}
        onEnded={handleSongEnded}
        preload="auto"
      />

      
      <div className="queue-settings-container">
        <button
          className="queue-button"
          aria-label="Open queue"
          onClick={() => setQueueOpen(true)}
        >
          ☰
        </button>
      </div>

      <QueuePanel
        isOpen={queueOpen}
        onClose={() => setQueueOpen(false)}
        currentSong={song}
        playingFromQueue={playingFromQueue}
      />



    </div>
  );
}
