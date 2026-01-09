import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

export default function Login() {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    // Get redirect path or default to home
    const from = location.state?.from?.pathname || "/";

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);
            await signInWithPopup(auth, googleProvider);
            navigate(from, { replace: true });
        } catch (err: any) {
            console.error(err);
            setError("Failed to sign in with Google.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        // Get form data
        const formData = new FormData(e.target as HTMLFormElement);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate(from, { replace: true });
        } catch (err: any) {
            console.error(err);
            if (err.code === "auth/network-request-failed") {
                setError("Network error. Please check your internet connection.");
            } else if (err.code === "auth/invalid-credential") {
                setError("Invalid email or password.");
            } else {
                setError("Failed to sign in. " + err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-card p-8 rounded-2xl shadow-xl border border-border"
            >
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Welcome Back</h2>
                    <p className="text-muted-foreground mt-2">Sign in to continue to Bytecore Stores</p>
                </div>

                {error && (
                    <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-6 text-center border border-destructive/20">
                        {error}
                    </div>
                )}

                <div className="space-y-4 mb-6">
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-white text-black border border-gray-300 hover:bg-gray-50 h-11 rounded-lg font-medium transition-all"
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                        Sign in with Google
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none" htmlFor="email">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="name@example.com"
                                className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 pl-10 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none" htmlFor="password">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 pl-10 pr-10 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
                    >
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign In"}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <span className="text-muted-foreground">Don't have an account? </span>
                    <Link to="/register" className="font-medium text-primary hover:underline">Register now</Link>
                </div>
            </motion.div>
        </div>
    );
}
