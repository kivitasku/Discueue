import { useEffect, useState } from "react";

import "./App.css";



import MainPage from "./components/MainPage";

import LoginPage from "./components/LoginPage";

import type { Song as SongType } from "./types/Song";

import type { Album as AlbumType } from "./types/Album";

import type { Artist as ArtistType } from "./types/Artist";

import { useNotification } from "./hooks/useNotification";
import Notification from "./components/Notification";


import { searchMusic } from "./api/search";
import { getCurrentUser, getRecentAlbums, logoutUser } from "./api/auth";
import { getArtists, getAlbum } from "./api/music";
import { updatePlayback } from "./api/playback";
import { addToQueue, getNextQueueSong } from "./api/queue";


function App() {

  const [loggedIn, setLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const [currentSong, setCurrentSong] =
    useState<SongType | null>(null);

  const [shouldAutoPlay, setShouldAutoPlay] = useState(false);

  const [searchQuery, setSearchQuery] =
    useState("");

  //old search results get info from these
  const [artists, setArtists] = useState<ArtistType[]>([]);
  
  //new search funtionality
  const [searchResults, setSearchResults] = useState({
    artists: [] as ArtistType[],
    albums: [] as AlbumType[],
    songs: [] as SongType[],
  });

const [artistOffset, setArtistOffset] = useState(0);
const [albumOffset, setAlbumOffset] = useState(0);
const [songOffset, setSongOffset] = useState(0);

const [hasMoreArtists, setHasMoreArtists] = useState(true);
const [hasMoreAlbums, setHasMoreAlbums] = useState(true);
const [hasMoreSongs, setHasMoreSongs] = useState(true);

const [loadingArtists, setLoadingArtists] = useState(false);
const [loadingAlbums, setLoadingAlbums] = useState(false);
const [loadingSongs, setLoadingSongs] = useState(false);


const [playingFromQueue, setPlayingFromQueue] = useState(false);

//user related states
const [recentAlbums, setRecentAlbums] =
  useState<AlbumType[]>([]);
const [userName, setUserName] = useState("");
const [playbackAlbumId, setPlaybackAlbumId] = useState<number | null>(null);
const [playbackAlbumSongId, setPlaybackAlbumSongId] = useState<number | null>(null);


const { 
  notification,
  showNotification,
} = useNotification();


//search query effect, triggers when searchQuery changes
useEffect(() => {
  const query = searchQuery.trim();
  setLoadingArtists(true);
  setLoadingAlbums(true);
  setLoadingSongs(true);

  if (!query) {
    setSearchResults({
      artists: [],
      albums: [],
      songs: [],
    });

    setArtistOffset(0);
    setAlbumOffset(0);
    setSongOffset(0);

    setHasMoreArtists(true);
    setHasMoreAlbums(true);
    setHasMoreSongs(true);

    return;
  }

  const timeout = setTimeout(async () => {
    try {
      setLoadingArtists(true);
      setLoadingAlbums(true);
      setLoadingSongs(true);

      const data = await searchMusic(query, 0, 5);

      setSearchResults(data);

      setArtistOffset(5);
      setAlbumOffset(5);
      setSongOffset(5);

      setHasMoreArtists(data.hasMoreArtists);
      setHasMoreAlbums(data.hasMoreAlbums);
      setHasMoreSongs(data.hasMoreSongs);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoadingArtists(false);
      setLoadingAlbums(false);
      setLoadingSongs(false);
    }
  }, 300);

  return () => clearTimeout(timeout);
}, [searchQuery]);

//handles showMore button click on artists
const handleShowMoreArtists = async () => {
  if (loadingArtists) return;

  try {

    const data = await searchMusic(
      searchQuery.trim(),
      artistOffset,
      5,
      "artists"
    );

    setSearchResults((previous) => ({
      ...previous,
      artists: [...previous.artists, ...data.artists],
    }));

    setArtistOffset((previous) => previous + 5);
    setHasMoreArtists(data.hasMoreArtists);
  } catch (error) {
    console.error("Failed to load more artists:", error);
  } finally {
    setLoadingArtists(false);
  }
};

//handles showMore button click on albums
const handleShowMoreAlbums = async () => {
  if (loadingAlbums) return;

  try {

    const data = await searchMusic(
      searchQuery.trim(),
      albumOffset,
      5,
      "albums"
    );

    setSearchResults((previous) => ({
      ...previous,
      albums: [...previous.albums, ...data.albums],
    }));

    setAlbumOffset((previous) => previous + 5);
    setHasMoreAlbums(data.hasMoreAlbums);
  } catch (error) {
    console.error("Failed to load more albums:", error);
  } finally {
    setLoadingAlbums(false);
  }
};

//handles showMore button click on songs
const handleShowMoreSongs = async () => {
  if (loadingSongs) return;

  try {

    const data = await searchMusic(
      searchQuery.trim(),
      songOffset,
      5,
      "songs"
    );

    setSearchResults((previous) => ({
      ...previous,
      songs: [...previous.songs, ...data.songs],
    }));

    setSongOffset((previous) => previous + 5);
    setHasMoreSongs(data.hasMoreSongs);
  } catch (error) {
    console.error("Failed to load more songs:", error);
  } finally {
    setLoadingSongs(false);
  }
};



//loads current user data from server if logged in
const loadCurrentUser = async () => {
  try {
    const [userData, recentAlbumsData] = await Promise.all([
      getCurrentUser(),
      getRecentAlbums(),
    ]);

    setLoggedIn(true);
    setUserName(userData.username);

    // Restore playback state
    setPlaybackAlbumId(
      userData.playback_album_id ?? null
    );

    setPlaybackAlbumSongId(
      userData.playback_album_song_id ?? null
    );

    // Restore last played song
    setCurrentSong(userData.songs ?? null);

    // Restore recent albums
    setRecentAlbums(recentAlbumsData);

    // Don't automatically start playing after login
    setShouldAutoPlay(false);
  } catch (error) {
    console.error("Authentication check failed:", error);

    setLoggedIn(false);
    setRecentAlbums([]);
  } finally {
    setAuthLoading(false);
  }
};


//run the loadCurrentUser when the app starts
useEffect(() => {
  loadCurrentUser();
}, []);

//fetch all artists
useEffect(() => {
  if (!loggedIn) {
    return;
  }

  const fetchArtists = async () => {
    try {
      const data = await getArtists();
      setArtists(data);
    } catch (error) {
      console.error("Error fetching artists:", error);
    }
  };

  fetchArtists();
}, [loggedIn]);


//timeout
useEffect(() => {
  if (!loggedIn) {
    return;
  }
  const checkSession = async () => {
    try {
      const response = await getCurrentUser();

      if (response.status === 401) {
        setLoggedIn(false);
        setCurrentSong(null);
        setShouldAutoPlay(false);
        setUserName("");
        setPlaybackAlbumId(null);
        setPlaybackAlbumSongId(null);
        setRecentAlbums([]);
      }
    } catch (error) {
      console.error("Session check failed:", error);
    }
  };

  const interval = setInterval(checkSession, 30_000); // 30 seconds

  return () => clearInterval(interval);
}, [loggedIn]);




//handles the playback state update on the server side, and updates the recent albums
//and currently playing album
const handleUpdatePlayback = async (
  song: SongType,
  fromQueue: boolean
) => {
  try {
    const data = await updatePlayback(
      song.id,
      fromQueue
    );

    setRecentAlbums(data.recentAlbums);
  } catch (error) {
    console.error(
      "Failed to update playback:",
      error
    );
  }
};

//handle add to queue button call
const handleAddToQueue = async (song: SongType) => {
  try {
    const data = await addToQueue(song.id);

    console.log("Added to queue:", data);

    showNotification(`Added "${song.title}" to queue`);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "QUEUE_FULL"
    ) {
      showNotification("Queue is full");
      return;
    }

    console.error("Error adding song to queue:", error);
  }
};


//handle song ended event
const handleSongEnded = async (): Promise<SongType | null> => {
  setShouldAutoPlay(true);

  if (!currentSong) {
    return null;
  }

  try {
    // First try to get the next song from the user's queue
    const nextSong = await getNextQueueSong();

    if (nextSong) {
      /*
       * Queue playback.
       *
       * Do NOT change playbackAlbumId or
       * playbackAlbumSongId.
       */
      setPlayingFromQueue(true);
      setCurrentSong(nextSong);

      await handleUpdatePlayback(nextSong, true);

      return nextSong;
    }

    // Queue is empty.
    // Continue from the album we were originally playing.
    setPlayingFromQueue(false);
    if (!playbackAlbumId) {
      setCurrentSong(null);
      return null;
    }

    const album = await getAlbum(playbackAlbumId);

    const currentIndex = album.songs.findIndex(
      (song: SongType) =>
        song.id === playbackAlbumSongId
    );

    if (
      currentIndex !== -1 &&
      currentIndex + 1 < album.songs.length
    ) {
      const nextAlbumSong =
        album.songs[currentIndex + 1];

      setCurrentSong(nextAlbumSong);
      setPlaybackAlbumSongId(nextAlbumSong.id);

      await handleUpdatePlayback(
        nextAlbumSong,
        false
      );

      return nextAlbumSong;

    } else {
      setCurrentSong(null);
      return null;
    }
  } catch (error) {
    console.error(
      "Error selecting next song:",
      error
    );

    setCurrentSong(null);
    return null;
  }
};




//handle logout button call
const handleLogout = async () => {
  try {
    await logoutUser();

    setLoggedIn(false);
  } catch (error) {
    console.error("Logout error:", error);
  }
};



  //web page
  if (authLoading) {
    return <div>Loading...</div>;
  }

  if (!loggedIn) {
  return (
      <LoginPage
        onLogin={loadCurrentUser}
      />
    );
  }

  return (
  <div className="app">

    {notification && (
      <Notification message={notification} />
    )}

    <MainPage
      albums={searchResults.albums}
      recentAlbums={recentAlbums}
      artists={searchResults.artists}
      songs={searchResults.songs}
      onPlay={(song) => {
        setCurrentSong(song);
        setShouldAutoPlay(true);

        if (song.album_id !== null) {
          setPlaybackAlbumId(song.album_id);
          setPlaybackAlbumSongId(song.id);
        } else {
          setPlaybackAlbumId(null);
          setPlaybackAlbumSongId(null);
        }

        handleUpdatePlayback(song, false);
      }}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      handleLogout={handleLogout}
      currentSong={currentSong}
      onSongEnded={handleSongEnded}
      autoPlay={shouldAutoPlay}
      onAddToQueue={handleAddToQueue}
      userName={userName}
      onShowMoreArtists={handleShowMoreArtists}
      onShowMoreAlbums={handleShowMoreAlbums}
      onShowMoreSongs={handleShowMoreSongs}
      hasMoreArtists={hasMoreArtists}
      hasMoreAlbums={hasMoreAlbums}
      hasMoreSongs={hasMoreSongs}
      loadingArtists={loadingArtists}
      loadingAlbums={loadingAlbums}
      loadingSongs={loadingSongs}
      allArtists={artists}
      playingFromQueue={playingFromQueue}
    />

    
  </div>
);
}

export default App;