"use client";

import React, { useState } from "react";
import { Producto } from "@/types/database";
import { X, Award, Sparkles, Plus, Check, MessageCircle, Droplet, Clock, ShieldCheck } from "lucide-react";
import { BOTTLE_PRESENTATIONS, getPriceForSize } from "@/lib/bottleSizes";

interface ProductModalProps {
  producto: Producto | null;
  onClose: () => void;
  onAddToCart: (producto: Producto, presentacion_ml?: number, precio_unitario?: number) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  producto,
  onClose,
  onAddToCart,
}) => {
  const [selectedSize, setSelectedSize] = useState<10 | 30 | 50 | 100>(50);

  if (!producto) return null;

  const currentPrice = getPriceForSize(selectedSize);
  const selectedPresentation = BOTTLE_PRESENTATIONS.find((b) => b.ml === selectedSize) || BOTTLE_PRESENTATIONS[2];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl glass-emerald border border-gold-400/40 p-6 sm:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-gold-300 hover:text-white bg-emerald-950/70 border border-gold-400/20 hover:border-gold-300 transition-all z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          
          {/* PRODUCT IMAGE (REAL FROM CATALOG) */}
          <div className="relative aspect-square rounded-2xl overflow-hidden border border-gold-400/40 bg-emerald-950 shadow-inner group">
            <img
              src={producto.imagen_url}
              alt={producto.nombre}
              className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-3 left-3">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-emerald-950 bg-gold-400 shadow-sm">
                {producto.categoria}
              </span>
            </div>
            <div className="absolute bottom-3 right-3">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white bg-black/75 border border-gold-400/30 backdrop-blur-sm">
                {selectedSize} ML
              </span>
            </div>
          </div>

          {/* PRODUCT INFO */}
          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold tracking-widest uppercase text-gold-400">
                {producto.marca_casa}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-0.5">
                {producto.nombre}
              </h3>
              {producto.familia_olfativa && (
                <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider text-gold-300 bg-gold-500/15 border border-gold-400/30">
                  {producto.familia_olfativa}
                </span>
              )}
            </div>

            {/* QUALITY BULLETS (FROM CLIENT LIST) */}
            <div className="grid grid-cols-2 gap-2 text-[10.5px] text-emerald-200/90 font-medium">
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-emerald-950/70 border border-gold-400/20">
                <Droplet className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                <span>40% Esencia Pura</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-emerald-950/70 border border-gold-400/20">
                <Clock className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                <span>8 a 12 hrs en Piel</span>
              </div>
            </div>

            {/* OLFACTORY NOTES BREAKDOWN */}
            {producto.notas_olfativas && (
              <div className="p-3 rounded-xl bg-emerald-950/70 border border-gold-400/20">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-gold-300 mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-gold-400" />
                  <span>Notas Olfativas:</span>
                </h4>
                <div className="flex flex-wrap gap-1">
                  {producto.notas_olfativas.split(",").slice(0, 6).map((note, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[11px] font-medium text-emerald-100 bg-emerald-900/60 border border-emerald-700/50"
                    >
                      {note.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* BOTTLE PRESENTATION SELECTOR (OFFICIAL SIZES & PRICES) */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-gold-300 block mb-2">
                Selecciona la Presentación / Frasco:
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {BOTTLE_PRESENTATIONS.map((b) => {
                  const isSelected = selectedSize === b.ml;
                  return (
                    <button
                      key={b.ml}
                      type="button"
                      onClick={() => setSelectedSize(b.ml)}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        isSelected
                          ? "bg-gold-500 text-emerald-950 border-gold-300 font-bold shadow-md ring-2 ring-gold-400/50"
                          : "bg-emerald-950/70 text-gray-200 border-gold-400/30 hover:border-gold-300"
                      }`}
                    >
                      <span className="text-xs font-bold block">{b.label}</span>
                      <span className={`text-[10px] font-mono mt-0.5 block ${isSelected ? "text-emerald-950 font-extrabold" : "text-gold-300"}`}>
                        Bs. {b.precio}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[10.5px] text-emerald-200/70 mt-1.5">
                {selectedPresentation.descripcion}
              </p>
            </div>

            {/* LOYALTY PERK */}
            <div className="flex items-center gap-2 text-xs text-gold-300">
              <Award className="w-4 h-4 text-gold-400 shrink-0" />
              <span>Suma 1 Sello ({selectedSize} ML) para tu Tarjeta Vecar Club</span>
            </div>

            {/* PRICE & ACTIONS */}
            <div className="pt-2 border-t border-gold-400/20">
              <div className="flex items-baseline justify-between mb-3">
                <span className="text-xs text-emerald-200/70 uppercase">Precio Total</span>
                <span className="font-serif text-3xl font-bold text-gold-300">
                  Bs. {currentPrice.toFixed(2)}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    onAddToCart(producto, selectedSize, currentPrice);
                    onClose();
                  }}
                  className="w-full py-3 rounded-full text-xs font-bold uppercase tracking-wider text-emerald-950 bg-gold-gradient hover:bg-gold-gradient-hover shadow-gold-glow flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4 text-emerald-950" />
                  <span>Añadir {selectedSize} ML al Carrito</span>
                </button>

                <a
                  href={`https://wa.me/59175462800?text=${encodeURIComponent(
                    `Hola Vecar Perfumería, deseo consultar disponibilidad de: ${producto.nombre} en presentación de ${selectedSize} ML (Bs. ${currentPrice.toFixed(2)}).`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-full text-xs font-semibold text-center text-gold-300 bg-emerald-900/50 border border-gold-400/30 hover:bg-emerald-800/60 transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-gold-400" />
                  <span>Preguntar por WhatsApp</span>
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
