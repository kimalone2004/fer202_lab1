import { NextResponse } from "next/server";
import { products } from "@/data/products";
import { getProductReviews } from "@/lib/reviews";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numId = Number(id);

  if (isNaN(numId)) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const product = products.find((p) => p.id === numId);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const data = await getProductReviews(numId);
  return NextResponse.json(data, { status: 200 });
}
