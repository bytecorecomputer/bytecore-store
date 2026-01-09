import { motion } from "framer-motion";
import { ShoppingCart, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import type { Product } from "@/data/products";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
            className="group relative bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
        >
            {/* Badge */}
            {product.badge && (
                <div className="absolute top-3 left-3 z-10 bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-lg">
                    {product.badge}
                </div>
            )}

            {/* Wishlist Button */}
            <button className="absolute top-3 right-3 z-10 p-2 bg-background/50 backdrop-blur-md rounded-full text-muted-foreground hover:text-red-500 hover:bg-background transition-colors">
                <Heart className="w-4 h-4" />
            </button>

            {/* Image Container */}
            <div className="aspect-[4/3] overflow-hidden bg-muted relative">
                <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Quick Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Link to={`/product/${product.id}`} className="px-4 py-2 bg-white text-black rounded-full text-sm font-semibold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75">
                        View Details
                    </Link>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{product.category}</p>
                        <h3 className="font-semibold text-lg leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                            {product.title}
                        </h3>
                    </div>
                </div>

                {/* Specs Mini */}
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span className="bg-muted px-1.5 py-0.5 rounded">{product.specs.processor}</span>
                    <span className="bg-muted px-1.5 py-0.5 rounded">{product.specs.ram}</span>
                </div>

                <div className="flex items-center justify-between pt-2">
                    <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground line-through">₹{product.originalPrice.toLocaleString()}</span>
                        <span className="text-xl font-bold text-foreground">₹{product.price.toLocaleString()}</span>
                    </div>
                    <button className="p-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 active:scale-95">
                        <ShoppingCart className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
