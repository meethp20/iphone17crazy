"use client";

import { useScroll, useTransform, motion, useMotionValueEvent } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function IphoneScroll() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadProgress, setLoadProgress] = useState(0);

    // Scroll progress for the entire 400vh section
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Map scroll progress to frame index (0 to 79)
    const frameIndex = useTransform(scrollYProgress, [0, 1], [0, 79]);

    // Opacity transforms for text layers
    const opacity1 = useTransform(scrollYProgress, [0, 0.2, 0.25], [1, 1, 0]);
    const opacity2 = useTransform(scrollYProgress, [0.25, 0.3, 0.5, 0.55], [0, 1, 1, 0]);
    const opacity3 = useTransform(scrollYProgress, [0.55, 0.6, 0.8, 0.85], [0, 1, 1, 0]);
    const opacity4 = useTransform(scrollYProgress, [0.85, 0.9, 1], [0, 1, 1]);

    // Preload images
    useEffect(() => {
        const loadImages = async () => {
            const loadedImages: HTMLImageElement[] = [];
            const frameCount = 80;
            let loadedCount = 0;

            for (let i = 0; i < frameCount; i++) {
                const img = new Image();
                // Images are in public/iphone17blackvid_000/
                // Naming format: iphone17blackvid_000.jpg
                const frameNumber = i.toString().padStart(3, '0');
                const src = `/iphone17blackvid_000/iphone17blackvid_${frameNumber}.jpg`;

                // Wait for image to load to ensure order (or promise.all parallel)
                img.src = src;
                await new Promise((resolve, reject) => {
                    img.onload = () => {
                        loadedCount++;
                        setLoadProgress((loadedCount / frameCount) * 100);
                        resolve(true);
                    }
                    img.onerror = () => {
                        // Fallback or just resolve to continue
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

    // Render logic
    useMotionValueEvent(frameIndex, "change", (latest) => {
        const canvas = canvasRef.current;
        if (!canvas || images.length === 0) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const index = Math.min(Math.round(latest), images.length - 1);
        const img = images[index];
        // console.log("Rendering frame:", index, "Scroll:", latest); 

        if (!img || !img.complete || img.naturalWidth === 0) return;

        // Draw image maintaining aspect ratio and centering
        // For this demo, assuming 1920x1080 frames or similar.
        // Use "contain" logic.
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        // Crop watermark (bottom 20%)
        const cropHeight = img.naturalHeight * 0.85;
        const sWidth = img.naturalWidth;
        const sHeight = cropHeight;

        // Scale to fit based on CROPPED dimensions
        const scale = Math.min(canvasWidth / sWidth, canvasHeight / sHeight);
        const w = sWidth * scale;
        const h = sHeight * scale;
        const x = (canvasWidth - w) / 2;
        const y = (canvasHeight - h) / 2;

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
        ctx.drawImage(img, 0, 0, sWidth, sHeight, x, y, w, h);
    });

    // Re-render latest frame on resize (optional but good)
    useEffect(() => {
        const resize = () => {
            if (canvasRef.current) {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;
                // Force redraw of current frame
                const currentFrame = Math.round(frameIndex.get());
                if (images[currentFrame]) {
                    const canvas = canvasRef.current;
                    const ctx = canvas.getContext("2d");
                    const img = images[currentFrame];

                    if (!ctx || !img || !img.complete || img.naturalWidth === 0) return;

                    // Crop watermark (bottom 20%)
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
        resize(); // Initial sizing
        return () => window.removeEventListener('resize', resize);
    }, [images, frameIndex]);

    return (
        <div ref={containerRef} className="relative h-[400vh] bg-[#050505]">
            <div className="sticky top-0 h-screen w-full overflow-hidden">

                {/* Loader Overlay */}
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

                {/* Canvas & Content - Fades in slightly after loader */}
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

                    {/* Text Overlays */}
                    {/* 0% Center */}
                    <motion.div style={{ opacity: opacity1 }} className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center">
                            <h2 className="text-6xl md:text-8xl font-semibold tracking-tighter text-white mb-2">iPhone 17 Pro</h2>
                            <p className="text-2xl md:text-3xl font-medium text-white/60 tracking-tight">Crafted Beyond Limits</p>
                        </div>
                    </motion.div>

                    {/* 30% Left */}
                    <motion.div style={{ opacity: opacity2 }} className="absolute inset-0 flex items-center justify-start px-12 md:px-32 pointer-events-none">
                        <div className="text-left max-w-xl">
                            <h2 className="text-5xl md:text-7xl font-semibold tracking-tighter text-white mb-4">Precision Engineering</h2>
                            <p className="text-xl md:text-2xl font-medium text-white/60 leading-relaxed">Built at the Atomic Level. Every micron calibrated for absolute perfection.</p>
                        </div>
                    </motion.div>

                    {/* 60% Right */}
                    <motion.div style={{ opacity: opacity3 }} className="absolute inset-0 flex items-center justify-end px-12 md:px-32 pointer-events-none">
                        <div className="text-right max-w-xl">
                            <h2 className="text-5xl md:text-7xl font-semibold tracking-tighter text-white mb-4">Titanium Core</h2>
                            <p className="text-xl md:text-2xl font-medium text-white/60 leading-relaxed">Next-Gen Silicon meeting aerospace-grade titanium. Lighter. Stronger. Faster.</p>
                        </div>
                    </motion.div>

                    {/* 90% Center CTA */}
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
