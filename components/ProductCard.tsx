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
      className="flex flex-col justify-between overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
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
        <CardHeader className="p-4 pb-2">
          <CardTitle
            data-testid="product-name"
            className="line-clamp-1 text-lg font-bold text-zinc-900 dark:text-zinc-50"
          >
            {product.name}
          </CardTitle>
          <CardDescription
            data-testid="product-description"
            className="line-clamp-2 mt-1 text-sm text-zinc-600 dark:text-zinc-400"
          >
            {product.description}
          </CardDescription>
        </CardHeader>
      </div>

      <div>
        {/* Price */}
        <CardContent className="px-4 py-2">
          <p
            data-testid="product-price"
            className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400"
          >
            {product.price}
          </p>
        </CardContent>

        {/* Action Button */}
        <CardFooter className="p-4 pt-2">
          <Button className="w-full cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm transition-colors">
            Thêm vào giỏ
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}
