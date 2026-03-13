import { useEffect, useMemo, useRef, useState } from "react";
import YouTube from "react-youtube";

type PlayerState = "idle" | "ready" | "playing" | "paused" | "error";

function extractPlaylistId(url: string): string | null {
    try {
        const parsed = new URL(url);

        const list = parsed.searchParams.get("list");
        if (list) return list;

        if (parsed.hostname.includes("youtu.be")) {
            return null;
        }

        return null;
    } catch {
        return null;
    }
}

function formatTitle(title: string, max = 42): string {
    if (!title) return "No track loaded";
    return title.length > max ? `${title.slice(0, max)}...` : title;
}

export default function FocusAudioBar() {
    const [playlistUrl, setPlaylistUrl] = useState("");
    const [playlistId, setPlaylistId] = useState<string | null>(null);
    const [inputError, setInputError] = useState("");
    const [playerState, setPlayerState] = useState<PlayerState>("idle");
    const [currentTitle, setCurrentTitle] = useState("No track loaded");
    const [volume, setVolume] = useState(40);
    const [isMuted, setIsMuted] = useState(false);

    const playerRef = useRef<any>(null);

    const isLoaded = useMemo(() => !!playlistId, [playlistId]);
    const isPlaying = playerState === "playing";

    const handleLoadPlaylist = () => {
        const extracted = extractPlaylistId(playlistUrl.trim());

        if (!extracted) {
            setInputError("Invalid YouTube playlist link.");
            setPlaylistId(null);
            setPlayerState("error");
            setCurrentTitle("No track loaded");
            return;
        }

        setInputError("");
        setPlaylistId(extracted);
        setPlayerState("idle");
        setCurrentTitle("Loading playlist...");
    };

    const syncCurrentTitle = () => {
        const internalPlayer = playerRef.current;
        if (!internalPlayer || typeof internalPlayer.getVideoData !== "function") return;

        const data = internalPlayer.getVideoData();
        const title = data?.title?.trim();
        if (title) {
            setCurrentTitle(title);
        }
    };

    const onReady = (event: any) => {
        playerRef.current = event.target;

        try {
            event.target.setVolume(volume);
            event.target.loadPlaylist({
                list: playlistId!,
                listType: "playlist",
                index: 0,
                startSeconds: 0,
            });
            setPlayerState("ready");
            syncCurrentTitle();
        } catch {
            setPlayerState("error");
            setInputError("Unable to load this playlist.");
        }
    };

    const onStateChange = (event: any) => {
        const state = event.data;

        // YouTube states:
        // -1 unstarted, 0 ended, 1 playing, 2 paused, 3 buffering, 5 cued
        if (state === 1) {
            setPlayerState("playing");
            syncCurrentTitle();
        } else if (state === 2) {
            setPlayerState("paused");
            syncCurrentTitle();
        } else if (state === 5) {
            setPlayerState("ready");
            syncCurrentTitle();
        }
    };

    const handlePlayPause = () => {
        const internalPlayer = playerRef.current;
        if (!internalPlayer) return;

        if (isPlaying) {
            internalPlayer.pauseVideo();
            setPlayerState("paused");
        } else {
            internalPlayer.playVideo();
            setPlayerState("playing");
        }
    };

    const handleNext = () => {
        const internalPlayer = playerRef.current;
        if (!internalPlayer) return;
        internalPlayer.nextVideo();
        setTimeout(syncCurrentTitle, 300);
    };

    const handlePrev = () => {
        const internalPlayer = playerRef.current;
        if (!internalPlayer) return;
        internalPlayer.previousVideo();
        setTimeout(syncCurrentTitle, 300);
    };

    const handleMuteToggle = () => {
        const internalPlayer = playerRef.current;
        if (!internalPlayer) return;

        if (isMuted) {
            internalPlayer.unMute();
            internalPlayer.setVolume(volume);
            setIsMuted(false);
        } else {
            internalPlayer.mute();
            setIsMuted(true);
        }
    };

    const handleVolumeChange = (value: number) => {
        setVolume(value);
        const internalPlayer = playerRef.current;
        if (!internalPlayer) return;

        internalPlayer.setVolume(value);

        if (value > 0 && isMuted) {
            internalPlayer.unMute();
            setIsMuted(false);
        }
    };

    useEffect(() => {
        const internalPlayer = playerRef.current;
        if (!internalPlayer) return;

        try {
            internalPlayer.setVolume(volume);
        } catch {
            // silent
        }
    }, [volume]);

    return (
        <section className={`focus-audio-bar ${isPlaying ? "is-playing" : ""}`}>
            <div className="focus-audio-row focus-audio-row--top">
                <span className="focus-audio-badge">🎧 Focus</span>

                <div className="focus-audio-input-group">
                    <input
                        type="text"
                        value={playlistUrl}
                        onChange={(e) => setPlaylistUrl(e.target.value)}
                        placeholder="Paste playlist"
                        className="focus-audio-input"
                    />
                    <button
                        type="button"
                        className="focus-audio-load-btn"
                        onClick={handleLoadPlaylist}
                    >
                        Load
                    </button>
                </div>
            </div>

            <div className="focus-audio-row focus-audio-row--bottom">
                <div className="focus-audio-track-inline">
                    <span className="focus-audio-track-inline__label">Track:</span>
                    <span className="focus-audio-track-inline__title">
                        {formatTitle(currentTitle, 56)}
                    </span>
                </div>

                <div className="focus-audio-controls-inline">
                    <button
                        type="button"
                        className="focus-audio-icon-btn"
                        onClick={handlePrev}
                        disabled={!isLoaded}
                        aria-label="Previous"
                    >
                        ⏮
                    </button>

                    <button
                        type="button"
                        className="focus-audio-play-btn"
                        onClick={handlePlayPause}
                        disabled={!isLoaded}
                        aria-label={isPlaying ? "Pause" : "Play"}
                    >
                        {isPlaying ? "⏸" : "▶"}
                    </button>

                    <button
                        type="button"
                        className="focus-audio-icon-btn"
                        onClick={handleNext}
                        disabled={!isLoaded}
                        aria-label="Next"
                    >
                        ⏭
                    </button>

                    <button
                        type="button"
                        className="focus-audio-icon-btn"
                        onClick={handleMuteToggle}
                        disabled={!isLoaded}
                        aria-label={isMuted ? "Unmute" : "Mute"}
                    >
                        {isMuted ? "🔇" : "🔊"}
                    </button>

                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume}
                        onChange={(e) => handleVolumeChange(Number(e.target.value))}
                        className="focus-audio-volume__slider"
                        aria-label="Volume"
                    />
                </div>
            </div>

            {inputError ? <p className="focus-audio-error">{inputError}</p> : null}

            <div className="focus-audio-player-hidden" aria-hidden="true">
                {playlistId ? (
                    <YouTube
                        key={playlistId}
                        videoId={undefined}
                        opts={{
                            width: "1",
                            height: "1",
                            playerVars: {
                                autoplay: 0,
                                controls: 0,
                                disablekb: 1,
                                fs: 0,
                                iv_load_policy: 3,
                                modestbranding: 1,
                                rel: 0,
                                playsinline: 1,
                                listType: "playlist",
                                list: playlistId,
                            },
                        }}
                        onReady={onReady}
                        onStateChange={onStateChange}
                    />
                ) : null}
            </div>
        </section>
    );
}