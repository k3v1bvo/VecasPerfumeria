"use client";

import React, { useState, useEffect } from "react";
import { Cliente } from "@/types/database";
import { findCliente, registerCliente } from "@/lib/dataService";
import { X, Search, Award, Gift, Sparkles, CheckCircle2, UserPlus, Phone, Mail, Calendar } from "lucide-react";
import confetti from "canvas-confetti";

interface VecarClubModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export const VecarClubModal: React.FC<VecarClubModalProps> = ({
  isOpen,
  onClose,
  initialQuery = "",
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  // New client form state
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newBirth, setNewBirth] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery);
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    if (cliente && cliente.sellos_acumulados >= 10) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#d4af37", "#f7e6a7", "#5c1a29", "#10b981"],
      });
    }
  }, [cliente]);

  if (!isOpen) return null;

  const handleSearch = async (queryToSearch = searchQuery) => {
    if (!queryToSearch.trim()) return;
    setIsSearching(true);
    setHasSearched(true);
    setShowRegisterForm(false);
    try {
      const found = await findCliente(queryToSearch);
      setCliente(found);
      if (!found) {
        // Pre-fill phone if digits
        if (/^\d+$/.test(queryToSearch.trim())) {
          setNewPhone(queryToSearch.trim());
        }
      }
    } catch (e) {
      console.error(e);
      setCliente(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim() || !newEmail.trim()) return;
    setIsRegistering(true);
    try {
      const created = await registerCliente({
        nombre_completo: newName,
        telefono: newPhone,
        email: newEmail,
        fecha_nacimiento: newBirth || undefined,
      });
      setCliente(created);
      setShowRegisterForm(false);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl glass-emerald border border-gold-400/40 p-6 sm:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-gold-300 hover:text-white bg-emerald-950/70 border border-gold-400/20 hover:border-gold-300 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* HEADER */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-emerald-subtle border border-gold-400/30 mb-2">
            <Award className="w-3.5 h-3.5 text-gold-400" />
            <span className="text-[11px] font-bold tracking-widest uppercase text-gold-300">
              Programa de Lealtad Exclusivo
            </span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide">
            Vecar <span className="gold-text">Club</span>
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100/70 mt-1">
            Consulta tu tarjeta digital con tu número de WhatsApp o correo electrónico.
          </p>
        </div>

        {/* SEARCH FORM */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="relative mb-6"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-400/70" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ej. 75462800 o tu correo..."
            className="w-full pl-11 pr-28 py-3 rounded-full text-sm bg-emerald-950 border border-gold-400/40 text-white placeholder-emerald-200/40 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-all shadow-inner"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-5 py-2 rounded-full text-xs font-bold tracking-wider uppercase text-emerald-950 bg-gold-gradient hover:bg-gold-gradient-hover shadow-md transition-all disabled:opacity-50"
          >
            {isSearching ? "Buscando..." : "Buscar"}
          </button>
        </form>

        {/* RESULT: CLIENT CARD FOUND */}
        {cliente && (
          <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
            {/* VIP CARD */}
            <div className="rounded-2xl p-6 bg-gradient-to-br from-[#0e3328] via-[#09221b] to-[#04110d] border-2 border-gold-400/60 shadow-gold-glow relative overflow-hidden">
              
              {/* Background watermark */}
              <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
                <Award className="w-48 h-48 text-gold-400" />
              </div>

              {/* CARD TOP */}
              <div className="flex items-center justify-between pb-4 border-b border-gold-400/20">
                <div>
                  <span className="text-[10px] font-mono tracking-widest uppercase text-gold-400">
                    MEMBRESÍA OFICIAL
                  </span>
                  <h4 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-wide">
                    {cliente.nombre_completo}
                  </h4>
                  <p className="text-xs text-emerald-200/70 font-mono mt-0.5">
                    Telf: {cliente.telefono} • {cliente.email}
                  </p>
                </div>

                <div className="text-right">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-emerald-950 bg-gold-400 shadow-sm inline-block">
                    {cliente.sellos_acumulados >= 10 ? "PREMIO LISTO" : "SOCIO ACTIVO"}
                  </span>
                  <p className="text-[10px] text-gold-300 font-mono mt-1">
                    Cochabamba, BO
                  </p>
                </div>
              </div>

              {/* 10 STAMPS GRID */}
              <div className="my-5">
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="text-gold-300 font-medium">Sellos Digitales Acumulados</span>
                  <span className="font-bold font-mono text-gold-400">
                    {cliente.sellos_acumulados} / 10
                  </span>
                </div>

                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 sm:gap-2.5">
                  {Array.from({ length: 10 }).map((_, idx) => {
                    const stampNum = idx + 1;
                    const isFilled = stampNum <= cliente.sellos_acumulados;
                    const isGift = stampNum === 10;

                    return (
                      <div
                        key={idx}
                        className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex flex-col items-center justify-center transition-all duration-300 ${
                          isFilled
                            ? "bg-[#5c1a29] border-2 border-gold-400 shadow-md scale-105"
                            : "border-2 border-dashed border-gold-400/40 bg-emerald-950/50 opacity-60"
                        }`}
                      >
                        {isFilled ? (
                          <>
                            <span className="text-[9px] font-bold text-gold-200">50ml</span>
                            <span className="text-[7px] text-gold-400/90 font-mono">#{stampNum}</span>
                          </>
                        ) : isGift ? (
                          <Gift className="w-4 h-4 text-gold-400 animate-pulse" />
                        ) : (
                          <span className="text-[9px] font-medium text-gold-400/60 font-mono">
                            {stampNum}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* PROGRESS STATUS ALERT */}
              {cliente.sellos_acumulados >= 10 ? (
                <div className="p-3.5 rounded-xl bg-gold-400/20 border border-gold-400/60 flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-gold-300 shrink-0" />
                  <div className="text-xs">
                    <strong className="text-gold-200 font-bold block">
                      ¡FELICITACIONES! PERFUME 50ML GRATIS DISPONIBLE
                    </strong>
                    <span className="text-emerald-100/90">
                      Presenta tu número en la tienda de Av. Heroínas o escribe por WhatsApp para coordinar tu fragancia gratis.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-700/40 text-xs text-emerald-200/80 flex items-center justify-between">
                  <span>
                    Te faltan <strong className="text-gold-300 font-bold">{10 - cliente.sellos_acumulados} sellos</strong> para tu perfume de 50ml gratis.
                  </span>
                  <span className="text-[10px] text-gold-400">1 compra = 1 sello</span>
                </div>
              )}

              {/* WHATSAPP ACTION BUTTON */}
              <div className="mt-5">
                <a
                  href={`https://wa.me/59175462800?text=${encodeURIComponent(
                    `Hola Vecar Perfumería, soy ${cliente.nombre_completo} (Telf: ${cliente.telefono}). Consulté mi tarjeta de fidelidad y tengo ${cliente.sellos_acumulados} de 10 sellos acumulados.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-full text-xs font-bold tracking-wider uppercase text-emerald-950 bg-gold-gradient hover:bg-gold-gradient-hover flex items-center justify-center gap-2 shadow-gold-glow transition-all"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>
                    {cliente.sellos_acumulados >= 10 ? "Solicitar Canje por WhatsApp" : "Contactar por WhatsApp"}
                  </span>
                </a>
              </div>

            </div>

            {/* MEMBER PERKS LIST */}
            <div className="p-4 rounded-2xl glass-emerald-subtle border border-gold-400/20 text-xs space-y-2">
              <h5 className="font-semibold text-gold-300 uppercase tracking-wider text-[11px]">
                Beneficios del Vecar Club:
              </h5>
              <ul className="space-y-1.5 text-gray-300/80">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                  <span>1 perfume de 50ml gratis por cada 10 sellos acumulados.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                  <span>Blindaje total: Tus sellos nunca se pierden si cambias de celular gracias a tu correo.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                  <span>Promociones exclusivas y fragancias regalo en el mes de tu cumpleaños.</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* NOT FOUND: REGISTRATION TRIGGER */}
        {hasSearched && !cliente && !showRegisterForm && (
          <div className="text-center py-8 px-4 rounded-2xl glass-emerald-subtle border border-gold-400/20">
            <Award className="w-10 h-10 text-gold-400/60 mx-auto mb-2" />
            <h4 className="font-serif text-lg text-white font-bold">
              No encontramos una cuenta registrada con ese dato
            </h4>
            <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
              ¿Es tu primera visita o compra? ¡Únete hoy mismo a Vecar Club y recibe tu primer sello de bienvenida de regalo!
            </p>
            <button
              onClick={() => setShowRegisterForm(true)}
              className="mt-4 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-emerald-950 bg-gold-gradient hover:bg-gold-gradient-hover shadow-gold-glow transition-all"
            >
              Registrarme en Vecar Club (+1 Sello Gratis)
            </button>
          </div>
        )}

        {/* REGISTRATION FORM */}
        {showRegisterForm && (
          <form
            onSubmit={handleRegister}
            className="p-5 rounded-2xl glass-emerald border border-gold-400/40 space-y-4 animate-in slide-in-from-bottom-2"
          >
            <div className="flex items-center justify-between pb-2 border-b border-gold-400/20">
              <h4 className="text-xs font-bold tracking-wider uppercase text-gold-300 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-gold-400" />
                <span>Registro Rápido al Club (+1 Sello Gratis)</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowRegisterForm(false)}
                className="text-xs text-gray-400 hover:text-white"
              >
                Cancelar
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-medium text-emerald-200/80 block mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ej. Valeria Quiroga"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-emerald-950 border border-gold-400/30 text-white focus:outline-none focus:border-gold-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-emerald-200/80 block mb-1">
                    Número de WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="Ej. 75462800"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-emerald-950 border border-gold-400/30 text-white focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-emerald-200/80 block mb-1">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="Ej. correo@gmail.com"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-emerald-950 border border-gold-400/30 text-white focus:outline-none focus:border-gold-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-emerald-200/80 block mb-1">
                  Fecha de Cumpleaños (Opcional - Regalos en tu mes)
                </label>
                <input
                  type="date"
                  value={newBirth}
                  onChange={(e) => setNewBirth(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-emerald-950 border border-gold-400/30 text-white focus:outline-none focus:border-gold-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isRegistering}
              className="w-full py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-emerald-950 bg-gold-gradient hover:bg-gold-gradient-hover shadow-gold-glow transition-all disabled:opacity-50"
            >
              {isRegistering ? "Creando Membresía..." : "Crear mi Tarjeta de Fidelidad"}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
