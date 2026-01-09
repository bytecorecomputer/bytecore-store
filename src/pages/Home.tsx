import { useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { PRODUCTS } from "@/data/products";

// Importing the 4 unique laptop PNGs
import laptop1 from "@/assets/laptops/png1.png";
import laptop2 from "@/assets/laptops/png2.png";
import laptop3 from "@/assets/laptops/png3.png";
import laptop4 from "@/assets/laptops/png4.png";

export default function Home() {
    const navigate = useNavigate();
    const trendingProducts = [...PRODUCTS].sort((a, b) => b.rating - a.rating).slice(0, 8);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = direction === 'left' ? -400 : 400;
            scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-black overflow-x-hidden">

            {/* Premium Full-Screen Hero Section */}
            <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
                {/* 1. Precise Background - Performance Optimized */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(37,99,235,0.08)_0%,_transparent_50%)]" />

                    {/* Minimalist Animated Glows */}
                    <motion.div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]"
                        animate={{ opacity: [0.2, 0.4, 0.2] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    />

                    {/* Grain Texture */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 contrast-150 mix-blend-overlay"></div>
                </div>

                {/* 2. Floating Laptops - High Performance Floating */}
                <div className="absolute inset-0 z-10 pointer-events-none">
                    <motion.img
                        src={laptop1}
                        animate={{ y: [0, -20, 0], rotate: [15, 12, 15] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-[10%] left-[5%] w-[420px] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] opacity-70"
                    />
                    <motion.img
                        src={laptop2}
                        animate={{ y: [0, 25, 0], rotate: [-15, -18, -15] }}
                        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute top-[5%] right-[2%] w-[450px] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] opacity-80"
                    />
                    <motion.img
                        src={laptop3}
                        animate={{ y: [0, -15, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                        className="absolute bottom-[10%] left-[8%] w-[380px] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] opacity-80"
                    />
                    <motion.img
                        src={laptop4}
                        animate={{ y: [0, 20, 0] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                        className="absolute bottom-[8%] right-[5%] w-[400px] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] opacity-70"
                    />
                </div>

                {/* 3. Main Content - High-Level Impact */}
                <div className="container relative z-30 px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="space-y-12"
                    >
                        {/* High-Level Title */}
                        <div className="relative">
                            <h1 className="text-[7rem] md:text-[14rem] font-black tracking-tighter leading-none text-white overflow-hidden inline-flex">
                                <span className="relative inline-block group">
                                    BYTE
                                    <motion.span
                                        className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-[30deg] pointer-events-none"
                                        animate={{ left: ['-100%', '200%'] }}
                                        transition={{ duration: 3, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }}
                                    />
                                </span>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-purple-500 ml-2">CORE</span>
                            </h1>
                        </div>

                        <p className="max-w-xl mx-auto text-lg md:text-xl text-gray-400 font-medium leading-relaxed glass-premium p-8 rounded-[2rem] border-white/5 shadow-2xl">
                            The world's most powerful machines at <span className="text-white">unbeatable prices</span>.
                            Fully inspected and ready for your next big project.
                        </p>

                        {/* Best-in-Class CTAs */}
                        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                            <button
                                onClick={() => navigate('/shop')}
                                className="group relative px-16 py-6 bg-white text-black font-black text-xs uppercase tracking-[0.3em] rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(255,255,255,0.1)]"
                            >
                                <span className="relative z-10 flex items-center gap-3">
                                    Explore Collection <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </button>

                            <button
                                onClick={() => navigate('/sell')}
                                className="px-16 py-6 glass-premium text-white font-black text-xs uppercase tracking-[0.3em] rounded-2xl hover:bg-white/10 transition-all border border-white/10"
                            >
                                Sell Your Machine
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-20"
                >
                    <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
                </motion.div>
            </section>

            {/* Improved Slider Section */}
            <section className="py-12 md:py-20 bg-background/50 border-y border-border/50">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between mb-6 md:mb-10">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2 md:gap-3">
                                <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-primary" /> Trending Now
                            </h2>
                            <p className="text-sm md:text-base text-muted-foreground mt-1 md:mt-2">Top rated picks from our community</p>
                        </div>
                        <div className="hidden md:flex gap-2">
                            <button onClick={() => scroll('left')} className="p-3 border border-border rounded-full hover:bg-muted hover:scale-105 active:scale-95 transition-all"><ChevronLeft className="w-5 h-5" /></button>
                            <button onClick={() => scroll('right')} className="p-3 border border-border rounded-full hover:bg-muted hover:scale-105 active:scale-95 transition-all"><ChevronRight className="w-5 h-5" /></button>
                        </div>
                    </div>

                    <div
                        ref={scrollContainerRef}
                        className="flex gap-4 md:gap-6 overflow-x-auto pb-6 hide-scrollbar snap-x snap-mandatory px-2 md:px-0"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {trendingProducts.map((product) => (
                            <motion.div
                                key={product.id}
                                className="min-w-[260px] md:min-w-[320px] snap-center"
                                whileHover={{ y: -5 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Link to={`/product/${product.id}`} className="group block bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all h-full flex flex-col">
                                    <div className="relative aspect-[4/3] bg-muted/20 p-4 md:p-6 flex items-center justify-center overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                                        <img
                                            src={product.image}
                                            alt={product.title}
                                            className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-110 transition-transform duration-500 z-0"
                                        />
                                        <span className="absolute top-3 right-3 md:top-4 md:right-4 bg-background/80 backdrop-blur-md border border-border/50 px-2 py-1 rounded text-[10px] md:text-xs font-bold flex items-center gap-1 z-20">
                                            <Star className="w-3 h-3 text-yellow-500 fill-current" /> {product.rating}
                                        </span>
                                    </div>
                                    <div className="p-4 md:p-5 flex-1 flex flex-col">
                                        <h3 className="font-bold text-base md:text-lg mb-2 group-hover:text-primary transition-colors line-clamp-1">{product.title}</h3>
                                        <div className="flex items-center gap-2 mb-3 md:mb-4">
                                            <span className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-[10px] md:text-xs font-medium">{product.category}</span>
                                            {product.badge && <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] md:text-xs font-medium">{product.badge}</span>}
                                        </div>
                                        <div className="mt-auto flex items-end justify-between border-t border-border/50 pt-3 md:pt-4">
                                            <div>
                                                <p className="text-[10px] md:text-xs text-muted-foreground line-through">₹{product.originalPrice.toLocaleString()}</p>
                                                <p className="text-lg md:text-xl font-bold">₹{product.price.toLocaleString()}</p>
                                            </div>
                                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                                <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
