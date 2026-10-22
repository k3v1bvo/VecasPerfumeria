"use client";

import React from "react";
import { MapPin, Phone, Clock, Award, ShieldCheck, Heart } from "lucide-react";
import Link from "next/link";

interface FooterProps {
  onOpenClubModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenClubModal }) => {
  return (
    <footer id="contacto" className="w-full bg-[#030d0a] border-t border-gold-500/20 pt-16 pb-12 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* BRAND */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border border-gold-400/50 flex items-center justify-center bg-emerald-950 text-gold-400">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <span className="font-serif text-xl font-bold tracking-widest text-white block">
                  VECAR
                </span>
                <span className="text-[9px] tracking-[0.3em] text-gold-400 uppercase -mt-1 block">
                  PERFUMERÍA
                </span>
              </div>
            </div>

            <p className="text-xs text-emerald-100/70 leading-relaxed font-light">
              Perfumería de autor, fragancias árabes de tendencia y las mejores inspiraciones de alta gama en Cochabamba, Bolivia.
            </p>

            <div className="pt-2 text-xs text-gold-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-gold-400" />
              <span>Garantía de Fijación & Calidad</span>
            </div>
          </div>

          {/* UBICACIÓN & CONTACTO */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-gold-400">
              Tienda Física & Contacto
            </h4>
            
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span className="text-emerald-100/80">
                  Av. Heroínas entre Av. Oquendo y Calle 16 de Julio, Cochabamba, Bolivia.
                </span>
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
