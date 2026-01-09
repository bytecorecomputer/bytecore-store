import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, CreditCard, Truck, CheckCircle2, ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { sendTelegramMessage, formatOrderMessage } from "@/lib/telegram";

export default function Checkout() {
    const navigate = useNavigate();
    const { cart, cartTotal, clearCart } = useCart();
    const { currentUser } = useAuth();

    const [loading, setLoading] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Online'>('Online');

    const [formData, setFormData] = useState({
        name: currentUser?.displayName || "",
        phone: "",
        address: "",
        city: "",
        pincode: ""
    });

    if (cart.length === 0 && !orderSuccess) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                <Link to="/shop" className="bg-primary px-8 py-3 rounded-xl font-bold">Go to Shop</Link>
            </div>
        );
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const placeOrder = async (orderDetails: any) => {
        try {
            // 1. Save to Firestore
            const ordersRef = collection(db, "orders");
            const docRef = await addDoc(ordersRef, {
                ...orderDetails,
                userId: currentUser?.uid || "guest",
                createdAt: serverTimestamp(),
            });

            const orderWithId = { ...orderDetails, id: docRef.id };

            // 2. Send Telegram Notification
            const telegramMsg = formatOrderMessage(orderWithId);
            const telegramSent = await sendTelegramMessage(telegramMsg);

            if (!telegramSent) {
                console.warn("Telegram notification failed to send, but order was saved.");
            }

            // 3. Cleanup
            clearCart();
            setOrderSuccess(true);
            setLoading(false);
        } catch (error: any) {
            console.error("Error placing order:", error);
            alert(`Failed to place order: ${error.message || "Unknown error"}. Please check if Firestore is configured correctly.`);
            setLoading(false);
        }
    };

    const handleRazorpayPayment = () => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: cartTotal * 100, // Amount in paise
            currency: "INR",
            name: "Bytecore Store",
            description: "Purchase of Premium Machine",
            handler: async function (response: any) {
                setLoading(true);
                const orderDetails = {
                    customerName: formData.name,
                    customerPhone: formData.phone,
                    customerAddress: `${formData.address}, ${formData.city} - ${formData.pincode}`,
                    items: cart,
                    total: cartTotal,
                    paymentMethod: "Online (Razorpay)",
                    paymentId: response.razorpay_payment_id,
                    status: "Paid",
                };
                await placeOrder(orderDetails);
            },
            prefill: {
                name: formData.name,
                contact: formData.phone,
            },
            theme: {
                color: "#2563eb",
            },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.phone || !formData.address) {
            alert("Please fill in all required fields.");
            return;
        }

        if (paymentMethod === 'Online') {
            handleRazorpayPayment();
        } else {
            setLoading(true);
            const orderDetails = {
                customerName: formData.name,
                customerPhone: formData.phone,
                customerAddress: `${formData.address}, ${formData.city} - ${formData.pincode}`,
                items: cart,
                total: cartTotal,
                paymentMethod: "Cash on Delivery",
                status: "Pending",
            };
            await placeOrder(orderDetails);
        }
    };

    if (orderSuccess) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center"
                >
                    <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-12 h-12 text-green-500" />
                    </div>
                    <h2 className="text-4xl font-black mb-4">ORDER PLACED!</h2>
                    <p className="text-gray-400 mb-8">
                        Your machine will be arriving soon. We've sent a confirmation message.
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-primary px-12 py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:brightness-110 transition-all"
                    >
                        Back to Home
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white pt-28 pb-12">
            <div className="container mx-auto px-4 max-w-6xl">
                <Link to="/cart" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Cart
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left: Shipping Form */}
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-4xl font-black mb-2">CHECKOUT</h1>
                            <p className="text-gray-500">Provide your shipping and payment details.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-gray-500">Full Name</label>
                                    <input
                                        required
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 ring-primary/50 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-gray-500">Phone Number</label>
                                    <input
                                        required
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 ring-primary/50 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase text-gray-500">Address</label>
                                <textarea
                                    required
                                    name="address"
                                    rows={3}
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 ring-primary/50 transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-gray-500">City</label>
                                    <input
                                        required
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 ring-primary/50 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-gray-500">Pincode</label>
                                    <input
                                        required
                                        type="text"
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleInputChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 ring-primary/50 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Payment Methods */}
                            <div className="space-y-4">
                                <label className="text-xs font-black uppercase text-gray-500">Select Payment Method</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('Online')}
                                        className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${paymentMethod === 'Online'
                                            ? 'bg-primary/10 border-primary text-primary'
                                            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                            }`}
                                    >
                                        <CreditCard className="w-6 h-6" />
                                        <span className="text-xs font-bold">Online Payment</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('COD')}
                                        className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${paymentMethod === 'COD'
                                            ? 'bg-primary/10 border-primary text-primary'
                                            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                            }`}
                                    >
                                        <Truck className="w-6 h-6" />
                                        <span className="text-xs font-bold">Cash on Delivery</span>
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-white text-black py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:bg-gray-200 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                                    </>
                                ) : (
                                    <>
                                        <ShoppingBag className="w-5 h-5" />
                                        Confirm Order - ₹{cartTotal.toLocaleString()}
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Right: Order Summary */}
                    <div className="lg:pl-12">
                        <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 sticky top-32">
                            <h3 className="text-xl font-black mb-6 uppercase tracking-wider">Your Machines</h3>
                            <div className="space-y-4 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="w-16 h-16 bg-black rounded-lg flex-shrink-0 border border-white/10">
                                            <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-sm line-clamp-1">{item.title}</h4>
                                            <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-sm">₹{(item.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 border-t border-white/10 pt-6">
                                <div className="flex justify-between text-gray-400 text-sm">
                                    <span>Subtotal</span>
                                    <span>₹{cartTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-400 text-sm">
                                    <span>Shipping</span>
                                    <span className="text-green-500">FREE</span>
                                </div>
                                <div className="flex justify-between items-center pt-4">
                                    <span className="text-lg font-black uppercase">Total</span>
                                    <span className="text-2xl font-black text-primary">₹{cartTotal.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
