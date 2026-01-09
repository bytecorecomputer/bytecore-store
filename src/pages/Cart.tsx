import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShoppingCart, ShieldCheck, Zap } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";

export default function Cart() {
    const navigate = useNavigate();
    const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

    if (cart.length === 0) {
        return (
            <div className="min-h-[80vh] bg-black text-white flex flex-col items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <div className="w-32 h-32 bg-white/[0.03] border border-white/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl">
                        <ShoppingCart className="w-12 h-12 text-primary" />
                    </div>
                    <h2 className="text-4xl font-black mb-4 uppercase tracking-tighter">Vault is Empty</h2>
                    <p className="text-gray-500 mb-10 max-w-xs mx-auto text-xs font-bold uppercase tracking-widest leading-relaxed">
                        Your equipment bay is currently inactive. Deployment aborted.
                    </p>
                    <Link
                        to="/shop"
                        className="inline-flex items-center gap-4 bg-white text-black px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-gray-200 transition-all shadow-xl"
                    >
                        Browse Inventory <ArrowRight className="w-5 h-5" />
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white pt-28 pb-20">
            <div className="container mx-auto px-4 lg:px-12 max-w-[1400px]">
                <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,1)]" />
                            <span className="text-[10px] font-black tracking-[0.4em] text-primary uppercase">Active Session</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">Your <span className="text-primary italic">Loadout</span></h1>
                    </div>
                    <div className="glass-premium px-8 py-4 rounded-2xl border-white/5">
                        <span className="text-gray-500 font-black text-[10px] uppercase tracking-widest mr-4">Total Units</span>
                        <span className="text-2xl font-black text-white">{cartCount}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-6">
                        <AnimatePresence mode="popLayout">
                            {cart.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="flex flex-col sm:flex-row items-center gap-8 p-6 glass-premium border-white/5 rounded-[2rem] relative group hover:border-primary/30 transition-all duration-500"
                                >
                                    <div className="w-40 h-40 bg-white/[0.02] rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center p-4 border border-white/5">
                                        <img src={item.image} alt={item.title} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" />
                                    </div>

                                    <div className="flex-1 text-center sm:text-left">
                                        <div className="mb-4">
                                            <span className="text-[9px] font-black text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-lg">Machine ID: {item.id.slice(0, 8)}</span>
                                        </div>
                                        <h3 className="text-2xl font-black mb-2 uppercase tracking-tight">{item.title}</h3>
                                        <div className="flex items-center justify-center sm:justify-start gap-4">
                                            <p className="text-primary font-black text-xl">₹{item.price.toLocaleString()}</p>
                                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Single Unit</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 bg-white/[0.03] p-1.5 rounded-2xl border border-white/5">
                                        <button
                                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                            className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="w-6 text-center font-black text-lg">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="p-4 bg-red-500/5 hover:bg-red-500/10 text-gray-600 hover:text-red-500 rounded-2xl transition-all border border-transparent hover:border-red-500/20"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="glass-premium border-white/5 rounded-[2.5rem] p-10 lg:sticky lg:top-32 shadow-2xl">
                            <div className="flex items-center gap-3 mb-10">
                                <Zap className="w-5 h-5 text-primary fill-current" />
                                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Order Summary</h3>
                            </div>

                            <div className="space-y-6 mb-12">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Subtotal</span>
                                    <span className="text-lg font-black text-white px-4 py-1 bg-white/[0.03] rounded-lg">₹{cartTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Logistics</span>
                                    <span className="text-[10px] font-black text-green-500 uppercase tracking-widest bg-green-500/10 px-3 py-1 rounded-lg">Complimentary</span>
                                </div>
                                <div className="h-px bg-white/5 my-8" />
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-1">Total Payload</span>
                                    <span className="text-4xl font-black text-primary tracking-tighter">₹{cartTotal.toLocaleString()}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/checkout')}
                                className="w-full bg-white text-black py-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-gray-200 transition-all flex items-center justify-center gap-4 group shadow-[0_20px_40px_-10px_rgba(255,255,255,0.1)] active:scale-95"
                            >
                                <ShoppingBag className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                                Initiate Checkout
                            </button>

                            <div className="mt-12 space-y-6">
                                <div className="flex items-center gap-4 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                                    <ShieldCheck className="w-6 h-6 text-primary" />
                                    <div>
                                        <p className="text-[9px] font-black text-white uppercase tracking-widest mb-0.5">Secure Transaction</p>
                                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Encrypted via Razorpay</p>
                                    </div>
                                </div>
                                <p className="text-center text-[8px] text-gray-600 font-black uppercase tracking-[0.3em] leading-relaxed px-6">
                                    By proceeding, you verify the configuration above matches your operational requirements.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
