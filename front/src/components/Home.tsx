import type { Album as AlbumType } from "../types/Album";

import AlbumLink from "./AlbumLink";


import "./Home.css";

interface HomeProps {

  recentAlbums: AlbumType[];

  onSelectAlbum: (album: AlbumType) => void;
  onSelectArtist: (artistId: number) => void;
}

export default function Home({

  recentAlbums,
  onSelectAlbum,
  onSelectArtist,

}: HomeProps) {

  return (
      <div className="home">
        <h2>Recently Played</h2>

        {recentAlbums.length === 0 ? (
          <div className="no-recent-albums">
            <p>No recent albums yet...</p>
            <p>Click right corner to check artists or search for music!</p>
          </div>
        ) : (
          recentAlbums.map((album) => (
            <AlbumLink
              key={album.id}
              album={album}
              onClick={onSelectAlbum}
              onSelectArtist={onSelectArtist}
            />
          ))
        )}
      </div>
  );
}