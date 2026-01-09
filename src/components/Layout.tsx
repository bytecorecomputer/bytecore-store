import type { ReactNode } from "react";
import Navbar from "./Navbar";

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen bg-black text-foreground font-sans antialiased flex flex-col">
            <Navbar />
            <main className="flex-1">
                {children}
            </main>
            <footer className="border-t border-border py-8 bg-muted/20">
                <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
                    <p>&copy; {new Date().getFullYear()} Bytecore Stores. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
