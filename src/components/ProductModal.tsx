"use client";

import React, { useState } from "react";
import { Producto } from "@/types/database";
import { 
  X, 
  Award, 
  Sparkles, 
  Plus, 
  MessageCircle, 
  Droplet, 
  Clock, 
  ShieldCheck, 
  Eye, 
  Layers 
} from "lucide-react";
import { BOTTLE_PRESENTATIONS, getPriceForSize, getBottleForSize } from "@/lib/bottleSizes";

interface ProductModalProps {
  producto: Producto | null;
  onClose: () => void;
  onAddToCart: (producto: Producto, presentacion_ml?: number, precio_unitario?: number) => void;
  onViewFlyer?: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  producto,
  onClose,
  onAddToCart,
  onViewFlyer,
}) => {
  const [selectedSize, setSelectedSize] = useState<10 | 30 | 50 | 100>(50);
  const [activeView, setActiveView] = useState<"inspiration" | "bottle">("inspiration");

  if (!producto) return null;

  const currentPrice = getPriceForSize(selectedSize);
  const selectedPresentation = getBottleForSize(selectedSize);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl max-h-[94vh] overflow-y-auto rounded-3xl glass-emerald border border-gold-400/40 p-4 sm:p-7 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 p-2 rounded-full text-gold-300 hover:text-white bg-emerald-950/70 border border-gold-400/20 hover:border-gold-300 transition-all z-20"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 items-start">
          
          {/* PRODUCT & BOTTLE IMAGE DUAL VIEW */}
          <div className="flex flex-col gap-2.5">
            <div className="relative aspect-square rounded-2xl overflow-hidden border border-gold-400/40 bg-emerald-950/90 shadow-inner group">
              {activeView === "inspiration" ? (
                <img
                  src={producto.imagen_url}
                  alt={producto.nombre}
                  className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.includes("unsplash")) {
                      target.src = "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80";
                    }
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center p-3 relative bg-gradient-to-b from-black/40 to-emerald-950/90">
                  <img
                    src={selectedPresentation.imagen_frasco}
                    alt={`Frasco real ${selectedPresentation.label}`}
                    className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-x-0 bottom-2 text-center pointer-events-none">
                    <span className="inline-block px-3 py-1 rounded-full text-[10px] font-semibold text-gold-200 bg-black/80 border border-gold-400/40 backdrop-blur-md">
                      📸 Foto Real: {selectedPresentation.formato}
                    </span>
                  </div>
                </div>
              )}

              {/* TOP BADGE */}
              <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-emerald-950 bg-gold-400 shadow-sm">
                  {producto.categoria}
                </span>
                <span className="px-2 py-0.5 rounded-md text-[9px] font-semibold text-gold-300 bg-black/75 border border-gold-400/30">
                  {activeView === "inspiration" ? "Inspiración Olfativa" : "Envase de Entrega"}
                </span>
              </div>

              {/* BOTTOM RIGHT PRICE BADGE */}
              <div className="absolute bottom-3 right-3 z-10">
                <span className="px-2.5 py-1 rounded-full text-[10.5px] font-mono font-bold text-white bg-black/80 border border-gold-400/40 backdrop-blur-sm shadow-md">
                  {selectedSize} ML • Bs. {currentPrice}
                </span>
              </div>
            </div>

            {/* DUAL PHOTO SELECTOR PILLS */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setActiveView("inspiration")}
                className={`py-1.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border ${
                  activeView === "inspiration"
                    ? "bg-gold-500/20 text-gold-300 border-gold-400 font-bold shadow-sm"
                    : "bg-emerald-950/60 text-gray-300 border-gold-400/20 hover:border-gold-400/40"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                <span>Inspiración Olfativa</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveView("bottle")}
                className={`py-1.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border ${
                  activeView === "bottle"
                    ? "bg-gold-500/20 text-gold-300 border-gold-400 font-bold shadow-sm"
                    : "bg-emerald-950/60 text-gray-300 border-gold-400/20 hover:border-gold-400/40"
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-gold-400" />
                <span>Frasco Real ({selectedSize}ml)</span>
              </button>
            </div>
          </div>

          {/* PRODUCT INFO & PRESENTATIONS */}
          <div className="space-y-3.5">
            <div>
              <span className="text-xs font-semibold tracking-widest uppercase text-gold-400">
                {producto.marca_casa}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-0.5">
                {producto.nombre}
              </h3>
              {producto.familia_olfativa && (
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider text-gold-300 bg-gold-500/15 border border-gold-400/30">
                  {producto.familia_olfativa}
                </span>
              )}
            </div>

            {/* QUALITY BULLETS (FROM CLIENT FLYER) */}
            <div className="grid grid-cols-2 gap-2 text-[10.5px] text-emerald-200/90 font-medium">
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-emerald-950/70 border border-gold-400/20">
                <Droplet className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                <div>
                  <span className="font-bold text-white block">40% Esencia Pura</span>
                  <span className="text-[9px] text-emerald-300/70">Máxima concentración</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-emerald-950/70 border border-gold-400/20">
                <Clock className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                <div>
                  <span className="font-bold text-white block">8 a 12 Horas</span>
                  <span className="text-[9px] text-emerald-300/70">Fijación en tu piel</span>
                </div>
              </div>
            </div>

            {/* OLFACTORY NOTES BREAKDOWN */}
            {producto.notas_olfativas && (
              <div className="p-2.5 rounded-xl bg-emerald-950/70 border border-gold-400/20">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-gold-300 mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-gold-400" />
                  <span>Notas Olfativas:</span>
                </h4>
                <div className="flex flex-wrap gap-1">
                  {producto.notas_olfativas.split(",").slice(0, 6).map((note, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[10.5px] font-medium text-emerald-100 bg-emerald-900/60 border border-emerald-700/50"
                    >
                      {note.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* BOTTLE PRESENTATION SELECTOR WITH MINIATURES */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gold-300">
                  Selecciona Tamaño y Frasco Real:
                </label>
                <span className="text-[10px] font-mono text-emerald-300/80">
                  {selectedPresentation.atomizaciones}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {BOTTLE_PRESENTATIONS.map((b) => {
                  const isSelected = selectedSize === b.ml;
                  return (
                    <button
                      key={b.ml}
                      type="button"
                      onClick={() => {
                        setSelectedSize(b.ml);
                        setActiveView("bottle");
                      }}
                      className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-between min-h-[90px] relative ${
                        isSelected
                          ? "bg-gold-500 text-emerald-950 border-gold-300 font-bold shadow-md ring-2 ring-gold-400/60 scale-[1.02]"
                          : "bg-emerald-950/70 text-gray-200 border-gold-400/30 hover:border-gold-300/80 hover:bg-emerald-900/60"
                      }`}
                    >
                      <div className="w-10 h-10 mb-1 flex items-center justify-center">
                        <img
                          src={b.imagen_frasco}
                          alt={b.label}
                          className="max-h-full max-w-full object-contain drop-shadow"
                        />
                      </div>
                      <span className="text-xs font-bold block leading-none">{b.label}</span>
                      <span className={`text-[10.5px] font-mono mt-0.5 block ${isSelected ? "text-emerald-950 font-black" : "text-gold-300"}`}>
                        Bs. {b.precio}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* SPEC DETAIL FOR SELECTED BOTTLE */}
              <div className="mt-2 p-2.5 rounded-xl bg-black/40 border border-gold-400/20 text-xs">
                <div className="flex items-center justify-between text-gold-300 font-semibold mb-0.5">
                  <span>Envase: {selectedPresentation.formato}</span>
                  <span className="text-[10px] text-gray-300 font-normal">Duración: {selectedPresentation.duracion_estimada}</span>
                </div>
                <p className="text-[11px] text-emerald-100/75 leading-relaxed">
                  {selectedPresentation.descripcion}
                </p>
              </div>
            </div>

            {/* LOYALTY PERK */}
            <div className="flex items-center gap-2 text-xs text-gold-300 bg-gold-400/10 p-2 rounded-xl border border-gold-400/20">
              <Award className="w-4 h-4 text-gold-400 shrink-0" />
              <span>Suma 1 Sello ({selectedSize} ML) para tu Tarjeta Vecar Club</span>
            </div>

            {/* PRICE & ACTIONS */}
            <div className="pt-2 border-t border-gold-400/20">
              <div className="flex items-baseline justify-between mb-2.5">
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
                  <span>Añadir {selectedSize} ML al Carrito (Bs. {currentPrice})</span>
                </button>

                <a
                  href={`https://wa.me/59175462800?text=${encodeURIComponent(
                    `Hola Vecar Perfumería, deseo consultar disponibilidad de: ${producto.nombre} en presentación de ${selectedSize} ML (Bs. ${currentPrice.toFixed(2)}).`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 rounded-full text-xs font-semibold text-center text-gold-300 bg-emerald-900/50 border border-gold-400/30 hover:bg-emerald-800/60 transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-gold-400" />
                  <span>Consultar por WhatsApp</span>
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
