import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, ContactShadows, Environment, Float, PresentationControls, Html } from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";

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
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <Suspense fallback={null}>
                    <PresentationControls
                        global
                        snap
                        rotation={[0, 0.3, 0]}
                        polar={[-Math.PI / 3, Math.PI / 3]}
                        azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
                    >
                        <Float rotationIntensity={0.4}>
                            <rectAreaLight
                                width={2.5}
                                height={1.65}
                                intensity={65}
                                color={"#2563eb"}
                                rotation={[-0.1, Math.PI, 0]}
                                position={[0, 0.55, -1.15]}
                            />
                            <LaptopModel />
                        </Float>
                    </PresentationControls>
                    <ContactShadows position={[0, -4.5, 0]} opacity={0.4} scale={20} blur={24} far={4.5} />
                    <Environment preset="city" />
                </Suspense>
            </Canvas>
        </div>
    );
}
