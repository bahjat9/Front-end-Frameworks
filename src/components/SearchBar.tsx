interface SearchBarProps {
  query: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ query, onChange }: SearchBarProps) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}