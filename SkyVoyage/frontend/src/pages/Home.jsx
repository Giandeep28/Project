import React from "react";
import Hero from "../components/home/Hero";
import FeaturesRow from "../components/home/FeaturesRow";
import TrendingDestinations from "../components/home/TrendingDestinations";
import Privileges from "../components/home/Privileges";
import ChatbotWindow from "../components/shared/ChatbotWindow";

/**
 * High-End Luxury Homepage.
 * Navbar/Footer are rendered by the Layout wrapper in App.jsx.
 */
export default function Home({ darkMode }) {
  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ background: darkMode ? "#0A0F1A" : "#ffffff" }}
    >
      <main>
        {/* 1. Elite Split-Screen Hero & Booking Card */}
        <Hero darkMode={darkMode} />

        {/* 2. Secure Feature Hub (4-Column Flex Row) */}
        <FeaturesRow darkMode={darkMode} />

        {/* 3. Trending Planetary Routes (3:4 Aspect Cards) */}
        <TrendingDestinations darkMode={darkMode} />

        {/* 4. Philosophical Branding Bridge */}
        <section
          className="py-24 relative"
          style={{
            background: darkMode
              ? "rgba(200,168,75,0.03)"
              : "rgba(200,168,75,0.05)",
          }}
        >
          <div
            className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 border-y py-32 text-center"
            style={{
              borderColor: darkMode
                ? "rgba(255,255,255,0.05)"
                : "rgba(0,0,0,0.06)",
            }}
          >
            <h3
              className="text-4xl lg:text-7xl font-serif italic leading-tight uppercase tracking-tight max-w-5xl mx-auto"
              style={{ color: darkMode ? "#f0ece4" : "#111827" }}
            >
              We don&apos;t just bridge{" "}
              <span style={{ color: "#C8A84B" }}>worlds</span>. <br />
              We redefine the <span style={{ opacity: 0.3 }}>voyage</span>{" "}
              between them.
            </h3>
          </div>
        </section>

        {/* 5. Elite Privileges (Bento Box Grid Layout) */}
        <Privileges darkMode={darkMode} />

        {/* 6. Newsletter / Engagement Hub */}
        <section className="pb-32">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div
              className="p-20 rounded-[4rem] relative overflow-hidden group"
              style={{
                background: darkMode ? "#111827" : "#f9f8f3",
                border: `1px solid ${darkMode ? "rgba(255,255,255,0.05)" : "#e5e7eb"}`,
              }}
            >
              <img
                src="/inner-circle.png"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                style={{ opacity: darkMode ? 0.35 : 0.4 }}
                alt="Newsletter Background"
              />

              <div
                className="absolute inset-0"
                style={{
                  background: darkMode
                    ? "linear-gradient(to right, rgba(17,24,39,0.95), rgba(17,24,39,0.7), rgba(17,24,39,0.95))"
                    : "linear-gradient(to right, rgba(249,248,243,0.95), rgba(249,248,243,0.7), rgba(249,248,243,0.95))",
                }}
              ></div>

              <div
                className="absolute top-0 right-0 w-[500px] h-[500px] opacity-10 rounded-full blur-[100px] group-hover:scale-110 transition-transform duration-1000"
                style={{ background: "#C8A84B" }}
              />
              <div className="flex flex-col items-center text-center max-w-2xl mx-auto space-y-10 relative z-10">
                <span
                  className="font-black uppercase tracking-[6px] text-[10px]"
                  style={{ color: "#C8A84B" }}
                >
                  Await the Manifest
                </span>
                <h2
                  className="text-4xl lg:text-6xl font-serif font-black italic uppercase leading-tight"
                  style={{ color: darkMode ? "#f0ece4" : "#111827" }}
                >
                  Join the{" "}
                  <span style={{ color: "#C8A84B" }}>Inner Circle</span>
                </h2>
                <p
                  className="font-bold uppercase tracking-[4px] text-[10px] leading-relaxed opacity-90"
                  style={{ color: darkMode ? "#f0ece4" : "#111827" }}
                >
                  Elite access to empty leg corridor alerts and signature fleet
                  additions.
                </p>
                <div
                  className="w-full flex pb-4"
                  style={{ borderBottom: "1px solid rgba(200,168,75,0.4)" }}
                >
                  <input
                    type="email"
                    placeholder="CELESTIAL ID (EMAIL)"
                    className="bg-transparent flex-1 text-xs font-black uppercase tracking-widest outline-none"
                    style={{ color: darkMode ? "#f0ece4" : "#111827" }}
                  />
                  <button
                    className="text-[10px] font-black uppercase tracking-widest transition-colors hover:opacity-80"
                    style={{ color: "#C8A84B" }}
                  >
                    Invoke
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* AI Assistant Hub — only on homepage */}
      <ChatbotWindow />
    </div>
  );
}
