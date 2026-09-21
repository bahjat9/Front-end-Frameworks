import { Movie } from '../types';
import MovieCard from './MovieCard';

export default function MovieList({ movies }: { movies: Movie[] }) {
  if (movies.length === 0) {
    return <p>No movies match your search.</p>;
  }

  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}