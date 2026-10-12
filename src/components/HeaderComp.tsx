import { Moon, Settings, Sun } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import SearchBar from "./SearchBar";

interface HeaderCompProps {
  searchQuery: string;
  onChange: (value: string) => void;
  onOpenApiConfig: () => void;
  showWatchlist: boolean;
  onToggleWatchlist: (show: boolean) => void;
}

export default function HeaderComp({
  searchQuery,
  onChange,
  onOpenApiConfig,
  showWatchlist,
  onToggleWatchlist,
}: HeaderCompProps) {
  const { theme, toggleTheme, favorites } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  const handleWatchlistClick = () => {
    const nextShowWatchlist = !showWatchlist;
    onToggleWatchlist(nextShowWatchlist);
    if (nextShowWatchlist && location.pathname !== "/") navigate("/");
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="header-left">
          <NavLink className="brand-logo" to="/" aria-label="CineGrid">
            <span className="logo-dot" />
            <span className="logo-text">CINE·GRID</span>
          </NavLink>
          <nav className="header-nav" aria-label="Main navigation">
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/about">About</NavLink>
          </nav>
        </div>
        <div className="header-search">
          <SearchBar query={searchQuery} onChange={onChange} />
        </div>
        <div className="header-actions">
          <button
            className={`btn-icon-label${showWatchlist ? " active" : ""}`}
            type="button"
            aria-pressed={showWatchlist}
            onClick={handleWatchlistClick}
          >
            <span>Watchlist</span>
            <span className="count-badge">{favorites.length}</span>
          </button>
          <button
            className="theme-toggle-btn"
            type="button"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            onClick={toggleTheme}
          >
            {theme === "dark" ? <Sun size={19} aria-hidden="true" /> : <Moon size={19} aria-hidden="true" />}
          </button>
          <button
            className="theme-toggle-btn"
            type="button"
            aria-label="Configure TMDB API key"
            title="Configure TMDB API key"
            onClick={onOpenApiConfig}
          >
            <Settings size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}