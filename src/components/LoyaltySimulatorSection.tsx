"use client";

import React, { useState } from "react";
import { VecarEmblem } from "./VecarLogo";
import { PhysicalCard3D } from "./PhysicalCard3D";
import confetti from "canvas-confetti";
import {
  Sparkles,
  Gift,
  Check,
  Phone,
  Plus,
  RotateCcw,
  Award,
  Search,
  UserPlus,
  History,
  Mail,
  User,
  CheckCircle2,
} from "lucide-react";
import { playStampSound } from "../lib/stampAudio";
import { findCliente, registerCliente } from "../lib/dataService";
import { Cliente } from "@/types/database";

interface LoyaltySimulatorSectionProps {
  onOpenClubModal?: () => void;
}

export const LoyaltySimulatorSection: React.FC<LoyaltySimulatorSectionProps> = ({
  onOpenClubModal,
}) => {
  // Búsqueda y ficha de cliente
  const [searchInput, setSearchInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeClient, setActiveClient] = useState<Cliente | null>(null);

  // Formulario de auto-registro para cliente nuevo
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  // Mensaje flotante Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 3200);
  };

  // Buscar cliente por celular o correo
  const handleSearchClient = async (e?: React.FormEvent, overrideQuery?: string) => {
    if (e) e.preventDefault();
    const query = (overrideQuery ?? searchInput).trim();
    if (!query) return;

    setIsSearching(true);
    setHasSearched(true);
    setShowRegisterForm(false);

    try {
      const found = await findCliente(query);
      if (found) {
        setActiveClient(found);
        triggerToast(`¡Tarjeta VIP de ${found.nombre_completo} cargada con éxito!`);
        if (found.sellos_acumulados >= 10) {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 },
            colors: ["#C9A050", "#DFB968", "#4E265B", "#FFFFFF"],
          });
        }
      } else {
        setActiveClient(null);
        // Si fue un número, pre-llenar teléfono
        if (/^\d+$/.test(query)) {
          setRegPhone(query);
        } else if (query.includes("@")) {
          setRegEmail(query);
        }
      }
    } catch (err) {
      console.error("Error al buscar cliente:", err);
      triggerToast("Error al consultar la tarjeta. Intenta nuevamente.");
    } finally {
      setIsSearching(false);
    }
  };

  // Auto-registro de nuevo cliente
  const handleRegisterClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regPhone.trim() || !regEmail.trim()) {
      triggerToast("Por favor completa tu nombre, celular y correo.");
      return;
    }

    setIsRegistering(true);
    try {
      const created = await registerCliente({
        nombre_completo: regName.trim(),
        telefono: regPhone.trim(),
        email: regEmail.trim(),
      });

      setActiveClient(created);
      setShowRegisterForm(false);
      setSearchInput(created.telefono);
      playStampSound();
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 },
        colors: ["#C9A050", "#DFB968", "#4E265B", "#FFFFFF"],
      });
      triggerToast(`🎉 ¡Bienvenido a Vecar Club, ${created.nombre_completo}! Tu tarjeta digital ha sido creada con 1 sello de bienvenida.`);
    } catch (err) {
      console.error(err);
      triggerToast("Ocurrió un error al registrarte.");
    } finally {
      setIsRegistering(false);
    }
  };

  // Probar con clientes demo de ejemplo
  const handleLoadDemo = (phoneDemo: string) => {
    setSearchInput(phoneDemo);
    handleSearchClient(undefined, phoneDemo);
  };

  const completedCount = activeClient ? activeClient.sellos_acumulados : 7;
  const isComplete = completedCount >= 10;

  return (
    <section id="fidelidad" className="py-16 sm:py-24 relative overflow-hidden border-t gold-divider bg-[#071518]/95">
      
      {/* Toast Flotante */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className="px-4 py-3 rounded-2xl plum-stamp-surface border border-purple-200/60 text-white shadow-2xl text-xs sm:text-sm font-semibold flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C9A050] animate-ping" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* ========================================================= */}
          {/* COLUMNA IZQUIERDA: BUSCADOR Y FICHA DEL CLIENTE (5 COLS)   */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#4E265B] border border-purple-300/40">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-200 animate-ping" />
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-100">
                Programa Oficial Vecar Club
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-semibold leading-tight text-white">
              Tu <span className="font-script text-4xl sm:text-6xl text-[#DFB968] font-normal block mt-1">Tarjeta de Fidelidad</span> Digital
            </h2>

            <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-light">
              Cada vez que compras en tienda física o por WhatsApp, el encargado estampa tu frasco en tu ficha de cliente. Ingresa tu <strong className="text-[#DFB968]">número de celular o correo</strong> para consultar tu tarjeta y tus compras en vivo.
            </p>

            {/* FORMULARIO DE CONSULTA RÁPIDA POR CELULAR O CORREO */}
            <div className="bg-[#1E3B3F]/90 rounded-2xl p-4 sm:p-5 border gold-divider space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-[#F1DCA7] font-semibold flex items-center gap-1.5 font-mono">
                  <Search className="w-3.5 h-3.5 text-[#C9A050]" />
                  <span>Consulta tu Tarjeta Digital</span>
                </span>
                <span className="text-[10px] text-gray-400 font-mono">
                  Enlace en vivo
                </span>
              </div>

              <form onSubmit={handleSearchClient} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Tu celular (ej. 75462800) o correo..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#091719] border border-[#C9A050]/40 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#C9A050]"
                  required
                />
                <button
                  type="submit"
                  disabled={isSearching}
                  className="gold-gradient-btn px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow cursor-pointer disabled:opacity-50 shrink-0"
                >
                  {isSearching ? "Buscando..." : "Ver Mi Tarjeta"}
                </button>
              </form>

              {/* Botones de ejemplo rápido para probar al instante */}
              {!activeClient && (
                <div className="pt-1 flex flex-wrap items-center gap-2 text-[11px] text-gray-300">
                  <span className="text-gray-400">Prueba con cuentas registradas:</span>
                  <button
                    type="button"
                    onClick={() => handleLoadDemo("75462800")}
                    className="px-2.5 py-1 rounded-lg bg-black/40 hover:bg-[#C9A050]/20 border border-[#C9A050]/30 text-gold-300 font-mono text-[10.5px] cursor-pointer"
                  >
                    Alejandro (75462800)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLoadDemo("70712345")}
                    className="px-2.5 py-1 rounded-lg bg-black/40 hover:bg-[#C9A050]/20 border border-[#C9A050]/30 text-gold-300 font-mono text-[10.5px] cursor-pointer"
                  >
                    Valeria (70712345)
                  </button>
                </div>
              )}
            </div>

            {/* CASO A: CLIENTE ENCONTRADO CON ÉXITO */}
            {activeClient && (
              <div className="bg-[#163034]/90 rounded-2xl p-5 border border-gold-400/40 space-y-4 shadow-xl animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center justify-between border-b border-gold-400/20 pb-3">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-[#DFB968] uppercase block">
                      CLIENTE VIP VECAR CLUB
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                      {activeClient.nombre_completo}
                    </h3>
                    <p className="text-xs text-emerald-200/80 font-mono mt-0.5">
                      Celular: {activeClient.telefono} • {activeClient.email}
                    </p>
                  </div>
                  <div className="px-3.5 py-1.5 rounded-full plum-stamp-surface border border-purple-200/60 text-white font-mono font-bold text-xs shrink-0">
                    {activeClient.sellos_acumulados} / 10 Sellos
                  </div>
                </div>

                {/* Barra de Progreso Oficial */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-gray-200">
                    <span>Progreso de Fidelidad 50ML:</span>
                    <span className="font-mono font-bold text-gold-300">{activeClient.sellos_acumulados * 10}%</span>
                  </div>
                  <div className="w-full h-3 bg-[#091719] rounded-full overflow-hidden border border-[#C9A050]/30">
                    <div
                      className="h-full bg-gradient-to-r from-[#69357A] via-purple-500 to-[#C9A050] transition-all duration-500"
                      style={{ width: `${(activeClient.sellos_acumulados / 10) * 100}%` }}
                    />
                  </div>
                </div>

                <p className="text-xs text-gray-200 leading-relaxed">
                  {activeClient.sellos_acumulados >= 10 ? (
                    <span className="text-emerald-300 font-semibold block">
                      🎉 ¡Completaste tus 10 sellos de 50ML! Tu perfume gratis está disponible para entrega en la Av. Heroínas o envío.
                    </span>
                  ) : (
                    <span>
                      Tienes <strong className="text-[#DFB968]">{activeClient.sellos_acumulados} sellos</strong>. Te {10 - activeClient.sellos_acumulados === 1 ? "falta 1 sello" : `faltan ${10 - activeClient.sellos_acumulados} sellos`} para recibir tu fragancia de regalo.
                    </span>
                  )}
                </p>

                {/* HISTORIAL DE COMPRAS REGISTRADAS DEL CLIENTE */}
                {activeClient.historial_compras && activeClient.historial_compras.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-gold-400/20">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gold-300 font-mono flex items-center gap-1.5">
                        <History className="w-3.5 h-3.5 text-gold-400" />
                        <span>Tus Perfumes Adquiridos ({activeClient.historial_compras.length})</span>
                      </span>
                    </div>

                    <div className="divide-y divide-gold-400/15 max-h-48 overflow-y-auto rounded-xl bg-black/40 border border-gold-400/20 p-2">
                      {activeClient.historial_compras.map((compra) => (
                        <div key={compra.id} className="p-2 flex items-center justify-between gap-2 text-xs">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-white">{compra.producto_nombre}</span>
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-emerald-950 text-gold-300 border border-gold-400/30 uppercase">
                                {compra.volumen_ml} ML
                              </span>
                            </div>
                            <span className="text-[10px] text-gray-400 block mt-0.5">
                              {new Date(compra.fecha).toLocaleDateString("es-BO", { day: "2-digit", month: "short" })}
                              {compra.otorgo_sello && " • 🟣 +1 Sello Oficial"}
                            </span>
                          </div>
                          <span className="font-mono font-bold text-gold-300 text-xs shrink-0">
                            Bs. {compra.precio_bob}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* BOTONES DE ACCIÓN: WHATSAPP Y CAMBIAR CUENTA */}
                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <a
                    href={`https://wa.me/59175462800?text=${encodeURIComponent(
                      `¡Hola Vecar Perfumería! ✨ Soy ${activeClient.nombre_completo} (Celular: ${activeClient.telefono}). ` +
                      `Consulté mi Tarjeta de Fidelidad en la web y tengo ${activeClient.sellos_acumulados}/10 sellos registrados.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-[#091719] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{activeClient.sellos_acumulados >= 10 ? "Solicitar Canje de Regalo" : "Contactar a Tienda"}</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveClient(null);
                      setHasSearched(false);
                      setSearchInput("");
                    }}
                    className="py-2.5 px-3.5 rounded-xl bg-black/40 hover:bg-black/60 text-gray-300 border border-gold-400/30 text-xs font-semibold"
                  >
                    Consultar Otro
                  </button>
                </div>
              </div>
            )}

            {/* CASO B: NO ENCONTRADO -> FORMULARIO DE REGISTRO RÁPIDO */}
            {hasSearched && !activeClient && (
              <div className="bg-[#1E3B3F]/90 rounded-2xl p-5 border border-gold-400/40 space-y-4 shadow-xl animate-in fade-in duration-300">
                <div className="text-center">
                  <UserPlus className="w-8 h-8 text-gold-400 mx-auto mb-1.5" />
                  <h4 className="font-serif text-lg font-bold text-white">
                    No encontramos una tarjeta registrada
                  </h4>
                  <p className="text-xs text-gray-300 mt-1 max-w-sm mx-auto">
                    ¿Es tu primera compra en Vecar? Regístrate en 15 segundos con tus datos para crear tu tarjeta digital y recibir tu <strong className="text-gold-300">primer sello de bienvenida</strong>.
                  </p>
                </div>

                <form onSubmit={handleRegisterClient} className="space-y-3 pt-1">
                  <div>
                    <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                      Nombre Completo:
                    </label>
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Ej. María Gonzales"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#091719] border border-[#C9A050]/40 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-[#C9A050]"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                      Número de Celular / WhatsApp:
                    </label>
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="Ej. 75462800"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#091719] border border-[#C9A050]/40 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-[#C9A050]"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                      Correo Electrónico (Para blindar tu cuenta):
                    </label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="Ej. maria@gmail.com"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#091719] border border-[#C9A050]/40 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-[#C9A050]"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isRegistering}
                    className="w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-emerald-950 bg-gold-gradient hover:bg-gold-gradient-hover shadow-gold-glow cursor-pointer disabled:opacity-50"
                  >
                    {isRegistering ? "Creando tu Tarjeta..." : "Crear Mi Tarjeta VIP (+1 Sello Gratis)"}
                  </button>
                </form>
              </div>
            )}

            {/* BENEFICIOS DEL PROGRAMA */}
            <div className="p-4 rounded-2xl glass-emerald border border-gold-400/20 text-xs space-y-2">
              <h5 className="font-semibold text-gold-300 uppercase tracking-wider text-[11px]">
                Reglas Claras de Vecar Club:
              </h5>
              <ul className="space-y-1.5 text-gray-300/80">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                  <span>Por cada compra de un frasco de <strong>50ML</strong>, se estampa 1 sello en tu tarjeta.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                  <span>Al décimo sello, tu siguiente fragancia de 50ML es <strong>100% GRATIS</strong>.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                  <span>El encargado de tienda registra tu compra en el sistema al instante con tu número.</span>
                </li>
              </ul>
            </div>

          </div>

          {/* ========================================================= */}
          {/* COLUMNA DERECHA: TARJETA FÍSICA 3D OFICIAL (7 COLS)        */}
          {/* ========================================================= */}
          <div className="lg:col-span-7">
            <div className="relative rounded-3xl card-surface-texture border-2 border-[#C9A050]/55 p-6 sm:p-10 shadow-2xl overflow-hidden">
              
              {/* Resplandor decorativo */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#C9A050]/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#4E265B]/30 rounded-full blur-3xl pointer-events-none" />

              {/* Cabecera Caligráfica Idéntica a la Tarjeta Física */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 border-b gold-divider pb-4">
                <div>
                  <h3 className="font-script text-4xl sm:text-5xl text-[#DFB968] tracking-wide leading-none">
                    Tarjeta de Fidelidad
                  </h3>
                  <p className="text-xs text-gray-300 mt-1">
                    {activeClient
                      ? `Mostrando sellos oficiales de ${activeClient.nombre_completo}`
                      : "Gira la tarjeta con el botón para ver la dirección física en el frente"}
                  </p>
                </div>

                <div className="flex items-center gap-2.5 bg-[#091719]/70 px-4 py-2 rounded-2xl border border-[#C9A050]/40 shrink-0">
                  <VecarEmblem className="w-8 h-7 text-[#C9A050]" />
                  <div className="flex flex-col leading-none">
                    <span className="font-serif italic font-bold text-xl text-[#C9A050]">Vecar</span>
                    <div className="w-full h-[1px] bg-[#C9A050]/50 my-0.5" />
                    <span className="text-[8px] tracking-[0.22em] text-[#C9A050] uppercase font-bold">
                      PERFUMERÍA
                    </span>
                  </div>
                </div>
              </div>

              {/* TARJETA FÍSICA 3D CON PERSPECTIVA Y SELLOS DEL CLIENTE */}
              <div className="w-full max-w-lg mx-auto py-2">
                <PhysicalCard3D
                  key={`portal-card-${activeClient ? activeClient.id : 'demo'}-${completedCount}`}
                  initialStamps={completedCount}
                  interactiveStamps={true}
                />
              </div>

              {/* Pie de la tarjeta */}
              <div className="mt-6 pt-4 border-t gold-divider flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-300">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full plum-stamp-surface border border-purple-200/60 flex items-center justify-center shrink-0">
                    <span className="text-[9px] font-black text-white font-mono">50ML</span>
                  </div>
                  <span>
                    Sellos registrados: <strong className="text-gold-300 font-mono">{completedCount}/10</strong>. Válido en tienda física Av. Heroínas y envíos.
                  </span>
                </div>

                {isComplete && (
                  <a
                    href={`https://wa.me/59175462800?text=${encodeURIComponent(
                      `¡Hola Vecar Perfumería! 🎉 Completé mis 10 sellos de 50ML en mi Tarjeta de Fidelidad${activeClient ? ` (${activeClient.nombre_completo} - Cel: ${activeClient.telefono})` : ""} y quisiera reclamar mi perfume GRATIS.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gold-gradient-btn px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg animate-bounce shrink-0"
                  >
                    🎁 Canjear Perfume de Regalo
                  </a>
                )}
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
