import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, X, Search, LogOut, ChevronDown, Rocket, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { CATEGORIES } from "@/data/products";
import logo from "@/assets/logo/bytecore-store.png";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [showCategoryMenu, setShowCategoryMenu] = useState(false);

    const { currentUser, logout } = useAuth();
    const { cartCount } = useCart();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchQuery.trim()) params.append("search", searchQuery);
        if (selectedCategory !== "All") params.append("category", selectedCategory);

        navigate(`/shop?${params.toString()}`);
        setIsOpen(false);
    };

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
                scrolled || isOpen
                    ? "bg-black/80 backdrop-blur-2xl border-b border-white/5 py-3 shadow-2xl"
                    : "bg-transparent py-6"
            )}
        >
            <div className="container mx-auto px-4 lg:px-8">
                <div className="flex items-center justify-between gap-4 lg:gap-12">

                    {/* 1. Large Brand Logo */}
                    <Link to="/" className="flex-shrink-0 group">
                        <motion.img
                            src={logo}
                            alt="Bytecore"
                            className="h-10 md:h-14 lg:h-16 w-auto object-contain transition-all duration-500 brightness-110 group-hover:brightness-125"
                            whileHover={{ scale: 1.05 }}
                        />
                    </Link>

                    {/* 2. Central Smart Search */}
                    <form
                        onSubmit={handleSearch}
                        className="hidden md:flex flex-1 relative items-center max-w-2xl mx-auto"
                    >
                        <div className="relative flex items-center w-full bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden group focus-within:border-primary/50 focus-within:ring-4 ring-primary/10 transition-all duration-300">

                            {/* Category Dropdown */}
                            <div className="relative flex-shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                                    className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border-r border-white/10 text-[10px] font-black uppercase tracking-widest text-gray-400 transition-colors"
                                >
                                    {selectedCategory} <ChevronDown className={cn("w-3 h-3 transition-transform duration-300", showCategoryMenu && "rotate-180")} />
                                </button>

                                <AnimatePresence>
                                    {showCategoryMenu && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-[120%] left-0 w-56 bg-black/90 backdrop-blur-3xl border border-white/10 rounded-2xl p-2 z-50 shadow-2xl"
                                        >
                                            {CATEGORIES.map(category => (
                                                <button
                                                    key={category}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedCategory(category);
                                                        setShowCategoryMenu(false);
                                                    }}
                                                    className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-white"
                                                >
                                                    {category}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <input
                                type="text"
                                placeholder="Search premium hardware..."
                                className="w-full bg-transparent border-none px-6 py-3 text-white placeholder:text-gray-500 focus:outline-none font-medium text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />

                            <button type="submit" className="px-6 py-3 text-gray-400 hover:text-primary transition-colors">
                                <Search className="w-5 h-5" />
                            </button>
                        </div>
                    </form>

                    {/* 3. Navigation & Actions */}
                    <div className="flex items-center gap-4 lg:gap-8">
                        <nav className="hidden lg:flex items-center gap-8">
                            {['Shop', 'Sell'].map((name) => (
                                <Link
                                    key={name}
                                    to={`/${name.toLowerCase()}`}
                                    className="relative group py-2"
                                >
                                    <span className={cn(
                                        "text-[10px] font-black tracking-[0.2em] uppercase transition-colors duration-300",
                                        location.pathname === `/${name.toLowerCase()}` ? "text-primary" : "text-gray-400 group-hover:text-white"
                                    )}>
                                        {name}
                                    </span>
                                    {location.pathname === `/${name.toLowerCase()}` && (
                                        <motion.div layoutId="nav-underline" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
                                    )}
                                </Link>
                            ))}
                        </nav>

                        {/* Cart & User */}
                        <div className="flex items-center gap-3 lg:gap-6 lg:border-l border-white/10 lg:pl-8">
                            <Link to="/cart" className="relative p-2 text-gray-400 hover:text-white transition-colors group">
                                <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                                <AnimatePresence>
                                    {cartCount > 0 && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                            className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-[10px] font-black text-white flex items-center justify-center rounded-full border-2 border-black"
                                        >
                                            {cartCount}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </Link>

                            {currentUser ? (
                                <div className="flex items-center gap-3 bg-white/[0.05] border border-white/10 p-1.5 rounded-2xl pr-3 hover:bg-white/[0.08] transition-all">
                                    <div className="w-9 h-9 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center font-black text-white shadow-lg shadow-primary/20">
                                        {currentUser.displayName?.[0] || <User className="w-4 h-4" />}
                                    </div>
                                    <div className="hidden xl:block">
                                        <p className="text-[10px] font-black text-white leading-none tracking-tight">
                                            {currentUser.displayName?.split(" ")[0] || "Trader"}
                                        </p>
                                    </div>
                                    <button onClick={logout} className="p-2 text-gray-500 hover:text-red-500 transition-colors">
                                        <LogOut className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    to="/login"
                                    className="hidden sm:flex px-6 py-2.5 bg-white text-black font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-gray-200 transition-all shadow-xl shadow-white/5 active:scale-95"
                                >
                                    Log In
                                </Link>
                            )}

                            {/* Mobile Toggle */}
                            <button
                                className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Expanded Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="lg:hidden fixed inset-x-0 top-[70px] bg-black border-t border-white/5 p-6 shadow-2xl h-[calc(100vh-70px)] flex flex-col"
                    >
                        <div className="space-y-6">
                            <form onSubmit={handleSearch} className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Search hardware..."
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 transition-all"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </form>

                            <div className="grid grid-cols-1 gap-4">
                                {['Home', 'Shop', 'Sell', 'Cart'].map((name) => (
                                    <Link
                                        key={name}
                                        to={name === 'Home' ? '/' : `/${name.toLowerCase()}`}
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center justify-between p-5 bg-white/[0.03] border border-white/10 rounded-2xl hover:bg-white/[0.05] transition-all group"
                                    >
                                        <span className="text-sm font-black uppercase tracking-widest text-gray-400 group-hover:text-white">{name}</span>
                                        <Rocket className="w-5 h-5 text-primary group-hover:scale-125 transition-transform" />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {!currentUser && (
                            <div className="mt-auto pb-10">
                                <Link
                                    to="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="w-full flex items-center justify-center py-5 bg-primary text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-primary/20"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
