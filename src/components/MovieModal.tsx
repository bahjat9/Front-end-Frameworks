import { useEffect } from "react";
import { X } from "lucide-react";
import type { Genre, Movie } from "../types";
import { getPosterUrl, TMDB_BACKDROP_BASE } from "../data/sampleMovies";

interface MovieModalProps {
  movie: Movie;
  genres: Genre[];
  onClose: () => void;
}

export default function MovieModal({ movie, genres, onClose }: MovieModalProps) {
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

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
          </div>
        </div>
      </section>
    </div>
  );
}