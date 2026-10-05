import React from "react";
import { Product } from "@/data/products";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
        {/* Product Image */}
        <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          <img
            data-testid="product-image"
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Product Info */}
        <CardHeader className="p-5 pb-2">
          <CardTitle
            data-testid="product-name"
            className="line-clamp-1 text-base font-bold text-zinc-900 dark:text-zinc-100 tracking-tight"
          >
            {product.name}
          </CardTitle>
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
            {product.price}
          </p>
        </CardContent>

        {/* Action Button */}
        <CardFooter className="p-5 pt-2">
          <Button className="w-full cursor-pointer rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 shadow-xs hover:shadow-md transition-all active:scale-[0.99]">
            Thêm vào giỏ
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}
