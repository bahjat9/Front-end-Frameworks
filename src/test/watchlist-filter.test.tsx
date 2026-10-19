import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "../App";
import type { Movie } from "../types";

const ACTION_MOVIE: Movie = {
  id: 1,
  title: "Action Favorite",
  original_title: "Action Favorite",
  overview: "A saved action movie.",
  poster_path: null,
  backdrop_path: null,
  release_date: "2020-01-01",
  vote_average: 7,
  vote_count: 100,
  popularity: 10,
  genre_ids: [28],
  adult: false,
  video: false,
  original_language: "en",
};

const COMEDY_MOVIE: Movie = {
  ...ACTION_MOVIE,
  id: 2,
  title: "Comedy Favorite",
  original_title: "Comedy Favorite",
  genre_ids: [35],
};

beforeEach(() => {
  localStorage.clear();
  localStorage.setItem("cinegrid_favorites", JSON.stringify([ACTION_MOVIE, COMEDY_MOVIE]));
  vi.stubGlobal(
    "fetch",
    vi.fn((input: string | URL | Request) =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve(
            String(input).includes("/genre/movie/list")
              ? { genres: [{ id: 28, name: "Action" }, { id: 35, name: "Comedy" }] }
              : { results: [] },
          ),
      }),
    ),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Watchlist filtering and sorting", () => {
  it("filters saved movies by genre", async () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /watchlist/i }));

    await waitFor(() => expect(screen.getByText("Action Favorite")).toBeInTheDocument());
    expect(screen.getByText("Comedy Favorite")).toBeInTheDocument();

    fireEvent.click(await screen.findByRole("button", { name: "Action" }));

    expect(screen.getByText("Action Favorite")).toBeInTheDocument();
    expect(screen.queryByText("Comedy Favorite")).not.toBeInTheDocument();
  });

  it("sorts saved movies by title", async () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /watchlist/i }));
    await waitFor(() => expect(screen.getByText("Action Favorite")).toBeInTheDocument());

    fireEvent.change(screen.getByRole("combobox", { name: /sort movies by/i }), {
      target: { value: "title" },
    });

    const titles = screen.getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent);
    expect(titles).toEqual(["Action Favorite", "Comedy Favorite"]);
  });
});
