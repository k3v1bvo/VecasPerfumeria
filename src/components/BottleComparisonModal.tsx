"use client";

import React, { useState } from "react";
import { X, Sparkles, Award, Droplet, Clock, Check, Eye, Maximize2, ShieldCheck } from "lucide-react";
import { BOTTLE_PRESENTATIONS } from "@/lib/bottleSizes";

interface BottleComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSize?: (ml: 10 | 30 | 50 | 100) => void;
}

export const BottleComparisonModal: React.FC<BottleComparisonModalProps> = ({
  isOpen,
  onClose,
  onSelectSize,
}) => {
  const [activeTab, setActiveTab] = useState<"comparador" | "flyer">("comparador");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl glass-emerald border border-gold-400/40 p-5 sm:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full text-gold-300 hover:text-white bg-emerald-950/70 border border-gold-400/20 hover:border-gold-300 transition-all z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* HEADER */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-emerald-subtle border border-gold-400/30 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-gold-300 font-mono">
              Vecar Perfumería • Envases Oficiales de Entrega
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Guía de <span className="gold-text">Frascos y Presentaciones</span>
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/70 mt-1 max-w-2xl">
            Todos nuestros envases son de cristal de importación de alta densidad con <strong>atomizadores plateados herméticos de micro-difusión</strong>. Cada frasco se llena con <strong>40% de esencia pura</strong> garantizando entre 8 y 12 horas de duración.
          </p>
        </div>

        {/* TABS SWITCHER */}
        <div className="flex items-center gap-2 mb-6 border-b border-gold-400/20 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab("comparador")}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === "comparador"
                ? "bg-gold-500 text-emerald-950 shadow-gold-glow scale-102"
                : "bg-emerald-950/60 text-gray-300 hover:text-white border border-gold-400/20"
            }`}
          >
            <span>💎 Comparador de Frascos (4 Tamaños)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("flyer")}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === "flyer"
                ? "bg-gold-500 text-emerald-950 shadow-gold-glow scale-102"
                : "bg-emerald-950/60 text-gray-300 hover:text-white border border-gold-400/20"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>📜 Flyer Oficial de Precios en Alta Calidad</span>
          </button>
        </div>

        {/* TAB 1: COMPARADOR DE FRASCOS */}
        {activeTab === "comparador" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {BOTTLE_PRESENTATIONS.map((b) => (
                <div
                  key={b.ml}
                  className={`p-4 rounded-2xl glass-emerald-subtle border flex flex-col justify-between transition-all duration-300 relative group hover:border-gold-400 ${
                    b.ml === 50
                      ? "border-gold-400 ring-2 ring-gold-400/40 bg-gradient-to-b from-gold-400/10 to-transparent"
                      : "border-gold-400/30"
                  }`}
                >
                  {b.ml === 50 && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-gold-400 text-emerald-950 shadow-gold-glow">
                        Más Vendido
                      </span>
                    </div>
                  )}

                  <div>
                    {/* PHOTO OF REAL BOTTLE */}
                    <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-black/40 border border-gold-400/20 mb-3 flex items-center justify-center p-2 group-hover:scale-105 transition-transform duration-300">
                      <img
                        src={b.imagen_frasco}
                        alt={`Frasco Vecar ${b.label}`}
                        className="max-h-full max-w-full object-contain drop-shadow-xl"
                      />
                    </div>

                    {/* HEADER */}
                    <div className="text-center mb-3">
                      <span className="text-[10px] font-mono tracking-widest uppercase text-emerald-300 font-bold block">
                        {b.tag}
                      </span>
                      <h3 className="font-serif text-2xl font-black text-white">
                        {b.label}
                      </h3>
                      <span className="font-serif text-2xl font-bold text-gold-300 block my-1">
                        Bs. {b.precio}
                      </span>
                      <span className="inline-block text-[10px] text-gray-300 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-gold-400/20">
                        {b.formato}
                      </span>
                    </div>

                    {/* SPECS */}
                    <div className="space-y-1.5 text-xs border-t border-gold-400/20 pt-2.5 mb-3">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-emerald-200/70">Atomizaciones:</span>
                        <span className="font-mono font-bold text-gold-200">{b.atomizaciones}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-emerald-200/70">Duración Aprox:</span>
                        <span className="font-semibold text-white">{b.duracion_estimada}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-emerald-200/70">Esencia Pura:</span>
                        <span className="font-bold text-gold-300">40%</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-emerald-100/70 italic leading-snug mb-3">
                      "{b.descripcion}"
                    </p>
                  </div>

                  {/* ACTION */}
                  {onSelectSize && (
                    <button
                      type="button"
                      onClick={() => {
                        onSelectSize(b.ml);
                        onClose();
                      }}
                      className="w-full py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-emerald-950 bg-gold-400 hover:bg-gold-300 transition-colors shadow-sm"
                    >
                      Elegir {b.label}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* QUALITY GUARANTEE FOOTER */}
            <div className="p-4 rounded-2xl bg-emerald-950/80 border border-gold-400/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-gold-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Garantía de Satisfacción Vecar
                  </h4>
                  <p className="text-[11px] text-emerald-200/70">
                    Atomizadores herméticos que previenen la evaporación del alcohol perfumero. Conserva la intensidad olfativa por más de 2 años.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-gold-300 shrink-0">
                <Award className="w-4 h-4 text-gold-400" />
                <span>Tarjeta Vecar Club: 10 sellos = 1 perfume 50ml gratis</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FLYER OFICIAL */}
        {activeTab === "flyer" && (
          <div className="flex flex-col items-center space-y-4">
            <div className="relative max-w-lg w-full rounded-2xl overflow-hidden border-2 border-gold-400 shadow-2xl bg-black">
              <img
                src="/frascos/flyer_precios_oficial.png"
                alt="Flyer Oficial de Precios Vecar Perfumería"
                className="w-full h-auto object-contain"
              />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href="/frascos/flyer_precios_oficial.png"
                download="Flyer_Precios_Oficial_Vecar_Perfumeria.png"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-emerald-950 bg-gold-gradient hover:bg-gold-gradient-hover shadow-gold-glow transition-all active:scale-95"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Descargar Flyer Oficial (PNG Alta Calidad)</span>
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
