"use client";

import React, { useState } from "react";
import { Sparkles, MapPin, Send, ExternalLink, MessageCircle, ArrowRight } from "lucide-react";

interface HeroProps {
  onCheckPhone: (phone: string) => void;
  onExploreCatalog: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onCheckPhone, onExploreCatalog }) => {
  const [quickPhone, setQuickPhone] = useState("");

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickPhone.trim()) {
      onCheckPhone(quickPhone.trim());
    }
  };

  return (
    <section id="inicio" className="relative w-full pt-6 pb-16 lg:py-16 overflow-hidden">
      
      {/* Ambient background glows */}
      <div className="absolute top-10 right-5 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle Golden decorative flow lines */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M-100,200 C300,50 600,450 1200,100 C1500,-50 1800,250 2000,150"
          fill="none"
          stroke="url(#goldGradientLine)"
          strokeWidth="1.2"
        />
        <path
          d="M-50,320 C400,180 700,520 1300,220 C1600,100 1900,400 2200,250"
          fill="none"
          stroke="url(#goldGradientLine)"
          strokeWidth="0.8"
        />
        <defs>
          <linearGradient id="goldGradientLine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#d4af37" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#f7e6a7" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#d4af37" stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* ========================================================= */}
          {/* LEFT COLUMN: TITLE, CTAs, LOYALTY WIDGET & LOCATION CARD */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 flex flex-col space-y-6 sm:space-y-7">
            
            {/* BADGE */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-emerald-subtle w-fit border border-gold-400/30">
              <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="text-xs font-medium tracking-wider text-gold-300 uppercase">
                Colección Exclusiva 2026 • Cochabamba
              </span>
            </div>

            {/* HEADLINE */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12]">
              Encuentra la fragancia <br />
              <span className="gold-text-shimmer">que define tu esencia</span>
            </h1>

            {/* SUBTITLE */}
            <p className="text-base sm:text-lg text-emerald-100/80 font-light max-w-xl leading-relaxed">
              Perfumería de autor, fragancias de tendencia y sistema de fidelidad en Cochabamba.
            </p>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <button
                onClick={onExploreCatalog}
                className="px-7 py-3.5 rounded-full text-sm font-semibold tracking-wider uppercase text-emerald-950 bg-gold-gradient hover:bg-gold-gradient-hover shadow-gold-glow hover:shadow-gold-glow-lg transition-all duration-300 transform active:scale-95 flex items-center gap-2"
              >
                <span>Explorar Catálogo</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="https://wa.me/59175462800?text=Hola%20Vecar%20Perfumer%C3%ADa!%20Vengo%20desde%20la%20p%C3%A1gina%20web%20y%20deseo%20asesoramiento%20personalizado."
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-full text-sm font-semibold tracking-wider text-gold-300 hover:text-white glass-emerald border border-gold-400/50 hover:border-gold-300 transition-all duration-300 transform active:scale-95 flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-gold-400" />
                <span>WhatsApp Directo</span>
              </a>
            </div>

            {/* --------------------------------------------------------- */}
            {/* TARJETA DE FIDELIDAD VECAR CLUB (Exact match to Mockup)   */}
            {/* --------------------------------------------------------- */}
            <div className="p-5 sm:p-6 rounded-2xl glass-emerald border border-gold-400/30 shadow-2xl relative overflow-hidden group">
              
              {/* Subtle gold ribbon top right */}
              <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-gold-400/10 to-transparent rounded-bl-full pointer-events-none" />

              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
                  <h3 className="text-xs sm:text-sm font-semibold tracking-[0.18em] uppercase text-gold-300">
                    TARJETA DE FIDELIDAD VECAR CLUB
                  </h3>
                </div>
                <span className="text-[11px] font-medium text-emerald-300/80 tracking-wide">
                  10 Sellos = 1 Gratis
                </span>
              </div>

              {/* 10 SELLOS DISPLAY (5 activos color vino con borde oro, 5 vacíos punteados) */}
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 sm:gap-2.5 my-3 py-1">
                {/* 5 Sellos llenos */}
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={`filled-${i}`}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#5c1a29] border-2 border-gold-400 flex flex-col items-center justify-center shadow-md transform hover:scale-110 transition-transform cursor-pointer"
                    title={`Sello ${i}: 50ml acumulado`}
                  >
                    <span className="text-[9px] font-bold text-gold-200 tracking-tighter">50ml</span>
                    <span className="text-[7px] text-gold-400/90 font-mono">#{i}</span>
                  </div>
                ))}

                {/* 5 Sellos vacíos punteados */}
                {[6, 7, 8, 9, 10].map((i) => (
                  <div
                    key={`empty-${i}`}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-dashed border-gold-400/40 bg-emerald-950/40 flex flex-col items-center justify-center opacity-70 hover:opacity-100 hover:border-gold-300 transition-all cursor-pointer"
                    title={i === 10 ? "¡Sello 10: PERFUME 50ML GRATIS!" : `Sello ${i} pendiente`}
                  >
                    {i === 10 ? (
                      <span className="text-[9px] font-bold text-gold-400 tracking-tighter animate-pulse">
                        🎁 GRATIS
                      </span>
                    ) : (
                      <span className="text-[9px] font-medium text-gold-400/60">{i}</span>
                    )}
                  </div>
                ))}
              </div>

              <p className="text-xs sm:text-sm text-emerald-100/90 font-medium mb-3">
                ¡Completa tus 10 sellos y recibe un perfume de 50ml gratis!
              </p>

              {/* Quick Input to check customer stamps */}
              <form onSubmit={handleQuickSubmit} className="relative flex items-center">
                <input
                  type="text"
                  value={quickPhone}
                  onChange={(e) => setQuickPhone(e.target.value)}
                  placeholder="Ingresa tu celular para consultar tus sellos..."
                  className="w-full pl-4 pr-28 py-2.5 rounded-full text-xs sm:text-sm bg-emerald-950/80 border border-gold-400/30 text-white placeholder-emerald-200/50 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-1 px-4 py-1.5 rounded-full text-xs font-semibold text-emerald-950 bg-gold-gradient hover:bg-gold-gradient-hover shadow-sm transition-all"
                >
                  Consultar
                </button>
              </form>
            </div>

            {/* --------------------------------------------------------- */}
            {/* VISÍTANOS EN COCHABAMBA CARD (Exact match to Mockup)       */}
            {/* --------------------------------------------------------- */}
            <div className="p-4 sm:p-5 rounded-2xl glass-emerald-subtle border border-gold-400/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold tracking-[0.16em] uppercase text-gold-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gold-400" />
                  <span>VISÍTANOS EN COCHABAMBA</span>
                </h4>
                <p className="text-xs sm:text-sm text-gray-200 font-light">
                  Av. Heroínas entre Av. Oquendo y Calle 16 de Julio
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-gold-300">
                  <span className="flex items-center gap-1">
                    <span className="font-semibold">WhatsApp:</span> 75462800
                  </span>
                  <span className="text-gold-500/50">•</span>
                  <span className="flex items-center gap-1">
                    <span className="font-semibold">TikTok:</span> @Perfumeria.Vecar
                  </span>
                </div>
              </div>

              {/* MINI MAP CARD (Interactive Google Maps trigger) */}
              <a
                href="https://maps.google.com/?q=Av.+Heroinas+y+Oquendo+Cochabamba"
                target="_blank"
                rel="noopener noreferrer"
                title="Abrir ubicación en Google Maps"
                className="relative w-full sm:w-28 h-16 sm:h-20 rounded-xl overflow-hidden border border-gold-400/40 bg-emerald-950 group shrink-0 flex items-center justify-center shadow-inner hover:border-gold-300 transition-all"
              >
                {/* Map grid lines simulation */}
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:12px_12px]" />
                <div className="absolute top-1/2 left-0 right-0 h-[1.5px] bg-gold-400/30" />
                <div className="absolute top-0 bottom-0 left-1/3 w-[1.5px] bg-gold-400/30" />
                <div className="relative z-10 flex flex-col items-center gap-1">
                  <div className="w-6 h-6 rounded-full bg-gold-400 text-emerald-950 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[9px] font-semibold text-gold-200 uppercase tracking-wider">
                    Ver Mapa
                  </span>
                </div>
              </a>

            </div>

          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: LUXURY PERFUME SHOWCASE (Golden Frame)      */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl p-3 sm:p-4 bg-gradient-to-b from-gold-400/30 via-gold-500/10 to-emerald-900/40 border-2 border-gold-400/60 shadow-gold-glow-lg group">
              
              {/* Inner Luxury Frame */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#08221b] via-[#051813] to-[#020b08] border border-gold-400/40 flex flex-col items-center justify-center p-6 text-center">
                
                {/* Floating Bokeh / Lights */}
                <div className="absolute top-8 left-8 w-16 h-16 rounded-full bg-gold-300/20 blur-xl animate-pulse" />
                <div className="absolute bottom-12 right-10 w-24 h-24 rounded-full bg-emerald-400/20 blur-2xl" />

                {/* Botanical leaves accent overlay (SVG) */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none opacity-25 mix-blend-screen"
                  viewBox="0 0 400 500"
                  fill="none"
                  stroke="#d4af37"
                >
                  <path d="M20,480 Q60,350 20,220 Q-20,100 80,40" strokeWidth="1.5" />
                  <path d="M380,480 Q340,350 380,220 Q420,100 320,40" strokeWidth="1.5" />
                  <circle cx="50" cy="180" r="3" fill="#d4af37" />
                  <circle cx="350" cy="180" r="3" fill="#d4af37" />
                  <circle cx="200" cy="50" r="2.5" fill="#f7e6a7" />
                </svg>

                {/* Perfume Bottle Image Container */}
                <div className="relative z-10 w-56 sm:w-64 h-72 sm:h-80 rounded-2xl overflow-hidden shadow-2xl border border-gold-400/50 transform group-hover:scale-[1.03] transition-transform duration-500">
                  <img
                    src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80"
                    alt="Perfume Exclusivo 50ml Vecar Perfumería"
                    className="w-full h-full object-cover object-center"
                  />
                  
                  {/* Luxury 50ml Golden Label Badge on bottle */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-6">
                    <div className="px-5 py-2 rounded-lg bg-emerald-950/90 border border-gold-400/70 shadow-lg backdrop-blur-sm">
                      <p className="text-xs font-serif font-bold tracking-[0.25em] text-gold-300 uppercase">
                        VECAR • 50 ML
                      </p>
                    </div>
                  </div>
                </div>

                {/* Floating Sparkle Elements */}
                <div className="absolute top-6 right-6 flex items-center gap-1 px-3 py-1 rounded-full bg-gold-400/20 border border-gold-400/50 backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5 text-gold-300 animate-spin" style={{ animationDuration: '4s' }} />
                  <span className="text-[10px] font-bold text-gold-200 tracking-wider">
                    ALTA CONCENTRACIÓN
                  </span>
                </div>

                {/* Bottom subtle label */}
                <p className="mt-4 text-[11px] font-light tracking-[0.2em] text-gold-300/80 uppercase z-10">
                  Fragancias de Autor & Inspiración Nicho
                </p>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
