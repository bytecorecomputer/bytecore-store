import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PRODUCTS, CATEGORIES } from "@/data/products";
import { Star, Search, X, SlidersHorizontal, Sparkles, Zap, ArrowRight, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";

function ProductCard({ product }: { product: typeof PRODUCTS[0] }) {
    const { addToCart } = useCart();
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="group relative"
        >
            <div className="h-full glass-premium rounded-[2.5rem] overflow-hidden hover:border-primary/50 transition-all duration-500 flex flex-col relative">

                {/* Image Section */}
                <Link
                    to={`/product/${product.id}`}
                    className="relative aspect-square bg-white/[0.02] flex items-center justify-center overflow-hidden"
                >
                    <motion.img
                        layoutId={`product-image-${product.id}`}
                        src={product.image}
                        alt={product.title}
                        className="w-[80%] h-[80%] object-contain p-4 group-hover:scale-110 transition-transform duration-700 select-none"
                    />

                    {/* Reflective Layer */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                    <div className="absolute top-6 left-6 flex flex-col gap-2">
                        {product.badge && (
                            <div className="px-3 py-1 bg-primary text-white text-[9px] font-black rounded-full uppercase tracking-widest shadow-xl shadow-primary/40">
                                {product.badge}
                            </div>
                        )}
                    </div>

                    <div className="absolute top-6 right-6 flex items-center gap-1 text-yellow-500 text-[10px] font-black glass-premium px-3 py-1 rounded-full border-white/5">
                        <Star className="w-3 h-3 fill-current" /> {product.rating}
                    </div>
                </Link>

                {/* Info Section */}
                <div className="p-8 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-[9px] font-black uppercase tracking-[0.2em]">{product.category}</span>
                    </div>

                    <Link to={`/product/${product.id}`}>
                        <h3 className="font-black text-xl mb-6 group-hover:text-primary transition-colors line-clamp-1 tracking-tighter uppercase">
                            {product.title}
                        </h3>
                    </Link>

                    {/* Specifications Pills */}
                    <div className="flex flex-wrap gap-2 mb-8">
                        <span className="px-2.5 py-1 bg-white/5 rounded-lg text-[9px] font-bold text-gray-500 uppercase tracking-widest">{product.specs.processor}</span>
                        <span className="px-2.5 py-1 bg-white/5 rounded-lg text-[9px] font-bold text-gray-500 uppercase tracking-widest">{product.specs.ram}</span>
                    </div>

                    <div className="mt-auto pt-6 flex items-center justify-between border-t border-white/5">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-500 line-through font-black tracking-widest">₹{product.originalPrice.toLocaleString()}</span>
                            <span className="text-2xl font-black text-white tracking-tighter">₹{product.price.toLocaleString()}</span>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    addToCart(product);
                                }}
                                className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all duration-300 text-white group/btn"
                            >
                                <ShoppingCart className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                            </button>
                            <Link
                                to={`/product/${product.id}`}
                                className="w-12 h-12 rounded-xl bg-white text-black flex items-center justify-center hover:bg-gray-200 transition-all duration-300"
                            >
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default function Shop() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [priceRange, setPriceRange] = useState(200000);
    const [filteredProducts, setFilteredProducts] = useState(PRODUCTS);

    const searchQuery = searchParams.get("search") || "";
    const categoryParam = searchParams.get("category");

    useEffect(() => {
        if (categoryParam) {
            setSelectedCategory(categoryParam);
        }
    }, [categoryParam]);

    useEffect(() => {
        let result = PRODUCTS;
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            result = result.filter(product =>
                product.title.toLowerCase().includes(lowerQuery) ||
                product.category.toLowerCase().includes(lowerQuery) ||
                product.specs.processor.toLowerCase().includes(lowerQuery)
            );
        }
        if (selectedCategory !== "All") {
            result = result.filter(product => product.category === selectedCategory);
        }
        result = result.filter(product => product.price <= priceRange);
        setFilteredProducts(result);
    }, [selectedCategory, priceRange, searchQuery]);

    const clearSearch = () => {
        setSearchParams({});
        setSelectedCategory("All");
    };

    return (
        <div className="min-h-screen bg-black text-white pt-28 pb-20">
            <div className="container mx-auto px-4 lg:px-12 max-w-[1600px]">

                {/* Header Section */}
                <header className="mb-16 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-3 px-4 py-1.5 glass-premium rounded-full mb-6 border-white/5"
                    >
                        <Sparkles className="w-3 h-3 text-primary" />
                        <span className="text-[10px] font-black tracking-[0.4em] text-primary uppercase">Direct Inventory</span>
                    </motion.div>

                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 text-reflective uppercase">
                        Choose Your <span className="text-primary italic">Weapon</span>
                    </h1>

                    {searchQuery && (
                        <button
                            onClick={clearSearch}
                            className="inline-flex items-center gap-4 glass-premium px-8 py-3 rounded-2xl group hover:border-primary/50 transition-all border-white/5"
                        >
                            <Search className="w-4 h-4 text-primary" />
                            <p className="text-[10px] font-black tracking-widest text-gray-500 uppercase">
                                Results for "<span className="text-white">{searchQuery}</span>"
                            </p>
                            <X className="w-4 h-4 text-gray-500 group-hover:text-red-500 transition-colors" />
                        </button>
                    )}
                </header>

                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
                    {/* Filters Sidebar */}
                    <aside className="w-full lg:w-72 space-y-12 h-fit lg:sticky lg:top-32 z-10">
                        <div className="glass-premium p-8 rounded-[2rem] border-white/5 shadow-2xl">
                            <div className="flex items-center justify-between mb-10">
                                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Master Filters</h3>
                                <SlidersHorizontal className="w-4 h-4 text-primary" />
                            </div>

                            {/* Categories */}
                            <div className="space-y-5 mb-12">
                                {CATEGORIES.map(category => (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className="relative w-full group py-0.5"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className={cn(
                                                "text-xs font-black uppercase tracking-widest transition-all",
                                                selectedCategory === category ? 'text-primary' : 'text-gray-500 hover:text-white'
                                            )}>
                                                {category}
                                            </span>
                                            {selectedCategory === category && (
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* Price Range */}
                            <div className="space-y-6">
                                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Budget Limit</h3>
                                <div className="space-y-4">
                                    <input
                                        type="range"
                                        min="10000"
                                        max="200000"
                                        step="5000"
                                        value={priceRange}
                                        onChange={(e) => setPriceRange(Number(e.target.value))}
                                        className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary"
                                    />
                                    <div className="bg-white/[0.03] p-4 rounded-xl flex items-center justify-between border border-white/5">
                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">₹</span>
                                        <span className="text-xl font-black text-white tracking-tighter">{priceRange.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Promo Card */}
                        <div className="hidden lg:block relative rounded-[2.5rem] overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-blue-600/20 blur-2xl group-hover:scale-125 transition-transform duration-1000" />
                            <div className="relative z-10 p-8 glass-premium border-white/5 h-56 flex flex-col justify-between">
                                <div className="bg-primary/20 w-12 h-12 rounded-xl flex items-center justify-center border border-primary/20">
                                    <Zap className="w-5 h-5 text-primary fill-current" />
                                </div>
                                <h3 className="text-lg font-black tracking-tighter leading-none uppercase">Need Custom<br /><span className="text-primary italic">Build?</span></h3>
                                <Link to="/sell" className="flex items-center gap-3 text-white font-black text-[10px] tracking-widest hover:gap-5 transition-all uppercase">
                                    Contact Agents <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <main className="flex-1">
                        {filteredProducts.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-96 flex flex-col items-center justify-center text-center p-12 glass-premium rounded-[3rem] border border-dashed border-white/10"
                            >
                                <Search className="w-12 h-12 text-gray-700 mb-6 opacity-50" />
                                <h3 className="text-2xl font-black mb-2 tracking-tighter uppercase">No Machines Found</h3>
                                <p className="text-gray-500 font-bold max-w-xs mx-auto mb-8 text-[10px] tracking-[0.2em] uppercase">The specific loadout you requested is currently unavailable.</p>
                                <button onClick={clearSearch} className="px-8 py-4 bg-white text-black rounded-xl font-black text-[10px] tracking-widest uppercase hover:bg-gray-200 transition-all">Reset Sync</button>
                            </motion.div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                <AnimatePresence mode="popLayout">
                                    {filteredProducts.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
