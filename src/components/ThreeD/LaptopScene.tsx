import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, Float, PresentationControls, Html, ContactShadows } from "@react-three/drei";
import { Suspense, useRef, Component, type ReactNode, useEffect, useState } from "react";
import * as THREE from "three";


// Error Boundary as a second line of defense
class WebGLBoundary extends Component<{ children: ReactNode, fallback: ReactNode }, { hasError: boolean }> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_: any) {
        return { hasError: true };
    }

    componentDidCatch(error: any, _info: any) {
        console.warn("WebGL Context Error caught by boundary:", error);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback;
        }
        return this.props.children;
    }
}

// Enhanced robustness check for WebGL
const checkWebGL = () => {
    try {
        const canvas = document.createElement('canvas');
        // Try to get the context with the same settings we use
        const gl = canvas.getContext('webgl', { failIfMajorPerformanceCaveat: true }) ||
            canvas.getContext('experimental-webgl', { failIfMajorPerformanceCaveat: true });

        if (!gl) return false;

        // Clean up context to avoid memory leaks
        const loseContext = gl.getExtension('WEBGL_lose_context');
        if (loseContext) loseContext.loseContext();

        return true;
    } catch (e) {
        console.warn("WebGL Check Failed:", e);
        return false;
    }
};

function LaptopModel() {
    const laptop = useGLTF("https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/macbook/model.gltf");
    const modelRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (modelRef.current) {
            // Smoother floating animation interpolation
            modelRef.current.rotation.y = THREE.MathUtils.lerp(modelRef.current.rotation.y, (state.mouse.x * Math.PI) / 6, 0.05);
            modelRef.current.rotation.x = THREE.MathUtils.lerp(modelRef.current.rotation.x, (state.mouse.y * Math.PI) / 12, 0.05);
        }
    });

    return (
        <primitive
            object={laptop.scene}
            ref={modelRef}
            position={[0, -1.2, 0]}
            scale={1.5}
        >
            {/* Screen Content */}
            <Html
                transform
                occlude
                distanceFactor={1.17}
                position={[0, 1.56, -1.4]}
                rotation-x={-0.256}
            >
                <div className="w-[1024px] h-[670px] bg-black overflow-hidden rounded-lg flex items-center justify-center p-10 select-none">
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="text-white text-9xl font-black tracking-tighter drop-shadow-2xl">
                            BYTE <span className="text-blue-500">CORE</span>
                        </div>
                        <div className="mt-4 text-blue-400/80 text-4xl font-bold tracking-[0.5em] uppercase">
                            Pro Systems
                        </div>
                    </div>

                    {/* Screen Glare/Reflection details */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-transparent to-white/5 pointer-events-none" />
                </div>
            </Html>
        </primitive>
    );
}

export default function LaptopScene() {
    const [isSupported, setIsSupported] = useState<boolean | null>(null);

    useEffect(() => {
        const supported = checkWebGL();
        if (!supported) {
            console.warn("WebGL not supported or performance caveat detected. Using fallback.");
        }
        setIsSupported(supported);
    }, []);

    const FallbackContent = (
        <div className="w-full h-full flex items-center justify-center relative overflow-hidden bg-black select-none pointer-events-none">
            {/* 1. Cinematic Background Image */}
            <img
                src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1200"
                alt="MacBook Pro Workstation"
                className="absolute inset-0 w-full h-full object-cover opacity-40 animate-in fade-in duration-1000 scale-105"
            />

            {/* 2. Advanced Gradient Overlays for Depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_black_100%)] opacity-80" />

            {/* 3. Hero Content - Centered & Animated */}
            <div className="z-10 flex flex-col items-center gap-6 animate-in slide-in-from-bottom-5 fade-in duration-1000">
                {/* Logo */}
                <div className="relative">
                    <div className="absolute -inset-4 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
                    <div className="relative text-5xl md:text-8xl font-black tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                        BYTE<span className="text-blue-500">CORE</span>
                    </div>
                </div>

                {/* Tagline Structure */}
                <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center gap-4">
                        <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-blue-500" />
                        <p className="text-blue-200 font-bold tracking-[0.3em] uppercase text-xs md:text-sm text-shadow-sm">
                            Premium Refurbished Hardware
                        </p>
                        <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-blue-500" />
                    </div>
                </div>

                {/* Visual Tech Element */}
                <div className="mt-8 flex gap-2">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="w-2 h-2 rounded-full bg-blue-500/50 animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
                    ))}
                </div>
            </div>
        </div>
    );

    if (isSupported === null) return <div className="w-full h-full bg-black/90" />;

    if (!isSupported) {
        return FallbackContent;
    }

    return (
        <div className="w-full h-full min-h-[500px] md:min-h-[700px] cursor-grab active:cursor-grabbing">
            <WebGLBoundary fallback={FallbackContent}>
                <Canvas
                    camera={{ position: [0, 0, 5], fov: 45 }}
                    dpr={[1, 1.5]}
                    shadows
                    gl={{
                        antialias: true,
                        alpha: true,
                        powerPreference: "default",
                        failIfMajorPerformanceCaveat: false,
                        preserveDrawingBuffer: true,
                    }}
                    onCreated={({ gl }) => {
                        gl.toneMapping = THREE.ACESFilmicToneMapping;
                        gl.toneMappingExposure = 1.2;
                    }}
                >
                    <Suspense fallback={null}>
                        <PresentationControls
                            global
                            snap
                            rotation={[0, 0.3, 0]}
                            polar={[-Math.PI / 3, Math.PI / 3]}
                            azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
                        >
                            <Float
                                rotationIntensity={0.4}
                                floatIntensity={0.5}
                                floatingRange={[-0.1, 0.1]}
                                speed={2}
                            >
                                <spotLight
                                    position={[0, 10, 10]}
                                    angle={0.5}
                                    penumbra={1}
                                    intensity={50}
                                    castShadow
                                    shadow-bias={-0.0001}
                                    color="#ffffff"
                                />
                                <ambientLight intensity={0.5} />
                                <pointLight position={[-10, -10, -10]} intensity={10} color="#2563eb" />
                                <LaptopModel />
                            </Float>
                        </PresentationControls>

                        <ContactShadows
                            position={[0, -2.4, 0]}
                            opacity={0.6}
                            scale={10}
                            blur={2.5}
                            far={4}
                            resolution={256}
                            color="#000000"
                        />

                        <Environment preset="city" />
                    </Suspense>
                </Canvas>
            </WebGLBoundary>
        </div>
    );
}
