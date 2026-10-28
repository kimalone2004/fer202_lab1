"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
  useRef,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import type { Review } from "@/lib/reviews";

// ─────────────────────────────────────────────────────────────────────────────
// Reducer Action Types
// ─────────────────────────────────────────────────────────────────────────────
type ReviewsAction =
  | { type: "SET"; payload: Review[] }
  | { type: "ADD"; payload: Review }
  | { type: "UPDATE"; payload: Review }
  | { type: "REMOVE"; payload: number }
  | { type: "RESTORE"; payload: { review: Review; index: number } };

interface ReviewsState {
  reviews: Review[];
}

function reviewsReducer(
  state: ReviewsState,
  action: ReviewsAction
): ReviewsState {
  switch (action.type) {
    case "SET":
      return { reviews: action.payload };

    case "ADD": {
      // Prevent duplicate if already exists
      if (state.reviews.some((r) => r.id === action.payload.id)) {
        return state;
      }
      return { reviews: [action.payload, ...state.reviews] };
    }

    case "UPDATE":
      return {
        reviews: state.reviews.map((r) =>
          r.id === action.payload.id ? action.payload : r
        ),
      };

    case "REMOVE":
      return {
        reviews: state.reviews.filter((r) => r.id !== action.payload),
      };

    case "RESTORE": {
      const restored = [...state.reviews];
      const targetIndex = Math.min(
        Math.max(0, action.payload.index),
        restored.length
      );
      restored.splice(targetIndex, 0, action.payload.review);
      return { reviews: restored };
    }

    default:
      return state;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Context Interface
// ─────────────────────────────────────────────────────────────────────────────
interface ReviewsContextType {
  reviews: Review[];
  myReview: Review | null;
  submitReview: (
    rating: number,
    comment: string
  ) => Promise<{ error: string | null; data?: Review }>;
  updateReview: (
    rating: number,
    comment: string
  ) => Promise<{ error: string | null; data?: Review }>;
  deleteReview: () => Promise<{ error: string | null }>;
  average: number;
  count: number;
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

// ─────────────────────────────────────────────────────────────────────────────
// Provider Component
// ─────────────────────────────────────────────────────────────────────────────
interface ReviewsProviderProps {
  productId: number;
  initialReviews: Review[];
  children: ReactNode;
}

export function ReviewsProvider({
  productId,
  initialReviews,
  children,
}: ReviewsProviderProps) {
  const router = useRouter();
  const { user, session } = useAuth();
  const [state, dispatch] = useReducer(reviewsReducer, {
    reviews: initialReviews,
  });

  const prevProductIdRef = useRef(productId);
  const prevInitialReviewsRef = useRef(initialReviews);

  // Synchronize initialReviews when productId changes or router.refresh() updates initialReviews
  useEffect(() => {
    if (prevProductIdRef.current !== productId) {
      prevProductIdRef.current = productId;
      prevInitialReviewsRef.current = initialReviews;
      dispatch({ type: "SET", payload: initialReviews });
      return;
    }

    if (prevInitialReviewsRef.current !== initialReviews) {
      prevInitialReviewsRef.current = initialReviews;
      dispatch({ type: "SET", payload: initialReviews });
    }
  }, [productId, initialReviews]);

  // Identify myReview strictly by user_id of logged-in user
  const myReview = useMemo(() => {
    if (!user) return null;
    return state.reviews.find((r) => r.user_id === user.id) || null;
  }, [state.reviews, user]);

  // Dynamic average and count based on current state
  const count = state.reviews.length;
  const average = useMemo(() => {
    if (count === 0) return 0;
    const sum = state.reviews.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / count) * 10) / 10;
  }, [state.reviews, count]);

  // ── submitReview ────────────────────────────────────────────────────────────
  const submitReview = async (
    rating: number,
    comment: string
  ): Promise<{ error: string | null; data?: Review }> => {
    if (!user || !session?.access_token) {
      return { error: "Vui lòng đăng nhập để đánh giá" };
    }

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          product_id: productId,
          rating: Number(rating),
          comment: comment.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { error: data.error || "Gửi đánh giá thất bại" };
      }

      dispatch({ type: "ADD", payload: data as Review });
      router.refresh();
      return { error: null, data: data as Review };
    } catch (err: unknown) {
      return {
        error: err instanceof Error ? err.message : "Đã xảy ra lỗi khi gửi",
      };
    }
  };

  // ── updateReview ────────────────────────────────────────────────────────────
  const updateReview = async (
    rating: number,
    comment: string
  ): Promise<{ error: string | null; data?: Review }> => {
    if (!user || !myReview) {
      return { error: "Không tìm thấy đánh giá của bạn" };
    }

    try {
      const { data, error } = await supabase
        .from("reviews")
        .update({
          rating: Number(rating),
          comment: comment.trim(),
        })
        .eq("id", myReview.id)
        .eq("user_id", user.id)
        .select("id, product_id, user_id, author, rating, comment, created_at")
        .single();

      if (error) {
        return { error: error.message };
      }

      const updated = data as Review;
      dispatch({ type: "UPDATE", payload: updated });
      router.refresh();
      return { error: null, data: updated };
    } catch (err: unknown) {
      return {
        error: err instanceof Error ? err.message : "Đã xảy ra lỗi khi cập nhật",
      };
    }
  };

  // ── deleteReview (Optimistic Delete with Rollback) ───────────────────────────
  const deleteReview = async (): Promise<{ error: string | null }> => {
    if (!user || !myReview) {
      return { error: "Không tìm thấy đánh giá của bạn" };
    }

    const reviewToDelete = myReview;
    const originalIndex = state.reviews.findIndex(
      (r) => r.id === reviewToDelete.id
    );

    // 1. Optimistic remove from local state first
    dispatch({ type: "REMOVE", payload: reviewToDelete.id });

    try {
      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", reviewToDelete.id)
        .eq("user_id", user.id);

      if (error) {
        // 2. Rollback to original position if Supabase call fails
        dispatch({
          type: "RESTORE",
          payload: { review: reviewToDelete, index: originalIndex },
        });
        return { error: error.message };
      }

      router.refresh();
      return { error: null };
    } catch (err: unknown) {
      // Rollback on unexpected error
      dispatch({
        type: "RESTORE",
        payload: { review: reviewToDelete, index: originalIndex },
      });
      return {
        error: err instanceof Error ? err.message : "Đã xảy ra lỗi khi xóa",
      };
    }
  };

  return (
    <ReviewsContext.Provider
      value={{
        reviews: state.reviews,
        myReview,
        submitReview,
        updateReview,
        deleteReview,
        average,
        count,
      }}
    >
      {children}
    </ReviewsContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Custom Hook
// ─────────────────────────────────────────────────────────────────────────────
export function useReviews(): ReviewsContextType {
  const ctx = useContext(ReviewsContext);
  if (!ctx) {
    throw new Error("useReviews must be used within a <ReviewsProvider>");
  }
  return ctx;
}
