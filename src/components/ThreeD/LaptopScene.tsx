import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, ContactShadows, Environment, Float, PresentationControls, Html } from "@react-three/drei";
import { Suspense, useRef, Component, type ReactNode } from "react";
import * as THREE from "three";
import { AlertTriangle } from "lucide-react";

// Error Boundary to catch WebGL context failures
class WebGLBoundary extends Component<{ children: ReactNode, fallback: ReactNode }, { hasError: boolean }> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_: any) {
        return { hasError: true };
    }

    componentDidCatch(error: any, _info: any) {
        console.error("WebGL Context Error:", error);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback;
        }
        return this.props.children;
    }
}

function LaptopModel() {
    const laptop = useGLTF("https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/macbook/model.gltf");
    const modelRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (modelRef.current) {
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
            {/* We can add a screen content here if we want using Html from drei */}
            <Html
                transform
                occlude
                distanceFactor={1.17}
                position={[0, 1.56, -1.4]}
                rotation-x={-0.256}
            >
                <div className="w-[1024px] h-[670px] bg-black overflow-hidden rounded-lg flex items-center justify-center p-10">
                    <div className="text-white text-9xl font-black tracking-tighter">
                        BYTE <span className="text-blue-500">CORE</span>
                    </div>
                </div>
            </Html>
        </primitive>
    );
}

export default function LaptopScene() {
    return (
        <div className="w-full h-full min-h-[500px] md:min-h-[700px] cursor-grab active:cursor-grabbing">
            <WebGLBoundary fallback={
                <div className="w-full h-full flex items-center justify-center bg-black/20">
                    <div className="flex flex-col items-center gap-3 text-center p-6 bg-black/50 backdrop-blur-md rounded-xl border border-white/10">
                        <AlertTriangle className="w-8 h-8 text-yellow-500" />
                        <div>
                            <p className="text-white font-bold text-sm">3D View Unavailable</p>
                            <p className="text-white/50 text-[10px] uppercase tracking-wider mt-1">Graphics Limited</p>
                        </div>
                    </div>
                </div>
            }>
                <Canvas
                    camera={{ position: [0, 0, 5], fov: 45 }}
                    dpr={[1, 1.5]} // Optimization: Limit pixel ratio for mobile performance
                    gl={{
                        antialias: true, // Keep AA but rely on dpr limits
                        powerPreference: "high-performance",
                        preserveDrawingBuffer: false
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
                            <Float rotationIntensity={0.4}>
                                {/* Replaced rectAreaLight with simpler lighting for compatibility */}
                                <spotLight
                                    position={[0, 5, 10]}
                                    angle={0.5}
                                    penumbra={1}
                                    intensity={40}
                                    castShadow
                                    shadow-bias={-0.0001}
                                    color="#2563eb"
                                />
                                <ambientLight intensity={0.5} />
                                <LaptopModel />
                            </Float>
                        </PresentationControls>
                        {/* Optimization: Bake shadows (frames=1) and reduce resolution */}
                        <ContactShadows
                            position={[0, -4.5, 0]}
                            opacity={0.4}
                            scale={20}
                            blur={24}
                            far={4.5}
                            frames={1}
                        />
                        <Environment preset="city" />
                    </Suspense>
                </Canvas>
            </WebGLBoundary>
        </div>
    );
}
