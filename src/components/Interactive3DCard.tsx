"use client";

import React, { useState, useRef } from "react";
import { Cliente } from "@/types/database";
import { Award, Sparkles, Gift, CheckCircle2, ShieldCheck, Wifi } from "lucide-react";
import { calculatePremioSugerido } from "@/lib/loyaltyRules";
import { VecarEmblem } from "./VecarLogo";

interface Interactive3DCardProps {
  cliente?: Cliente | null;
  onOpenClubModal?: () => void;
  stampsCount?: number;
  interactive?: boolean;
}

export const Interactive3DCard: React.FC<Interactive3DCardProps> = ({
  cliente,
  onOpenClubModal,
  stampsCount,
  interactive = true,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Default demo data if no specific client is passed
  const currentStamps = stampsCount ?? (cliente ? cliente.sellos_acumulados : 7);
  const clientName = cliente ? cliente.nombre_completo : "Alejandro Montaño";
  const clientPhone = cliente ? cliente.telefono : "75462800";
  const memberId = cliente ? `VC-${cliente.id.slice(0, 8).toUpperCase()}` : "VC-VIP-2026";
  const premio = calculatePremioSugerido(cliente);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    setRotate({ x: rotateX, y: rotateY });
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.85,
    });
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  const handleMouseEnter = () => {
    if (!interactive) return;
    setIsHovered(true);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!interactive || !cardRef.current || e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = cardRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = Math.max(-14, Math.min(14, ((y - centerY) / centerY) * -12));
    const rotateY = Math.max(-14, Math.min(14, ((x - centerX) / centerX) * 12));

    setRotate({ x: rotateX, y: rotateY });
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.85,
    });
  };

  const handleTouchEnd = () => {
    if (!interactive) return;
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      className="relative select-none w-full"
      style={{ perspective: "1200px" }}
    >
      {/* 3D TILT CONTAINER */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={() => setIsHovered(true)}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={onOpenClubModal}
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) ${
            isHovered ? "scale3d(1.025, 1.025, 1.025)" : "scale3d(1, 1, 1)"
          }`,
          transition: isHovered
            ? "transform 0.1s cubic-bezier(0.2, 0, 0, 1)"
            : "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)",
          transformStyle: "preserve-3d",
        }}
        className="cursor-pointer relative w-full rounded-3xl p-6 sm:p-7 overflow-hidden bg-gradient-to-br from-[#0c2e24] via-[#061c16] to-[#020b08] border-2 border-gold-400/60 shadow-2xl shadow-black/80 group"
      >
        {/* DYNAMIC METALLIC GLARE OVERLAY */}
        <div
          className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300 mix-blend-color-dodge"
          style={{
            opacity: glare.opacity,
            background: `radial-gradient(circle 320px at ${glare.x}% ${glare.y}%, rgba(255, 238, 185, 0.55), rgba(212, 175, 55, 0.25) 40%, transparent 80%)`,
          }}
        />

        {/* HOLOGRAPHIC SHIMMER STRIP */}
        <div className="pointer-events-none absolute -inset-x-full top-0 h-full w-[200%] bg-gradient-to-r from-transparent via-gold-300/10 to-transparent transform -skew-x-25 group-hover:animate-shimmer" />

        {/* ART DÉCO CORNER EMBOSSING */}
        <div className="pointer-events-none absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-gold-400/50 rounded-tl-lg" />
        <div className="pointer-events-none absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-gold-400/50 rounded-tr-lg" />
        <div className="pointer-events-none absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-gold-400/50 rounded-bl-lg" />
        <div className="pointer-events-none absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-gold-400/50 rounded-br-lg" />

        {/* CARD CONTENT LAYER (Preserve-3d with translation for depth) */}
        <div style={{ transform: "translateZ(35px)" }} className="relative z-20 space-y-5">
          
          {/* HEADER: LOGO, MEMBER STATUS & CONTACTLESS ICON */}
          <div className="flex items-center justify-between pb-3.5 border-b border-gold-400/25">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-gold-400/70 bg-gradient-to-br from-gold-300/20 via-emerald-950 to-emerald-900 flex items-center justify-center shadow-gold-glow">
                <VecarEmblem className="w-7 h-6 text-gold-300" />
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-[0.25em] text-gold-400 uppercase block font-semibold">
                  VECAR CLUB • PASS VIP
                </span>
                <h4 className="font-serif text-lg sm:text-xl font-bold text-white tracking-wide">
                  {clientName}
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-gold-400/80 rotate-90" />
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-wider uppercase text-emerald-950 bg-gold-gradient shadow-sm">
                {currentStamps >= 10 ? "PREMIO ACTIVO" : "SOCIO ACTIVO"}
              </span>
            </div>
          </div>

          {/* 10 SELLOS HOLOGRAPHIC SLOTS */}
          <div>
            <div className="flex items-center justify-between mb-2.5 text-xs">
              <span className="text-gold-200/90 font-medium tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                <span>Sellos Digitales Acumulados</span>
              </span>
              <span className="font-mono font-bold text-gold-300 text-sm">
                {currentStamps} <span className="text-emerald-400/70 font-normal">/ 10</span>
              </span>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 sm:gap-2.5 py-1">
              {Array.from({ length: 10 }).map((_, idx) => {
                const stampNum = idx + 1;
                const isFilled = stampNum <= currentStamps;
                const isGift = stampNum === 10;

                return (
                  <div
                    key={idx}
                    className={`relative w-full aspect-square rounded-2xl flex flex-col items-center justify-center transition-all duration-300 shadow-sm ${
                      isFilled
                        ? "bg-gradient-to-b from-[#6b1e32] via-[#4e265b] to-[#371842] border-2 border-purple-300/80 text-white shadow-gold-glow transform hover:scale-110"
                        : isGift
                        ? "border-2 border-dashed border-gold-400 bg-gold-400/10 text-gold-400 animate-pulse"
                        : "border border-dashed border-gold-400/40 bg-emerald-950/40 text-gold-400/40"
                    }`}
                  >
                    {isFilled ? (
                      <div className="flex flex-col items-center justify-center p-0.5">
                        <VecarEmblem className="w-5 h-4 text-purple-200 drop-shadow-sm" />
                        <span className="text-[7.5px] font-black text-white font-mono leading-none mt-0.5">50ML</span>
                      </div>
                    ) : isGift ? (
                      <div className="flex flex-col items-center">
                        <Gift className="w-4 h-4 text-gold-400" />
                        <span className="text-[6.5px] text-gold-300 font-bold uppercase mt-0.5">{premio.tamanoMl}ml</span>
                      </div>
                    ) : (
                      <span className="text-[9px] font-medium font-mono">{stampNum}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>


          {/* CARD FOOTER: MEMBER NUMBER & STATUS BADGE */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-t border-gold-400/20">
            <div className="flex items-center gap-3">
              <div>
                <span className="text-[9px] text-emerald-300/70 uppercase block font-mono">Teléfono Blindado</span>
                <span className="text-white font-mono font-semibold tracking-wider text-xs">
                  {clientPhone}
                </span>
              </div>
              <div className="h-6 w-px bg-gold-500/20" />
              <div>
                <span className="text-[9px] text-emerald-300/70 uppercase block font-mono">ID Membresía</span>
                <span className="text-gold-300 font-mono text-xs">{memberId}</span>
              </div>
            </div>

            <div className="text-right">
              {currentStamps >= 10 ? (
                <span className="text-xs font-bold text-gold-300 bg-gold-400/20 px-3 py-1 rounded-full border border-gold-400 animate-pulse">
                  🎁 ¡Perfume {premio.tamanoMl} ML GRATIS Listo!
                </span>
              ) : (
                <div className="flex flex-col items-end">
                  <span className="text-[11px] text-emerald-200/90">
                    Te faltan <strong className="text-gold-300 font-bold">{10 - currentStamps} sellos</strong>
                  </span>
                  <span className="text-[9.5px] text-gold-300 font-medium">
                    Premio proyectado: Perfume {premio.tamanoMl} ML GRATIS
                  </span>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* 3D FLOATING WATERMARK LOGO */}
        <div
          style={{ transform: "translateZ(15px)" }}
          className="pointer-events-none absolute -bottom-10 -right-10 opacity-10"
        >
          <Award className="w-56 h-56 text-gold-400" />
        </div>
      </div>
      
      {/* CARD INTERACTION HINT */}
      <p className="text-center text-[11px] text-gold-400/60 font-mono mt-2 flex items-center justify-center gap-1.5">
        <Sparkles className="w-3 h-3 text-gold-400/70" />
        <span>Mueve el cursor o toca para interactuar con tu Tarjeta 3D</span>
      </p>
    </div>
  );
};
