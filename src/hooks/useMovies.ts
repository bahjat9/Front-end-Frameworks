import { useState, useEffect } from "react";
import type { Movie } from "../types";
import { getApiHeaders, getConfiguredApiKey } from "../data/movieService";

interface UseMoviesResult {
  movies: Movie[];
  loading: boolean;
  error: string | null;
}

export function useMovies(url: string, apiKey = getConfiguredApiKey()): UseMoviesResult {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchMovies() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: getApiHeaders(apiKey),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const data = await response.json();
        setMovies(data.results);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError((err as Error).message);
        }
      } finally {
        setLoading(false);
      }
    }

  fetchMovies();

    return () => controller.abort();
  }, [url, apiKey]);

  return { movies, loading, error };
}