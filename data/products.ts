export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Tai nghe không dây Pro",
    description: "Âm thanh vòm sống động, chống ồn chủ động ANC đỉnh cao.",
    price: "20.000.000 VNĐ",
    image: "/products/anh-tai-nghe-khong-day-pro.jpg",
  },
  {
    id: "2",
    name: "Đồng hồ thông minh SmartWatch",
    description: "Theo dõi sức khỏe 24/7, đo nhịp tim và kháng nước chuẩn 5ATM.",
    price: "6.000.000 VNĐ",
    image: "/products/dong-ho-thong-minh-SmartWatch.jpg",
  },
  {
    id: "3",
    name: "Bàn phím cơ RGB",
    description: "Switch cơ học siêu nhạy, đèn nền RGB 16.8 triệu màu tùy chỉnh.",
    price: "800.000 VNĐ",
    image: "/products/ban-phim-co.jpg",
  },
  {
    id: "4",
    name: "Chuột Gaming không dây",
    description: "Cảm biến quang học 16000 DPI, trọng lượng siêu nhẹ và pin bền bỉ.",
    price: "346.000 VNĐ",
    image: "/products/chuot-gaming-khong-day.jpg",
  },
  {
    id: "5",
    name: "Balo Laptop chống nước",
    description: "Chất liệu Oxford chống thấm nước cao cấp, ngăn chứa laptop 15.6 inch.",
    price: "147.000 VNĐ",
    image: "/products/balo-laptop-chong-nuoc.jpg",
  },
  {
    id: "6",
    name: "Loa Bluetooth di động",
    description: "Công suất mạnh mẽ, âm bass uy lực, thời lượng pin liên tục 12 giờ.",
    price: "358.000 VNĐ",
    image: "/products/loa-bluetooth-di-dong.jpg",
  },
];