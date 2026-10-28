import { supabase } from "@/lib/supabaseClient";

export interface Review {
  id: number;
  product_id: number;
  user_id: string;
  author: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface ProductReviewsResponse {
  average: number;
  count: number;
  reviews: Review[];
}

/**
 * Shared helper to fetch reviews for a product using Supabase anon key.
 * Used by both GET /api/products/[id]/reviews and the server-rendered /products/[id] page.
 */
export async function getProductReviews(productId: number): Promise<ProductReviewsResponse> {
  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("id, product_id, user_id, author, rating, comment, created_at")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });

    if (error || !data) {
      return {
        average: 0,
        count: 0,
        reviews: [],
      };
    }

    const reviews = data as Review[];
    const count = reviews.length;
    const average =
      count === 0
        ? 0
        : Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / count) * 10) / 10;

    return {
      average,
      count,
      reviews,
    };
  } catch {
    return {
      average: 0,
      count: 0,
      reviews: [],
    };
  }
}
