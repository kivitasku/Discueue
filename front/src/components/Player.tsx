import { useState } from "react";
import type { Song as SongType } from "../types/Song";
import "./Player.css";
import QueuePanel from "./QueuePanel";

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


const handleSongEnded = async () => {
  if (!song) {
    return;
  }
  await onSongEnded();
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
        controls
        autoPlay={autoPlay}
        src={song.file_path}
        onEnded={handleSongEnded}
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
