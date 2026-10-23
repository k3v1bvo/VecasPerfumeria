"use client";

import React, { useState } from "react";
import { 
  X, 
  MapPin, 
  Navigation, 
  Copy, 
  Check, 
  ExternalLink, 
  Compass, 
  Phone, 
  Clock, 
  Sparkles,
  Share2,
  Store,
  Layers
} from "lucide-react";
import { VecarEmblem } from "./VecarLogo";

interface GoogleMapsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleMapsModal: React.FC<GoogleMapsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [viewMode, setViewMode] = useState<"interactive_map" | "card_croquis">("interactive_map");
  const [copied, setCopied] = useState(false);
  const [pinReference, setPinReference] = useState<string>("central");

  if (!isOpen) return null;

  // Real store location in Cochabamba
  const addressText = "Av. Heroínas entre Av. Oquendo y Calle 16 de Julio, Cochabamba, Bolivia";
  const coordinates = "-17.3938,-66.1528";
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=Av.+Heroinas+entre+Av.+Oquendo+y+Calle+16+de+Julio+Cochabamba+Bolivia`;
  const googleDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=-17.3938,-66.1528`;
  const wazeUrl = `https://waze.com/ul?ll=-17.3938,-66.1528&navigate=yes`;

  // Dynamic embed iframe URL
  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    pinReference === "oquendo" 
      ? "Av Heroinas y Oquendo, Cochabamba" 
      : pinReference === "16julio"
      ? "Av Heroinas y 16 de Julio, Cochabamba"
      : "Av. Heroinas entre Av. Oquendo y Calle 16 de Julio, Cochabamba, Bolivia"
  )}&t=&z=17&ie=UTF8&iwloc=&output=embed`;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(addressText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl max-h-[94vh] flex flex-col rounded-3xl glass-emerald border border-gold-400/40 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="p-4 sm:p-5 border-b border-gold-400/20 flex items-center justify-between bg-emerald-950/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold-400/20 border border-gold-400/50 flex items-center justify-center text-gold-400 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-gold-400 font-bold">
                <Sparkles className="w-3 h-3" />
                <span>Tienda Oficial • Cochabamba</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                Ubicación & <span className="gold-text">Google Maps</span>
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-full text-gray-400 hover:text-white bg-emerald-950/70 border border-gold-400/20 hover:border-gold-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* VIEW TABS & QUICK NAVIGATION BAR */}
        <div className="px-4 py-2.5 bg-emerald-950/70 border-b border-gold-400/20 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* TABS */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViewMode("interactive_map")}
              className={`px-3 py-1.5 rounded-full font-semibold transition-all flex items-center gap-1.5 ${
                viewMode === "interactive_map"
                  ? "bg-gold-500 text-emerald-950 font-bold shadow-sm"
                  : "bg-emerald-950/80 text-gray-300 border border-gold-400/20 hover:text-white"
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>🗺️ Google Maps en Vivo</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode("card_croquis")}
              className={`px-3 py-1.5 rounded-full font-semibold transition-all flex items-center gap-1.5 ${
                viewMode === "card_croquis"
                  ? "bg-gold-500 text-emerald-950 font-bold shadow-sm"
                  : "bg-emerald-950/80 text-gray-300 border border-gold-400/20 hover:text-white"
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>📍 Croquis Vectorial Oficial</span>
            </button>
          </div>

          {/* REFERENCE PIN CHIPS */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-emerald-200/70 uppercase font-mono mr-1">Pin:</span>
            <button
              type="button"
              onClick={() => setPinReference("central")}
              className={`px-2.5 py-1 rounded-lg text-[10.5px] transition-all ${
                pinReference === "central"
                  ? "bg-gold-400 text-emerald-950 font-bold"
                  : "bg-emerald-950 text-gray-300 hover:text-white border border-gold-400/20"
              }`}
            >
              Av. Heroínas (Punto Exacto)
            </button>
            <button
              type="button"
              onClick={() => setPinReference("oquendo")}
              className={`px-2.5 py-1 rounded-lg text-[10.5px] transition-all ${
                pinReference === "oquendo"
                  ? "bg-gold-400 text-emerald-950 font-bold"
                  : "bg-emerald-950 text-gray-300 hover:text-white border border-gold-400/20"
              }`}
            >
              Lado Av. Oquendo
            </button>
            <button
              type="button"
              onClick={() => setPinReference("16julio")}
              className={`px-2.5 py-1 rounded-lg text-[10.5px] transition-all ${
                pinReference === "16julio"
                  ? "bg-gold-400 text-emerald-950 font-bold"
                  : "bg-emerald-950 text-gray-300 hover:text-white border border-gold-400/20"
              }`}
            >
              Lado C. 16 de Julio
            </button>
          </div>
        </div>

        {/* MAP CONTAINER */}
        <div className="relative w-full h-[400px] sm:h-[480px] bg-black">
          {viewMode === "interactive_map" ? (
            <iframe
              src={mapEmbedUrl}
              title="Google Maps Vecar Perfumería"
              className="w-full h-full border-0 filter contrast-105"
              loading="lazy"
              allowFullScreen
            />
          ) : (
            /* CROQUIS VECTORIAL FIEL A LA TARJETA FÍSICA */
            <div className="w-full h-full bg-[#FCFBF7] flex items-center justify-center p-4 relative overflow-hidden select-none">
              <svg viewBox="0 0 600 360" className="w-full h-full max-w-2xl drop-shadow-xl">
                {/* Cuadrícula urbana */}
                <rect width="600" height="360" fill="#FCFBF7" />
                <g stroke="#E9E4D8" strokeWidth="1">
                  <line x1="0" y1="70" x2="600" y2="70" />
                  <line x1="0" y1="310" x2="600" y2="310" />
                  <line x1="300" y1="0" x2="300" y2="360" strokeDasharray="4 4" />
                </g>

                {/* Manzanos */}
                <rect x="135" y="25" width="320" height="165" rx="12" fill="#F4F1EA" stroke="#E2DAC9" strokeWidth="1.5" />
                <rect x="135" y="250" width="320" height="90" rx="12" fill="#F4F1EA" stroke="#E2DAC9" strokeWidth="1.5" />
                <text x="295" y="95" fill="#9A8F7A" fontSize="11" fontWeight="600" textAnchor="middle" letterSpacing="1">
                  ZONA CENTRAL / COMERCIAL
                </text>
                <text x="295" y="113" fill="#B2A793" fontSize="9.5" fontWeight="500" textAnchor="middle">
                  Cochabamba, Bolivia
                </text>

                {/* CALLE 16 DE JULIO */}
                <path d="M 85 -10 L 110 370" stroke="#53687E" strokeWidth="34" />
                <path d="M 85 -10 L 110 370" stroke="#7A90A7" strokeWidth="1.5" strokeDasharray="8 8" />
                <text x="94" y="115" fill="#FFFFFF" fontSize="13" fontWeight="700" transform="rotate(86 94 115)" textAnchor="middle" letterSpacing="1">
                  C. 16 de Julio
                </text>

                {/* AV. OQUENDO */}
                <path d="M 480 -10 L 505 370" stroke="#53687E" strokeWidth="36" />
                <path d="M 480 -10 L 505 370" stroke="#7A90A7" strokeWidth="1.5" strokeDasharray="8 8" />
                <text x="490" y="115" fill="#FFFFFF" fontSize="13" fontWeight="700" transform="rotate(86 490 115)" textAnchor="middle" letterSpacing="1">
                  Av. Oquendo
                </text>

                {/* AV. HEROÍNAS */}
                <path d="M -10 232 L 610 205" stroke="#485D73" strokeWidth="36" />
                <path d="M -10 232 L 610 205" stroke="#8CA2B8" strokeWidth="1.5" strokeDasharray="10 8" />
                <text x="385" y="222" fill="#FFFFFF" fontSize="15" fontWeight="700" transform="rotate(-2.5 385 222)" textAnchor="middle" letterSpacing="1.2">
                  Av. Heroínas
                </text>

                {/* PIN DORADO OFICIAL VECAR */}
                <g transform="translate(275, 208)">
                  <ellipse cx="0" cy="18" rx="14" ry="5" fill="rgba(0,0,0,0.28)" />
                  <path
                    d="M0 -42 C20 -42, 34 -28, 34 -10 C34 8, 12 20, 0 32 C-12 20, -34 8, -34 -10 C-34 -28, -20 -42, 0 -42 Z"
                    fill="#C9A050"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                  />
                  <circle cx="0" cy="-11" r="25" fill="#1C2428" />
                  <g transform="translate(-14, -31) scale(0.28)" className="text-gold-300">
                    <VecarEmblem className="w-full h-full text-gold-300" />
                  </g>
                  <text x="0" y="-1" fill="#DFB968" fontFamily="Cormorant Garamond, serif" fontStyle="italic" fontWeight="700" fontSize="14" textAnchor="middle">
                    Vecar
                  </text>
                  <text x="0" y="6" fill="#C9A050" fontFamily="Montserrat, sans-serif" fontWeight="700" fontSize="4.5" letterSpacing="1" textAnchor="middle">
                    PERFUMERÍA
                  </text>
                </g>
              </svg>
            </div>
          )}

          {/* FLOATING ADDRESS BADGE */}
          <div className="absolute top-3 left-3 bg-emerald-950/90 text-white px-3.5 py-2 rounded-xl border border-gold-400/40 backdrop-blur-md shadow-xl max-w-sm hidden sm:block">
            <span className="text-[10px] font-mono font-bold text-gold-400 uppercase block">
              DIRECCIÓN EXACTA:
            </span>
            <p className="text-xs font-semibold text-white mt-0.5 leading-snug">
              Av. Heroínas entre Av. Oquendo y Calle 16 de Julio
            </p>
            <p className="text-[10px] text-emerald-200/70">
              Cochabamba • Acera Norte
            </p>
          </div>
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="p-4 sm:p-5 bg-emerald-950/95 border-t border-gold-400/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-emerald-200">
              <Clock className="w-3.5 h-3.5 text-gold-400" />
              <span>Lun a Vie: 09:30 - 20:00 | Sáb: 10:00 - 20:00</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-gold-300">
              <Phone className="w-3.5 h-3.5 text-gold-400" />
              <span>WhatsApp de Atención: <strong>+591 75462800</strong></span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <button
              onClick={handleCopyAddress}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold text-gold-200 bg-emerald-900/80 hover:bg-emerald-800 border border-gold-400/30 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "¡Copiada!" : "Copiar Dirección"}</span>
            </button>

            <a
              href={googleDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-emerald-950 bg-gold-gradient hover:bg-gold-gradient-hover shadow-gold-glow transition-all active:scale-95"
            >
              <Navigation className="w-3.5 h-3.5 text-emerald-950" />
              <span>Cómo Llegar (Google Maps)</span>
            </a>

            <a
              href={wazeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold text-blue-100 bg-blue-950/70 hover:bg-blue-900 border border-blue-400/40 transition-all"
            >
              <Compass className="w-3.5 h-3.5 text-blue-300" />
              <span>Waze</span>
            </a>

            <a
              href={`https://wa.me/59175462800?text=${encodeURIComponent(
                "Hola Vecar Perfumería! 📍 Estoy yendo a la tienda en Av. Heroínas e/ Oquendo y 16 de Julio. ¿Me podrían confirmar si tienen atención en este momento?"
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-sm"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Avisar que Voy</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
