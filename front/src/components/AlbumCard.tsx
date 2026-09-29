import type { Album as AlbumType } from "../types/Album";
import Card from "./Card";
import "./AlbumCard.css";

interface AlbumCardProps {
  album: AlbumType;
  onClick: (album: AlbumType) => void;
  onSelectArtist?: (artistId: number) => void;
  isArtistPage?: boolean;
}

export default function AlbumCard({
  album,
  onClick,
  onSelectArtist = () => {},
  isArtistPage = false,
}: AlbumCardProps) {
  return (
    <Card onClick={() => onClick(album)}>
      
      <div className="album-card-container">
        <div className="album-card-info">
          <h3>{album.title ?? "No album"}</h3>

          {!isArtistPage && (

            <a
              className="album-artist-link"
              href="#"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onSelectArtist(album.artists.id);
              }}
            >
              {album.artists?.name ?? "No artist"}
            </a>


          )}


          <p>{album.year ?? "Unknown year"}</p>
        </div>

          <div className="album-card-cover">
            {album.cover_path ? (
              <img
                className="album-cover"
                src={album.cover_path}
                alt={`${album.title} album cover`}
              />
            ) : (
              <div
                className="album-cover-placeholder"
                aria-label="No album cover available"
              />
            )}
          </div>


      </div>

    </Card>

  );
}