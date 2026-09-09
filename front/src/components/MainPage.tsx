import { useState } from "react";

import type { Album as AlbumType } from "../types/Album";
import type { Artist as ArtistType } from "../types/Artist";
import type { Song as SongType } from "../types/Song";

import SearchResults from "./SearchResults";
import AlbumPage from "./AlbumPage";
import ArtistPage from "./ArtistPage";
import ArtistListPage from "./ArtistListPage";
import Home from "./Home";

import "./MainPage.css";
import Player from "./Player";
import Header from "./Header";
import SongMenu from "./SongMenu";

interface MainPageProps {
  albums: AlbumType[];
  artists: ArtistType[];
  allArtists: ArtistType[];
  songs: SongType[];
  recentAlbums: AlbumType[];
  onPlay: (song: SongType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleLogout: () => void;
  currentSong: SongType | null;
  onSongEnded: () => Promise<SongType | null>;
  autoPlay: boolean;
  onAddToQueue: (song: SongType) => void;
  userName: string;
  
  onShowMoreArtists: () => void;
  onShowMoreAlbums: () => void;
  onShowMoreSongs: () => void;

  hasMoreArtists: boolean;
  hasMoreAlbums: boolean;
  hasMoreSongs: boolean;

  loadingArtists: boolean;
  loadingAlbums: boolean;
  loadingSongs: boolean;

  playingFromQueue: boolean;
}

export default function MainPage({
  albums,
  artists,
  songs,
  recentAlbums,
  onPlay,
  searchQuery,
  setSearchQuery,
  handleLogout,
  currentSong,
  onSongEnded,
  autoPlay,
  onAddToQueue,
  userName,
  onShowMoreArtists,
  onShowMoreAlbums,
  onShowMoreSongs,
  hasMoreArtists,
  hasMoreAlbums,
  hasMoreSongs,
  loadingArtists,
  loadingAlbums,
  loadingSongs,
  allArtists,
  playingFromQueue,
}: MainPageProps) {
  const [selectedAlbumId, setSelectedAlbumId] =
    useState<number | null>(null);

    const [selectedArtistId, setSelectedArtistId] =
    useState<number | null>(null);

    const [showArtistList, setShowArtistList] =
      useState(false);

    const [sideMenuOpen, setSideMenuOpen] = useState(false);

    const [songMenuIsAlbumPage, setSongMenuIsAlbumPage] = useState(false);
    const [songMenuOpen, setSongMenuOpen] = useState(false);
    const [songMenuSong, setSongMenuSong] =
      useState<SongType | null>(null);

    

    const filteredArtists = artists.filter((artist) =>
      artist.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );

    const filteredAlbums = albums.filter((album) =>
      album.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );

    const filteredSongs = songs.filter((song) =>
      song.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );

  const handleSelectAlbum = (albumId: number) => {
    resetView();
    setSelectedAlbumId(albumId);
  };


  const handleSelectArtist = (artistId: number) => {
      resetView();
      setSelectedArtistId(artistId);
  };

  const handleSongMenuOpen = (song: SongType, isAlbumPage: boolean) => {
    setSongMenuSong(song);
    setSongMenuIsAlbumPage(isAlbumPage);
    setSongMenuOpen(true);
  }

  function resetView()  {
    setSearchQuery("");
    setSelectedAlbumId(null);
    setShowArtistList(false);
    setSelectedArtistId(null);
    setSideMenuOpen(false);
  }

    

  return (
    <main>
      {searchQuery.trim() ? (
        <SearchResults
            artists={filteredArtists}
            albums={filteredAlbums}
            songs={filteredSongs}
            onSelectArtist={handleSelectArtist}
            onSelectAlbum={handleSelectAlbum}
            onPlay={onPlay}
            onSongMenuOpen={handleSongMenuOpen}
            currentSong={currentSong}
            onShowMoreArtists={onShowMoreArtists}
            onShowMoreAlbums={onShowMoreAlbums}
            onShowMoreSongs={onShowMoreSongs}
            hasMoreArtists={hasMoreArtists}
            hasMoreAlbums={hasMoreAlbums}
            hasMoreSongs={hasMoreSongs}
            loadingArtists={loadingArtists}
            loadingAlbums={loadingAlbums}
            loadingSongs={loadingSongs}
        />
      ) : selectedArtistId ? (
        <ArtistPage
          artistId={selectedArtistId}
          onBack={() => setSelectedArtistId(null)}
          onSelectAlbum={(album) => {
            setSelectedArtistId(null);
            setSelectedAlbumId(album.id);
          }}
        />
      ) : selectedAlbumId ? (
        <AlbumPage
          albumId={selectedAlbumId}
          onBack={() => setSelectedAlbumId(null)}
          onPlay={onPlay}
          onSelectArtist={setSelectedArtistId}
          onSongMenuOpen={handleSongMenuOpen}
          currentSong={currentSong}
        />
      ) : showArtistList ? (
        <ArtistListPage
          artists={allArtists}
          onSelectArtist={setSelectedArtistId}
        />
      ) : (
        <Home 
          recentAlbums={recentAlbums}
          onSelectAlbum={(album) => {
            setSelectedAlbumId(album.id);
          }}
          onSelectArtist={handleSelectArtist}
        />
      )}

      <Header
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        onOpen={() => setSideMenuOpen(true)}
        onClose={() => setSideMenuOpen(false)}
        onShowArtists={() => {
          resetView();
          setShowArtistList(true);
        }}
        onHome={() => {
          resetView();
        }}
        onLogout={handleLogout}
        menuOpen={sideMenuOpen}
        userName={userName}

      />

      <SongMenu
        isOpen={songMenuOpen}
        onClose={() => setSongMenuOpen(false)}
        song={songMenuSong}
        isAlbumPage={songMenuIsAlbumPage}
        onAddToQueue={onAddToQueue}
        onSelectArtist={handleSelectArtist}
        onSelectAlbum={handleSelectAlbum}
      />




    <Player 
      song={currentSong} 
      onSongEnded={onSongEnded} 
      autoPlay={autoPlay} 
      onSelectArtist={handleSelectArtist}
      onSelectAlbum={handleSelectAlbum}
      playingFromQueue={playingFromQueue}
      
    />

    </main>
  );
}