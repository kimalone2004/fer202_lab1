import React from "react";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import SiteHeader from "@/components/SiteHeader";

export default function HomePage() {
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

        {/* Product Grid Container */}
        <div
          data-testid="product-list"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-6 text-center text-sm text-zinc-500">
        <p>© 2026 ShopVibe. FER202 Lab 3 - Next.js + Supabase Auth.</p>
      </footer>
    </div>
  );
}
