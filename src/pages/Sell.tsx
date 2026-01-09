import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Loader2, ImagePlus, DollarSign, Tag, Type, User, Smartphone, MapPin, Cpu, HardDrive, Monitor, CircuitBoard, Shield, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/firebase";
import { useAuth } from "@/contexts/AuthContext";

export default function Sell() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Redirect if not logged in
    if (!currentUser) {
        navigate("/login", { state: { from: { pathname: "/sell" } } });
        return null;
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!imageFile) {
            alert("Please upload an image of your product.");
            return;
        }

        setLoading(true);
        const formData = new FormData(e.target as HTMLFormElement);

        try {
            // 1. Upload Image
            const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
            const snapshot = await uploadBytes(storageRef, imageFile);
            const downloadURL = await getDownloadURL(snapshot.ref);

            // 2. Save Data to Firestore
            await addDoc(collection(db, "products"), {
                title: formData.get("title"),
                price: Number(formData.get("price")),
                originalPrice: Number(formData.get("originalPrice")),
                category: formData.get("category"),
                condition: formData.get("condition"),
                description: formData.get("description"),

                // Seller Details
                sellerName: formData.get("sellerName"),
                sellerMobile: formData.get("sellerMobile"),
                sellerAddress: formData.get("sellerAddress"),
                sellerId: currentUser.uid,

                // Specs
                specs: {
                    processor: formData.get("processor"),
                    ram: formData.get("ram"),
                    storage: formData.get("storage"),
                    display: formData.get("display")
                },

                image: downloadURL,
                createdAt: new Date(),
                rating: 0,
                reviews: 0,
                status: "available" // available, sold, pending
            });

            navigate("/shop");
        } catch (error) {
            console.error("Error listing item:", error);
            alert("Failed to list item. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = "flex h-12 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 placeholder:text-gray-500 transition-all hover:bg-black/60";
    const labelClasses = "text-sm font-medium text-gray-300 flex items-center gap-2 mb-2";

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-primary/30 overflow-x-hidden">
            {/* Background Effects - Optimized for performance */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {/* REMOVED heavy blurs on mobile for maximum performance */}
                <div className="hidden md:block absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]" />
                <div className="hidden md:block absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 py-2 md:py-12">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-4 md:mb-8"
                >
                    <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors group">
                        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-4 lg:gap-10 max-w-6xl mx-auto">


                    {/* Header Info - Responsive Design */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:w-1/3 space-y-4 md:space-y-6"
                    >
                        {/* Mobile Optimized Hero V2 - PREMIUM */}
                        <div className="block lg:hidden relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                            <div className="relative px-6 py-6 bg-black rounded-2xl leading-none flex items-center justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold text-white mb-1">
                                        Sell Smart. <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">Earn Fast.</span>
                                    </h1>
                                    <p className="text-gray-400 text-xs font-medium">Get the best value for your gadget instantly.</p>
                                </div>
                                <div className="ml-4 flex items-center justify-center w-10 h-10 bg-white/5 rounded-full border border-white/10">
                                    <Zap className="w-5 h-5 text-yellow-400 fill-current" />
                                </div>
                            </div>
                        </div>

                        {/* Desktop Hero (Hidden on Mobile) */}
                        <div className="hidden lg:block">
                            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                                Sell Your <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Gadgets</span>
                            </h1>
                            <p className="text-lg text-gray-400 leading-relaxed mt-4">
                                Turn your old tech into cash. List your laptop or accessory in minutes and reach thousands of buyers.
                            </p>

                            <div className="relative mt-10 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"></div>
                                <div className="relative z-10 flex flex-col gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                                            <DollarSign className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold">Best Prices</h4>
                                            <p className="text-xs text-gray-400">Competitive market rates</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                            <Shield className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold">Secure Data</h4>
                                            <p className="text-xs text-gray-400">Your info is protected</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Main Form - Right Side */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="lg:w-2/3"
                    >
                        <form onSubmit={handleSubmit} className="bg-[#111] border border-white/10 rounded-xl md:rounded-3xl p-4 md:p-10 shadow-2xl space-y-5 md:space-y-10 relative overflow-hidden">
                            <div className="hidden md:block absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-bl-[100px] z-0 blur-3xl pointer-events-none"></div>

                            {/* Section 1: Upload - Compact on Mobile */}
                            <motion.div variants={itemVariants} className="space-y-3 md:space-y-4 relative z-10">
                                <h3 className="text-base md:text-xl font-bold flex items-center gap-2 md:gap-3 text-white">
                                    <span className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary/20 text-primary text-xs md:text-sm">1</span>
                                    Product Image
                                </h3>
                                <div className={`border-2 border-dashed rounded-xl md:rounded-2xl p-3 md:p-4 transition-all duration-300 ${previewUrl ? 'border-primary/50 bg-primary/5' : 'border-white/10 hover:border-white/30 hover:bg-white/5'}`}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        id="image-upload"
                                        onChange={handleImageChange}
                                    />
                                    <label htmlFor="image-upload" className="cursor-pointer block w-full h-full min-h-[120px] md:min-h-[200px] flex items-center justify-center">
                                        {previewUrl ? (
                                            <div className="relative w-full h-[180px] md:h-[300px] rounded-lg md:rounded-xl overflow-hidden group">
                                                <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                                                    <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full font-medium flex items-center gap-2">
                                                        <ImagePlus className="w-4 h-4" /> Change Photo
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-4 md:py-10">
                                                <div className="bg-white/5 w-12 h-12 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-4 text-gray-400 group-hover:scale-110 transition-transform">
                                                    <Upload className="w-6 h-6 md:w-10 md:h-10" />
                                                </div>
                                                <p className="text-sm md:text-lg font-medium text-white">Upload Product Photo</p>
                                                <p className="text-[10px] md:text-sm text-gray-500 mt-1 md:mt-2">Support for PNG, JPG (Max 5MB)</p>
                                            </div>
                                        )}
                                    </label>
                                </div>
                            </motion.div>

                            {/* Section 2: Product Info - Tighter Grid */}
                            <motion.div variants={itemVariants} className="space-y-4 md:space-y-6 relative z-10">
                                <h3 className="text-base md:text-xl font-bold flex items-center gap-2 md:gap-3 text-white">
                                    <span className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary/20 text-primary text-xs md:text-sm">2</span>
                                    Product Details
                                </h3>

                                <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-6">
                                    <div className="col-span-2">
                                        <label className={labelClasses}><Type className="w-4 h-4 text-primary" /> Product Title</label>
                                        <input name="title" required placeholder="e.g. MacBook Pro M1 13-inch" className={inputClasses} />
                                    </div>

                                    <div className="col-span-2 md:col-span-1">
                                        <label className={labelClasses}><Tag className="w-4 h-4 text-primary" /> Category</label>
                                        <div className="relative">
                                            <select name="category" className={`${inputClasses} appearance-none cursor-pointer`}>
                                                <option value="Student">Student Laptop</option>
                                                <option value="Gaming">Gaming Laptop</option>
                                                <option value="Professional">Professional / Ultrabook</option>
                                                <option value="Accessories">Accessories</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Grouped Prices for Mobile Compactness */}
                                    <div className="col-span-1">
                                        <label className={labelClasses}><DollarSign className="w-4 h-4 text-primary" /> Expected Price (₹)</label>
                                        <input name="price" type="number" required placeholder="45000" className={inputClasses} />
                                    </div>

                                    <div className="col-span-1">
                                        <label className={labelClasses}><DollarSign className="w-4 h-4 text-gray-500" /> Original Price (₹)</label>
                                        <input name="originalPrice" type="number" required placeholder="90000" className={inputClasses} />
                                    </div>

                                    <div className="col-span-2">
                                        <label className={labelClasses}>Condition</label>
                                        <div className="grid grid-cols-3 gap-2 md:gap-4">
                                            {['Like New', 'Good', 'Fair'].map((c) => (
                                                <label key={c} className="cursor-pointer group">
                                                    <input type="radio" name="condition" value={c} className="peer sr-only" defaultChecked={c === 'Like New'} />
                                                    <div className="rounded-xl border border-white/10 bg-white/5 py-2.5 md:py-3 text-center text-xs md:text-sm font-medium text-gray-400 transition-all peer-checked:border-primary peer-checked:bg-primary/20 peer-checked:text-primary hover:bg-white/10">
                                                        {c}
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="col-span-2">
                                        <label className={labelClasses}>Description</label>
                                        <textarea name="description" rows={3} className={`${inputClasses} min-h-[80px] md:min-h-[120px] resize-none`} placeholder="Describe any defects, screen condition, battery health, etc..." />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Section 3: Specs */}
                            <motion.div variants={itemVariants} className="space-y-4 md:space-y-6 relative z-10">
                                <h3 className="text-base md:text-xl font-bold flex items-center gap-2 md:gap-3 text-white">
                                    <span className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary/20 text-primary text-xs md:text-sm">3</span>
                                    Tech Specs
                                </h3>
                                <div className="grid grid-cols-2 gap-3 md:gap-4">
                                    <div>
                                        <label className={labelClasses}><Cpu className="w-4 h-4 text-primary" /> Processor</label>
                                        <input name="processor" placeholder="i5 / M1" className={inputClasses} />
                                    </div>
                                    <div>
                                        <label className={labelClasses}><CircuitBoard className="w-4 h-4 text-primary" /> RAM</label>
                                        <input name="ram" placeholder="16GB" className={inputClasses} />
                                    </div>
                                    <div>
                                        <label className={labelClasses}><HardDrive className="w-4 h-4 text-primary" /> Storage</label>
                                        <input name="storage" placeholder="512GB" className={inputClasses} />
                                    </div>
                                    <div>
                                        <label className={labelClasses}><Monitor className="w-4 h-4 text-primary" /> Display</label>
                                        <input name="display" placeholder="14 FHD" className={inputClasses} />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Section 4: Seller Info */}
                            <motion.div variants={itemVariants} className="space-y-4 md:space-y-6 relative z-10">
                                <h3 className="text-base md:text-xl font-bold flex items-center gap-2 md:gap-3 text-white">
                                    <span className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary/20 text-primary text-xs md:text-sm">4</span>
                                    Seller Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                    <div>
                                        <label className={labelClasses}><User className="w-4 h-4 text-primary" /> Your Name</label>
                                        <input name="sellerName" required defaultValue={currentUser.displayName || ""} placeholder="Full Name" className={inputClasses} />
                                    </div>
                                    <div>
                                        <label className={labelClasses}><Smartphone className="w-4 h-4 text-primary" /> Mobile Number</label>
                                        <input name="sellerMobile" required type="tel" placeholder="Contact number" className={inputClasses} />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className={labelClasses}><MapPin className="w-4 h-4 text-primary" /> Pickup Address</label>
                                        <input name="sellerAddress" required placeholder="Full location address" className={inputClasses} />
                                    </div>
                                </div>
                            </motion.div>

                            <div className="pt-2 md:pt-6">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full relative group overflow-hidden bg-white text-black h-12 md:h-14 rounded-xl font-bold text-lg hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center justify-center gap-3"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" /> Publishing...
                                        </>
                                    ) : (
                                        <>
                                            <span className="relative z-10">List Item for Sale</span>
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                        </>
                                    )}
                                </button>
                                <p className="text-center text-xs text-gray-500 mt-4">
                                    By listing, you agree to our Terms of Service. Your listing will be reviewed by admin.
                                </p>
                            </div>

                        </form>
                    </motion.div>
                </div>
            </div>
        </div >
    );
}
