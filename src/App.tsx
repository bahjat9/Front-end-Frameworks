import { useState } from "react";
import MovieList from "./components/MovieList";
import SearchBar from "./components/SearchBar";
import { SAMPLE_MOVIES } from "./data/sampleMovies";

const App = () => {
  const [movies, setMovies] = useState(SAMPLE_MOVIES);
  const [query, setQuery] = useState("");
  const [minRating, setMinRating] = useState(0);

  const filteredMovies = movies.filter((m) =>
    m.title.toLowerCase().includes(query.toLowerCase()) &&
    m.vote_average >= minRating
  );

  return (
    <div className="app-layout">
      <h1>Movie App</h1>
      <SearchBar query={query} onChange={setQuery} />
      <MovieList movies={filteredMovies} />
    </div>
  );
};

export default App;