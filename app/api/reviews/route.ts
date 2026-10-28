import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import { products } from "@/data/products";
import { reviewSchema } from "@/lib/reviewSchema";

export async function POST(request: Request) {
  // 1. Check Authorization header
  const authHeader =
    request.headers.get("authorization") || request.headers.get("Authorization");
  if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.slice(7).trim();
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Validate token with Supabase Auth
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 3. Parse JSON body (catch corrupt/malformed JSON separately)
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        error: "Invalid input",
        issues: [
          {
            code: "custom",
            message: "Malformed or invalid JSON body",
            path: [],
          },
        ],
      },
      { status: 400 }
    );
  }

  // 4. Validate schema with shared reviewSchema
  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  // 5. Verify product exists in product source
  const product = products.find((p) => p.id === parsed.data.product_id);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  // 6. Insert using Supabase client with anon key and user Authorization header
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://undkjlralcaxhrucyqmo.supabase.co";
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuZGtqbHJhbGNheGhydWN5cW1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTExOTQ2MzIsImV4cCI6MjEwNjc3MDYzMn0.bkkMqymQ5eDp6GjwR5FMzxF8_rV2_nFGG7SbjDQ6tlY";

  const userClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const { data, error } = await userClient
    .from("reviews")
    .insert({
      product_id: parsed.data.product_id,
      rating: parsed.data.rating,
      comment: parsed.data.comment,
    })
    .select("id, product_id, user_id, author, rating, comment, created_at")
    .single();

  if (error) {
    if (
      error.code === "23505" ||
      error.message?.includes("duplicate") ||
      error.message?.includes("unique")
    ) {
      return NextResponse.json(
        { error: "You already reviewed this product" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // 7. Revalidate detail page cache
  revalidatePath("/products/" + parsed.data.product_id);

  return NextResponse.json(data, { status: 201 });
}
