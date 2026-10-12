import { Search, X } from "lucide-react";

interface SearchBarProps {
  query: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ query, onChange }: SearchBarProps) {
  return (
    <div className="search-bar">
      <div className="search-input-wrapper">
        <Search className="search-icon" aria-hidden="true" />
      <input
        className="search-input"
        type="text"
        placeholder="Search movies..."
        aria-label="Search movies"
        value={query}
        onChange={(e) => onChange(e.target.value)}
      />
        {query && (
          <button
            className="search-clear-btn"
            type="button"
            aria-label="Clear search"
            onClick={() => onChange("")}
          >
            <X size={15} aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}