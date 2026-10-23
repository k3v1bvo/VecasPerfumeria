"use client";

import React, { useState, useMemo } from "react";
import { Producto } from "@/types/database";
import { 
  Search, 
  FileDown, 
  Plus, 
  Check, 
  Sparkles, 
  Award, 
  Eye, 
  SlidersHorizontal,
  Flame,
  RotateCcw,
  Tag,
  Printer,
  Layers,
  Maximize2
} from "lucide-react";
import { generatePdfCatalog } from "@/lib/pdfCatalogGenerator";
import { BottleComparisonModal } from "./BottleComparisonModal";
import { PrintCatalogModal } from "./PrintCatalogModal";
import { BOTTLE_PRESENTATIONS } from "@/lib/bottleSizes";

interface CatalogProps {
  productos: Producto[];
  onAddToCart: (producto: Producto, presentacion_ml?: number, precio_unitario?: number) => void;
  onOpenProductModal: (producto: Producto) => void;
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
}

const OLFACTORY_FAMILIES = [
  { id: "all", label: "Todas las Familias", icon: "✨" },
  { id: "Dulce / Gourmand", label: "Dulce / Vainilla", icon: "🍨" },
  { id: "Amaderada", label: "Amaderada / Oud", icon: "🌲" },
  { id: "Floral", label: "Floral / Rosas", icon: "💐" },
  { id: "Cítrica / Fresca", label: "Cítrica / Fresca", icon: "🌊" },
  { id: "Ámbar / Oriental", label: "Ámbar / Especiada", icon: "🔥" },
  { id: "Cuero / Intenso", label: "Cuero / Tabaco", icon: "👑" },
];

const TOP_BRANDS = [
  "Todas las Casas",
  "Carolina Herrera",
  "Christian Dior",
  "Paco Rabanne",
  "Chanel",
  "Jean Paul Gaultier",
  "Lattafa",
  "Giorgio Armani",
  "Ariana Grande",
  "Versace",
  "Bvlgari",
  "Victoria's Secret",
  "Hugo Boss",
  "Creed",
  "Louis Vuitton"
];

