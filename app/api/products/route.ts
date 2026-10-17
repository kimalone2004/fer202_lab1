import { NextResponse, type NextRequest } from "next/server";
import { products, categoryLabels } from "@/data/products";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";

  let filtered = products;

  // Filter by search query (name or description, case-insensitive)
  if (q) {
    const lower = q.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        p.description.toLowerCase().includes(lower)
    );
  }

  // Filter by category (case-insensitive, supports English or Vietnamese)
  if (category) {
    const lower = category.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.category.toLowerCase() === lower ||
        (categoryLabels[p.category] &&
          categoryLabels[p.category].toLowerCase() === lower)
    );
  }

  return NextResponse.json(filtered);
}
