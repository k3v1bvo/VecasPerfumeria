"use client";

import React from "react";
import { Producto } from "@/types/database";
import { X, Award, Sparkles, Plus, Check, MessageCircle } from "lucide-react";

interface ProductModalProps {
  producto: Producto | null;
  onClose: () => void;
  onAddToCart: (producto: Producto) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  producto,
  onClose,
  onAddToCart,
}) => {
  if (!producto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl glass-emerald border border-gold-400/40 p-6 sm:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-gold-300 hover:text-white bg-emerald-950/70 border border-gold-400/20 hover:border-gold-300 transition-all z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          
          {/* PRODUCT IMAGE */}
          <div className="relative aspect-square rounded-2xl overflow-hidden border border-gold-400/40 bg-emerald-950 shadow-inner">
            <img
              src={producto.imagen_url}
              alt={producto.nombre}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-emerald-950 bg-gold-400 shadow-sm">
                {producto.categoria}
              </span>
            </div>
            <div className="absolute bottom-3 right-3">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white bg-black/70 border border-white/20 backdrop-blur-sm">
                {producto.volumen_ml} ml
              </span>
            </div>
          </div>

          {/* PRODUCT INFO */}
          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold tracking-widest uppercase text-gold-400">
                {producto.marca_casa}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
                {producto.nombre}
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-gray-200 font-light leading-relaxed">
              {producto.descripcion}
            </p>

            {/* OLFACTORY NOTES BREAKDOWN */}
            {producto.notas_olfativas && (
              <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-gold-400/20">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-gold-300 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                  <span>Notas Olfativas Principales:</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {producto.notas_olfativas.split(",").map((note, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium text-emerald-100 bg-emerald-900/60 border border-emerald-700/50"
                    >
                      {note.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* LOYALTY PERK */}
            <div className="flex items-center gap-2 text-xs text-gold-300">
              <Award className="w-4 h-4 text-gold-400" />
              <span>Incluye 1 Sello para tu tarjeta Vecar Club</span>
            </div>

            {/* PRICE & ACTIONS */}
            <div className="pt-2 border-t border-gold-400/20">
              <div className="flex items-baseline justify-between mb-3">
                <span className="text-xs text-emerald-200/70 uppercase">Precio</span>
                <span className="font-serif text-2xl font-bold text-gold-300">
                  Bs. {producto.precio_venta.toFixed(2)}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    onAddToCart(producto);
                    onClose();
                  }}
                  className="w-full py-3 rounded-full text-xs font-bold uppercase tracking-wider text-emerald-950 bg-gold-gradient hover:bg-gold-gradient-hover shadow-gold-glow flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Añadir al Carrito</span>
                </button>

                <a
                  href={`https://wa.me/59175462800?text=${encodeURIComponent(
                    `Hola Vecar Perfumería, deseo consultar disponibilidad de: ${producto.nombre} (${producto.marca_casa}) a Bs. ${producto.precio_venta.toFixed(2)}.`
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
