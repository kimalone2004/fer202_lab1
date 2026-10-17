import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { products, formatPrice } from "@/data/products";
import type { Metadata } from "next";
import FavoriteButton from "@/components/FavoriteButton";

// ─────────────────────────────────────────────────────────────────────────────
// generateStaticParams — pre-render every product page at build time
// ─────────────────────────────────────────────────────────────────────────────
export async function generateStaticParams() {
  return products.map((p) => ({ id: String(p.id) }));
}

// ─────────────────────────────────────────────────────────────────────────────
// generateMetadata — dynamic <title> per product
// ─────────────────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = products.find((p) => p.id === Number(id));
  if (!product) {
    return { title: "Không tìm thấy | ShopVibe" };
  }
  return {
    title: `${product.name} | ShopVibe`,
    description: product.description,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Page component — Server Component (no "use client")
// ─────────────────────────────────────────────────────────────────────────────
export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Navigation bar */}
      <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20">
              S
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              ShopVibe
            </span>
          </Link>
          <Link
            href="/"
            data-testid="link-back"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Quay lại trang chủ
          </Link>
        </div>
      </nav>

      {/* Product detail */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div
          data-testid="product-detail"
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12"
        >
          {/* Image */}
          <div className="rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto object-cover aspect-square"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center space-y-5">
            <div className="flex items-start justify-between gap-3">
              <h1
                data-testid="detail-name"
                className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white"
              >
                {product.name}
              </h1>
              <FavoriteButton productId={product.id} />
            </div>

            <span
              data-testid="detail-category"
              className="inline-flex self-start items-center rounded-full bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300"
            >
              {product.category}
            </span>

            <p
              data-testid="detail-price"
              className="text-2xl sm:text-3xl font-bold text-indigo-600 dark:text-indigo-400"
            >
              {formatPrice(product.price)}
            </p>

            <p
              data-testid="detail-description"
              className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400"
            >
              {product.description}
            </p>

            <div className="pt-4 flex gap-3">
              <button className="flex-1 cursor-pointer rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 shadow-sm hover:shadow-md transition-all active:scale-[0.99]">
                Thêm vào giỏ
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
