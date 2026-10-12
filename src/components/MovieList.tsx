import type { Movie, Genre } from '../types';
import MovieCard from './MovieCard';

interface MovieListProps {
  movies: Movie[];
  genres?: Genre[];
  onMovieClick?: (movie: Movie) => void;
}

export default function MovieList({ movies, genres = [], onMovieClick }: MovieListProps) {
  if (movies.length === 0) {
    return <p>No movies match your search.</p>;
  }

  return (
    <div className="movies-grid">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          genres={genres}
          onClick={() => onMovieClick?.(movie)}
        />
      ))}
    </div>
  );
}