"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
type FavoritesAction =
  | { type: "SET"; payload: number[] }
  | { type: "ADD"; payload: number }
  | { type: "REMOVE"; payload: number };

interface FavoritesState {
  ids: number[];
}

interface FavoritesContextType {
  favorites: number[];
  isFavorite: (id: number) => boolean;
  toggleFavorite: (id: number) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Reducer
// ─────────────────────────────────────────────────────────────────────────────
function favoritesReducer(
  state: FavoritesState,
  action: FavoritesAction
): FavoritesState {
  switch (action.type) {
    case "SET":
      return { ids: action.payload };
    case "ADD":
      if (state.ids.includes(action.payload)) return state;
      return { ids: [...state.ids, action.payload] };
    case "REMOVE":
      return { ids: state.ids.filter((id) => id !== action.payload) };
    default:
      return state;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────
const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

// ─────────────────────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────────────────────
export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(favoritesReducer, { ids: [] });

  // Load favorites when user changes (login/logout)
  useEffect(() => {
    if (!user) {
      // User logged out → clear favorites
      dispatch({ type: "SET", payload: [] });
      return;
    }

    // User logged in → load their favorites from Supabase
    const loadFavorites = async () => {
      const { data, error } = await supabase
        .from("favorites")
        .select("product_id");

      if (error) {
        console.error("Failed to load favorites:", error.message);
        return;
      }

      const ids = (data ?? []).map(
        (row: { product_id: number }) => row.product_id
      );
      dispatch({ type: "SET", payload: ids });
    };

    loadFavorites();
  }, [user]);

  // Check if a product is favorited
  const isFavorite = useCallback(
    (id: number) => state.ids.includes(id),
    [state.ids]
  );

  // Toggle favorite — optimistic update with rollback
  const toggleFavorite = useCallback(
    (id: number) => {
      if (!user) {
        // Not logged in — handled by the UI (redirect to /login)
        return;
      }

      const alreadyFavorited = state.ids.includes(id);

      if (alreadyFavorited) {
        // Optimistic: remove immediately
        dispatch({ type: "REMOVE", payload: id });

        supabase
          .from("favorites")
          .delete()
          .eq("product_id", id)
          .eq("user_id", user.id)
          .then(({ error }) => {
            if (error) {
              console.error("Failed to remove favorite:", error.message);
              // Rollback
              dispatch({ type: "ADD", payload: id });
            }
          });
      } else {
        // Optimistic: add immediately
        dispatch({ type: "ADD", payload: id });

        supabase
          .from("favorites")
          .insert({ product_id: id })
          .then(({ error }) => {
            if (error) {
              console.error("Failed to add favorite:", error.message);
              // Rollback
              dispatch({ type: "REMOVE", payload: id });
            }
          });
      }
    },
    [user, state.ids]
  );

  return (
    <FavoritesContext.Provider value={{ favorites: state.ids, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Custom hook — useFavorites()
// ─────────────────────────────────────────────────────────────────────────────
export function useFavorites(): FavoritesContextType {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites must be used inside <FavoritesProvider>");
  }
  return ctx;
}
