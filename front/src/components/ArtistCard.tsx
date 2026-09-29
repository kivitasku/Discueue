import type { Artist as ArtistType } from "../types/Artist";
import Card from "./Card";

import "./ArtistCard.css";

interface ArtistCardProps {
  artist: ArtistType;
  onClick: (artistId: number) => void;
}

export default function ArtistCard({
  artist,
  onClick,
}: ArtistCardProps) {
  return (
    <Card onClick={() => onClick(artist.id)}>
      <div
      className="artist-card"
      >
        <h3>{artist.name}</h3>
      </div>
    </Card>


  );
}