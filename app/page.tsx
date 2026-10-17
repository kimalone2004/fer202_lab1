import React from "react";
import { products, getCategories } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import SiteHeader from "@/components/SiteHeader";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";
  const category = typeof params.category === "string" ? params.category : "";

  // Filter products based on search params
  let filtered = products;

  if (q) {
    const lower = q.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        p.description.toLowerCase().includes(lower)
    );
  }

  if (category) {
    filtered = filtered.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  }

  const categories = getCategories();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col">
      {/* Auth-aware header — uses useAuth() internally */}
      <SiteHeader />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Banner Section */}
        <section className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Danh Sách Sản Phẩm Nổi Bật
          </h1>
          <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
            Khám phá các thiết bị công nghệ hiện đại với chất lượng và mức giá tốt nhất.
          </p>
        </section>

        {/* Search & Filter Form — plain GET form, URL is the state */}
        <form
          method="get"
          action="/"
          className="mb-8 flex flex-col sm:flex-row gap-3 items-stretch sm:items-end"
        >
          <div className="flex-1">
            <label
              htmlFor="search-input"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
            >
              Tìm kiếm
            </label>
            <input
              id="search-input"
              data-testid="search-input"
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Nhập tên hoặc mô tả sản phẩm..."
              className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
          <div className="sm:w-48">
            <label
              htmlFor="category-select"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
            >
              Danh mục
            </label>
            <select
              id="category-select"
              data-testid="category-select"
              name="category"
              defaultValue={category}
              className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
              <option value="">All</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            data-testid="btn-search"
            className="cursor-pointer sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
          >
            Tìm kiếm
          </button>
        </form>

        {/* Product Grid or No Results */}
        {filtered.length === 0 ? (
          <div
            data-testid="no-results"
            className="text-center py-16"
          >
            <div className="mx-auto w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-zinc-400"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">
              Không tìm thấy sản phẩm
            </h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Thử thay đổi từ khóa hoặc danh mục khác.
            </p>
          </div>
        ) : (
          <div
            data-testid="product-list"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-6 text-center text-sm text-zinc-500">
        <p>© 2026 ShopVibe. FER202 Lab 5 - Next.js + Supabase Auth + Favorites.</p>
      </footer>
    </div>
  );
}
