import type { Artist as ArtistType } from "../types/Artist";

import ArtistCard from "./ArtistCard";

import "./ArtistListPage.css";

interface ArtistListPageProps {
  artists: ArtistType[];
  onSelectArtist: (artistId: number) => void;
}

export default function ArtistListPage({
  artists,
  onSelectArtist,
}: ArtistListPageProps) {
  return (
    <div className="artist-list-page">
      {artists.map((artist) => (
        <ArtistCard
          key={artist.id}
          artist={artist}
          onClick={onSelectArtist}
        />
      ))}
    </div>
  );
}

