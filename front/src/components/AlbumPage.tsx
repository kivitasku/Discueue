import { useEffect, useState } from "react";
import { getAlbum } from "../api/music";

import type { Album as AlbumType } from "../types/Album";
import type { Song as SongType } from "../types/Song";

import Song from "./Song";

import "./AlbumPage.css";
import ContentPage from "./ContentPage";

interface AlbumPageProps {
  albumId: number;
  onBack: () => void;
  onPlay: (song: SongType) => void;
  onSelectArtist: (artistId: number) => void;
  onSongMenuOpen: (song: SongType, isAlbumPage: boolean) => void;
  currentSong: SongType | null;
}

export default function AlbumPage({
  albumId,
  onBack,
  onPlay,
  onSelectArtist,
  onSongMenuOpen,
  currentSong,
}: AlbumPageProps) {
  const [fullAlbum, setFullAlbum] = useState<AlbumType | null>(null);

useEffect(() => {
  getAlbum(albumId)
    .then((data) => {
      setFullAlbum(data);
    })
    .catch((error) => {
      console.error("Error fetching album:", error);
    });
}, [albumId]);

  if (!fullAlbum) {
    return (
      <ContentPage onBack={onBack}>
        <p>Loading album...</p>
      </ContentPage>
    );
  }

  return (

    <ContentPage onBack={onBack}>
      <div className="album-page-header">
        <div className="album-cover-container">

          {fullAlbum.cover_path ? (
            <img
              className="album-cover"
              src={fullAlbum.cover_path}
              alt={`${fullAlbum.title} album cover`}
            />
          ) : (
            <div
              className="album-cover-placeholder"
              aria-label="No album cover available"
            />
          )}
        </div>

        <div className="album-page-info">
          <h1>{fullAlbum.title}</h1>

          <a
            className="album-artist-link"
            onClick={() => onSelectArtist(fullAlbum.artists.id)}
            role="button"
            tabIndex={0}
          >
            {fullAlbum.artists.name}
          </a>

          <p>{fullAlbum.year ?? "Unknown year"}</p>
        </div>
      </div>

      <div className="album-songs">
        {fullAlbum.songs.map((song) => (
          <Song 
            key={song.id}
            song={song}
            onPlay={onPlay}
            onSelectArtist={onSelectArtist}
            isAlbumPage={true}
            onSongMenuOpen={onSongMenuOpen}
            currentSong={currentSong}
          />
        ))}
      </div>

    </ContentPage>


  );
}