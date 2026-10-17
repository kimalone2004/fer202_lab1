import React from "react";
import Link from "next/link";
import { Product, formatPrice, categoryLabels } from "@/data/products";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import FavoriteButton from "@/components/FavoriteButton";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card
      data-testid="product-card"
      className="flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-zinc-300 dark:hover:border-zinc-700"
    >
      <div>
        {/* Product Image — wrapped in link to detail page */}
        <Link href={`/products/${product.id}`} data-testid="link-detail">
          <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
            <img
              data-testid="product-image"
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        </Link>

        {/* Product Info */}
        <CardHeader className="p-5 pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle
              data-testid="product-name"
              className="line-clamp-1 text-base font-bold text-zinc-900 dark:text-zinc-100 tracking-tight"
            >
              {product.name}
            </CardTitle>
            {/* Heart button */}
            <FavoriteButton productId={product.id} />
          </div>
          <CardDescription
            data-testid="product-description"
            className="line-clamp-2 mt-2 text-sm text-zinc-500 dark:text-zinc-400 font-normal leading-relaxed min-h-[42px]"
          >
            {product.description}
          </CardDescription>
        </CardHeader>
      </div>

      <div>
        {/* Price */}
        <CardContent className="px-5 py-2">
          <p
            data-testid="product-price"
            className="text-lg font-bold tracking-tight text-indigo-600 dark:text-indigo-400"
          >
            {formatPrice(product.price)}
          </p>
        </CardContent>

        {/* Category badge + Detail link */}
        <CardFooter className="p-5 pt-2 flex items-center justify-between gap-2">
          <span className="inline-flex items-center rounded-full bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-0.5 text-xs font-medium text-indigo-700 dark:text-indigo-300">
            {categoryLabels[product.category] || product.category}
          </span>
          <Link
            href={`/products/${product.id}`}
            className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Xem chi tiết →
          </Link>
        </CardFooter>
      </div>
    </Card>
  );
}

