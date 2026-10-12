import type { Genre, SortOption } from "../types";

interface FilterBarProps {
  genres: Genre[];
  selectedGenre: string;
  sort: SortOption;
  onGenreChange: (genre: string) => void;
  onSortChange: (sort: SortOption) => void;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "popularity", label: "Most Popular" },
  { value: "rating", label: "Highest Rated" },
  { value: "release_date", label: "Release Date" },
  { value: "title", label: "Title (A-Z)" },
];

export default function FilterBar({
  genres,
  selectedGenre,
  sort,
  onGenreChange,
  onSortChange,
}: FilterBarProps) {
  return (
    <section className="filter-bar" aria-label="Filter and sort movies">
      <div className="genre-pills-scroll" aria-label="Movie genres">
        <button
          className={`genre-pill${selectedGenre === "all" ? " active" : ""}`}
          type="button"
          aria-pressed={selectedGenre === "all"}
          onClick={() => onGenreChange("all")}
        >
          All Movies
        </button>
        {genres.map((genre) => (
          <button
            className={`genre-pill${String(genre.id) === selectedGenre ? " active" : ""}`}
            key={genre.id}
            type="button"
            aria-pressed={String(genre.id) === selectedGenre}
            onClick={() => onGenreChange(String(genre.id))}
          >
            {genre.name}
          </button>
        ))}
      </div>
      <div className="filter-actions-right">
        <label className="sort-select-wrapper">
          <span className="visually-hidden">Sort movies by</span>
          <select
            className="sort-select"
            aria-label="Sort movies by"
            value={sort}
            onChange={(event) => onSortChange(event.target.value as SortOption)}
          >
            {SORT_OPTIONS.map((option) => (
              <option value={option.value} key={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}