export const Catalog: React.FC<CatalogProps> = ({
  productos,
  onAddToCart,
  onOpenProductModal,
  selectedCategory: externalCategory,
  onSelectCategory: externalSetCategory,
}) => {
  const [internalCategory, setInternalCategory] = useState<string>("Todos");
  const selectedCategory = externalCategory ?? internalCategory;
  const setSelectedCategory = externalSetCategory ?? setInternalCategory;

  const [selectedFamily, setSelectedFamily] = useState<string>("all");
  const [selectedBrand, setSelectedBrand] = useState<string>("Todas las Casas");
  const [sortBy, setSortBy] = useState<"populares" | "nombre" | "marca">("populares");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [visibleCount, setVisibleCount] = useState<number>(24);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [isBottleModalOpen, setIsBottleModalOpen] = useState<boolean>(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);

  const categories = [
    { id: "Todos", label: "Todos", emoji: "🌟" },
    { id: "Femenino", label: "Damas / Femenino", emoji: "🌸" },
    { id: "Masculino", label: "Varones / Masculino", emoji: "👔" },
    { id: "Árabes", label: "Árabes & Nicho", emoji: "🌙" },
    { id: "Unisex", label: "Unisex", emoji: "✨" },
  ];

  // Reset pagination when any filter changes
  const handleFilterChange = (callback: () => void) => {
    callback();
    setVisibleCount(24);
  };

  const handleResetFilters = () => {
    setSelectedCategory("Todos");
    setSelectedFamily("all");
    setSelectedBrand("Todas las Casas");
    setSearchQuery("");
    setSortBy("populares");
    setVisibleCount(24);
  };

  const hasActiveFilters = 
    selectedCategory !== "Todos" || 
    selectedFamily !== "all" || 
    selectedBrand !== "Todas las Casas" || 
    searchQuery.trim().length > 0;

  // Filter & Sort products
  const filteredProducts = useMemo(() => {
    let result = productos.filter((p) => {
      if (!p.activo) return false;

      // Category filter
      if (selectedCategory === "Árabes") {
        const isArabe = 
          p.marca_casa.toLowerCase().includes("lattafa") || 
          p.marca_casa.toLowerCase().includes("armaf") ||
          p.nombre.toLowerCase().includes("asad") ||
          p.nombre.toLowerCase().includes("yara") ||
          p.nombre.toLowerCase().includes("khamrah") ||
          p.nombre.toLowerCase().includes("odyssey");
        if (!isArabe) return false;
      } else if (selectedCategory !== "Todos") {
        if (p.categoria !== selectedCategory) return false;
      }

      // Olfactory Family filter
      if (selectedFamily !== "all") {
        const pFamily = p.familia_olfativa || "";
        const pFamilies = p.familias_olfativas || [];
        const notes = (p.notas_olfativas || "").toLowerCase();
        
        const matchesFamily = 
          pFamily === selectedFamily || 
          pFamilies.includes(selectedFamily) ||
          (selectedFamily === "Dulce / Gourmand" && (notes.includes("dulce") || notes.includes("vainilla") || notes.includes("caramel"))) ||
          (selectedFamily === "Amaderada" && (notes.includes("amaderad") || notes.includes("cedro") || notes.includes("oud") || notes.includes("pachul"))) ||
          (selectedFamily === "Floral" && (notes.includes("floral") || notes.includes("rosas") || notes.includes("jazm") || notes.includes("nardos"))) ||
          (selectedFamily === "Cítrica / Fresca" && (notes.includes("ctric") || notes.includes("citric") || notes.includes("fresco") || notes.includes("acutic") || notes.includes("marina"))) ||
          (selectedFamily === "Ámbar / Oriental" && (notes.includes("mbar") || notes.includes("ambar") || notes.includes("especiad") || notes.includes("canela"))) ||
          (selectedFamily === "Cuero / Intenso" && (notes.includes("cuero") || notes.includes("tabaco") || notes.includes("animal")));

        if (!matchesFamily) return false;
      }

      // Brand filter
      if (selectedBrand !== "Todas las Casas") {
        if (!p.marca_casa.toLowerCase().includes(selectedBrand.toLowerCase())) {
          return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          p.nombre.toLowerCase().includes(q) ||
          p.marca_casa.toLowerCase().includes(q) ||
          (p.notas_olfativas && p.notas_olfativas.toLowerCase().includes(q)) ||
          (p.familia_olfativa && p.familia_olfativa.toLowerCase().includes(q)) ||
          (p.descripcion && p.descripcion.toLowerCase().includes(q));

        if (!matchesSearch) return false;
      }

      return true;
    });

    // Sort products
    if (sortBy === "nombre") {
      result.sort((a, b) => a.nombre.localeCompare(b.nombre));
    } else if (sortBy === "marca") {
      result.sort((a, b) => a.marca_casa.localeCompare(b.marca_casa));
    } else {
      // Populares: featured first, then original order
      result.sort((a, b) => {
        if (a.destacado && !b.destacado) return -1;
        if (!a.destacado && b.destacado) return 1;
        return 0;
      });
    }

    return result;
  }, [productos, selectedCategory, selectedFamily, selectedBrand, searchQuery, sortBy]);

  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

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

  const handleQuickAdd = (producto: Producto) => {
    onAddToCart(producto, 50, 90.0);
    setAddedId(producto.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <section id="catalogo" className="w-full py-16 sm:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-emerald-subtle border border-gold-400/25 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span className="text-xs font-semibold tracking-widest uppercase text-gold-300">
                Catálogo Oficial 2026 • 215 Fragancias
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Catálogo de <span className="gold-text">Fragancias</span>
            </h2>
            <p className="text-emerald-100/70 text-sm sm:text-base mt-2 max-w-2xl font-light">
              Explora nuestra colección con fotografías reales de cada perfume. Todas las fragancias son elaboradas con <strong>40% de esencia pura</strong> y garantizan de 8 a 12 horas de duración en piel.
            </p>
          </div>

          {/* DESCARGAR & IMPRIMIR CATÁLOGOS OFICIALES */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <button
              onClick={() => setIsPrintModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase text-emerald-950 bg-gold-gradient hover:bg-gold-gradient-hover shadow-gold-glow transition-all duration-300 active:scale-95 shrink-0"
              title="Abrir centro de impresión de catálogos y láminas de mostrador"
            >
              <Printer className="w-4 h-4 text-emerald-950" />
              <span>Imprimir Catálogo</span>
            </button>

            <a
              href="/catalogos/Catalogo_Dama_Vecar_Perfumeria.pdf"
              download="Catalogo_Dama_Vecar_Perfumeria.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase text-pink-100 bg-pink-950/70 hover:bg-pink-900/80 border border-pink-400/40 shadow-sm hover:shadow-pink-500/20 transition-all duration-300 active:scale-95 shrink-0"
            >
              <FileDown className="w-3.5 h-3.5 text-pink-300" />
              <span>Catálogo Dama (PDF)</span>
            </a>

            <a
              href="/catalogos/Catalogo_Varon_Vecar_Perfumeria.pdf"
              download="Catalogo_Varon_Vecar_Perfumeria.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase text-blue-100 bg-blue-950/70 hover:bg-blue-900/80 border border-blue-400/40 shadow-sm hover:shadow-blue-500/20 transition-all duration-300 active:scale-95 shrink-0"
            >
              <FileDown className="w-3.5 h-3.5 text-blue-300" />
              <span>Catálogo Varón (PDF)</span>
            </a>

            <button
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase text-emerald-200 bg-emerald-950/80 hover:bg-emerald-900 border border-gold-400/30 transition-all duration-300 active:scale-95 disabled:opacity-70 shrink-0"
              title="Genera un PDF con las fragancias filtradas"
            >
              <FileDown className={`w-3.5 h-3.5 ${isDownloadingPdf ? "animate-bounce" : ""}`} />
              <span>{isDownloadingPdf ? "Generando..." : "Descargar Lista"}</span>
            </button>
          </div>
        </div>

        {/* LISTA OFICIAL DE PRECIOS & ENVASES DE LUJO (FOTOGRAFÍAS REALES DEL FLYER OFICIAL) */}
        <div className="mb-8 p-5 sm:p-6 rounded-3xl glass-emerald border border-gold-400/40 bg-gradient-to-r from-emerald-950/90 via-[#0a231a] to-emerald-950/90 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gold-400/20">
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-gold-400 font-bold block">
                FOTOS REALES DE ENTREGA • ENVASES DE LUJO
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mt-0.5">
                Fragancias con <span className="gold-text">40% de Esencia Pura</span>
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              <button
                type="button"
                onClick={() => setIsBottleModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-gold-300 bg-emerald-900/60 hover:bg-emerald-800/80 border border-gold-400/30 transition-colors"
              >
                <Layers className="w-3.5 h-3.5 text-gold-400" />
                <span>Guía & Comparador de Frascos</span>
              </button>

              <button
                type="button"
                onClick={() => setIsBottleModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-gold-300 bg-emerald-900/60 hover:bg-emerald-800/80 border border-gold-400/30 transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-gold-400" />
                <span>Ver Flyer Oficial</span>
              </button>
            </div>
          </div>

          {/* 4 CARDS WITH REAL BOTTLE PHOTOS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-4">
            
            {/* 10 ML */}
            <div 
              onClick={() => setIsBottleModalOpen(true)}
              className="p-3.5 rounded-2xl bg-black/40 border border-gold-400/30 text-center hover:border-gold-400 hover:scale-[1.02] transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="h-28 w-full flex items-center justify-center p-1.5 mb-2 bg-gradient-to-b from-[#132E32]/70 via-[#0C1E20]/90 to-black/80 rounded-xl overflow-hidden border border-[#C9A050]/25 shadow-inner">
                <img
                  src="/frascos/frasco_10ml.png"
                  alt="Frasco Vecar 10ml"
                  className="max-h-full max-w-full object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.65)] group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-300 uppercase block font-mono">10 ML • Pocket</span>
                <span className="font-serif text-2xl font-black text-gold-300 block my-0.5">Bs. 40</span>
                <span className="text-[10px] text-gray-300 block">Frasco cilíndrico plateado</span>
                <span className="text-[9.5px] font-mono text-emerald-400/80 block mt-0.5">~120 atomizaciones</span>
              </div>
            </div>

            {/* 30 ML */}
            <div 
              onClick={() => setIsBottleModalOpen(true)}
              className="p-3.5 rounded-2xl bg-black/40 border border-gold-400/30 text-center hover:border-gold-400 hover:scale-[1.02] transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="h-28 w-full flex items-center justify-center p-1.5 mb-2 bg-gradient-to-b from-[#132E32]/70 via-[#0C1E20]/90 to-black/80 rounded-xl overflow-hidden border border-[#C9A050]/25 shadow-inner">
                <img
                  src="/frascos/frasco_30ml.png"
                  alt="Frasco Vecar 30ml"
                  className="max-h-full max-w-full object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.65)] group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-300 uppercase block font-mono">30 ML • Personal</span>
                <span className="font-serif text-2xl font-black text-gold-300 block my-0.5">Bs. 70</span>
                <span className="text-[10px] text-gray-300 block">Envase rectangular elegante</span>
                <span className="text-[9.5px] font-mono text-emerald-400/80 block mt-0.5">~360 atomizaciones</span>
              </div>
            </div>

            {/* 50 ML (SIGNATURE / MAS VENDIDO) */}
            <div 
              onClick={() => setIsBottleModalOpen(true)}
              className="p-3.5 rounded-2xl bg-gold-400/15 border-2 border-gold-400 text-center shadow-gold-glow hover:scale-[1.03] transition-all cursor-pointer group flex flex-col justify-between relative"
            >
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-gold-400 text-emerald-950 shadow-md">
                  Más Vendido
                </span>
              </div>
              <div className="h-28 w-full flex items-center justify-center p-1.5 mb-2 bg-gradient-to-b from-[#16383E]/85 via-[#0C1E20]/95 to-black/90 rounded-xl overflow-hidden border border-gold-400/35 shadow-gold-glow/20">
                <img
                  src="/frascos/frasco_50ml.png"
                  alt="Frasco Vecar 50ml"
                  className="max-h-full max-w-full object-contain drop-shadow-[0_8px_18px_rgba(201,160,80,0.25)] group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div>
                <span className="text-[10px] font-bold text-gold-300 uppercase block font-mono">50 ML • Signature</span>
                <span className="font-serif text-2xl font-black text-white block my-0.5">Bs. 90</span>
                <span className="text-[10px] text-gold-200 font-semibold block">Cuadrado Clásico (+1 Sello)</span>
                <span className="text-[9.5px] font-mono text-gold-300/90 block mt-0.5">~600 atomizaciones</span>
              </div>
            </div>

            {/* 100 ML (DELUXE) */}
            <div 
              onClick={() => setIsBottleModalOpen(true)}
              className="p-3.5 rounded-2xl bg-black/40 border border-gold-400/30 text-center hover:border-gold-400 hover:scale-[1.02] transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="h-28 w-full flex items-center justify-center p-1.5 mb-2 bg-gradient-to-b from-[#132E32]/70 via-[#0C1E20]/90 to-black/80 rounded-xl overflow-hidden border border-[#C9A050]/25 shadow-inner">
                <img
                  src="/frascos/frasco_100ml.png"
                  alt="Frasco Vecar 100ml"
                  className="max-h-full max-w-full object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.65)] group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-300 uppercase block font-mono">100 ML • Deluxe</span>
                <span className="font-serif text-2xl font-black text-gold-300 block my-0.5">Bs. 145</span>
                <span className="text-[10px] text-gray-300 block">Gran reserva señorial</span>
                <span className="text-[9.5px] font-mono text-emerald-400/80 block mt-0.5">~1,200 atomizaciones</span>
              </div>
            </div>

          </div>
        </div>


        {/* ========================================================= */}
        {/* FILTROS & CATEGORIZACIÓN INTELIGENTE (AMIGABLE AL CLIENTE) */}
        {/* ========================================================= */}
        <div className="space-y-4 mb-8">
          
          {/* NIVEL 1: GÉNERO / LÍNEA */}
          <div className="p-3 sm:p-4 rounded-2xl glass-emerald border border-gold-400/25">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gold-300 flex items-center gap-1.5 font-mono">
                <SlidersHorizontal className="w-3.5 h-3.5 text-gold-400" />
                <span>1. Selecciona Colección:</span>
              </span>
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-gold-400/80 hover:text-gold-200 flex items-center gap-1 underline underline-offset-2 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Limpiar Filtros</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleFilterChange(() => setSelectedCategory(cat.id))}
                    className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all whitespace-nowrap flex items-center gap-2 ${
                      isSelected
                        ? "bg-gold-500 text-emerald-950 font-bold shadow-gold-glow scale-[1.02]"
                        : "text-gray-200 hover:text-white bg-emerald-950/70 border border-gold-500/20 hover:border-gold-400/50"
                    }`}
                  >
                    <span>{cat.emoji}</span>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* NIVEL 2: FAMILIAS OLFATIVAS (DULCE, AMADERADA, FLORAL, FRESCA, ETC.) */}
          <div className="p-3 sm:p-4 rounded-2xl glass-emerald border border-gold-400/20 bg-emerald-950/40">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300/80 mb-2.5 block font-mono">
              2. Familia Olfativa / Tipo de Aroma:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {OLFACTORY_FAMILIES.map((fam) => {
                const isSelected = selectedFamily === fam.id;
                return (
                  <button
                    key={fam.id}
                    onClick={() => handleFilterChange(() => setSelectedFamily(fam.id))}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all whitespace-nowrap flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-emerald-200 text-emerald-950 font-bold shadow-sm"
                        : "text-emerald-100/70 hover:text-white bg-emerald-900/40 border border-emerald-700/40 hover:border-gold-400/40"
                    }`}
                  >
                    <span>{fam.icon}</span>
                    <span>{fam.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* NIVEL 3: CASAS / MARCAS DESTACADAS & BARRA DE BÚSQUEDA */}
          <div className="p-3 sm:p-4 rounded-2xl glass-emerald border border-gold-400/20 flex flex-col lg:flex-row gap-4 items-center justify-between">
            
            {/* MARCAS SCROLL */}
            <div className="w-full lg:w-auto flex-1 overflow-hidden">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gold-400/80 block mb-1.5 font-mono">
                Casas & Diseñadores:
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {TOP_BRANDS.map((brand) => {
                  const isSelected = selectedBrand === brand;
                  return (
                    <button
                      key={brand}
                      onClick={() => handleFilterChange(() => setSelectedBrand(brand))}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all ${
                        isSelected
                          ? "bg-gold-400/20 text-gold-300 border border-gold-400 font-bold"
                          : "text-gray-300 hover:text-white bg-black/30 border border-white/10 hover:border-white/30"
                      }`}
                    >
                      {brand}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* BÚSQUEDA DIRECTA Y ORDEN */}
            <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center shrink-0">
              {/* SEARCH INPUT */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-400/70" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleFilterChange(() => setSearchQuery(e.target.value))}
                  placeholder="Buscar nombre, nota, casa..."
                  className="w-full pl-9 pr-8 py-2 rounded-xl text-xs bg-emerald-950/90 border border-gold-400/30 text-white placeholder-emerald-200/40 focus:outline-none focus:border-gold-400 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => handleFilterChange(() => setSearchQuery(""))}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gold-300/70 hover:text-white"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* SORT DROPDOWN */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 rounded-xl text-xs bg-emerald-950/90 border border-gold-400/30 text-gold-300 font-medium focus:outline-none focus:border-gold-400 cursor-pointer"
              >
                <option value="populares">Más Populares</option>
                <option value="nombre">Nombre (A - Z)</option>
                <option value="marca">Casa (A - Z)</option>
              </select>
            </div>

          </div>

        </div>

        {/* RESULTS HEADER & ACTIVE FILTERS SUMMARY */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 text-xs text-emerald-200/70">
          <div className="flex items-center gap-2">
            <span>
              Mostrando <strong className="text-gold-300 font-semibold">{filteredProducts.length}</strong> de {productos.length} fragancias
            </span>
            {selectedBrand !== "Todas las Casas" && (
              <span className="px-2 py-0.5 rounded-full bg-gold-400/15 border border-gold-400/30 text-gold-300 text-[10px]">
                {selectedBrand}
              </span>
            )}
            {selectedFamily !== "all" && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-800/40 border border-emerald-600/40 text-emerald-200 text-[10px]">
                {selectedFamily}
              </span>
            )}
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="text-xs text-gold-400 hover:text-gold-200 underline underline-offset-2"
            >
              Restablecer todos los filtros
            </button>
          )}
        </div>

        {/* PRODUCT GRID */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl glass-emerald border border-gold-400/20">
            <p className="font-serif text-2xl text-gold-200">No encontramos fragancias con esos filtros</p>
            <p className="text-sm text-gray-300 mt-2 max-w-md mx-auto">
              Intenta cambiar la familia olfativa, la casa de diseño o busca por nombre directo como &ldquo;Cloud&rdquo;, &ldquo;Sauvage&rdquo;, &ldquo;Good Girl&rdquo; o &ldquo;Asad&rdquo;.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-5 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-emerald-950 bg-gold-400 hover:bg-gold-300 shadow-gold-glow transition-all"
            >
              Ver todas las 215 fragancias
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7">
              {displayedProducts.map((producto) => (
                <div
                  key={producto.id}
                  className="group rounded-2xl glass-emerald border border-gold-400/25 overflow-hidden flex flex-col justify-between hover:border-gold-400/60 hover:shadow-gold-glow transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-b from-emerald-950/70 to-emerald-950/95"
                >
                  <div>
                    {/* IMAGE & BADGES CONTAINER */}
                    <div 
                      onClick={() => onOpenProductModal(producto)}
                      className="relative aspect-square w-full overflow-hidden bg-gradient-to-b from-black/50 via-emerald-950/80 to-emerald-950 flex items-center justify-center p-4 cursor-pointer"
                    >
                      {/* REAL PERFUME IMAGE DIRECT FROM CATALOG */}
                      <img
                        src={producto.imagen_url}
                        alt={producto.nombre}
                        className="w-full h-full object-contain filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.src.includes("unsplash")) {
                            target.src = "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80";
                          }
                        }}
                      />

                      {/* TOP BADGES */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase text-emerald-950 bg-gold-400 shadow-sm">
                          {producto.categoria}
                        </span>
                        {producto.familia_olfativa && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold text-emerald-100 bg-emerald-900/90 border border-emerald-500/30">
                            {producto.familia_olfativa}
                          </span>
                        )}
                      </div>

                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold text-gold-300 bg-black/80 border border-gold-400/30 backdrop-blur-md">
                          40% Esencia
                        </span>
                      </div>

                      {/* QUICK VIEW OVERLAY ON HOVER */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                        <span className="px-3 py-1.5 rounded-full bg-emerald-950/90 border border-gold-400/50 text-gold-300 text-xs font-semibold flex items-center gap-1.5 shadow-xl">
                          <Eye className="w-3.5 h-3.5" />
                          <span>Ver Detalles</span>
                        </span>
                      </div>
                    </div>

                    {/* CONTENT */}
                    <div className="p-4 sm:p-5">
                      <p className="text-[10.5px] font-semibold tracking-widest uppercase text-gold-400/90 font-mono">
                        {producto.marca_casa}
                      </p>
                      <h3 
                        onClick={() => onOpenProductModal(producto)}
                        className="font-serif text-lg font-bold text-white mt-0.5 group-hover:text-gold-200 transition-colors line-clamp-1 cursor-pointer"
                        title={producto.nombre}
                      >
                        {producto.nombre}
                      </h3>

                      {/* OLFACTORY NOTES SNIPPET */}
                      {producto.notas_olfativas && (
                        <div className="mt-2.5 flex flex-wrap gap-1">
                          {producto.notas_olfativas
                            .split(",")
                            .slice(0, 3)
                            .map((nota, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded text-[10px] font-medium text-emerald-200/90 bg-emerald-900/50 border border-emerald-700/40"
                              >
                                {nota.trim()}
                              </span>
                            ))}
                        </div>
                      )}

                      <p className="text-xs text-gray-300/80 font-light mt-2 line-clamp-2 leading-relaxed">
                        {producto.descripcion}
                      </p>
                    </div>
                  </div>

                  {/* FOOTER: PRICE & SELECT SIZE / ADD */}
                  <div className="p-4 sm:p-5 pt-0 border-t border-gold-500/10">
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-emerald-300/70 block font-mono">
                          50 ML Signature
                        </span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xl font-bold font-serif text-gold-300">
                            Bs. 90.00
                          </span>
                          <span className="text-[10px] text-emerald-200/60 font-mono">
                            (Desde Bs. 40)
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-[10px] text-gold-400/90 font-medium bg-gold-400/10 px-2 py-0.5 rounded-full border border-gold-400/20">
                        <Award className="w-3 h-3 text-gold-400" />
                        <span>1 Sello</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <button
                        onClick={() => onOpenProductModal(producto)}
                        className="py-2 rounded-xl text-xs font-semibold tracking-wider text-gold-300 bg-emerald-950/80 hover:bg-emerald-900 border border-gold-400/30 hover:border-gold-400 transition-all flex items-center justify-center gap-1"
                      >
                        <Tag className="w-3.5 h-3.5" />
                        <span>Medidas</span>
                      </button>

                      <button
                        onClick={() => handleQuickAdd(producto)}
                        className={`py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-1.5 ${
                          addedId === producto.id
                            ? "bg-emerald-500 text-white font-bold"
                            : "bg-gold-500 hover:bg-gold-400 text-emerald-950 shadow-md hover:shadow-gold-glow"
                        }`}
                      >
                        {addedId === producto.id ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>¡Listo!</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>50 ML</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CARGAR MÁS BOTÓN (CUANDO HAY MÁS DE 24 RESULTADOS) */}
            {visibleCount < filteredProducts.length && (
              <div className="mt-12 text-center">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 24)}
                  className="px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest text-emerald-950 bg-gold-gradient hover:bg-gold-gradient-hover shadow-gold-glow hover:scale-105 active:scale-95 transition-all"
                >
                  Ver Más Fragancias ({filteredProducts.length - visibleCount} restantes)
                </button>
              </div>
            )}
          </>
        )}

      </div>

      {/* MODAL DE COMPARADOR DE FRASCOS Y FLYER OFICIAL */}
      <BottleComparisonModal
        isOpen={isBottleModalOpen}
        onClose={() => setIsBottleModalOpen(false)}
      />

      {/* MODAL DE CENTRO DE IMPRESIÓN Y CATÁLOGOS */}
      <PrintCatalogModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        productos={productos}
      />
    </section>
  );
};

