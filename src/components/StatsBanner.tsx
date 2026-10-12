import { Clapperboard, Star, Tags } from "lucide-react";
import type { Movie } from "../types";

interface StatsBannerProps {
  movies: Movie[];
  genreName: string;
}

export default function StatsBanner({ movies, genreName }: StatsBannerProps) {
  const averageRating = movies.length
    ? (movies.reduce((total, movie) => total + movie.vote_average, 0) / movies.length).toFixed(1)
    : "0.0";

  return (
    <section className="stats-banner" aria-label="Movie results summary">
      <div className="stat-card">
        <span className="stat-icon"><Clapperboard size={21} aria-hidden="true" /></span>
        <span className="stat-info">
          <span className="stat-value">{movies.length}</span>
          <span className="stat-label">Titles shown</span>
        </span>
      </div>
      <div className="stat-card">
        <span className="stat-icon stat-icon-rating"><Star size={21} aria-hidden="true" /></span>
        <span className="stat-info">
          <span className="stat-value">{averageRating} / 10</span>
          <span className="stat-label">Average rating</span>
        </span>
      </div>
      <div className="stat-card">
        <span className="stat-icon"><Tags size={21} aria-hidden="true" /></span>
        <span className="stat-info">
          <span className="stat-value stat-value-genre">{genreName}</span>
          <span className="stat-label">Selected genre</span>
        </span>
      </div>
    </section>
  );
}