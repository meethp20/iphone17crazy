"use client";

import { useScroll, useTransform, motion, useMotionValueEvent } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";

export default function IphoneScroll() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadProgress, setLoadProgress] = useState(0);

    const lenis = useLenis();

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const frameIndex = useTransform(scrollYProgress, [0, 1], [0, 79]);

    const opacity1 = useTransform(scrollYProgress, [0, 0.2, 0.25], [1, 1, 0]);
    const opacity2 = useTransform(scrollYProgress, [0.25, 0.3, 0.5, 0.55], [0, 1, 1, 0]);
    const opacity3 = useTransform(scrollYProgress, [0.55, 0.6, 0.8, 0.85], [0, 1, 1, 0]);
    const opacity4 = useTransform(scrollYProgress, [0.85, 0.9, 1], [0, 1, 1]);

    useEffect(() => {
        const loadImages = async () => {
            const loadedImages: HTMLImageElement[] = [];
            const frameCount = 80;
            let loadedCount = 0;

            for (let i = 0; i < frameCount; i++) {
                const img = new Image();
                const frameNumber = i.toString().padStart(3, '0');
                const src = `/iphone17blackvid_000/iphone17blackvid_${frameNumber}.jpg`;

                img.src = src;
                await new Promise((resolve, reject) => {
                    img.onload = () => {
                        loadedCount++;
                        setLoadProgress((loadedCount / frameCount) * 100);
                        resolve(true);
                    }
                    img.onerror = () => {
                        console.warn(`Failed to load frame ${i}`);
                        resolve(true);
                    }
                });
                loadedImages.push(img);
            }
            setImages(loadedImages);
            setLoading(false);
        };

        loadImages();
    }, []);

    useEffect(() => {
        if (loading) {
            document.body.style.overflow = 'hidden';
            lenis?.stop();
        } else {
            document.body.style.overflow = '';
            lenis?.start();
        }
        return () => {
            document.body.style.overflow = '';
            lenis?.start();
        }
    }, [loading, lenis]);

    useMotionValueEvent(frameIndex, "change", (latest) => {
        const canvas = canvasRef.current;
        if (!canvas || images.length === 0) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const index = Math.min(Math.round(latest), images.length - 1);
        const img = images[index];

        if (!img || !img.complete || img.naturalWidth === 0) return;

        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        const cropHeight = img.naturalHeight * 0.85;
        const sWidth = img.naturalWidth;
        const sHeight = cropHeight;

        const scale = Math.min(canvasWidth / sWidth, canvasHeight / sHeight);
        const w = sWidth * scale;
        const h = sHeight * scale;
        const x = (canvasWidth - w) / 2;
        const y = (canvasHeight - h) / 2;

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.drawImage(img, 0, 0, sWidth, sHeight, x, y, w, h);
    });

    useEffect(() => {
        const resize = () => {
            if (canvasRef.current) {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;
                const currentFrame = Math.round(frameIndex.get());
                if (images[currentFrame]) {
                    const canvas = canvasRef.current;
                    const ctx = canvas.getContext("2d");
                    const img = images[currentFrame];

                    if (!ctx || !img || !img.complete || img.naturalWidth === 0) return;

                    const cropHeight = img.naturalHeight * 0.85;
                    const sWidth = img.naturalWidth;
                    const sHeight = cropHeight;

                    const scale = Math.min(canvas.width / sWidth, canvas.height / sHeight);
                    const w = sWidth * scale;
                    const h = sHeight * scale;

                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0, sWidth, sHeight, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
                }
            }
        }
        window.addEventListener('resize', resize);
        resize();
        return () => window.removeEventListener('resize', resize);
    }, [images, frameIndex]);

    return (
        <div ref={containerRef} className="relative h-[800vh] bg-[#050505]">
            <div className="sticky top-0 h-screen w-full overflow-hidden">

                <motion.div
                    initial={{ opacity: 1 }}
                    animate={{ opacity: loading ? 1 : 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className={`absolute inset-0 z-50 flex items-center justify-center bg-[#050505] ${!loading ? 'pointer-events-none' : ''}`}
                >
                    {loading && (
                        <div className="flex flex-col items-center gap-2">
                            <div className="text-6xl font-bold text-white tracking-tighter tabular-nums">
                                {Math.round(loadProgress)}%
                            </div>
                            <p className="text-sm text-white/40 font-medium uppercase tracking-[0.2em]">Loading Experience</p>
                        </div>
                    )}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: loading ? 0 : 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="relative w-full h-full"
                >
                    <canvas
                        ref={canvasRef}
                        className="block w-full h-full pointer-events-none"
                    />

                    <motion.div style={{ opacity: opacity1 }} className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center">
                            <h2 className="text-6xl md:text-8xl font-semibold tracking-tighter text-white mb-2">iPhone 17 Pro</h2>
                            <p className="text-2xl md:text-3xl font-medium text-white/60 tracking-tight">Crafted Beyond Limits</p>
                        </div>
                    </motion.div>

                    <motion.div style={{ opacity: opacity2 }} className="absolute inset-0 flex items-center justify-start px-12 md:px-32 pointer-events-none">
                        <div className="text-left max-w-xl">
                            <h2 className="text-5xl md:text-7xl font-semibold tracking-tighter text-white mb-4">Precision Engineering</h2>
                            <p className="text-xl md:text-2xl font-medium text-white/60 leading-relaxed">Built at the Atomic Level. Every micron calibrated for absolute perfection.</p>
                        </div>
                    </motion.div>

                    <motion.div style={{ opacity: opacity3 }} className="absolute inset-0 flex items-center justify-end px-12 md:px-32 pointer-events-none">
                        <div className="text-right max-w-xl">
                            <h2 className="text-5xl md:text-7xl font-semibold tracking-tighter text-white mb-4">Titanium Core</h2>
                            <p className="text-xl md:text-2xl font-medium text-white/60 leading-relaxed">Next-Gen Silicon meeting aerospace-grade titanium. Lighter. Stronger. Faster.</p>
                        </div>
                    </motion.div>

                    <motion.div style={{ opacity: opacity4 }} className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center">
                            <h2 className="text-6xl md:text-8xl font-semibold tracking-tighter text-white mb-8">Experience the Future</h2>
                            <button className="px-8 py-4 bg-white text-black rounded-full font-semibold text-lg hover:scale-105 transition-transform duration-300 pointer-events-auto cursor-pointer">
                                Pre-order Now
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
