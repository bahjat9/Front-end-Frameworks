import { useState } from "react";
import FilterBar from "../components/FilterBar";
import MovieModal from "../components/MovieModal";
import { useGenres } from "../hooks/useGenres";
import { useMovies } from "../hooks/useMovies";
import StatsBanner from "../components/StatsBanner";
import MovieList from "../components/MovieList";
import { useOptionalAppContext } from "../context/AppContext";
import { buildMoviesUrl, filterAndSortMovies } from "../data/movieService";
import type { SortOption } from "../types";

const GENRES_URL = "https://api.themoviedb.org/3/genre/movie/list?language=en-US";

interface HomePageProps {
  searchQuery?: string;
  apiKey?: string;
  showWatchlist?: boolean;
}

export default function HomePage({
  searchQuery = "",
  apiKey = "",
  showWatchlist = false,
}: HomePageProps) {
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [sort, setSort] = useState<SortOption>("popularity");
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const appContext = useOptionalAppContext();
  const favorites = appContext?.favorites ?? [];
  const moviesUrl = buildMoviesUrl({ genre: selectedGenre, sort });
  const { movies, loading, error } = useMovies(moviesUrl, apiKey);
  const { genres } = useGenres(GENRES_URL, apiKey);

  const sourceMovies = showWatchlist ? favorites : movies;
  const activeGenre = showWatchlist ? "all" : selectedGenre;
  const filteredMovies = filterAndSortMovies(
    sourceMovies,
    searchQuery,
    activeGenre,
    sort,
  );
  const selectedMovie = sourceMovies.find((movie) => movie.id === selectedMovieId) ?? null;
  const selectedGenreName = showWatchlist
    ? "Watchlist"
    : genres.find((genre) => String(genre.id) === selectedGenre)?.name ?? "All Genres";

  return (
    <main className="main-container">
      <div className="page-heading">
        <div>
          <p className="eyebrow">{showWatchlist ? "Your collection" : "Discover"}</p>
          <h1>{showWatchlist ? "Watchlist" : "Movies worth your time"}</h1>
        </div>
      </div>
      <StatsBanner movies={filteredMovies} genreName={selectedGenreName} />
      {!showWatchlist && (
        <FilterBar
          genres={genres}
          selectedGenre={selectedGenre}
          sort={sort}
          onGenreChange={setSelectedGenre}
          onSortChange={setSort}
        />
      )}
      {loading && <p role="status">Loading...</p>}
      {error && <p role="alert">Something went wrong. {error}</p>}
      {!loading && !error && (
        <MovieList
          movies={filteredMovies}
          genres={genres}
          onMovieClick={(movie) => setSelectedMovieId(movie.id)}
        />
      )}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          genres={genres}
          apiKey={apiKey}
          onClose={() => setSelectedMovieId(null)}
        />
      )}
    </main>
  );
}