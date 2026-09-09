import { useEffect, useState } from "react";
import { getQueue, removeFromQueue } from "../api/queue";
import type { Song as SongType } from "../types/Song";
import "./QueuePanel.css";

interface QueueItem {
  id: number;
  position: number;
  songs: SongType;
}

interface QueuePanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentSong: SongType | null;
  playingFromQueue: boolean;
}

export default function QueuePanel({
  isOpen,
  onClose,
  currentSong,
  playingFromQueue,
}: QueuePanelProps) {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(false);

useEffect(() => {
  if (!isOpen) {
    return;
  }

  const loadQueue = async () => {
    setLoading(true);

    try {
      const data: QueueItem[] = await getQueue();

      setQueue(data);
    } catch (error) {
      console.error("Failed to load queue:", error);
    } finally {
      setLoading(false);
    }
  };

  loadQueue();
}, [isOpen]);

useEffect(() => {
  if (!currentSong || !playingFromQueue) {
    return;
  }

  setQueue((currentQueue) => {
    const index = currentQueue.findIndex(
      (item) => item.songs.id === currentSong.id
    );

    if (index === -1) {
      return currentQueue;
    }

    return [
      ...currentQueue.slice(0, index),
      ...currentQueue.slice(index + 1),
    ];
  });
}, [currentSong, playingFromQueue]);


const handleRemove = async (queueId: number) => {
  try {
    await removeFromQueue(queueId);

    setQueue((currentQueue) =>
      currentQueue.filter((item) => item.id !== queueId)
    );
  } catch (error) {
    console.error("Failed to remove song from queue:", error);
  }
};

  if (!isOpen) {
    return null;
  }

  return (
    <div className="queue-overlay" onClick={onClose}>
      <div
        className="queue-panel"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="queue-header">
          <h2>Queue</h2>

          <button
            className="queue-close-button"
            onClick={onClose}
            aria-label="Close queue"
          >
            ×
          </button>
        </div>

        <div className="queue-list">
          {loading ? (
            <p className="queue-empty">Loading...</p>
          ) : queue.length === 0 ? (
            <p className="queue-empty">Queue is empty</p>
          ) : (
            queue.map((item) => (
              <div className="queue-item" key={item.id}>

                {item.songs.albums?.cover_path ? (
                    <img
                        className="queue-song-cover"
                        src={item.songs.albums.cover_path}
                        alt={`${item.songs.albums.title} album cover`}
                    />
                    ) : (
                    <div className="queue-song-cover-placeholder" />
                )}

                <div className="queue-song-info">
                  <div className="queue-song-title">
                    {item.songs.title ?? "No song"}
                  </div>

                  <div className="queue-song-artist">
                    {item.songs.artists?.name ?? "No artist"}
                  </div>
                </div>

                <button
                  className="queue-remove-button"
                  onClick={() => handleRemove(item.id)}
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}