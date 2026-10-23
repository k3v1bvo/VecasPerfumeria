"use client";

import React, { useState } from "react";
import { VecarEmblem } from "./VecarLogo";
import { MapPin, Navigation, Copy, Check, ExternalLink } from "lucide-react";

interface OfficialLocationSectionProps {
  onOpenGoogleMapsModal?: () => void;
}

export const OfficialLocationSection: React.FC<OfficialLocationSectionProps> = ({
  onOpenGoogleMapsModal,
}) => {
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText("Av. Heroínas entre Av. Oquendo y Calle 16 de Julio, Cochabamba, Bolivia");
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2200);
  };

  const copyPhone = () => {
    navigator.clipboard.writeText("75462800");
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2200);
  };

  return (
    <section id="visitanos" className="py-16 sm:py-24 bg-[#091719]/90 border-t gold-divider relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Encabezado */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.28em] text-[#C9A050]">
            Tienda Física en Cochabamba
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-semibold mt-2 text-white">
            Visítanos y Vive la <span className="italic gold-gradient-text">Experiencia Vecar</span>
          </h2>
          <div className="w-24 h-[1px] bg-[#C9A050]/60 mx-auto my-4" />
          <p className="text-gray-300 text-sm sm:text-base font-light">
            Estamos ubicados en pleno corazón de Cochabamba. Ven a probar tus fragancias favoritas con 40% de esencia pura y recibe tu tarjeta física de fidelidad.
          </p>
        </div>

        {/* Tarjeta de Presentación Ampliada con el Croquis Oficial */}
        <div className="rounded-3xl card-surface-texture border-2 border-[#C9A050]/50 shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">

            {/* Columna Izquierda (7 cols): Croquis Vectorial Interactivo Fiel a la Tarjeta */}
            <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r gold-divider">
              
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#C9A050] block">
                    Croquis Oficial de Ubicación
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-semibold text-white">
                    Av. Heroínas entre Av. Oquendo y C. 16 de Julio
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  {onOpenGoogleMapsModal && (
                    <button
                      type="button"
                      onClick={onOpenGoogleMapsModal}
                      className="px-3.5 py-2 rounded-xl bg-[#C9A050]/20 hover:bg-[#C9A050] text-[#DFB968] hover:text-[#091719] border border-[#C9A050]/60 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Cómo Llegar (GPS)</span>
                    </button>
                  )}

                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Av.+Heroinas+entre+Av.+Oquendo+y+Calle+16+de+Julio+Cochabamba+Bolivia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-emerald-950/80 hover:bg-[#C9A050] text-gray-200 hover:text-[#091719] border border-[#C9A050]/40 text-xs font-semibold transition-all flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Google Maps</span>
                  </a>
                </div>
              </div>

              {/* Mapa Vectorial Urbano de Alta Fidelidad */}
              <div className="relative w-full aspect-[16/10] bg-[#FCFBF7] rounded-2xl border-[3px] border-[#C9A050] shadow-inner overflow-hidden group select-none">
                <svg viewBox="0 0 600 360" className="w-full h-full">
                  {/* Cuadrícula urbana sutil */}
                  <g stroke="#E9E4D8" strokeWidth="1">
                    <line x1="0" y1="70" x2="600" y2="70" />
                    <line x1="0" y1="310" x2="600" y2="310" />
                    <line x1="300" y1="0" x2="300" y2="360" strokeDasharray="4 4" />
                  </g>

                  {/* Bloques de manzanos urbanos */}
                  <rect x="135" y="25" width="320" height="165" rx="12" fill="#F4F1EA" stroke="#E2DAC9" strokeWidth="1.5" />
                  <rect x="135" y="250" width="320" height="90" rx="12" fill="#F4F1EA" stroke="#E2DAC9" strokeWidth="1.5" />

                  {/* Referencias urbanas en Cochabamba */}
                  <text x="295" y="95" fill="#9A8F7A" fontSize="11" fontWeight="700" textAnchor="middle" letterSpacing="1">
                    ZONA CENTRAL COMERCIAL
                  </text>
                  <text x="295" y="113" fill="#B2A793" fontSize="9.5" fontWeight="500" textAnchor="middle">
                    Cochabamba, Bolivia
                  </text>

                  {/* CALLE 16 DE JULIO (Vertical Izquierda) */}
                  <path d="M 85 -10 L 110 370" stroke="#53687E" strokeWidth="34" />
                  <path d="M 85 -10 L 110 370" stroke="#7A90A7" strokeWidth="1.5" strokeDasharray="8 8" />
                  <text
                    x="94"
                    y="115"
                    fill="#FFFFFF"
                    fontSize="13"
                    fontWeight="700"
                    transform="rotate(86 94 115)"
                    textAnchor="middle"
                    letterSpacing="1"
                  >
                    C. 16 de Julio
                  </text>

                  {/* AV. OQUENDO (Vertical Derecha) */}
                  <path d="M 480 -10 L 505 370" stroke="#53687E" strokeWidth="36" />
                  <path d="M 480 -10 L 505 370" stroke="#7A90A7" strokeWidth="1.5" strokeDasharray="8 8" />
                  <text
                    x="490"
                    y="115"
                    fill="#FFFFFF"
                    fontSize="13"
                    fontWeight="700"
                    transform="rotate(86 490 115)"
                    textAnchor="middle"
                    letterSpacing="1"
                  >
                    Av. Oquendo
                  </text>

                  {/* AV. HEROÍNAS (Horizontal Principal) */}
                  <path d="M -10 232 L 610 205" stroke="#485D73" strokeWidth="36" />
                  <path d="M -10 232 L 610 205" stroke="#8CA2B8" strokeWidth="1.5" strokeDasharray="10 8" />
                  <text
                    x="385"
                    y="222"
                    fill="#FFFFFF"
                    fontSize="15"
                    fontWeight="700"
                    transform="rotate(-2.5 385 222)"
                    textAnchor="middle"
                    letterSpacing="1.2"
                  >
                    Av. Heroínas
                  </text>

                  {/* Ondas de pulso radar bajo el Pin de Vecar */}
                  <circle cx="275" cy="220" r="28" fill="#C9A050" opacity="0.25">
                    <animate attributeName="r" values="20;42;20" dur="2.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.4;0;0.4" dur="2.5s" repeatCount="indefinite" />
                  </circle>

                  {/* PIN DORADO OFICIAL DE VECAR (Con silueta y nombre) */}
                  <g transform="translate(275, 208)" className="cursor-pointer" onClick={copyAddress}>
                    <ellipse cx="0" cy="18" rx="14" ry="5" fill="rgba(0,0,0,0.28)" />
                    <path
                      d="M0 -42 C20 -42, 34 -28, 34 -10 C34 8, 12 20, 0 32 C-12 20, -34 8, -34 -10 C-34 -28, -20 -42, 0 -42 Z"
                      fill="#C9A050"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                    />
                    <circle cx="0" cy="-11" r="25" fill="#1C2428" />
                    <g transform="translate(-14, -31) scale(0.28)" className="text-[#DFB968]">
                      <VecarEmblem className="w-24 h-20 text-[#DFB968]" />
                    </g>
                    <text
                      x="0"
                      y="-1"
                      fill="#DFB968"
                      fontFamily="Cormorant Garamond, serif"
                      fontStyle="italic"
                      fontWeight="bold"
                      fontSize="14"
                      textAnchor="middle"
                    >
                      Vecar
                    </text>
                    <text
                      x="0"
                      y="6"
                      fill="#C9A050"
                      fontFamily="Montserrat, sans-serif"
                      fontWeight="bold"
                      fontSize="4.5"
                      letterSpacing="1"
                      textAnchor="middle"
                    >
                      PERFUMERÍA
                    </text>
                  </g>
                </svg>

                {/* Etiqueta flotante inferior en el croquis */}
                <div className="absolute bottom-3 left-3 right-3 sm:right-auto bg-[#091719]/95 text-white px-3.5 py-2 rounded-xl border border-[#C9A050]/50 text-xs flex items-center gap-2 shadow-lg backdrop-blur-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C9A050] animate-pulse" />
                  <span>
                    <strong>Punto Exacto:</strong> Acera de la Av. Heroínas, a pasos de la Av. Oquendo y C. 16 de Julio
                  </span>
                </div>
              </div>

            </div>

            {/* Columna Derecha (5 cols): Datos Oficiales con divisiones idénticas a la tarjeta */}
            <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between relative space-y-6 my-auto">
              
              {/* Cabecera con Logotipo */}
              <div className="flex items-center gap-4 pb-4 border-b gold-divider">
                <div className="w-16 h-16 rounded-2xl bg-[#091719]/80 border border-[#C9A050]/50 flex items-center justify-center shrink-0 shadow-lg">
                  <VecarEmblem className="w-12 h-10 text-[#DFB968]" />
                </div>
                <div>
                  <h3 className="font-serif italic text-3xl sm:text-4xl text-[#DFB968] leading-none">
                    Vecar
                  </h3>
                  <p className="text-xs font-bold tracking-[0.25em] text-[#C9A050] uppercase mt-1">
                    PERFUMERÍA
                  </p>
                  <p className="text-xs text-gray-300 mt-1">
                    Atención personalizada y asesoría olfativa
                  </p>
                </div>
              </div>

              {/* 1. FILA VISÍTANOS */}
              <div className="pb-5 border-b gold-divider flex items-start gap-4">
                <div className="w-11 h-11 rounded-full gold-gradient-btn flex items-center justify-center shrink-0 mt-1 shadow">
                  <MapPin className="w-5 h-5 text-[#091719]" />
                </div>
                <div className="flex-1">
                  <h4 className="font-sans font-bold text-lg tracking-wider text-[#C9A050] uppercase">
                    VISÍTANOS
                  </h4>
                  <p className="text-white font-medium text-sm sm:text-base leading-snug mt-1">
                    Av. Heroínas entre<br />
                    Av. Oquendo y<br />
                    Calle 16 de Julio
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Cochabamba, Bolivia</p>
                  
                  <button
                    onClick={copyAddress}
                    className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-[#DFB968] hover:text-white transition-colors cursor-pointer"
                  >
                    {copiedAddress ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedAddress ? "¡Dirección copiada!" : "Copiar dirección exacta"}</span>
                  </button>
                </div>
              </div>

              {/* 2. FILA WHATSAPP 75462800 */}
              <div className="pb-5 border-b gold-divider flex items-center gap-4">
                <div className="w-11 h-11 rounded-full gold-gradient-btn flex items-center justify-center shrink-0 shadow">
                  <svg className="w-5 h-5 fill-current text-[#091719]" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.124.556 4.119 1.528 5.847l-1.528 5.576 5.717-1.499c1.678.898 3.593 1.412 5.629 1.412 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href="https://wa.me/59175462800?text=Hola%20Vecar%20Perfumer%C3%ADa%2C%20quisiera%20consultar%20sobre%20sus%20fragancias"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-sans font-bold text-2xl sm:text-3xl tracking-wider text-white hover:text-[#DFB968] transition-colors"
                    >
                      75462800
                    </a>
                    <button
                      onClick={copyPhone}
                      className="px-2.5 py-1 rounded-lg bg-[#091719] border border-[#C9A050]/40 hover:border-[#C9A050] text-[11px] font-medium text-[#F1DCA7] transition-all cursor-pointer"
                    >
                      {copiedPhone ? "¡Copiado!" : "Copiar número"}
                    </button>
                  </div>
                  <p className="text-xs text-gray-300 mt-0.5">
                    Pedidos por WhatsApp, catálogo digital y envíos a toda Bolivia
                  </p>
                </div>
              </div>

              {/* 3. FILA TIKTOK */}
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full gold-gradient-btn flex items-center justify-center shrink-0 shadow">
                  <svg className="w-5 h-5 fill-current text-[#091719]" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <a
                    href="https://www.tiktok.com/search?q=Perfumeria%20Vecar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans font-bold text-lg sm:text-xl text-white hover:text-[#DFB968] transition-colors inline-flex items-center gap-2"
                  >
                    <span>Perfumeria Vecar</span>
                    <ExternalLink className="w-4 h-4 text-[#C9A050]" />
                  </a>
                  <p className="text-xs text-gray-300 mt-0.5">
                    Síguenos en TikTok para reseñas, novedades y sorteos de fragancias
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
