"use client";

import React from "react";
import { Sparkles, ArrowRight, Flame, Heart, Compass, Crown } from "lucide-react";

interface BentoShowcaseProps {
  onSelectCategory: (category: string) => void;
}

export const BentoShowcase: React.FC<BentoShowcaseProps> = ({ onSelectCategory }) => {
  return (
    <section className="w-full py-14 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-emerald-subtle border border-gold-400/30 mb-3">
            <Crown className="w-3.5 h-3.5 text-gold-400" />
            <span className="text-xs font-semibold tracking-widest uppercase text-gold-300">
              Universos Olfativos
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Descubre por <span className="gold-text">Colecciones</span>
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/70 mt-2 font-light">
            Explora las familias de fragancias más codiciadas de nuestra selección en 50 ml.
          </p>
        </div>

        {/* BENTO GRID (Inspired by Option 6 & Option 7) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6">
          
          {/* 1. FRAGANCIAS ÁRABES (Featured Wide Card) */}
          <div
            onClick={() => onSelectCategory("Árabes")}
            className="md:col-span-7 group relative rounded-3xl overflow-hidden glass-emerald border border-gold-400/30 p-7 sm:p-8 flex flex-col justify-between min-h-[320px] cursor-pointer hover:border-gold-400/70 hover:shadow-gold-glow transition-all duration-500 transform hover:-translate-y-1"
          >
            {/* Background Image with warm amber tint */}
            <div className="absolute inset-0 z-0">
              <img
                src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=80"
                alt="Colección Árabes"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-30 group-hover:opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#04110d] via-[#061c16]/90 to-transparent" />
            </div>

            <div className="relative z-10 space-y-2 max-w-md">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase text-emerald-950 bg-gold-400">
                <Flame className="w-3 h-3 text-emerald-950" />
                <span>Tendencia Mundial 2026</span>
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white group-hover:text-gold-200 transition-colors">
                Colección Árabes & Gourmand
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
                Opulencia oriental, especias nobles, café recién tostado y madera de Oud. Fragancias de proyección extrema que no pasan desapercibidas.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] text-gold-300 bg-emerald-950/80 border border-gold-400/30">
                  Café & Canela
                </span>
                <span className="px-2.5 py-0.5 rounded text-[10px] text-gold-300 bg-emerald-950/80 border border-gold-400/30">
                  Oud Noble
                </span>
                <span className="px-2.5 py-0.5 rounded text-[10px] text-gold-300 bg-emerald-950/80 border border-gold-400/30">
                  Haba Tonka
                </span>
              </div>
            </div>

            <div className="relative z-10 pt-6 flex items-center justify-between border-t border-gold-400/20">
              <span className="text-xs font-semibold text-gold-300 uppercase tracking-wider flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                <span>Explorar Fragancias Árabes</span>
                <ArrowRight className="w-4 h-4" />
              </span>
              <span className="text-[11px] font-mono text-emerald-300/80">
                Lattafa • Armaf • 50 ml
              </span>
            </div>
          </div>

          {/* 2. COLECCIÓN FEMENINA */}
          <div
            onClick={() => onSelectCategory("Femenino")}
            className="md:col-span-5 group relative rounded-3xl overflow-hidden glass-emerald border border-gold-400/30 p-7 sm:p-8 flex flex-col justify-between min-h-[320px] cursor-pointer hover:border-gold-400/70 hover:shadow-gold-glow transition-all duration-500 transform hover:-translate-y-1"
          >
            <div className="absolute inset-0 z-0">
              <img
                src="https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80"
                alt="Colección Femenina"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-25 group-hover:opacity-35"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#04110d] via-[#061c16]/90 to-transparent" />
            </div>

            <div className="relative z-10 space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase text-white bg-pink-900/80 border border-pink-400/40">
                <Heart className="w-3 h-3 text-pink-300" />
                <span>Seducción Aterciopelada</span>
              </span>
              <h3 className="font-serif text-2xl font-bold text-white group-hover:text-gold-200 transition-colors">
                Colección Femenina
              </h3>
              <p className="text-xs text-gray-300 font-light leading-relaxed">
                Rosas de Turquía, algodón de azúcar, lichi jugoso y nubes cremosas de vainilla delicada.
              </p>
            </div>

            <div className="relative z-10 pt-4 flex items-center justify-between border-t border-gold-400/20">
              <span className="text-xs font-semibold text-gold-300 uppercase tracking-wider flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                <span>Ver Perfumes</span>
                <ArrowRight className="w-4 h-4" />
              </span>
              <span className="text-[11px] font-mono text-emerald-300/80">Yara • Delina</span>
            </div>
          </div>

          {/* 3. COLECCIÓN MASCULINA */}
          <div
            onClick={() => onSelectCategory("Masculino")}
            className="md:col-span-6 group relative rounded-3xl overflow-hidden glass-emerald border border-gold-400/30 p-7 sm:p-8 flex flex-col justify-between min-h-[300px] cursor-pointer hover:border-gold-400/70 hover:shadow-gold-glow transition-all duration-500 transform hover:-translate-y-1"
          >
            <div className="absolute inset-0 z-0">
              <img
                src="https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80"
                alt="Colección Masculina"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-25 group-hover:opacity-35"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#04110d] via-[#061c16]/90 to-transparent" />
            </div>

            <div className="relative z-10 space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase text-emerald-950 bg-emerald-400">
                <Compass className="w-3 h-3 text-emerald-950" />
                <span>Carácter & Distinción</span>
              </span>
              <h3 className="font-serif text-2xl font-bold text-white group-hover:text-gold-200 transition-colors">
                Colección Masculina
              </h3>
              <p className="text-xs text-gray-300 font-light leading-relaxed">
                Salida de piña ahumada, abedul negro, lavanda francesa y fondos ambarados de máxima permanencia.
              </p>
            </div>

            <div className="relative z-10 pt-4 flex items-center justify-between border-t border-gold-400/20">
              <span className="text-xs font-semibold text-gold-300 uppercase tracking-wider flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                <span>Ver Masculinos</span>
                <ArrowRight className="w-4 h-4" />
              </span>
              <span className="text-[11px] font-mono text-emerald-300/80">Club de Nuit • Sauvage</span>
            </div>
          </div>

          {/* 4. COLECCIÓN UNISEX & NICHO */}
          <div
            onClick={() => onSelectCategory("Unisex")}
            className="md:col-span-6 group relative rounded-3xl overflow-hidden glass-emerald border border-gold-400/30 p-7 sm:p-8 flex flex-col justify-between min-h-[300px] cursor-pointer hover:border-gold-400/70 hover:shadow-gold-glow transition-all duration-500 transform hover:-translate-y-1"
          >
            <div className="absolute inset-0 z-0">
              <img
                src="https://images.unsplash.com/photo-1587017539504-67cfbddac569?auto=format&fit=crop&w=800&q=80"
                alt="Colección Unisex"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-25 group-hover:opacity-35"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#04110d] via-[#061c16]/90 to-transparent" />
            </div>

            <div className="relative z-10 space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase text-emerald-950 bg-gold-gradient shadow-sm">
                <Sparkles className="w-3 h-3 text-emerald-950" />
                <span>Alta Gama Cristalina</span>
              </span>
              <h3 className="font-serif text-2xl font-bold text-white group-hover:text-gold-200 transition-colors">
                Colección Unisex & Joyas Nicho
              </h3>
              <p className="text-xs text-gray-300 font-light leading-relaxed">
                Jazmín grandiflorum, azafrán rojo y ámbar gris con una dulzura mineral etérea para gustos verdaderamente exclusivos.
              </p>
            </div>

            <div className="relative z-10 pt-4 flex items-center justify-between border-t border-gold-400/20">
              <span className="text-xs font-semibold text-gold-300 uppercase tracking-wider flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                <span>Ver Unisex</span>
                <ArrowRight className="w-4 h-4" />
              </span>
              <span className="text-[11px] font-mono text-emerald-300/80">Baccarat Rouge 540</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
