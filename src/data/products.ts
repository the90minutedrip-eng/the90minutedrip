export type ProductCategory = "NEW_SEASON" | "LEGEND" | "RETRO" | "SPECIAL_EDITION";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  team: string;
  season: string;
  price: number;
  originalPrice?: number;
  images: string[];
  videos?: string[];
  sizes: string[];
  stock: { [size: string]: number };
  isLimitedEdition: boolean;
  discount?: number;
}

export const products: Product[] = [
  {
    id: "manutd-24-home",
    name: "Manchester United Home 24/25",
    category: "NEW_SEASON",
    team: "Manchester United",
    season: "2024/25",
    price: 7399,
    originalPrice: 9049,
    discount: 18,
    images: ["/Jersey-Pics/Trent Front.png", "/Jersey-Pics/trent back.png"],
    videos: ["https://www.w3schools.com/html/mov_bbb.mp4"],
    sizes: ["S", "M", "L", "XL"],
    stock: { S: 10, M: 15, L: 8, XL: 5 },
    isLimitedEdition: false,
  },
  {
    id: "brazil-70-pele",
    name: "Brazil Pelé 1970",
    category: "LEGEND",
    team: "Brazil",
    season: "1970",
    price: 10707,
    images: ["/Jersey-Pics/Yamal Front.png", "/Jersey-Pics/Yamal Back.png"],
    sizes: ["S", "M", "L"],
    stock: { S: 3, M: 4, L: 2 },
    isLimitedEdition: true,
  },
  {
    id: "barca-05-ronaldinho",
    name: "Barcelona 2005 Ronaldinho",
    category: "RETRO",
    team: "Barcelona",
    season: "2005/06",
    price: 9877,
    images: ["/Jersey-Pics/Modric Front.png", "/Jersey-Pics/Modric back.png"],
    sizes: ["M", "L", "XL"],
    stock: { M: 6, L: 4, XL: 2 },
    isLimitedEdition: false,
  },
  {
    id: "arsenal-04-invincibles",
    name: "Arsenal Invincibles 2003/04",
    category: "LEGEND",
    team: "Arsenal",
    season: "2003/04",
    price: 11599,
    originalPrice: 12899,
    discount: 10,
    images: ["/Jersey-Pics/Yamal Front.png", "/Jersey-Pics/Yamal Back.png"],
    sizes: ["S", "M", "L", "XL"],
    stock: { S: 5, M: 8, L: 6, XL: 3 },
    isLimitedEdition: true,
  },
  {
    id: "real-madrid-24-home",
    name: "Real Madrid Home 24/25",
    category: "NEW_SEASON",
    team: "Real Madrid",
    season: "2024/25",
    price: 7799,
    images: ["/Jersey-Pics/Real madrid front Belingam.png", "/Jersey-Pics/Belingam back.png"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: { S: 12, M: 18, L: 15, XL: 8, XXL: 4 },
    isLimitedEdition: false,
  },
  {
    id: "milan-90-retro",
    name: "AC Milan 1990 Retro",
    category: "RETRO",
    team: "AC Milan",
    season: "1989/90",
    price: 8999,
    images: ["/Jersey-Pics/Trent Front.png", "/Jersey-Pics/trent back.png"],
    sizes: ["M", "L", "XL"],
    stock: { M: 4, L: 6, XL: 3 },
    isLimitedEdition: false,
  },
];
