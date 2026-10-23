"use client";

import React from "react";

interface VecarEmblemProps {
  className?: string;
  size?: number | string;
}

/**
 * Emblema vectorial oficial de Vecar Perfumería
 * Fiel calco matemático de la tarjeta física:
 * - Frasco gota alargada con bucle superior (viewBox 0 0 100 82)
 * - Medialuna sólida con corte horizontal a Y=41
 * - Ramas ornamentales de hojas simétricas (100 - X)
 * - Usa currentColor para adaptarse dinámicamente con clases de Tailwind
 */
export const VecarEmblem: React.FC<VecarEmblemProps> = ({
  className = "w-10 h-10 text-gold-400",
}) => {
  return (
    <svg
      viewBox="0 0 100 82"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Tapa en bucle superior */}
      <path
        d="M50 6 C46 6, 45 12, 48.5 16.5 C50 18.5, 50 18.5, 51.5 16.5 C55 12, 54 6, 50 6 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Cuello del frasco */}
      <path
        d="M47 17.5 L53 17.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Cuerpo de gota alargada */}
      <path
        d="M48.5 17.5 C39 28, 36 44, 37.5 58 C39 70, 44 77, 50 77 C56 77, 61 70, 62.5 58 C64 44, 61 28, 51.5 17.5 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.3"
      />
      {/* Detalle interno de medialuna dorada con corte horizontal en Y=41 */}
      <path
        d="M50 18 C56 26, 58.5 34, 59 41 L45.5 41 C46.5 33, 48 25, 50 18 Z"
        fill="currentColor"
        opacity="0.92"
      />
      {/* Reflejo curvo interior izquierdo */}
      <path
        d="M42.5 34 C39.8 45, 40.2 58, 45.5 70"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.85"
      />

      {/* Rama ornamental izquierda */}
      <g stroke="currentColor" fill="currentColor">
        <path
          d="M40 69 C32 69, 24 65, 16 69"
          fill="none"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M36 62 C30 59, 26 54, 27 49"
          fill="none"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <ellipse cx="26" cy="51" rx="3.2" ry="1.6" transform="rotate(-35 26 51)" />
        <ellipse cx="32" cy="55" rx="3" ry="1.5" transform="rotate(20 32 55)" />
        <ellipse cx="24" cy="60" rx="3.4" ry="1.6" transform="rotate(-15 24 60)" />
        <ellipse cx="18" cy="65" rx="3.5" ry="1.6" transform="rotate(-25 18 65)" />
        <ellipse cx="27" cy="69.5" rx="3.5" ry="1.5" transform="rotate(25 27 69.5)" />
        <circle cx="34" cy="65" r="1.4" />
      </g>

      {/* Rama ornamental derecha (simétrica 100 - X) */}
      <g stroke="currentColor" fill="currentColor">
        <path
          d="M60 69 C68 69, 76 65, 84 69"
          fill="none"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M64 62 C70 59, 74 54, 73 49"
          fill="none"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <ellipse cx="74" cy="51" rx="3.2" ry="1.6" transform="rotate(35 74 51)" />
        <ellipse cx="68" cy="55" rx="3" ry="1.5" transform="rotate(-20 68 55)" />
        <ellipse cx="76" cy="60" rx="3.4" ry="1.6" transform="rotate(15 76 60)" />
        <ellipse cx="82" cy="65" rx="3.5" ry="1.6" transform="rotate(25 82 65)" />
        <ellipse cx="73" cy="69.5" rx="3.5" ry="1.5" transform="rotate(-25 73 69.5)" />
        <circle cx="66" cy="65" r="1.4" />
      </g>
    </svg>
  );
};

interface VecarLogoProps {
  variant?: "horizontal" | "vertical" | "compact";
  className?: string;
}

export const VecarLogo: React.FC<VecarLogoProps> = ({
  variant = "horizontal",
  className = "",
}) => {
  if (variant === "vertical") {
    return (
      <div className={`flex flex-col items-center justify-center text-center ${className}`}>
        <VecarEmblem className="w-16 h-14 text-gold-400 drop-shadow-md" />
        <span className="font-serif italic font-bold text-3xl sm:text-4xl text-white tracking-wide leading-none mt-1">
          Vecar
        </span>
        <div className="w-24 h-[1px] bg-gold-400/60 my-1" />
        <span className="font-sans text-[9px] sm:text-[10px] font-bold tracking-[0.28em] text-gold-300 uppercase">
          PERFUMERÍA
        </span>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <VecarEmblem className="w-8 h-7 text-gold-400" />
        <div className="flex flex-col leading-none">
          <span className="font-serif italic font-bold text-lg text-white">Vecar</span>
          <span className="text-[7.5px] font-bold tracking-[0.2em] text-gold-300 uppercase -mt-0.5">
            PERFUMERÍA
          </span>
        </div>
      </div>
    );
  }

  // Horizontal default
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="w-11 h-11 rounded-full bg-emerald-950/80 border border-gold-400/50 flex items-center justify-center shadow-gold-glow shrink-0">
        <VecarEmblem className="w-8 h-7 text-gold-300" />
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-serif italic font-bold text-2xl sm:text-3xl text-white tracking-wide">
          Vecar
        </span>
        <div className="w-full h-[1px] bg-gold-400/50 my-0.5" />
        <span className="font-sans text-[9px] sm:text-[10px] font-bold tracking-[0.3em] text-gold-400 uppercase">
          PERFUMERÍA
        </span>
      </div>
    </div>
  );
};
