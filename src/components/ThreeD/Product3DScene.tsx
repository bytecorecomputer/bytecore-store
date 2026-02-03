import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, Float, PresentationControls, Html, ContactShadows } from "@react-three/drei";
import { Suspense, useRef, Component, type ReactNode, useEffect, useState } from "react";
import * as THREE from "three";
import { motion } from "framer-motion";
import { getWebGLSupport } from "@/utils/webgl";

// Error Boundary
class WebGLBoundary extends Component<{ children: ReactNode, fallback: ReactNode }, { hasError: boolean }> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError(_: any) { return { hasError: true }; }
    componentDidCatch(error: any) { console.warn("WebGL Context Error:", error); }
    render() {
        if (this.state.hasError) return this.props.fallback;
        return this.props.children;
    }
}

function LaptopModel({ screenImage }: { screenImage: string }) {
    const laptop = useGLTF("https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/macbook/model.gltf");
    const modelRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (modelRef.current) {
            modelRef.current.rotation.y = THREE.MathUtils.lerp(modelRef.current.rotation.y, (state.mouse.x * Math.PI) / 6, 0.05);
            modelRef.current.rotation.x = THREE.MathUtils.lerp(modelRef.current.rotation.x, (state.mouse.y * Math.PI) / 12, 0.05);
        }
    });

    return (
        <primitive object={laptop.scene} ref={modelRef} position={[0, -1.2, 0]} scale={1.5}>
            <Html transform occlude distanceFactor={1.17} position={[0, 1.56, -1.4]} rotation-x={-0.256}>
                <div className="w-[1024px] h-[670px] bg-black overflow-hidden rounded-lg flex items-center justify-center select-none relative">
                    <img src={screenImage} className="w-full h-full object-cover opacity-80" alt="Screen content" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-transparent to-white/5 pointer-events-none" />
                </div>
            </Html>
        </primitive>
    );
}

interface Product3DSceneProps {
    image: string;
    isHero?: boolean;
}

export default function Product3DScene({ image, isHero = false }: Product3DSceneProps) {
    const [isSupported, setIsSupported] = useState<boolean | null>(null);

    useEffect(() => {
        setIsSupported(getWebGLSupport());
    }, []);

    const FallbackContent = (
        <div className="w-full h-full flex items-center justify-center relative overflow-hidden bg-black/5 select-none pointer-events-none rounded-inherit">
            <motion.div
                className="absolute inset-0 z-0 flex items-center justify-center p-4"
                animate={isHero ? { scale: [1, 1.05, 1], y: [0, -10, 0] } : {}}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            >
                <img
                    src={image}
                    alt="Product Showcase"
                    className={`max-w-full max-h-full object-contain ${isHero ? 'opacity-90' : 'opacity-100'} drop-shadow-[0_0_30px_rgba(37,99,235,0.2)]`}
                />
            </motion.div>

            {isHero && (
                <>
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-transparent to-blue-500/5 mix-blend-overlay z-10" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_40%,_black_100%)] z-10" />
                </>
            )}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className="w-1 h-1 rounded-full bg-blue-500/30"
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                    />
                ))}
            </div>
        </div>
    );

    if (isSupported === null) return <div className="w-full h-full bg-black/5" />;

    if (!isSupported) return FallbackContent;

    return (
        <div className={`w-full h-full ${isHero ? 'min-h-[500px] md:min-h-[700px]' : ''} cursor-grab active:cursor-grabbing`}>
            <WebGLBoundary fallback={FallbackContent}>
                <Canvas
                    camera={{ position: [0, 0, 5], fov: isHero ? 45 : 35 }}
                    dpr={[1, 1.5]}
                    shadows
                    gl={{
                        antialias: true,
                        alpha: true,
                        powerPreference: "default",
                        failIfMajorPerformanceCaveat: false,
                        preserveDrawingBuffer: true,
                    }}
                >
                    <Suspense fallback={null}>
                        <PresentationControls
                            global={isHero}
                            snap={isHero}
                            rotation={[0, 0.3, 0]}
                            polar={[-Math.PI / 3, Math.PI / 3]}
                            azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
                        >
                            <Float
                                rotationIntensity={isHero ? 0.4 : 0.2}
                                floatIntensity={isHero ? 0.5 : 0.2}
                                floatingRange={[-0.1, 0.1]}
                                speed={isHero ? 2 : 1}
                            >
                                <spotLight position={[0, 10, 10]} angle={0.5} penumbra={1} intensity={50} castShadow shadow-bias={-0.0001} />
                                <ambientLight intensity={0.5} />
                                <pointLight position={[-10, -10, -10]} intensity={10} color="#2563eb" />
                                <LaptopModel screenImage={image} />
                            </Float>
                        </PresentationControls>

                        <ContactShadows position={[0, -2.4, 0]} opacity={0.4} scale={10} blur={2.5} far={4} resolution={128} color="#000000" />
                        <Environment preset="city" />
                    </Suspense>
                </Canvas>
            </WebGLBoundary>
        </div>
    );
}
