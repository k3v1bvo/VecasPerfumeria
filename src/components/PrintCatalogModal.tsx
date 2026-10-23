"use client";

import React, { useState, useMemo } from "react";
import { Producto } from "@/types/database";
import { 
  X, 
  Printer, 
  FileDown, 
  Sparkles, 
  QrCode, 
  Phone, 
  MapPin, 
  Layers, 
  Check, 
  Droplet,
  Store,
  BookOpen
} from "lucide-react";
import { BOTTLE_PRESENTATIONS } from "@/lib/bottleSizes";
import { generatePdfCatalog } from "@/lib/pdfCatalogGenerator";
import { VecarEmblem } from "./VecarLogo";

interface PrintCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  productos: Producto[];
}

export const PrintCatalogModal: React.FC<PrintCatalogModalProps> = ({
  isOpen,
  onClose,
  productos,
}) => {
  const [printMode, setPrintMode] = useState<"lista_productos" | "mostrador_precios">("lista_productos");
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Filter products for printing
  const printableProducts = useMemo(() => {
    return productos.filter((p) => {
      if (!p.activo) return false;
      if (selectedCategory === "Todos") return true;
      if (selectedCategory === "Árabes") {
        return (
          p.marca_casa.toLowerCase().includes("lattafa") ||
          p.marca_casa.toLowerCase().includes("armaf") ||
          p.nombre.toLowerCase().includes("asad") ||
          p.nombre.toLowerCase().includes("yara") ||
          p.nombre.toLowerCase().includes("khamrah")
        );
      }
      return p.categoria === selectedCategory;
    });
  }, [productos, selectedCategory]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleLivePdfDownload = () => {
    setIsGeneratingPdf(true);
    try {
      generatePdfCatalog(printableProducts);
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setIsGeneratingPdf(false), 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* SCREEN VIEW (MODAL) */}
      <div 
        className="relative w-full max-w-5xl max-h-[94vh] flex flex-col rounded-3xl glass-emerald border border-gold-400/40 shadow-2xl overflow-hidden print:hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="p-4 sm:p-6 border-b border-gold-400/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-emerald-950/90">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-emerald-subtle border border-gold-400/30 mb-1.5">
              <Printer className="w-3.5 h-3.5 text-gold-400" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-gold-300 font-mono">
                Centro de Impresión y Catálogos Vecar
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Imprimir Catálogo & <span className="gold-text">Hojas de Mostrador</span>
            </h2>
            <p className="text-xs text-emerald-200/80 mt-0.5">
              Genera impresiones de alta definición para tu mostrador, catálogo anillado o listas para clientes.
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-emerald-950 bg-gold-gradient hover:bg-gold-gradient-hover shadow-gold-glow transition-all active:scale-95"
            >
              <Printer className="w-4 h-4 text-emerald-950" />
              <span>Imprimir Ahora (Ctrl + P)</span>
            </button>

            <button
              onClick={onClose}
              className="p-2.5 rounded-full text-gray-300 hover:text-white bg-emerald-950/70 border border-gold-400/20 hover:border-gold-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CONTROLS BAR */}
        <div className="p-4 bg-emerald-950/60 border-b border-gold-400/20 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* FORMAT TABS */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPrintMode("lista_productos")}
              className={`px-3.5 py-1.5 rounded-full font-semibold transition-all flex items-center gap-1.5 ${
                printMode === "lista_productos"
                  ? "bg-gold-500 text-emerald-950 font-bold shadow-sm"
                  : "bg-emerald-950/80 text-gray-300 border border-gold-400/20 hover:text-white"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Catálogo de Fragancias ({printableProducts.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setPrintMode("mostrador_precios")}
              className={`px-3.5 py-1.5 rounded-full font-semibold transition-all flex items-center gap-1.5 ${
                printMode === "mostrador_precios"
                  ? "bg-gold-500 text-emerald-950 font-bold shadow-sm"
                  : "bg-emerald-950/80 text-gray-300 border border-gold-400/20 hover:text-white"
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Lámina de Precios & Frascos (Mostrador)</span>
            </button>
          </div>

          {/* CATEGORY FILTER (WHEN IN PRODUCT LIST) */}
          {printMode === "lista_productos" && (
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-emerald-200/70 uppercase font-mono mr-1">Filtrar:</span>
              {["Todos", "Femenino", "Masculino", "Árabes"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                    selectedCategory === cat
                      ? "bg-gold-400/20 text-gold-300 border border-gold-400/60 font-bold"
                      : "text-gray-300 hover:text-white bg-black/30"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* DIRECT PDF DOWNLOADS */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLivePdfDownload}
              disabled={isGeneratingPdf}
              className="text-xs text-gold-300 hover:text-white flex items-center gap-1 underline underline-offset-2"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>{isGeneratingPdf ? "Generando..." : "Descargar PDF Digital"}</span>
            </button>
          </div>
        </div>

        {/* PRINT PREVIEW WINDOW (SCROLLABLE IN MODAL) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-zinc-900/60">
          <div className="max-w-4xl mx-auto bg-white text-zinc-900 p-6 sm:p-10 rounded-2xl shadow-2xl border border-zinc-200">
            
            {/* PREVIEW CONTENT */}
            {printMode === "mostrador_precios" ? (
              /* MOSTRADOR / FLYER OFICIAL A4 */
              <div className="space-y-6">
                {/* HEADER */}
                <div className="text-center border-b-2 border-amber-600 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <span className="text-xs tracking-widest uppercase font-mono font-bold text-amber-700 block">
                        VECAR PERFUMERÍA • COCHABAMBA
                      </span>
                      <h1 className="font-serif text-3xl font-black text-zinc-900 tracking-tight">
                        LISTA OFICIAL DE PRECIOS
                      </h1>
                      <p className="text-xs text-zinc-600 font-medium">
                        Fragancias con <strong className="text-amber-800">40% de Esencia Pura</strong> • Fijación de 8 a 12 Horas
                      </p>
                    </div>

                    <div className="text-right flex flex-col items-end">
                      <div className="w-16 h-16 bg-zinc-100 rounded-lg border border-zinc-300 flex items-center justify-center p-1">
                        <QrCode className="w-full h-full text-zinc-900" />
                      </div>
                      <span className="text-[9px] font-mono font-bold text-zinc-600 mt-1">
                        Escanea para Pedir por WhatsApp
                      </span>
                    </div>
                  </div>
                </div>

                {/* 4 BOTTLES GRID */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {BOTTLE_PRESENTATIONS.map((b) => (
                    <div
                      key={b.ml}
                      className="border-2 border-zinc-300 rounded-2xl p-3 text-center bg-zinc-50 flex flex-col justify-between"
                    >
                      <div className="h-32 flex items-center justify-center p-1 bg-white rounded-xl border border-zinc-200 mb-2">
                        <img
                          src={b.imagen_frasco}
                          alt={b.label}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>

                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase text-amber-700 block">
                          {b.tag}
                        </span>
                        <h3 className="font-serif text-2xl font-black text-zinc-900">
                          {b.label}
                        </h3>
                        <div className="my-1 py-1 rounded-lg bg-amber-50 border border-amber-300">
                          <span className="font-serif text-2xl font-black text-amber-900">
                            Bs. {b.precio}
                          </span>
                        </div>
                        <span className="text-[10.5px] font-semibold text-zinc-700 block">
                          {b.atomizaciones}
                        </span>
                        <span className="text-[9.5px] text-zinc-500 block">
                          {b.duracion_estimada}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* BOTTOM FEATURES */}
                <div className="grid grid-cols-4 gap-2 pt-2 border-t border-zinc-200 text-center text-[10px]">
                  <div className="p-2 rounded-lg bg-zinc-100 border border-zinc-200">
                    <strong className="block text-zinc-900">40% ESENCIA PURA</strong>
                    <span className="text-zinc-600">Máxima concentración</span>
                  </div>
                  <div className="p-2 rounded-lg bg-zinc-100 border border-zinc-200">
                    <strong className="block text-zinc-900">DURA MÁS</strong>
                    <span className="text-zinc-600">8 a 12 horas en piel</span>
                  </div>
                  <div className="p-2 rounded-lg bg-zinc-100 border border-zinc-200">
                    <strong className="block text-zinc-900">ENVASES DE LUJO</strong>
                    <span className="text-zinc-600">Atomizador plateado</span>
                  </div>
                  <div className="p-2 rounded-lg bg-zinc-100 border border-zinc-200">
                    <strong className="block text-zinc-900">VECAR CLUB</strong>
                    <span className="text-zinc-600">10 sellos = 1 perfume gratis</span>
                  </div>
                </div>

                {/* STORE FOOTER */}
                <div className="text-center pt-2 text-[10.5px] text-zinc-600 flex items-center justify-between border-t border-zinc-200">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-700" />
                    <span>Av. Heroínas entre Oquendo y 16 de Julio, Cochabamba</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-bold text-zinc-900">
                    <Phone className="w-3.5 h-3.5 text-amber-700" />
                    <span>WhatsApp: +591 75462800</span>
                  </div>
                </div>
              </div>
            ) : (
              /* LISTA COMPLETA DE PERFUMES IMPRIMIBLE */
              <div className="space-y-6">
                {/* PRINT HEADER */}
                <div className="border-b-2 border-zinc-900 pb-3 flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-widest text-amber-700 font-bold block">
                      VECAR PERFUMERÍA • CATÁLOGO OFICIAL 2026
                    </span>
                    <h1 className="font-serif text-2xl sm:text-3xl font-black text-zinc-900">
                      Colección de Fragancias ({selectedCategory})
                    </h1>
                    <p className="text-xs text-zinc-600 mt-0.5">
                      Mostrando {printableProducts.length} perfumes • 40% de Esencia Pura • Av. Heroínas, Cochabamba
                    </p>
                  </div>

                  {/* PRICE GUIDE TABLE ON TOP */}
                  <div className="border border-zinc-300 rounded-lg p-2 bg-zinc-50 text-right text-xs">
                    <span className="text-[9px] uppercase font-bold text-zinc-500 block mb-0.5">
                      Precios Oficiales Vecar:
                    </span>
                    <div className="flex items-center gap-2 font-mono font-bold text-[11px]">
                      <span>10ml: <strong>Bs. 40</strong></span>
                      <span>•</span>
                      <span>30ml: <strong>Bs. 70</strong></span>
                      <span>•</span>
                      <span className="text-amber-800 font-black">50ml: <strong>Bs. 90</strong></span>
                      <span>•</span>
                      <span>100ml: <strong>Bs. 145</strong></span>
                    </div>
                  </div>
                </div>

                {/* 2-COLUMN FRAGRANCE GRID (PRINT OPTIMIZED) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {printableProducts.map((p, idx) => (
                    <div
                      key={p.id}
                      className="border border-zinc-200 rounded-xl p-2.5 flex items-center gap-3 bg-zinc-50 break-inside-avoid"
                    >
                      <div className="w-14 h-14 rounded-lg overflow-hidden border border-zinc-300 bg-white shrink-0 flex items-center justify-center p-1">
                        <img
                          src={p.imagen_url}
                          alt={p.nombre}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[9.5px] font-mono font-bold uppercase text-amber-700 truncate">
                            {p.marca_casa}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-zinc-200 text-zinc-800 font-bold shrink-0">
                            #{idx + 1}
                          </span>
                        </div>
                        <h4 className="font-serif text-xs font-bold text-zinc-900 truncate">
                          {p.nombre}
                        </h4>
                        {p.familia_olfativa && (
                          <span className="text-[9px] text-zinc-500 block truncate">
                            Fam: {p.familia_olfativa}
                          </span>
                        )}
                        {p.notas_olfativas && (
                          <span className="text-[8.5px] text-zinc-400 block truncate">
                            {p.notas_olfativas}
                          </span>
                        )}
                      </div>

                      <div className="text-right shrink-0 pl-1 border-l border-zinc-200">
                        <span className="text-[10px] font-mono font-black text-zinc-900 block">
                          50ml: Bs. 90
                        </span>
                        <span className="text-[8.5px] text-zinc-500 block">
                          10ml: Bs. 40
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* FOOTER */}
                <div className="pt-4 border-t border-zinc-300 flex items-center justify-between text-[10px] text-zinc-600">
                  <span>Vecar Perfumería • Pedidos y Envíos Nacionales: WhatsApp +591 75462800</span>
                  <span>Página Impresa • {new Date().toLocaleDateString()}</span>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* ========================================================= */}
      {/* NATIVE PRINT STYLES (HIDDEN ON SCREEN, VISIBLE ON PRINT) */}
      {/* ========================================================= */}
      <div className="hidden print:block w-full text-black bg-white p-6">
        {printMode === "mostrador_precios" ? (
          <div className="space-y-6">
            <div className="text-center border-b-2 border-black pb-4 flex items-center justify-between">
              <div>
                <h1 className="font-serif text-3xl font-black tracking-tight">
                  VECAR PERFUMERÍA
                </h1>
                <p className="text-sm font-semibold">
                  LISTA OFICIAL DE PRECIOS & ENVASES • 40% ESENCIA PURA
                </p>
                <p className="text-xs text-gray-700">
                  Fijación de 8 a 12 Horas • Cochabamba, Bolivia
                </p>
              </div>
              <div className="text-right text-xs">
                <p className="font-bold">WhatsApp: +591 75462800</p>
                <p>Av. Heroínas e/ Oquendo y 16 de Julio</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 pt-4">
              {BOTTLE_PRESENTATIONS.map((b) => (
                <div key={b.ml} className="border-2 border-black rounded-xl p-3 text-center">
                  <div className="h-32 flex items-center justify-center mb-2">
                    <img src={b.imagen_frasco} alt={b.label} className="max-h-full max-w-full object-contain" />
                  </div>
                  <h3 className="text-2xl font-black">{b.label}</h3>
                  <p className="text-3xl font-black my-1">Bs. {b.precio}</p>
                  <p className="text-xs font-bold">{b.atomizaciones}</p>
                  <p className="text-[10px] text-gray-700">{b.duracion_estimada}</p>
                </div>
              ))}
            </div>

            <div className="border-t-2 border-black pt-4 text-center text-xs font-bold">
              Cada compra acumula sellos para tu Tarjeta Vecar Club: ¡Al completar 10 sellos te llevas 1 perfume de 50ml GRATIS!
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="border-b-2 border-black pb-2 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black font-serif">VECAR PERFUMERÍA — CATÁLOGO</h1>
                <p className="text-xs font-bold">40% Esencia Pura • Colección: {selectedCategory} ({printableProducts.length} perfumes)</p>
              </div>
              <div className="text-right text-xs">
                <p className="font-bold">Precios: 10ml Bs. 40 | 30ml Bs. 70 | 50ml Bs. 90 | 100ml Bs. 145</p>
                <p>Pedidos WhatsApp: +591 75462800</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {printableProducts.map((p, idx) => (
                <div key={p.id} className="border border-gray-400 rounded p-2 flex items-center gap-2 break-inside-avoid">
                  <div className="w-12 h-12 border border-gray-300 shrink-0 flex items-center justify-center p-0.5">
                    <img src={p.imagen_url} alt={p.nombre} className="max-h-full max-w-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-[9px] font-bold text-gray-700 uppercase">{p.marca_casa} • #{idx + 1}</p>
                    <p className="font-serif font-bold text-xs truncate">{p.nombre}</p>
                    <p className="text-[9px] text-gray-600 truncate">{p.familia_olfativa || p.categoria}</p>
                  </div>
                  <div className="text-right font-mono font-bold text-[10px] shrink-0">
                    <span>Bs. 90</span>
                    <span className="text-[8px] text-gray-500 block">50 ml</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
