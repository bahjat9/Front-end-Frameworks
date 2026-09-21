import { useState } from 'react';
import { Movie } from '../types';
import { getPosterUrl } from '../data/sampleMovies';

interface MovieCardProps {
  movie: Movie;
  onClick?: () => void;
}

export default function MovieCard({ movie, onClick }: MovieCardProps) {
  const [isFavourite, setIsFavourite] = useState(false);

  return (
    <article className="movie-card" tabIndex={0} aria-label={movie.title} onClick={onClick}>
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
              className={`favorite-btn ${isFavourite ? 'active' : ''}`} 
              title={isFavourite ? "Remove from favourites" : "Add to favourites"}
              aria-label={isFavourite ? "Remove from favourites" : "Add to favourites"}
              onClick={() => setIsFavourite(!isFavourite)}
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
          <span className="genre-tag">Movie</span>
        </div>
      </div>
    </article>
  );
}