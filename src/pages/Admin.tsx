import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus, Package, Search, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/firebase";

interface Product {
    id: string;
    title: string;
    price: number;
    category: string;
    image: string;
}

export default function Admin() {
    const { currentUser, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');

    // Protect the route
    useEffect(() => {
        if (!loading && !isAdmin) {
            navigate("/");
        }
    }, [isAdmin, loading, navigate]);

    // Fetch data from Firestore
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Products
                const productSnapshot = await getDocs(collection(db, "products"));
                setProducts(productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[]);

                // Fetch Orders
                const orderSnapshot = await getDocs(collection(db, "orders"));
                setOrders(orderSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (isAdmin) fetchData();
    }, [isAdmin]);

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this product?")) {
            try {
                await deleteDoc(doc(db, "products", id));
                setProducts(products.filter(p => p.id !== id));
            } catch (error) {
                console.error("Error deleting document: ", error);
                alert("Failed to delete product");
            }
        }
    };

    if (!isAdmin) return null;

    return (
        <div className="min-h-screen bg-muted/30 pb-20">
            {/* Header */}
            <div className="bg-background border-b border-border sticky top-0 z-30">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-primary font-bold text-xl">
                        <LayoutDashboard className="w-6 h-6" /> Admin Dashboard
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground hidden md:inline">Logged in as {currentUser?.email}</span>
                        <button
                            onClick={() => navigate("/sell")}
                            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" /> Add New Item
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm cursor-pointer" onClick={() => setActiveTab('products')}>
                        <h3 className="text-sm font-medium text-muted-foreground">Total Listings</h3>
                        <div className="text-3xl font-bold mt-2">{products.length}</div>
                    </div>
                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm cursor-pointer" onClick={() => setActiveTab('orders')}>
                        <h3 className="text-sm font-medium text-muted-foreground">Total Orders</h3>
                        <div className="text-3xl font-bold mt-2">{orders.length}</div>
                    </div>
                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                        <h3 className="text-sm font-medium text-muted-foreground">Pending Action</h3>
                        <div className="text-3xl font-bold mt-2">
                            {orders.filter(o => o.status === 'Pending').length}
                        </div>
                    </div>
                </div>

                {/* Tab Switcher */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${activeTab === 'products' ? 'bg-primary text-white' : 'bg-card border border-border text-muted-foreground'}`}
                    >
                        Inventory ({products.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${activeTab === 'orders' ? 'bg-primary text-white' : 'bg-card border border-border text-muted-foreground'}`}
                    >
                        Orders ({orders.length})
                    </button>
                </div>

                {/* Content Section */}
                <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h2 className="text-lg font-bold">{activeTab === 'products' ? 'Manage Inventory' : 'Order Receipts'}</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder={`Search ${activeTab}...`}
                                className="pl-9 pr-4 py-2 bg-muted/50 border border-input rounded-lg text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center text-muted-foreground flex flex-col items-center gap-4">
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
                            Loading data...
                        </div>
                    ) : (cardContent())}
                </div>
            </div>
        </div>
    );

    function cardContent() {
        if (activeTab === 'products') {
            return products.length === 0 ? (
                <div className="p-20 text-center flex flex-col items-center justify-center text-muted-foreground">
                    <Package className="w-12 h-12 mb-4 opacity-20" />
                    <p>No products found in database.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
                            <tr>
                                <th className="px-6 py-4">Product</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-muted/30">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded border border-border overflow-hidden">
                                                <img src={product.image} className="w-full h-full object-cover" />
                                            </div>
                                            <span className="font-medium">{product.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-[10px] font-bold">{product.category}</span>
                                    </td>
                                    <td className="px-6 py-4 font-bold">₹{product.price.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => handleDelete(product.id)} className="p-2 text-muted-foreground hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        }

        return orders.length === 0 ? (
            <div className="p-20 text-center flex flex-col items-center justify-center text-muted-foreground">
                <ShoppingBag className="w-12 h-12 mb-4 opacity-20" />
                <p>No orders placed yet.</p>
            </div>
        ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
                        <tr>
                            <th className="px-6 py-4">Order ID</th>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Method</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-muted/30">
                                <td className="px-6 py-4 font-mono text-xs">#{order.id.slice(0, 8)}</td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-bold">{order.customerName}</span>
                                        <span className="text-[10px] text-muted-foreground">{order.customerPhone}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-xs">{order.paymentMethod}</td>
                                <td className="px-6 py-4 font-bold">₹{order.total.toLocaleString()}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${order.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {order.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}
