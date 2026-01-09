import { Zap, Shield, Star, Award } from "lucide-react";

// Importing images directly (Vite will handle the paths)
import laptop1 from "@/assets/laptops/png1.png";
import laptop2 from "@/assets/laptops/png2.png";
import laptop3 from "@/assets/laptops/png3.png";
import laptop4 from "@/assets/laptops/png4.png";

// Re-using these 4 images across the product list for now as requested
const laptop5 = laptop1;
const laptop6 = laptop2;
const laptop7 = laptop3;
const laptop8 = laptop4;
const laptop9 = laptop1;
const laptop10 = laptop2;

export const CATEGORIES = ["All", "Gaming", "Ultrabook", "Student", "Professional"];

export interface Product {
    id: string;
    title: string;
    price: number;
    originalPrice: number;
    rating: number;
    reviews: number;
    category: string;
    image: string;
    badge?: string;
    // Seller Details (optional for mock data, required for real listings)
    sellerName?: string;
    sellerMobile?: string;
    sellerAddress?: string;
    sellerId?: string;
    condition?: string;
    status?: string;
    createdAt?: any;
    specs: {
        processor: string;
        ram: string;
        storage: string;
        display: string;
    }
}

export const PRODUCTS: Product[] = [
    {
        id: "1",
        title: "Dell Inspiron 5440 Thin & Light",
        price: 45999,
        originalPrice: 65000,
        rating: 4.5,
        reviews: 128,
        category: "Student",
        image: laptop1,
        badge: "Best Seller",
        specs: { processor: "i5 12th Gen", ram: "16GB", storage: "512GB SSD", display: "14\" FHD" }
    },
    {
        id: "2",
        title: "Dell Latitude 3550 Pro",
        price: 52499,
        originalPrice: 78000,
        rating: 4.8,
        reviews: 85,
        category: "Professional",
        image: laptop3,
        badge: "Premium",
        specs: { processor: "i7 13th Gen", ram: "16GB", storage: "1TB SSD", display: "15.6\" FHD" }
    },
    {
        id: "3",
        title: "HP Victus 15 Gaming Beast",
        price: 72999,
        originalPrice: 95000,
        rating: 4.9,
        reviews: 342,
        category: "Gaming",
        image: laptop4,
        badge: "Gaming Beast",
        specs: { processor: "Ryzen 7 7840HS", ram: "16GB", storage: "512GB SSD", display: "144Hz 15.6\"" }
    },
    {
        id: "4",
        title: "OMEN by HP 16 Gaming",
        price: 115000,
        originalPrice: 145000,
        rating: 5.0,
        reviews: 56,
        category: "Gaming",
        image: laptop5,
        specs: { processor: "i9 14900HX", ram: "32GB", storage: "2TB Gen4", display: "16.1\" QHD 240Hz" }
    },
    {
        id: "5",
        title: "Dell Inspiron 3530 Series",
        price: 38999,
        originalPrice: 48000,
        rating: 4.2,
        reviews: 210,
        category: "Student",
        image: laptop7,
        badge: "Value Pick",
        specs: { processor: "i3 13th Gen", ram: "8GB", storage: "512GB SSD", display: "15.6\" FHD" }
    },
    {
        id: "6",
        title: "ASUS Vivobook 16X",
        price: 64990,
        originalPrice: 82990,
        rating: 4.6,
        reviews: 112,
        category: "Ultrabook",
        image: laptop2,
        specs: { processor: "Ryzen 5 7600H", ram: "16GB", storage: "512GB SSD", display: "16\" WUXGA" }
    },
    {
        id: "7",
        title: "Lenovo Ideapad Slim 5",
        price: 58990,
        originalPrice: 75000,
        rating: 4.4,
        reviews: 89,
        category: "Ultrabook",
        image: laptop6,
        specs: { processor: "i5 13500H", ram: "16GB", storage: "1TB SSD", display: "14\" OLED" }
    },
    {
        id: "8",
        title: "Acer Nitro V Gaming",
        price: 78990,
        originalPrice: 99999,
        rating: 4.7,
        reviews: 156,
        category: "Gaming",
        image: laptop8,
        specs: { processor: "i7 12650H", ram: "16GB", storage: "512GB SSD", display: "144Hz FHD" }
    },
    {
        id: "9",
        title: "MacBook Air M1 (Used - Mint)",
        price: 55000,
        originalPrice: 99000,
        rating: 4.9,
        reviews: 890,
        category: "Professional",
        image: laptop9,
        badge: "Hot Deal",
        specs: { processor: "Apple M1", ram: "8GB", storage: "256GB SSD", display: "13.3\" Retina" }
    },
    {
        id: "10",
        title: "Dell G15 Gaming",
        price: 85000,
        originalPrice: 110000,
        rating: 4.6,
        reviews: 124,
        category: "Gaming",
        image: laptop10,
        specs: { processor: "Ryzen 7 6800H", ram: "16GB", storage: "1TB SSD", display: "165Hz FHD" }
    },
];
