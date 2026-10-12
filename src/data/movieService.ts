import type { Movie, SortOption } from "../types";

const API_KEY_STORAGE_KEY = "cinegrid_tmdb_api_key";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export interface MovieQuery {
  genre: string;
  sort: SortOption;
}

const SORT_PARAMETER: Record<SortOption, string> = {
  popularity: "popularity.desc",
  rating: "vote_average.desc",
  release_date: "release_date.desc",
  title: "title.asc",
};

export function getConfiguredApiKey(): string {
  const savedKey = localStorage.getItem(API_KEY_STORAGE_KEY)?.trim();
  return savedKey || import.meta.env.VITE_TMDB_API_KEY?.trim() || "";
}

export function saveApiKey(apiKey: string): void {
  const normalizedKey = apiKey.trim();
  if (normalizedKey) {
    localStorage.setItem(API_KEY_STORAGE_KEY, normalizedKey);
  } else {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
  }
}

export function buildMoviesUrl({ genre, sort }: MovieQuery): string {
  const url = new URL(`${TMDB_BASE_URL}/discover/movie`);
  url.searchParams.set("language", "en-US");
  url.searchParams.set("page", "1");
  url.searchParams.set("sort_by", SORT_PARAMETER[sort]);
  if (genre !== "all") {
    url.searchParams.set("with_genres", genre);
  }
  return url.toString();
}

export function getApiHeaders(apiKey: string): HeadersInit {
  return {
    accept: "application/json",
    ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
  };
}

interface TMDBVideo {
  key: string;
  site: string;
  type: string;
  official: boolean;
}

export async function getMovieTrailerUrl(
  movieId: number,
  apiKey: string,
  signal?: AbortSignal,
): Promise<string | null> {
  if (!apiKey) return null;

  const response = await fetch(
    `${TMDB_BASE_URL}/movie/${movieId}/videos?language=en-US`,
    { headers: getApiHeaders(apiKey), signal },
  );
  if (!response.ok) throw new Error(`Response status: ${response.status}`);

  const data: { results?: TMDBVideo[] } = await response.json();
  const youtubeVideos = (data.results ?? []).filter(
    (video) => video.site === "YouTube" && video.type === "Trailer" && video.key,
  );
  const trailer = youtubeVideos.find((video) => video.official) ?? youtubeVideos[0];
  return trailer ? `https://www.youtube.com/watch?v=${encodeURIComponent(trailer.key)}` : null;
}

export function filterAndSortMovies(
  movies: Movie[],
  searchQuery: string,
  genre: string,
  sort: SortOption,
): Movie[] {
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredMovies = movies.filter((movie) => {
    const matchesSearch =
      !normalizedQuery ||
      (movie.title ?? "").toLowerCase().includes(normalizedQuery) ||
      (movie.original_title ?? "").toLowerCase().includes(normalizedQuery) ||
      (movie.overview ?? "").toLowerCase().includes(normalizedQuery);
    const matchesGenre =
      genre === "all" || movie.genre_ids.includes(Number(genre));
    return matchesSearch && matchesGenre;
  });

  return filteredMovies.sort((first, second) => {
    switch (sort) {
      case "rating":
        return second.vote_average - first.vote_average;
      case "release_date":
        return second.release_date.localeCompare(first.release_date);
      case "title":
        return first.title.localeCompare(second.title);
      default:
        return second.popularity - first.popularity;
    }
  });
}