"use client";

import React, { useState, useRef } from "react";
import { VecarEmblem } from "./VecarLogo";
import { Sparkles, RefreshCw } from "lucide-react";
import confetti from "canvas-confetti";
import { playStampSound } from "../lib/stampAudio";

interface PhysicalCard3DProps {
  initialStamps?: number;
  interactiveStamps?: boolean;
  onOpenClubModal?: () => void;
  className?: string;
}

export const PhysicalCard3D: React.FC<PhysicalCard3DProps> = ({
  initialStamps = 2,
  interactiveStamps = true,
  onOpenClubModal,
  className = "",
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [stamps, setStamps] = useState<boolean[]>(() => {
    const arr = Array(10).fill(false);
    for (let i = 0; i < Math.min(10, initialStamps); i++) {
      arr[i] = true;
    }
    return arr;
  });
  const [lastStampedIdx, setLastStampedIdx] = useState<number | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const completedCount = stamps.filter(Boolean).length;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    setRotate({ x: rotateX, y: rotateY });
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.65,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const toggleStamp = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!interactiveStamps) return;
    const willBeStamped = !stamps[index];
    if (willBeStamped) {
      setLastStampedIdx(index);
      playStampSound();
    }
    setStamps((prev) => {
      const next = [...prev];
      next[index] = willBeStamped;
      const count = next.filter(Boolean).length;
      if (willBeStamped && count === 10) {
        confetti({
          particleCount: 110,
          spread: 80,
          origin: { y: 0.5 },
          colors: ["#C9A050", "#DFB968", "#4E265B", "#FFFFFF"],
        });
      }
      return next;
    });
  };

  return (
    <div className={`w-full max-w-[530px] flex flex-col items-center ${className}`}>
      
      {/* HEADER DE CONTROL DEL VOLTEO */}
      <div className="mb-3 flex items-center justify-between w-full px-1">
        <span className="text-xs uppercase tracking-widest text-[#F1DCA7]/90 flex items-center gap-1.5 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-[#C9A050]" />
          <span>Tarjeta Oficial Física (Frente y Reverso)</span>
        </span>
        
        <button
          type="button"
          onClick={() => setIsFlipped(!isFlipped)}
          className="text-xs font-semibold px-3.5 py-1 rounded-full bg-[#C9A050]/20 border border-[#C9A050]/50 text-[#DFB968] hover:bg-[#C9A050] hover:text-[#091719] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
        >
          <RefreshCw className="w-3 h-3" />
          <span>{isFlipped ? "Ver Frente (Dirección)" : "Ver Reverso (Fidelidad)"}</span>
        </button>
      </div>

      {/* CONTENEDOR 3D CON PERSPECTIVA */}
      <div
        className="w-full aspect-[1.72/1] perspective-1000 select-none cursor-pointer"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          ref={cardRef}
          style={{
            transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y + (isFlipped ? 180 : 0)}deg) ${
              isHovered ? "scale3d(1.02, 1.02, 1.02)" : "scale3d(1, 1, 1)"
            }`,
            transition: isHovered
              ? "transform 0.12s cubic-bezier(0.2, 0, 0, 1)"
              : "transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
            transformStyle: "preserve-3d",
          }}
          className="relative w-full h-full rounded-2xl shadow-2xl shadow-black/85 transition-all"
        >
          {/* GLARE METÁLICO DINÁMICO */}
          <div
            className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300 mix-blend-color-dodge rounded-2xl"
            style={{
              opacity: glare.opacity,
              background: `radial-gradient(circle 280px at ${glare.x}% ${glare.y}%, rgba(241, 220, 167, 0.5), rgba(201, 160, 80, 0.2) 40%, transparent 80%)`,
            }}
          />

          {/* ========================================================= */}
          {/* CARA FRONTAL: Réplica exacta de la foto 1 (Tarjeta física) */}
          {/* ========================================================= */}
          <div className="absolute inset-0 w-full h-full backface-hidden rounded-2xl card-surface-texture border border-[#C9A050]/55 overflow-hidden p-4 sm:p-5 flex">
            
            {/* Ondas curvas vectoriales y ramas botánicas calcadas de la tarjeta */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 520 300"
              fill="none"
            >
              {/* Arco turquesa y dorado superior izquierdo */}
              <path d="M 0 110 C 45 45, 115 12, 185 0" stroke="#C9A050" strokeWidth="1.5" opacity="0.85" />
              <path d="M 0 125 C 35 65, 95 28, 165 0" stroke="#2A6F7B" strokeWidth="6" opacity="0.45" />
              <path d="M 0 175 C 12 -10, 145 -10, 210 0" stroke="#C9A050" strokeWidth="1.2" opacity="0.6" />
              {/* Arco inferior izquierdo */}
              <path d="M 0 245 C 50 285, 130 305, 225 270" stroke="#2A6F7B" strokeWidth="10" opacity="0.5" />
              <path d="M 150 300 C 185 288, 215 268, 232 246" stroke="#C9A050" strokeWidth="1.6" opacity="0.9" />
              {/* Hojas botánicas sutiles en el margen derecho */}
              <g fill="#2A646D" opacity="0.32">
                <ellipse cx="508" cy="140" rx="16" ry="5" transform="rotate(-35 508 140)" />
                <ellipse cx="502" cy="165" rx="18" ry="5.5" transform="rotate(-25 502 165)" />
                <ellipse cx="506" cy="190" rx="16" ry="5" transform="rotate(-30 506 190)" />
                <ellipse cx="500" cy="215" rx="18" ry="5.5" transform="rotate(-20 500 215)" />
                <ellipse cx="505" cy="240" rx="15" ry="4.5" transform="rotate(-30 505 240)" />
              </g>
            </svg>

            {/* Mitad Izquierda (44%): Logotipo Vecar Perfumería */}
            <div className="relative z-10 w-[44%] flex flex-col items-center justify-center pr-2 sm:pr-3 text-center">
              <VecarEmblem className="w-20 sm:w-26 h-18 sm:h-22 text-[#C9A050] drop-shadow-md" />
              <span className="font-serif italic font-bold text-3xl sm:text-4xl text-[#C9A050] leading-none -mt-1 tracking-wide">
                Vecar
              </span>
              <div className="w-24 sm:w-32 h-[1px] bg-[#C9A050]/80 my-1" />
              <span className="font-sans font-bold text-[9px] sm:text-[11px] tracking-[0.24em] text-[#C9A050] uppercase">
                PERFUMERÍA
              </span>
            </div>

            {/* Línea Divisoria Vertical Dorada */}
            <div className="relative z-10 w-[1.5px] bg-[#C9A050]/70 my-1" />

            {/* Mitad Derecha (55%): Croquis + VISÍTANOS + WhatsApp + TikTok */}
            <div className="relative z-10 w-[55%] pl-3 sm:pl-4 flex flex-col justify-between">
              
              {/* Mini Croquis Blanco con Borde Dorado */}
              <div className="w-full h-22 sm:h-26 bg-white rounded-xl border-[1.5px] border-[#C9A050] overflow-hidden relative shadow-inner">
                <svg viewBox="0 0 260 110" className="w-full h-full select-none">
                  {/* Calles azul pizarra como en la tarjeta */}
                  {/* Calle 16 de Julio (Vertical Izquierda) */}
                  <path d="M 32 -5 L 44 115" stroke="#53687E" strokeWidth="14" />
                  <text
                    x="35"
                    y="42"
                    fill="#FFFFFF"
                    fontSize="6.2"
                    fontWeight="700"
                    transform="rotate(84 35 42)"
                    textAnchor="middle"
                  >
                    C. 16 de Julio
                  </text>

                  {/* Av. Oquendo (Vertical Derecha) */}
                  <path d="M 205 -5 L 217 115" stroke="#53687E" strokeWidth="14" />
                  <text
                    x="208"
                    y="42"
                    fill="#FFFFFF"
                    fontSize="6.2"
                    fontWeight="700"
                    transform="rotate(84 208 42)"
                    textAnchor="middle"
                  >
                    Av. Oquendo
                  </text>

                  {/* Av. Heroínas (Horizontal Central) */}
                  <path d="M -5 76 L 265 64" stroke="#53687E" strokeWidth="13" />
                  <text
                    x="165"
                    y="72"
                    fill="#FFFFFF"
                    fontSize="6.8"
                    fontWeight="700"
                    transform="rotate(-3 165 72)"
                    textAnchor="middle"
                  >
                    Av. Heroínas
                  </text>

                  {/* Pin Dorado de Vecar en el centro de Av. Heroínas */}
                  <g transform="translate(115, 58)">
                    <path
                      d="M0 -14 C8 -14, 14 -8, 14 0 C14 7, 5 14, 0 18 C-5 14, -14 7, -14 0 C-14 -8, -8 -14, 0 -14 Z"
                      fill="#C9A050"
                    />
                    <circle cx="0" cy="-1" r="10.5" fill="#2A2629" />
                    <text
                      x="0"
                      y="3"
                      fill="#DFB968"
                      fontFamily="Cormorant Garamond, serif"
                      fontStyle="italic"
                      fontWeight="bold"
                      fontSize="8.5"
                      textAnchor="middle"
                    >
                      Vecar
                    </text>
                  </g>
                </svg>
              </div>

              {/* Bloque VISÍTANOS */}
              <div className="pt-1.5 pb-1 border-b gold-divider flex items-start gap-2">
                <div className="w-4.5 h-4.5 rounded-full bg-[#C9A050] flex items-center justify-center text-[#0E2326] shrink-0 mt-0.5">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="text-[9.5px] sm:text-[10.5px] leading-tight text-white">
                  <p className="font-bold text-[#C9A050] tracking-wider text-[11px] sm:text-xs uppercase">
                    VISÍTANOS
                  </p>
                  <p className="font-medium">Av. Heroínas entre</p>
                  <p className="font-medium">Av. Oquendo y</p>
                  <p className="font-medium">Calle 16 de Julio</p>
                </div>
              </div>

              {/* Bloque WhatsApp 75462800 */}
              <div className="py-1 border-b gold-divider flex items-center gap-2">
                <div className="w-4.5 h-4.5 rounded-full bg-[#C9A050] flex items-center justify-center text-[#0E2326] shrink-0">
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771z" />
                  </svg>
                </div>
                <span className="font-sans font-bold text-xs sm:text-sm tracking-wider text-white">
                  75462800
                </span>
              </div>

              {/* Bloque TikTok Perfumeria Vecar */}
              <div className="pt-0.5 flex items-center gap-2">
                <div className="w-4.5 h-4.5 rounded-full bg-[#C9A050] flex items-center justify-center text-[#0E2326] shrink-0">
                  <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                </div>
                <span className="font-sans font-semibold text-[11px] sm:text-xs text-white">
                  Perfumeria Vecar
                </span>
              </div>

            </div>
          </div>

          {/* ========================================================= */}
          {/* CARA REVERSO: Réplica exacta de la foto 2 (Tarjeta de Fidelidad) */}
          {/* ========================================================= */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl card-surface-texture border border-[#C9A050]/55 overflow-hidden p-4 sm:p-5 flex flex-col justify-between">
            
            {/* Título Caligráfico Dorado */}
            <div className="text-center pt-0.5">
              <h3 className="font-script text-3xl sm:text-4xl text-[#DFB968] tracking-wide drop-shadow-sm leading-none">
                Tarjeta de Fidelidad
              </h3>
            </div>

            {/* 10 Círculos (5 columnas x 2 filas) + Logo lateral */}
            <div className="flex items-center justify-between gap-3 my-auto px-1">
              <div className="grid grid-cols-5 gap-2 sm:gap-2.5 flex-1">
                {stamps.map((isStamped, idx) => {
                  const isJustStamped = lastStampedIdx === idx;
                  if (isStamped) {
                    return (
                      <button
                        key={`card-stamp-${idx}-active-${isJustStamped ? 'pop' : 'static'}`}
                        type="button"
                        onClick={(e) => toggleStamp(idx, e)}
                        title={`Sello #${idx + 1} de 50ML completado (clic para alternar)`}
                        className={`aspect-square rounded-full plum-stamp-surface border border-purple-200/60 flex flex-col items-center justify-center p-1 shadow-md relative cursor-pointer ${
                          isJustStamped ? "animate-stamp" : ""
                        }`}
                      >
                        <VecarEmblem className="w-5 sm:w-6 h-5 sm:h-6 text-purple-100 drop-shadow-sm" />
                        <span className="text-[6.5px] sm:text-[7.5px] font-black tracking-wider text-white leading-none mt-0.5 font-mono">
                          50ML
                        </span>
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#C9A050] text-[#091719] font-bold text-[8px] flex items-center justify-center shadow">
                          {idx + 1}
                        </span>
                      </button>
                    );
                  }

                  return (
                    <button
                      key={`card-stamp-${idx}-empty`}
                      type="button"
                      onClick={(e) => toggleStamp(idx, e)}
                      title={`Casilla #${idx + 1} disponible (clic para estampar)`}
                      className="aspect-square rounded-full bg-white flex items-center justify-center p-1 shadow-inner hover:bg-amber-50 border border-[#C9A050]/40 transition-transform hover:scale-105 active:scale-90 cursor-pointer relative"
                    >
                      <VecarEmblem className="w-6 sm:w-7 h-6 sm:h-7 text-[#C9A050]/80" />
                    </button>
                  );
                })}
              </div>

              {/* Pequeño Logo Vecar a la derecha como en el reverso físico */}
              <div className="flex flex-col items-center justify-center pl-2 border-l gold-divider shrink-0">
                <VecarEmblem className="w-8 sm:w-9 h-8 sm:h-9 text-[#C9A050]" />
                <span className="font-serif italic font-bold text-base sm:text-lg text-[#C9A050] leading-none mt-0.5">
                  Vecar
                </span>
                <span className="text-[6px] tracking-[0.2em] text-[#C9A050] uppercase font-bold mt-0.5">
                  PERFUMERÍA
                </span>
              </div>
            </div>

            {/* Pie de Tarjeta con Progreso */}
            <div className="text-center pb-0.5 flex items-center justify-between px-2 text-[10px] text-[#F1DCA7]/90 border-t gold-divider pt-1.5">
              <span>
                Sellos activos: <strong className="text-white">{completedCount}/10</strong>
              </span>
              <span className="text-[#DFB968]">
                {completedCount >= 10
                  ? "🎉 ¡Premio 10 Sellos Desbloqueado!"
                  : `Faltan ${10 - completedCount} sellos para tu premio`}
              </span>
            </div>

          </div>

        </div>
      </div>

      <p className="text-[11px] text-gray-400 mt-2.5 text-center flex items-center justify-center gap-1.5 font-light">
        <span>Diseño de lujo inspirado fielmente en nuestra tarjeta comercial física.</span>
      </p>

    </div>
  );
};
