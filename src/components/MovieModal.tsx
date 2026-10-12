import { useEffect, useState } from "react";
import { Heart, Play, X } from "lucide-react";
import type { Genre, Movie } from "../types";
import { getPosterUrl, TMDB_BACKDROP_BASE } from "../data/sampleMovies";
import { getMovieTrailerUrl } from "../data/movieService";
import { useOptionalAppContext } from "../context/AppContext";

interface MovieModalProps {
  movie: Movie;
  genres: Genre[];
  apiKey?: string;
  onClose: () => void;
}

export default function MovieModal({ movie, genres, apiKey = "", onClose }: MovieModalProps) {
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);
  const [trailerStatus, setTrailerStatus] = useState("Loading trailer…");
  const [savedLocally, setSavedLocally] = useState(false);
  const appContext = useOptionalAppContext();
  const isSaved = appContext?.isFavorite(movie.id) ?? savedLocally;

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  useEffect(() => {
    const controller = new AbortController();
    setTrailerUrl(null);
    setTrailerStatus(apiKey ? "Loading trailer…" : "Configure a TMDB API key to load trailers.");

    if (apiKey) {
      getMovieTrailerUrl(movie.id, apiKey, controller.signal)
        .then((url) => {
          setTrailerUrl(url);
          setTrailerStatus(url ? "Trailer ready" : "No YouTube trailer is available.");
        })
        .catch((error: unknown) => {
          if (!controller.signal.aborted) {
            setTrailerStatus(error instanceof Error ? "Could not load the trailer." : "Trailer unavailable.");
          }
        });
    }

    return () => controller.abort();
  }, [movie.id, apiKey]);

  const backdropImage = movie.backdrop_path
    ? `url("${TMDB_BACKDROP_BASE}${movie.backdrop_path}")`
    : undefined;
  const releaseDate = movie.release_date
    ? new Date(`${movie.release_date}T00:00:00`).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Release date unavailable";
  const movieGenres = movie.genre_ids
    .map((id) => genres.find((genre) => genre.id === id)?.name)
    .filter((name): name is string => Boolean(name));

  return (
    <div className="modal-overlay active" onMouseDown={onClose}>
      <section
        className="modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-movie-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="modal-close-btn" type="button" aria-label="Close movie details" onClick={onClose}>
          <X size={19} aria-hidden="true" />
        </button>
        <div
          className="modal-backdrop-hero"
          style={backdropImage ? { backgroundImage: backdropImage } : undefined}
        />
        <div className="modal-body">
          <img className="modal-poster" src={getPosterUrl(movie.poster_path)} alt={`${movie.title} poster`} />
          <div className="modal-content-details">
            <h2 className="modal-title" id="modal-movie-title">{movie.title}</h2>
            {movie.original_title !== movie.title && (
              <p className="modal-original-title">Original title: {movie.original_title}</p>
            )}
            <div className="modal-meta-row">
              <span className="rating-badge">★ {movie.vote_average.toFixed(1)} / 10</span>
              <span className="modal-meta-item">{movie.vote_count.toLocaleString()} ratings</span>
              <span className="modal-meta-item">{releaseDate}</span>
            </div>
            {movieGenres.length > 0 && (
              <div className="movie-genres-tags modal-genre-list">
                {movieGenres.map((genre) => <span className="genre-tag" key={genre}>{genre}</span>)}
              </div>
            )}
            <div className="modal-overview">
              <h3 className="modal-overview-heading">Overview</h3>
              <p>{movie.overview || "No plot synopsis available."}</p>
            </div>
            <div className="modal-footer-actions">
              <button
                className="btn-primary"
                type="button"
                aria-pressed={isSaved}
                onClick={() => {
                  if (appContext) appContext.toggleFavorite(movie);
                  else setSavedLocally((wasSaved) => !wasSaved);
                }}
              >
                <Heart size={18} fill={isSaved ? "currentColor" : "none"} aria-hidden="true" />
                {isSaved ? "Remove from Watchlist" : "Add to Watchlist"}
              </button>
              {trailerUrl ? (
                <a className="btn-secondary" href={trailerUrl} target="_blank" rel="noopener noreferrer">
                  <Play size={16} fill="currentColor" aria-hidden="true" />
                  Watch Trailer
                </a>
              ) : (
                <button className="btn-secondary" type="button" disabled aria-describedby="trailer-status">
                  <Play size={16} fill="currentColor" aria-hidden="true" />
                  {trailerStatus.startsWith("Loading") ? "Finding Trailer…" : "Trailer Unavailable"}
                </button>
              )}
              <span className="visually-hidden" id="trailer-status" role="status">{trailerStatus}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}