import { useState } from 'react';
import type { Movie, Genre } from '../types';
import { getPosterUrl } from '../data/sampleMovies';
import { useOptionalAppContext } from '../context/AppContext';

interface MovieCardProps {
  movie: Movie;
  genres?: Genre[];
  onClick?: () => void;
}

export default function MovieCard({ movie, genres = [], onClick }: MovieCardProps) {
  const [localIsFavourite, setLocalIsFavourite] = useState(false);
  const appContext = useOptionalAppContext();
  const isFavourite = appContext?.isFavorite(movie.id) ?? localIsFavourite;

  const handleFavouriteClick = () => {
    if (appContext) {
      appContext.toggleFavorite(movie);
    } else {
      setLocalIsFavourite((wasFavourite) => !wasFavourite);
    }
  };

  const movieGenreNames = movie.genre_ids
    .map((id) => genres.find((g) => g.id === id)?.name)
    .filter((name): name is string => Boolean(name));

  return (
    <article
      className="movie-card"
      tabIndex={0}
      aria-label={`${movie.title}, view details`}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.target === event.currentTarget && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault();
          onClick?.();
        }
      }}
    >
      <div className="poster-wrapper">
        <img 
          src={getPosterUrl(movie.poster_path)} 
          alt={movie.title} 
          className="poster-img" 
          loading="lazy" 
        />
        <div className="poster-overlay">
          <div className="card-top-badges">
            <span className="rating-badge">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              {movie.vote_average.toFixed(1)}
            </span>
            <button 
              className={`favorite-btn ${isFavourite ? 'is-favorite' : ''}`} 
              title={isFavourite ? "Remove from favourites" : "Add to favourites"}
              aria-label={isFavourite ? "Remove from favourites" : "Add to favourites"}
              onClick={(event) => {
                event.stopPropagation();
                handleFavouriteClick();
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill={isFavourite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.78-8.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
          </div>
          <span className="quick-view-hint">View Details</span>
        </div>
      </div>
      <div className="movie-card-info">
        <h2 className="movie-card-title">{movie.title}</h2>
        <div className="movie-card-meta">
          <span>{movie.release_date?.substring(0, 4)}</span>
          <span>{movie.vote_count} votes</span>
        </div>
        <div className="movie-genres-tags">
          {movieGenreNames.length > 0 ? (
            movieGenreNames.map((name) => (
              <span key={name} className="genre-tag">{name}</span>
            ))
          ) : (
            <span className="genre-tag">General</span>
          )}
        </div>
      </div>
    </article>
  );
}