"use client";

import React, { useState } from "react";
import { Sparkles, ShoppingBag, Search, Phone, Menu, X, Award, MapPin } from "lucide-react";
import { VecarEmblem } from "./VecarLogo";

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenClubModal: () => void;
  onOpenMapsModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenClubModal,
  onOpenMapsModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full glass-emerald border-b border-gold-500/20 backdrop-blur-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* LOGO OFICIAL VECAR PERFUMERÍA (CON EMBLEMA VECTORIAL CALCADO DE LA TARJETA) */}
        <a href="#inicio" className="flex items-center gap-3 group">
          <div className="relative w-11 h-11 rounded-full border border-gold-400/50 flex items-center justify-center bg-gradient-to-br from-gold-300/20 via-emerald-950/80 to-emerald-900/60 shadow-gold-glow transition-transform duration-300 group-hover:scale-105">
            <VecarEmblem className="w-8 h-7 text-gold-300 transition-colors" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-gold-400 animate-ping opacity-75" />
          </div>

          <div className="flex flex-col leading-none">
            <span className="font-serif italic font-bold text-2xl sm:text-3xl text-white group-hover:text-gold-200 transition-colors tracking-wide">
              Vecar
            </span>
            <div className="w-full h-[1px] bg-gold-400/50 my-0.5" />
            <span className="font-sans text-[9px] tracking-[0.28em] text-gold-400 font-bold uppercase">
              PERFUMERÍA
            </span>
          </div>
        </a>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden md:flex items-center space-x-7 text-sm font-medium">
          <a
            href="#inicio"
            className="text-gray-200 hover:text-gold-300 transition-colors tracking-wide py-1 border-b border-transparent hover:border-gold-400/40"
          >
            Inicio
          </a>
          <a
            href="#catalogo"
            className="text-gray-200 hover:text-gold-300 transition-colors tracking-wide py-1 border-b border-transparent hover:border-gold-400/40"
          >
            Catálogo
          </a>
          <a
            href="#club"
            onClick={(e) => {
              e.preventDefault();
              onOpenClubModal();
            }}
            className="text-gray-200 hover:text-gold-300 transition-colors tracking-wide py-1 flex items-center gap-1.5"
          >
            <span>Club Vecar</span>
            <span className="px-1.5 py-0.5 text-[9px] rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/30 font-semibold uppercase">
              10 Sellos
            </span>
          </a>
          {onOpenMapsModal && (
            <button
              onClick={onOpenMapsModal}
              className="text-gray-200 hover:text-gold-300 transition-colors tracking-wide py-1 flex items-center gap-1.5"
            >
              <MapPin className="w-3.5 h-3.5 text-gold-400" />
              <span>Ubicación</span>
            </button>
          )}
        </nav>


        {/* ACTIONS RIGHT */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* BOTÓN CONSULTAR SELLOS (Exactly matching Option 1 in the mockup) */}
          <button
            onClick={onOpenClubModal}
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase text-emerald-950 bg-gold-gradient hover:bg-gold-gradient-hover shadow-gold-glow transition-all duration-300 active:scale-95"
          >
            <Award className="w-3.5 h-3.5 text-emerald-950" />
            <span>Consultar Sellos</span>
          </button>

          {/* WHATSAPP PILL */}
          <a
            href="https://wa.me/59175462800?text=Hola%20Vecar%20Perfumer%C3%ADa,%20deseo%20consultar%20sobre%20sus%20fragancias"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-gold-300 bg-emerald-900/60 border border-gold-500/30 hover:bg-emerald-800/80 transition-all"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>75462800</span>
          </a>

          {/* CART BUTTON */}
          <button
            onClick={onOpenCart}
            aria-label="Abrir carrito de compras"
            className="relative p-2.5 rounded-full bg-emerald-900/70 border border-gold-500/30 text-gold-300 hover:text-white hover:border-gold-400 transition-all duration-200 shadow-sm"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600 text-white text-[11px] font-bold flex items-center justify-center shadow-lg border border-white/30 animate-bounce">
                {cartCount}
              </span>
            )}
          </button>

          {/* MOBILE MENU TOGGLE */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-gold-300 transition-colors"
            aria-label="Menú principal"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE DROPDOWN */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-emerald border-b border-gold-500/20 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2">
          <a
            href="#inicio"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-gray-200 hover:text-gold-300 rounded-lg hover:bg-emerald-900/40"
          >
            Inicio
          </a>
          <a
            href="#catalogo"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-gray-200 hover:text-gold-300 rounded-lg hover:bg-emerald-900/40"
          >
            Catálogo
          </a>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenClubModal();
            }}
            className="w-full text-left px-3 py-2 text-base font-medium text-gold-300 rounded-lg hover:bg-emerald-900/40 flex items-center justify-between"
          >
            <span>Club Vecar (Sellos)</span>
            <span className="px-2 py-0.5 text-xs rounded-full bg-gold-500/20 border border-gold-500/40 text-gold-300">
              Consultar
            </span>
          </button>
          {onOpenMapsModal && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenMapsModal();
              }}
              className="w-full text-left px-3 py-2 text-base font-medium text-gray-200 hover:text-gold-300 rounded-lg hover:bg-emerald-900/40 flex items-center gap-2"
            >
              <MapPin className="w-4 h-4 text-gold-400" />
              <span>Ver Ubicación & Google Maps</span>
            </button>
          )}

          <div className="pt-2 border-t border-gold-500/20 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenClubModal();
              }}
              className="w-full py-2.5 rounded-full text-center text-xs font-bold tracking-wider uppercase text-emerald-950 bg-gold-gradient shadow-gold-glow"
            >
              Consultar Mis Sellos
            </button>
            <a
              href="https://wa.me/59175462800"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 rounded-full text-center text-xs font-semibold text-gold-300 bg-emerald-900/60 border border-gold-500/30"
            >
              WhatsApp Directo (75462800)
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
