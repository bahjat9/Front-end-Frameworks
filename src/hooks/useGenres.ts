import { useState, useEffect } from "react";
import type { Genre } from "../types";
import { getApiHeaders, getConfiguredApiKey } from "../data/movieService";

interface UseGenresResult {
  genres: Genre[];
  loading: boolean;
  error: string | null;
}

export function useGenres(url: string, apiKey = getConfiguredApiKey()): UseGenresResult {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchGenres() {
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
        setGenres(Array.isArray(data.genres) ? data.genres : []);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError((err as Error).message);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchGenres();

    return () => controller.abort();
  }, [url, apiKey]);

  return { genres, loading, error };
}