import { createContext, useContext, useEffect, useReducer } from "react";
import type { ReactNode } from "react";
import type { Movie, Theme } from "../types";

interface AppState {
  theme: Theme;
  favorites: Movie[];
}

type AppAction =
  | { type: "TOGGLE_FAVOURITE"; movie: Movie }
  | { type: "SET_THEME" };

interface AppContextValue extends AppState {
  watchList: Movie[];
  toggleFavorite: (movie: Movie) => void;
  toggleWatchList: (movie: Movie) => void;
  isFavorite: (movieId: number) => boolean;
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

function readInitialState(): AppState {
  let theme: Theme = "dark";
  let favorites: Movie[] = [];

  try {
    const savedTheme = localStorage.getItem("cinegrid_theme");
    if (savedTheme === "dark" || savedTheme === "light") theme = savedTheme;

    const savedFavorites = localStorage.getItem("cinegrid_favorites");
    if (savedFavorites) {
      const parsedFavorites: unknown = JSON.parse(savedFavorites);
      if (Array.isArray(parsedFavorites)) favorites = parsedFavorites as Movie[];
    }
  } catch {
    favorites = [];
  }

  return { theme, favorites };
}

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "TOGGLE_FAVOURITE": {
      const isAlreadyFavorite = state.favorites.some((movie) => movie.id === action.movie.id);
      return {
        ...state,
        favorites: isAlreadyFavorite
          ? state.favorites.filter((movie) => movie.id !== action.movie.id)
          : [action.movie, ...state.favorites],
      };
    }
    case "SET_THEME":
      return { ...state, theme: state.theme === "dark" ? "light" : "dark" };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, readInitialState);

  useEffect(() => {
    localStorage.setItem("cinegrid_favorites", JSON.stringify(state.favorites));
  }, [state.favorites]);

  useEffect(() => {
    localStorage.setItem("cinegrid_theme", state.theme);
    document.documentElement.setAttribute("data-theme", state.theme);
  }, [state.theme]);

  const toggleFavorite = (movie: Movie) => dispatch({ type: "TOGGLE_FAVOURITE", movie });
  const toggleTheme = () => dispatch({ type: "SET_THEME" });
  const isFavorite = (movieId: number) => state.favorites.some((movie) => movie.id === movieId);

  return (
    <AppContext.Provider
      value={{
        ...state,
        watchList: state.favorites,
        toggleFavorite,
        toggleWatchList: toggleFavorite,
        isFavorite,
        toggleTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within an AppProvider");
  return context;
}

export function useOptionalAppContext(): AppContextValue | undefined {
  return useContext(AppContext);
}