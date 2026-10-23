"use client";

import React, { useState } from "react";
import { Sparkles, MapPin, MessageCircle, ArrowRight, Award } from "lucide-react";
import { PhysicalCard3D } from "./PhysicalCard3D";
import { WaxSealBadge } from "./WaxSealBadge";

interface HeroProps {
  onCheckPhone: (phone: string) => void;
  onExploreCatalog: () => void;
  onOpenClubModal: () => void;
  onOpenMapsModal?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onCheckPhone,
  onExploreCatalog,
  onOpenClubModal,
  onOpenMapsModal,
}) => {
  const [quickPhone, setQuickPhone] = useState("");

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickPhone.trim()) {
      onCheckPhone(quickPhone.trim());
    }
  };

  return (
    <section id="inicio" className="relative w-full pt-8 pb-16 lg:py-20 overflow-hidden">
      
      {/* Ondas Doradas y Turquesa de Fondo */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <svg className="w-full h-full object-cover opacity-30" viewBox="0 0 1440 800" fill="none" preserveAspectRatio="xMidYMid slice">
          <circle cx="250" cy="400" r="360" fill="#245861" filter="blur(110px)" opacity="0.5" />
          <circle cx="1150" cy="350" r="320" fill="#C9A050" filter="blur(140px)" opacity="0.18" />
          <path d="M-100 680 C 120 420, 380 120, 760 -40" stroke="#C9A050" strokeWidth="2" opacity="0.5" />
          <path d="M-80 760 C 180 510, 410 180, 880 -20" stroke="#DFB968" strokeWidth="1.2" opacity="0.35" />
          <path d="M-120 220 C 140 520, 480 740, 960 820" stroke="#2D6E78" strokeWidth="14" opacity="0.2" strokeLinecap="round" />
          <path d="M-90 250 C 160 540, 490 750, 980 830" stroke="#C9A050" strokeWidth="1.8" opacity="0.55" />
          <path d="M850 -60 C 1120 220, 1290 520, 1520 760" stroke="#C9A050" strokeWidth="1.4" opacity="0.35" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* ========================================================= */}
          {/* COLUMNA IZQUIERDA: PRESENTACIÓN DE MARCA Y LLAMADOS A LA ACCIÓN */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 flex flex-col space-y-6 sm:space-y-7 text-left">
            
            {/* BADGE DE UBICACIÓN Y LUJO */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1E3B3F]/90 border border-[#C9A050]/40 w-fit shadow-md">
              <span className="w-2 h-2 rounded-full bg-[#C9A050] animate-pulse" />
              <span className="text-xs font-semibold tracking-widest uppercase text-[#F1DCA7]">
                Cochabamba • Av. Heroínas
              </span>
            </div>

            {/* HEADLINE PRINCIPAL */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12]">
              La esencia del lujo en cada gota de{" "}
              <span className="italic font-bold gold-gradient-text block mt-1">
                Vecar Perfumería
              </span>
            </h1>

            {/* SUBTITLE */}
            <p className="text-base sm:text-lg text-emerald-100/80 font-light max-w-xl leading-relaxed">
              Descubre fragancias de alta fijación con <strong className="text-[#DFB968] font-semibold">40% de esencia pura</strong>, perfumes árabes de tendencia y presentaciones exclusivas de <strong className="text-white font-semibold">50ML</strong>. Por cada compra de 50ML acumulas un sello oficial en tu <span className="font-script text-2xl text-[#DFB968]">Tarjeta de Fidelidad</span>.
            </p>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <button
                onClick={onExploreCatalog}
                className="gold-gradient-btn px-7 py-3.5 rounded-xl font-bold text-xs sm:text-sm tracking-wide uppercase flex items-center gap-2.5 shadow-xl cursor-pointer active:scale-95"
              >
                <span>Explorar Fragancias</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenClubModal}
                className="px-6 py-3.5 rounded-xl font-semibold text-xs sm:text-sm border border-[#C9A050]/50 bg-[#163034]/80 hover:bg-[#1E3B3F] text-[#F1DCA7] transition-all flex items-center gap-2 cursor-pointer shadow-md active:scale-95"
              >
                <span className="w-3 h-3 rounded-full plum-stamp-surface inline-block border border-purple-200/40" />
                <span>Mi Tarjeta de Fidelidad</span>
              </button>
            </div>

            {/* BUSCADOR RÁPIDO DE CLIENTE / SELLOS */}
            <div className="pt-1 max-w-lg">
              <form onSubmit={handleQuickSubmit} className="relative flex items-center">
                <input
                  type="text"
                  value={quickPhone}
                  onChange={(e) => setQuickPhone(e.target.value)}
                  placeholder="Ingresa tu celular para consultar tus sellos..."
                  className="w-full pl-5 pr-28 py-3 rounded-xl text-xs sm:text-sm bg-[#091719]/90 border border-[#C9A050]/40 text-white placeholder-gray-400 focus:outline-none focus:border-[#C9A050] focus:ring-1 focus:ring-[#C9A050] transition-all shadow-inner"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 px-4 py-2 rounded-lg text-xs font-bold tracking-wider uppercase text-[#091719] bg-gradient-to-r from-[#DFB968] to-[#C9A050] hover:brightness-110 shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  Consultar
                </button>
              </form>
            </div>

            {/* ESTADÍSTICAS DE VALOR */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t gold-divider max-w-lg">
              <div>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-[#DFB968]">50 ML</p>
                <p className="text-[11px] text-gray-300 mt-0.5">Suma 1 Sello Oficial</p>
              </div>
              <div className="border-l gold-divider pl-4">
                <p className="font-serif text-2xl sm:text-3xl font-bold text-[#DFB968]">+12 Hrs</p>
                <p className="text-[11px] text-gray-300 mt-0.5">Fijación en Piel</p>
              </div>
              <div className="border-l gold-divider pl-4">
                <p className="font-serif text-2xl sm:text-3xl font-bold text-[#DFB968]">10 Sellos</p>
                <p className="text-[11px] text-gray-300 mt-0.5">Premio de Fidelidad</p>
              </div>
            </div>

          </div>

          {/* ========================================================= */}
          {/* COLUMNA DERECHA: RÉPLICA 3D DE LA TARJETA FÍSICA DE VECAR */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center relative">
            
            {/* FLOATING 3D WAX SEAL BADGE */}
            <div className="absolute -top-7 -right-2 sm:-right-4 z-30 animate-float-slow hidden sm:block">
              <WaxSealBadge onOpenClubModal={onOpenClubModal} />
            </div>

            {/* TARJETA FÍSICA VECTORIAL CON VOLTEO Y CROQUIS OFICIAL */}
            <PhysicalCard3D onOpenClubModal={onOpenClubModal} />

          </div>

        </div>
      </div>
    </section>
  );
};
