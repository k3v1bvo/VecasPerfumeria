"use client";

import React, { useState } from "react";
import { Sparkles, Award, Star } from "lucide-react";

interface WaxSealBadgeProps {
  onOpenClubModal?: () => void;
}

export const WaxSealBadge: React.FC<WaxSealBadgeProps> = ({ onOpenClubModal }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onOpenClubModal}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="cursor-pointer group relative inline-flex items-center justify-center p-2"
      title="Programa de Fidelidad Vecar Club: 10 sellos = 1 perfume de 50ml gratis"
    >
      {/* Glow aura */}
      <div className="absolute inset-0 rounded-full bg-gold-400/20 blur-xl group-hover:bg-gold-400/40 transition-all duration-500 transform group-hover:scale-125" />

      {/* Outer Wavy / Scalloped Gold Medallion */}
      <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-full p-2 bg-gradient-to-tr from-[#99701d] via-[#f7e6a7] to-[#aa811d] shadow-2xl shadow-black/70 border border-gold-300 transform group-hover:scale-105 group-hover:rotate-3 transition-all duration-500">
        
        {/* Scalloped teeth pattern overlay */}
        <div className="absolute inset-0 rounded-full border-4 border-dashed border-[#aa811d]/60 opacity-80 animate-spin-slow pointer-events-none" />

        {/* Inner Gold Disk with Relief Shadow */}
        <div className="w-full h-full rounded-full bg-gradient-to-b from-[#f9ebbe] via-[#d4af37] to-[#8d6915] p-1.5 flex items-center justify-center shadow-inner">
          
          {/* Deep Embossed Center Circle */}
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#7c5b14] via-[#b89028] to-[#60450e] border-2 border-gold-200/80 flex flex-col items-center justify-center p-2 text-center shadow-2xl relative overflow-hidden">
            
            {/* Ambient Shine Light Sweep */}
            <div className="absolute -inset-full bg-gradient-to-tr from-transparent via-white/40 to-transparent transform rotate-45 group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

            {/* Stars Arc */}
            <div className="flex items-center gap-0.5 text-gold-200 mb-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-3 h-3 fill-gold-200 text-gold-100 drop-shadow-sm" />
              ))}
            </div>

            {/* Center Text */}
            <span className="font-serif text-[11px] sm:text-xs font-black tracking-[0.2em] uppercase text-white drop-shadow-[0_1.5px_1.5px_rgba(0,0,0,0.8)] leading-tight">
              SELLO DE
            </span>
            <span className="font-serif text-xs sm:text-sm font-black tracking-[0.2em] uppercase text-gold-100 drop-shadow-[0_2px_2px_rgba(0,0,0,0.9)]">
              FIDELIDAD
            </span>

            {/* Subtext */}
            <div className="mt-1 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/40 border border-gold-300/40">
              <Sparkles className="w-2.5 h-2.5 text-gold-300" />
              <span className="text-[8px] font-bold tracking-wider uppercase text-gold-200">
                10 = 50ml Gratis
              </span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
