"use client";

import React, { useState, useMemo } from "react";
import { Producto } from "@/types/database";
import { Search, FileDown, Plus, Check, Sparkles, Filter, Award, Eye } from "lucide-react";
import { generatePdfCatalog } from "@/lib/pdfCatalogGenerator";

interface CatalogProps {
  productos: Producto[];
  onAddToCart: (producto: Producto) => void;
  onOpenProductModal: (producto: Producto) => void;
}

export const Catalog: React.FC<CatalogProps> = ({
  productos,
  onAddToCart,
  onOpenProductModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false);
  const [addedId, setAddedId] = useState<string | null>(null);

  const categories = ["Todos", "Árabes", "Masculino", "Femenino", "Unisex"];

  // Filter products based on category and search query
  const filteredProducts = useMemo(() => {
    return productos.filter((p) => {
      if (!p.activo) return false;
      const matchesCategory =
        selectedCategory === "Todos" || p.categoria === selectedCategory;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        p.nombre.toLowerCase().includes(q) ||
        p.marca_casa.toLowerCase().includes(q) ||
        (p.notas_olfativas && p.notas_olfativas.toLowerCase().includes(q)) ||
        (p.descripcion && p.descripcion.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [productos, selectedCategory, searchQuery]);

  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true);
    try {
      generatePdfCatalog(filteredProducts.length > 0 ? filteredProducts : productos);
    } catch (e) {
      console.error("Error generating PDF", e);
    } finally {
      setTimeout(() => setIsDownloadingPdf(false), 1200);
    }
  };

  const handleAdd = (producto: Producto) => {
    onAddToCart(producto);
    setAddedId(producto.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <section id="catalogo" className="w-full py-16 sm:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-emerald-subtle border border-gold-400/25 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span className="text-xs font-semibold tracking-widest uppercase text-gold-300">
                Selección de Alta Gama
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Catálogo de <span className="gold-text">Fragancias</span>
            </h2>
            <p className="text-emerald-100/70 text-sm sm:text-base mt-2 max-w-xl font-light">
              Explora nuestra cuidada colección en presentación de 50 ml. Cada compra acumula sellos digitales en Vecar Club.
            </p>
          </div>

          {/* DESCARGAR CATÁLOGO PDF (Feature estrella del Plan Económico) */}
          <button
            onClick={handleDownloadPdf}
            disabled={isDownloadingPdf}
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold tracking-wider uppercase text-emerald-950 bg-gold-gradient hover:bg-gold-gradient-hover shadow-gold-glow transition-all duration-300 active:scale-95 disabled:opacity-70 shrink-0"
          >
            <FileDown className={`w-4 h-4 ${isDownloadingPdf ? "animate-bounce" : ""}`} />
            <span>
              {isDownloadingPdf ? "Generando PDF..." : "Descargar Catálogo PDF"}
            </span>
          </button>
        </div>

        {/* CONTROLS: CATEGORIES & SEARCH BAR */}
        <div className="p-4 sm:p-5 rounded-2xl glass-emerald border border-gold-400/20 mb-10 flex flex-col lg:flex-row gap-4 items-center justify-between">
          
          {/* CATEGORY TABS */}
          <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium tracking-wide transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-gold-500 text-emerald-950 font-bold shadow-md"
                    : "text-gray-300 hover:text-white bg-emerald-950/60 border border-gold-500/20 hover:border-gold-400/40"
                }`}
              >
                {cat === "Árabes" ? "Árabes / Tendencia" : cat}
              </button>
            ))}
          </div>

          {/* SEARCH INPUT */}
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-400/70" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por aroma, notas, casa..."
              className="w-full pl-10 pr-4 py-2 rounded-full text-xs sm:text-sm bg-emerald-950/90 border border-gold-400/30 text-white placeholder-emerald-200/40 focus:outline-none focus:border-gold-400 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gold-300/70 hover:text-gold-200"
              >
                Limpiar
              </button>
            )}
          </div>

        </div>

        {/* RESULTS COUNT */}
        <div className="flex items-center justify-between mb-6 text-xs text-emerald-200/70">
          <span>
            Mostrando <strong className="text-gold-300 font-semibold">{filteredProducts.length}</strong> fragancias disponibles
          </span>
          {searchQuery && (
            <span>
              Filtrado por: &ldquo;<span className="text-white">{searchQuery}</span>&rdquo;
            </span>
          )}
        </div>

        {/* PRODUCT GRID */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl glass-emerald border border-gold-400/20">
            <p className="font-serif text-2xl text-gold-200">No encontramos fragancias con ese criterio</p>
            <p className="text-sm text-gray-400 mt-2">Intenta buscar otra nota olfativa (ej. Vainilla, Café, Oud) o cambia la categoría.</p>
            <button
              onClick={() => { setSelectedCategory("Todos"); setSearchQuery(""); }}
              className="mt-5 px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider text-emerald-950 bg-gold-400 hover:bg-gold-300 transition-all"
            >
              Ver todas las fragancias
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7">
            {filteredProducts.map((producto) => (
              <div
                key={producto.id}
                className="group rounded-2xl glass-emerald border border-gold-400/25 overflow-hidden flex flex-col justify-between hover:border-gold-400/60 hover:shadow-gold-glow transition-all duration-300 transform hover:-translate-y-1"
              >
                <div>
                  {/* IMAGE & BADGES CONTAINER */}
                  <div className="relative aspect-square w-full overflow-hidden bg-emerald-950/80">
                    <img
                      src={producto.imagen_url}
                      alt={producto.nombre}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-transparent to-black/30 pointer-events-none" />

                    {/* TOP BADGES */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase text-emerald-950 bg-gold-400 shadow-sm">
                        {producto.categoria}
                      </span>
                      {producto.destacado && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase text-gold-200 bg-emerald-900/90 border border-gold-400/40">
                          Top Trend
                        </span>
                      )}
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white bg-black/60 border border-white/20 backdrop-blur-md">
                        {producto.volumen_ml} ml
                      </span>
                    </div>

                    {/* QUICK VIEW BUTTON OVERLAY */}
                    <button
                      onClick={() => onOpenProductModal(producto)}
                      className="absolute bottom-3 right-3 p-2 rounded-full bg-emerald-900/90 border border-gold-400/40 text-gold-300 hover:text-white hover:bg-emerald-800 transition-all opacity-0 group-hover:opacity-100 shadow-lg"
                      title="Ver notas y detalles"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>

                  {/* CONTENT */}
                  <div className="p-5">
                    <p className="text-[11px] font-medium tracking-widest uppercase text-gold-400/90">
                      {producto.marca_casa}
                    </p>
                    <h3 
                      onClick={() => onOpenProductModal(producto)}
                      className="font-serif text-lg font-bold text-white mt-1 group-hover:text-gold-200 transition-colors line-clamp-1 cursor-pointer"
                    >
                      {producto.nombre}
                    </h3>

                    {/* NOTES SNIPPET */}
                    {producto.notas_olfativas && (
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {producto.notas_olfativas
                          .split(",")
                          .slice(0, 3)
                          .map((nota, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded text-[10px] font-medium text-emerald-200/90 bg-emerald-900/60 border border-emerald-700/40"
                            >
                              {nota.trim()}
                            </span>
                          ))}
                      </div>
                    )}

                    <p className="text-xs text-gray-300/80 font-light mt-2.5 line-clamp-2 leading-relaxed">
                      {producto.descripcion}
                    </p>
                  </div>
                </div>

                {/* FOOTER: PRICE & ADD TO CART */}
                <div className="p-5 pt-0 mt-2 border-t border-gold-500/10">
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-emerald-300/70 block">
                        Precio Oficial
                      </span>
                      <span className="text-lg sm:text-xl font-bold font-serif text-gold-300">
                        Bs. {producto.precio_venta.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-gold-400/80 font-medium">
                      <Award className="w-3.5 h-3.5 text-gold-400" />
                      <span>+1 Sello</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAdd(producto)}
                    className={`w-full py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 ${
                      addedId === producto.id
                        ? "bg-emerald-500 text-white font-bold"
                        : "bg-gold-500 hover:bg-gold-400 text-emerald-950 font-bold shadow-md hover:shadow-gold-glow"
                    }`}
                  >
                    {addedId === producto.id ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>¡Añadido!</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Añadir al Carrito</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
