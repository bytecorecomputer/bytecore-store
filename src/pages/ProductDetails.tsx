import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { PRODUCTS } from "@/data/products";
import { Star, Truck, ShieldCheck, ShoppingCart, ArrowLeft, Zap, Sparkles, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser } = useAuth();
    const { addToCart } = useCart();
    const product = PRODUCTS.find((p) => p.id === id);
    const [isAdded, setIsAdded] = useState(false);

    const handleAddToCart = () => {
        if (!product) return;
        addToCart(product);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    const handleBuyNow = () => {
        if (!currentUser) {
            navigate("/login", { state: { from: location } });
            return;
        }
        if (!product) return;
        addToCart(product);
        navigate("/cart");
    };

    if (!product) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
                <h2 className="text-3xl font-black mb-4 tracking-tighter uppercase">Machine Not Found</h2>
                <Link to="/shop" className="text-primary font-bold hover:underline tracking-widest uppercase text-xs">Back to Inventory</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white pt-28 pb-20 overflow-x-hidden">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Back Link */}
                <Link to="/shop" className="inline-flex items-center text-gray-500 hover:text-white mb-12 group transition-colors text-[10px] font-black uppercase tracking-[0.3em]">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Collection
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
                    {/* Visual Section */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative"
                    >
                        {/* Background Glow */}
                        <div className="absolute -inset-10 bg-primary/20 rounded-[4rem] blur-[120px] opacity-50 z-0" />

                        <div className="relative z-10 aspect-square rounded-[2.5rem] overflow-hidden bg-white/[0.02] border border-white/10 shadow-2xl group flex items-center justify-center">
                            <motion.img
                                layoutId={`product-image-${product.id}`}
                                src={product.image}
                                alt={product.title}
                                className="w-[85%] h-[85%] object-contain p-8 group-hover:scale-110 transition-transform duration-1000"
                            />

                            {/* Reflective Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />

                            {/* Tags */}
                            <div className="absolute top-8 left-8 flex flex-col gap-2">
                                <span className="bg-primary px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase shadow-xl shadow-primary/40">
                                    {product.badge || 'Elite Grade'}
                                </span>
                            </div>
                        </div>

                        {/* Floating Micro-Badges */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -bottom-8 -right-8 md:right-0 bg-black/60 backdrop-blur-3xl border border-white/10 p-6 rounded-3xl hidden md:block shadow-2xl"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Authenticated</p>
                                    <p className="text-sm font-black text-white uppercase tracking-tight">Certified Quality</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Content Section */}
                    <div className="flex flex-col">
                        <header className="space-y-6 mb-10">
                            <div className="flex items-center gap-3">
                                <Sparkles className="w-4 h-4 text-primary" />
                                <span className="text-[10px] font-black tracking-[0.4em] text-primary uppercase">{product.category}</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none text-white uppercase">{product.title}</h1>

                            <div className="flex items-center gap-8">
                                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                    <span className="font-black text-sm">{product.rating}</span>
                                    <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest ml-1">({product.reviews} Feedbacks)</span>
                                </div>
                                <span className="text-green-500 font-bold flex items-center gap-2 uppercase text-[10px] tracking-widest">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]" /> In Stock
                                </span>
                            </div>
                        </header>

                        <div className="flex items-end gap-6 mb-12">
                            <span className="text-6xl font-black text-white tracking-tighter">₹{product.price.toLocaleString()}</span>
                            <div className="flex flex-col mb-2">
                                <span className="text-xl text-gray-500 line-through font-bold">₹{product.originalPrice.toLocaleString()}</span>
                                <span className="text-primary font-black text-xs uppercase tracking-widest">Saving ₹{(product.originalPrice - product.price).toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Specs Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-12">
                            {Object.entries(product.specs).map(([key, value]) => (
                                <div key={key} className="bg-white/[0.03] p-5 rounded-2xl border border-white/5 hover:border-primary/30 transition-all group">
                                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 group-hover:text-primary transition-colors">{key}</p>
                                    <p className="font-black text-sm text-white uppercase tracking-tight">{value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-12">
                            <button
                                onClick={handleBuyNow}
                                className="flex-[2] bg-white text-black h-20 rounded-2xl font-black text-xs tracking-[0.3em] uppercase hover:bg-gray-200 active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-4 group"
                            >
                                <Zap className="w-5 h-5 fill-current" /> Buy Instantly
                            </button>
                            <button
                                onClick={handleAddToCart}
                                disabled={isAdded}
                                className={cn(
                                    "flex-1 h-20 rounded-2xl font-black text-xs tracking-[0.3em] uppercase transition-all border flex items-center justify-center gap-4 active:scale-95",
                                    isAdded
                                        ? "bg-green-500 border-green-500 text-white"
                                        : "bg-transparent text-white border-white/10 hover:bg-white/5 shadow-xl"
                                )}
                            >
                                <AnimatePresence mode="wait">
                                    {isAdded ? (
                                        <motion.div
                                            key="added"
                                            initial={{ scale: 0.5, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0.5, opacity: 0 }}
                                            className="flex items-center gap-2"
                                        >
                                            <CheckCircle2 className="w-5 h-5" /> Added
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="add"
                                            initial={{ scale: 0.5, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0.5, opacity: 0 }}
                                            className="flex items-center gap-2"
                                        >
                                            <ShoppingCart className="w-5 h-5" /> Add to Cart
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </button>
                        </div>

                        {/* Trust Markers */}
                        <div className="grid grid-cols-2 gap-6 pt-10 border-t border-white/10">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center justify-center text-primary">
                                    <Truck className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="font-black text-[10px] text-white uppercase tracking-widest mb-1">Flash Delivery</p>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">24h Response Time</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center justify-center text-primary">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="font-black text-[10px] text-white uppercase tracking-widest mb-1">Elite Warranty</p>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">1 Year Protection</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
