export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Tai nghe không dây Pro",
    price: 20000000,
    description: "Âm thanh vòm sống động, chống ồn chủ động ANC đỉnh cao.",
    category: "Audio",
    image: "/products/anh-tai-nghe-khong-day-pro.jpg",
  },
  {
    id: 2,
    name: "Đồng hồ thông minh SmartWatch",
    price: 6000000,
    description: "Theo dõi sức khỏe 24/7, đo nhịp tim và kháng nước chuẩn 5ATM.",
    category: "Wearable",
    image: "/products/dong-ho-thong-minh-SmartWatch.jpg",
  },
  {
    id: 3,
    name: "Bàn phím cơ RGB",
    price: 800000,
    description: "Switch cơ học siêu nhạy, đèn nền RGB 16.8 triệu màu tùy chỉnh.",
    category: "Peripheral",
    image: "/products/ban-phim-co.jpg",
  },
  {
    id: 4,
    name: "Chuột Gaming không dây",
    price: 346000,
    description: "Cảm biến quang học 16000 DPI, trọng lượng siêu nhẹ và pin bền bỉ.",
    category: "Peripheral",
    image: "/products/chuot-gaming-khong-day.jpg",
  },
  {
    id: 5,
    name: "Balo Laptop chống nước",
    price: 147000,
    description: "Chất liệu Oxford chống thấm nước cao cấp, ngăn chứa laptop 15.6 inch.",
    category: "Accessory",
    image: "/products/balo-laptop-chong-nuoc.jpg",
  },
  {
    id: 6,
    name: "Loa Bluetooth di động",
    price: 358000,
    description: "Công suất mạnh mẽ, âm bass uy lực, thời lượng pin liên tục 12 giờ.",
    category: "Audio",
    image: "/products/loa-bluetooth-di-dong.jpg",
  },
];

// Helper: format price for display
export function formatPrice(price: number): string {
  return price.toLocaleString("vi-VN") + " VNĐ";
}

// Helper: get all unique categories
export function getCategories(): string[] {
  return [...new Set(products.map((p) => p.category))];
}