"use client";

import React from "react";
import { MapPin, Phone, Clock, Award, ShieldCheck, Heart, Navigation } from "lucide-react";
import Link from "next/link";
import { VecarEmblem } from "./VecarLogo";

interface FooterProps {
  onOpenClubModal: () => void;
  onOpenMapsModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenClubModal, onOpenMapsModal }) => {
  return (
    <footer id="contacto" className="w-full bg-[#030d0a] border-t border-gold-500/20 pt-16 pb-12 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* BRAND CON EMBLEMA VECTORIAL OFICIAL */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-gold-400/50 flex items-center justify-center bg-emerald-950/90 text-gold-400 shadow-gold-glow shrink-0">
                <VecarEmblem className="w-7 h-6 text-gold-300" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-serif italic text-2xl font-bold text-white block">
                  Vecar
                </span>
                <div className="w-full h-[1px] bg-gold-400/50 my-0.5" />
                <span className="text-[9px] tracking-[0.28em] text-gold-400 font-bold uppercase block">
                  PERFUMERÍA
                </span>
              </div>
            </div>

            <p className="text-xs text-emerald-100/70 leading-relaxed font-light">
              Perfumería de autor, fragancias árabes de tendencia y las mejores inspiraciones con 40% de esencia pura en Cochabamba, Bolivia.
            </p>

            <div className="pt-2 text-xs text-gold-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-gold-400" />
              <span>Garantía de Fijación 8 a 12 Horas</span>
            </div>
          </div>

          {/* UBICACIÓN & CONTACTO */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-gold-400">
              Tienda Física & Contacto
            </h4>
            
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-emerald-100/80 block">
                    Av. Heroínas entre Av. Oquendo y Calle 16 de Julio, Cochabamba.
                  </span>
                  {onOpenMapsModal && (
                    <button
                      onClick={onOpenMapsModal}
                      className="mt-1 text-[11px] text-gold-300 hover:text-white underline underline-offset-2 flex items-center gap-1 font-medium"
                    >
                      <Navigation className="w-3 h-3" />
                      <span>Abrir Mapa & Cómo Llegar</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <a 
                  href="https://wa.me/59175462800" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-gold-300 transition-colors"
                >
                  WhatsApp: +591 75462800
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-gold-400 shrink-0" />
                <span className="text-emerald-100/80">
                  Lun a Sáb: 09:30 - 20:00 | Dom: Previa Cita
                </span>
              </div>
            </div>
          </div>


          {/* VECAR CLUB & ENLACES RÁPIDOS */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-gold-400">
              Vecar Club & Enlaces
            </h4>

            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenClubModal}
                  className="hover:text-gold-300 transition-colors flex items-center gap-1.5"
                >
                  <span>Consultar Tarjeta de Sellos</span>
                  <span className="px-1.5 py-0.2 rounded bg-gold-400/20 text-gold-300 text-[9px]">VIP</span>
                </button>
              </li>
              <li>
                <a href="#catalogo" className="hover:text-gold-300 transition-colors">
                  Catálogo en Línea (50 ml)
                </a>
              </li>
              <li>
                <a 
                  href="https://www.tiktok.com/@Perfumeria.Vecar" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-gold-300 transition-colors"
                >
                  TikTok: @Perfumeria.Vecar
                </a>
              </li>
              <li>
                <a 
                  href="https://maps.google.com/?q=Av.+Heroinas+y+Oquendo+Cochabamba"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-gold-300 transition-colors"
                >
                  Ver en Google Maps
                </a>
              </li>
            </ul>
          </div>

          {/* ACCESO EXCLUSIVO DEL DUEÑO */}
          <div className="space-y-3 p-4 rounded-2xl glass-emerald-subtle border border-gold-400/20">
            <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-gold-300">
              Panel Administrativo
            </h4>
            <p className="text-[11px] text-emerald-200/70">
              Acceso exclusivo para el dueño: asignación de sellos (+1), CRUD de catálogo y códigos QR para vitrina.
            </p>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-emerald-950 bg-gold-400 hover:bg-gold-300 transition-all shadow-sm w-full justify-center"
            >
              <span>Acceso Administrador</span>
            </Link>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="pt-8 border-t border-gold-500/10 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© {new Date().getFullYear()} Vecar Perfumería. Cochabamba, Bolivia. Todos los derechos reservados.</p>
          <div className="flex items-center gap-1 text-[11px] text-gold-400/70">
            <span>Diseñado con estética Apple & Dark Emerald para Vecar</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
