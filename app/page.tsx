"use client";

import IphoneScroll from "@/components/IphoneScroll";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050505] selection:bg-white/20">

      {/* 1. Scrollytelling Section */}
      <IphoneScroll />

      {/* 2. Features Section */}
      <section className="py-32 px-6 md:px-12 max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1 }}
          className="mb-24"
        >
          <h2 className="text-4xl md:text-6xl font-semibold text-white/90 mb-6 tracking-tight">Everything changes. Again.</h2>
          <p className="text-xl text-white/60 max-w-2xl">The most advanced iPhone we’ve ever created. Designed to push the boundaries of what is physically possible.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { title: "A18 Pro Chip", desc: "Unrivaled performance." },
            { title: "Titanium Frame", desc: "Aerospace-grade durability." },
            { title: "Pro Camera", desc: "The world's best studio." },
            { title: "All-Day Battery", desc: "Power that lasts." }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className="p-8 bg-white/5 rounded-3xl backdrop-blur-sm border border-white/5 hover:bg-white/10 transition-colors duration-500"
            >
              <h3 className="text-2xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-white/50 font-medium">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. Tech Specs Section */}
      <section className="py-32 px-6 md:px-12 max-w-[1000px] mx-auto border-t border-white/10">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-semibold text-white/90 mb-20 tracking-tight"
        >
          Tech Specs
        </motion.h2>

        <div className="space-y-12">
          {[
            { label: "Finish", value: "Natural Titanium, Blue Titanium, White Titanium, Black Titanium" },
            { label: "Display", value: "Super Retina XDR display. 6.7‑inch (diagonal) all‑screen OLED display. ProMotion technology." },
            { label: "Chip", value: "A18 Pro chip. New 6‑core CPU. New 6‑core GPU. New 16‑core Neural Engine." },
            { label: "Camera", value: "Pro camera system. 48MP Main. 12MP Ultra Wide. 12MP 5x Telephoto." },
            { label: "Power", value: "Video playback up to 29 hours. Fast-charge capable." }
          ].map((spec, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-12 py-8 border-b border-white/10"
            >
              <dt className="text-xl font-semibold text-white/90">{spec.label}</dt>
              <dd className="col-span-1 md:col-span-2 text-lg text-white/60 font-medium leading-relaxed">{spec.value}</dd>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. Footer */}
      <footer className="py-12 border-t border-white/5 text-center">
        <p className="text-sm text-white/30 font-medium">© 2026 Meethios Labs. Concept Experience.</p>
      </footer>
    </main>
  );
}
