"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Producto, Cliente } from "@/types/database";
import {
  getProductos,
  saveProducto,
  deleteProducto,
  getClientes,
  findCliente,
  registerCliente,
  updateClienteSellos,
  canjearPremioFidelidad,
} from "@/lib/dataService";
import QRCode from "qrcode";
import {
  Award,
  Package,
  QrCode,
  Sparkles,
  Lock,
  Plus,
  Trash2,
  Edit2,
  Check,
  Search,
  Download,
  Printer,
  ChevronRight,
  TrendingUp,
  Receipt,
  RotateCcw,
  ShieldAlert,
  ArrowLeft,
  DollarSign,
  Smartphone,
} from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { Interactive3DCard } from "@/components/Interactive3DCard";
import { calculatePremioSugerido } from "@/lib/loyaltyRules";
import {
  getBusinessPaymentConfig,
  saveBusinessPaymentConfig,
  BusinessPaymentConfig,
} from "@/lib/configService";
import { BOTTLE_PRESENTATIONS } from "@/lib/bottleSizes";
import { Upload, Image as ImageIcon } from "lucide-react";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<"fidelidad" | "catalogo" | "qr" | "planplus">("fidelidad");

  // Fidelidad state
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clientSearch, setClientSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // New Client Modal
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [newClientName, setNewClientName] = useState("");
  const [newClientPhone, setNewClientPhone] = useState("");
  const [newClientEmail, setNewClientEmail] = useState("");
  const [newClientBirth, setNewClientBirth] = useState("");

  // Catalogo state
  const [productos, setProductos] = useState<Producto[]>([]);
  const [adminProductSearch, setAdminProductSearch] = useState("");
  const [editingProduct, setEditingProduct] = useState<Partial<Producto> | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);

  const filteredAdminProducts = useMemo(() => {
    if (!adminProductSearch.trim()) return productos;
    const q = adminProductSearch.toLowerCase();
    return productos.filter(
      (p) =>
        p.nombre.toLowerCase().includes(q) ||
        p.marca_casa.toLowerCase().includes(q) ||
        p.categoria.toLowerCase().includes(q) ||
        (p.notas_olfativas && p.notas_olfativas.toLowerCase().includes(q))
    );
  }, [productos, adminProductSearch]);

  // QR Code generator state
  const [qrType, setQrType] = useState<"web" | "club" | "whatsapp">("web");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  // POS Simulator state (Plan Plus preview)
  const [posCart, setPosCart] = useState<{ prod: Producto; qty: number }[]>([]);
  const [posPaymentMethod, setPosPaymentMethod] = useState<"EFECTIVO" | "QR">("EFECTIVO");
  const [posCustomerPhone, setPosCustomerPhone] = useState("");
  const [lastTicket, setLastTicket] = useState<{
    id: number;
    total: number;
    method: string;
    items: { name: string; qty: number; sub: number }[];
    clientName?: string;
    clientStamps?: number;
    date: string;
  } | null>(null);

  const defaultPin = process.env.NEXT_PUBLIC_ADMIN_PIN || "5910";

  useEffect(() => {
    // Check if already authenticated in session
    const auth = sessionStorage.getItem("vecar_admin_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
      loadData();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === defaultPin || pinInput === "5910") {
      setIsAuthenticated(true);
      sessionStorage.setItem("vecar_admin_auth", "true");
      setPinError(false);
      loadData();
    } else {
      setPinError(true);
    }
  };

  const loadData = async () => {
    const prods = await getProductos();
    setProductos(prods);
    const clis = await getClientes();
    setClientes(clis);
  };

  // Generate QR on tab change or qrType change
  useEffect(() => {
    if (!isAuthenticated) return;
    const generateQr = async () => {
      let url = "";
      const currentHost = typeof window !== "undefined" ? window.location.origin : "https://vecarperfumeria.bo";
      if (qrType === "web") url = currentHost;
      if (qrType === "club") url = `${currentHost}/#club`;
      if (qrType === "whatsapp") url = "https://wa.me/59175462800";

      try {
        const dataUrl = await QRCode.toDataURL(url, {
          width: 400,
          margin: 2,
          color: {
            dark: "#04120e",
            light: "#ffffff",
          },
        });
        setQrDataUrl(dataUrl);
      } catch (err) {
        console.error(err);
      }
    };
    generateQr();
  }, [qrType, isAuthenticated]);

  // Payment Config State
  const [paymentConfig, setPaymentConfig] = useState<BusinessPaymentConfig>(getBusinessPaymentConfig());

  // STAMPS ACTIONS (CON PRESENTACIONES OFICIALES: 10ML, 30ML, 50ML, 100ML)
  const handleAddStamp = async (clienteId: string, delta: number, presentacion_ml: number = 50) => {
    try {
      const res = await updateClienteSellos(clienteId, delta, `Compra en mostrador (${presentacion_ml} ML)`, presentacion_ml);
      setSelectedClient(res.cliente);
      setFeedbackMsg(`Sello (${presentacion_ml} ML) registrado con éxito: ${res.nuevo} / 10`);
      loadData();
      if (res.nuevo === 10) {
        confetti({ particleCount: 90, spread: 70 });
      }
      setTimeout(() => setFeedbackMsg(null), 3500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRedeemPrize = async (clienteId: string, presentacion_ml: number = 50) => {
    if (!confirm(`¿Confirmar entrega de PERFUME DE ${presentacion_ml} ML GRATIS al cliente? Sus sellos se reiniciarán a 0 para el nuevo ciclo de compras.`)) {
      return;
    }
    try {
      const res = await canjearPremioFidelidad(clienteId, presentacion_ml);
      setSelectedClient(res);
      setFeedbackMsg(`¡Premio de ${presentacion_ml} ML entregado con éxito! Tarjeta reiniciada a 0.`);
      loadData();
      confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 } });
      setTimeout(() => setFeedbackMsg(null), 4000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleUploadQrImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        const updated = saveBusinessPaymentConfig({ qr_imagen_url: dataUrl });
        setPaymentConfig(updated);
        setFeedbackMsg("¡Código QR de pago actualizado con éxito!");
        setTimeout(() => setFeedbackMsg(null), 3500);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveBankInfo = (e: React.FormEvent) => {
    e.preventDefault();
    saveBusinessPaymentConfig(paymentConfig);
    setFeedbackMsg("Datos bancarios y de cobro guardados con éxito.");
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName || !newClientPhone || !newClientEmail) return;
    try {
      const created = await registerCliente({
        nombre_completo: newClientName,
        telefono: newClientPhone,
        email: newClientEmail,
        fecha_nacimiento: newClientBirth || undefined,
      });
      setShowNewClientModal(false);
      setSelectedClient(created);
      setNewClientName("");
      setNewClientPhone("");
      setNewClientEmail("");
      setNewClientBirth("");
      setFeedbackMsg(`Cliente registrado con éxito con su primer sello de bienvenida.`);
      loadData();
      setTimeout(() => setFeedbackMsg(null), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  // PRODUCT ACTIONS
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.nombre || !editingProduct?.precio_venta) return;
    try {
      await saveProducto(editingProduct as any);
      setShowProductModal(false);
      setEditingProduct(null);
      loadData();
      setFeedbackMsg("Producto guardado correctamente en el catálogo.");
      setTimeout(() => setFeedbackMsg(null), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar esta fragancia del catálogo?")) return;
    try {
      await deleteProducto(id);
      loadData();
      setFeedbackMsg("Producto eliminado.");
      setTimeout(() => setFeedbackMsg(null), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  // POS SIMULATOR ACTIONS
  const handlePosAddToCart = (prod: Producto) => {
    setPosCart((prev) => {
      const found = prev.find((item) => item.prod.id === prod.id);
      if (found) {
        return prev.map((item) =>
          item.prod.id === prod.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { prod, qty: 1 }];
    });
  };

  const handlePosCheckout = () => {
    if (posCart.length === 0) return;
    const total = posCart.reduce((acc, i) => acc + i.prod.precio_venta * i.qty, 0);
    const ticketId = Math.floor(1000 + Math.random() * 9000);

    let clientMatch = clientes.find((c) => c.telefono.includes(posCustomerPhone.trim()));

    setLastTicket({
      id: ticketId,
      total,
      method: posPaymentMethod,
      items: posCart.map((i) => ({
        name: i.prod.nombre,
        qty: i.qty,
        sub: i.prod.precio_venta * i.qty,
      })),
      clientName: clientMatch?.nombre_completo || "Cliente Mostrador",
      clientStamps: clientMatch ? Math.min(10, clientMatch.sellos_acumulados + 1) : 1,
      date: new Date().toLocaleString("es-BO"),
    });

    // If client found, auto-increment stamp
    if (clientMatch) {
      updateClienteSellos(clientMatch.id, 1, `Venta POS #${ticketId}`);
      loadData();
    }

    setPosCart([]);
    setPosCustomerPhone("");
  };

  // =========================================================
  // VIEW: AUTHENTICATION LOCK SCREEN
  // =========================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-emerald-950/90 bg-emerald-radial">
        <div className="w-full max-w-sm p-8 rounded-3xl glass-emerald border border-gold-400/40 text-center shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="w-14 h-14 rounded-full border border-gold-400/60 bg-emerald-950 text-gold-400 flex items-center justify-center mx-auto mb-4 shadow-gold-glow">
            <Lock className="w-6 h-6" />
          </div>

          <span className="text-[10px] font-mono tracking-widest uppercase text-gold-400">
            PANEL DEL DUEÑO
          </span>
          <h2 className="font-serif text-2xl font-bold text-white mt-1">Vecar Perfumería</h2>
          <p className="text-xs text-emerald-200/70 mt-1 mb-6">
            Ingresa tu PIN de seguridad administrativo para acceder al control de sellos y catálogo.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                maxLength={6}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="PIN Maestro (5910)"
                className="w-full text-center tracking-[0.5em] text-lg font-bold py-3 rounded-xl bg-emerald-950/80 border border-gold-400/40 text-white placeholder-emerald-300/30 focus:outline-none focus:border-gold-400"
                autoFocus
              />
              {pinError && (
                <p className="text-[11px] text-red-400 mt-1 font-medium">
                  PIN incorrecto. Intenta con 5910
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full text-xs font-bold uppercase tracking-wider text-emerald-950 bg-gold-gradient hover:bg-gold-gradient-hover shadow-gold-glow transition-all"
            >
              Ingresar al Panel
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gold-500/10">
            <Link
              href="/"
              className="text-xs text-emerald-200/70 hover:text-gold-300 transition-colors flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver a la Tienda</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // VIEW: MAIN ADMIN DASHBOARD
  // =========================================================
  const filteredClients = clientes.filter(
    (c) =>
      c.nombre_completo.toLowerCase().includes(clientSearch.toLowerCase()) ||
      c.telefono.includes(clientSearch) ||
      c.email.toLowerCase().includes(clientSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-emerald-950/95 bg-emerald-radial text-gray-200 pb-20">
      
      {/* TOP BAR */}
      <header className="sticky top-0 z-30 w-full glass-emerald border-b border-gold-400/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between py-3">
          
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-full bg-emerald-950 border border-gold-400/30 text-gold-300 hover:text-white transition-colors"
              title="Volver a la tienda pública"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <span className="text-[10px] font-mono tracking-widest text-gold-400 uppercase">
                ADMINISTRACIÓN
              </span>
              <h1 className="font-serif text-lg sm:text-xl font-bold text-white">
                Vecar Perfumería Control
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sessionStorage.removeItem("vecar_admin_auth");
                setIsAuthenticated(false);
              }}
              className="px-3 py-1.5 rounded-full text-xs text-gold-300 hover:text-white bg-emerald-950/70 border border-gold-400/20 hover:border-gold-400/40 transition-all"
            >
              Cerrar Sesión
            </button>
          </div>

        </div>

        {/* TABS NAVIGATION */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto border-t border-gold-400/10 py-2 scrollbar-none">
          <button
            onClick={() => setActiveTab("fidelidad")}
            className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === "fidelidad"
                ? "bg-gold-500 text-emerald-950 shadow-md font-bold"
                : "text-gray-300 hover:text-white hover:bg-emerald-900/40"
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Control de Sellos (+1)</span>
          </button>

          <button
            onClick={() => setActiveTab("catalogo")}
            className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === "catalogo"
                ? "bg-gold-500 text-emerald-950 shadow-md font-bold"
                : "text-gray-300 hover:text-white hover:bg-emerald-900/40"
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Gestión de Catálogo</span>
          </button>

          <button
            onClick={() => setActiveTab("qr")}
            className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === "qr"
                ? "bg-gold-500 text-emerald-950 shadow-md font-bold"
                : "text-gray-300 hover:text-white hover:bg-emerald-900/40"
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Generador QR Mostrador</span>
          </button>

          <button
            onClick={() => setActiveTab("planplus")}
            className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === "planplus"
                ? "bg-gradient-to-r from-emerald-500 to-teal-400 text-emerald-950 shadow-md font-bold"
                : "text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900/40"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>Propuesta & Simulador POS (Plan Plus)</span>
          </button>
        </div>
      </header>

      {/* FEEDBACK TOAST */}
      {feedbackMsg && (
        <div className="fixed top-24 right-5 z-50 p-4 rounded-2xl bg-emerald-900 border border-gold-400 text-gold-200 text-xs shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-top-2">
          <Check className="w-4 h-4 text-gold-400" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* ========================================================= */}
        {/* TAB 1: GESTIÓN DE FIDELIDAD (VECAR CLUB SELLOS)           */}
        {/* ========================================================= */}
        {activeTab === "fidelidad" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-white">
                  Asignación de Sellos Vecar Club
                </h2>
                <p className="text-xs text-emerald-200/70 mt-0.5">
                  Busca al cliente por teléfono o correo y presiona <strong className="text-gold-300">+1 Sello</strong> tras confirmar su compra.
                </p>
              </div>

              <button
                onClick={() => setShowNewClientModal(true)}
                className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-emerald-950 bg-gold-gradient hover:bg-gold-gradient-hover shadow-gold-glow flex items-center gap-2 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Registrar Nuevo Cliente</span>
              </button>
            </div>

            {/* SEARCH BOX */}
            <div className="p-4 rounded-2xl glass-emerald border border-gold-400/20">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-400/70" />
                <input
                  type="text"
                  value={clientSearch}
                  onChange={(e) => setClientSearch(e.target.value)}
                  placeholder="Buscar por teléfono (ej. 75462800), nombre o correo..."
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-emerald-950 border border-gold-400/30 text-white placeholder-emerald-200/40 text-sm focus:outline-none focus:border-gold-400"
                />
              </div>
            </div>

            {/* CLIENTS LIST & QUICK STAMP ACTION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Clients Table Column */}
              <div className="lg:col-span-2 rounded-2xl glass-emerald border border-gold-400/20 overflow-hidden">
                <div className="p-4 border-b border-gold-400/10 flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gold-300">
                    Directorio de Clientes ({filteredClients.length})
                  </h3>
                  <span className="text-[10px] text-emerald-300/60 font-mono">
                    Blindaje WhatsApp + Correo
                  </span>
                </div>

                <div className="divide-y divide-gold-500/10 max-h-[600px] overflow-y-auto">
                  {filteredClients.length === 0 ? (
                    <div className="p-8 text-center text-xs text-gray-400">
                      No se encontraron clientes con ese criterio.
                    </div>
                  ) : (
                    filteredClients.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => setSelectedClient(c)}
                        className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer transition-colors ${
                          selectedClient?.id === c.id
                            ? "bg-gold-500/15 border-l-4 border-gold-400"
                            : "hover:bg-emerald-900/30"
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-serif font-bold text-white text-base">
                              {c.nombre_completo}
                            </h4>
                            {c.sellos_acumulados >= 10 && (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase text-emerald-950 bg-gold-400 animate-pulse">
                                ¡10 Sellos!
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-emerald-200/70 font-mono mt-0.5">
                            Telf: {c.telefono} • {c.email}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* STAMP BADGE */}
                          <div className="px-3 py-1 rounded-full bg-emerald-950 border border-gold-400/40 text-center">
                            <span className="text-xs font-mono font-bold text-gold-300">
                              {c.sellos_acumulados} / 10
                            </span>
                          </div>

                          {/* +1 SELLO BUTTON */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddStamp(c.id, 1);
                            }}
                            className="px-3 py-1.5 rounded-full text-xs font-bold uppercase text-emerald-950 bg-gold-gradient hover:bg-gold-gradient-hover shadow-sm active:scale-95 transition-all"
                            title="Sumar 1 sello por compra de 50ml"
                          >
                            +1 Sello
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Selected Client Card Details (TARJETA 3D INTERACTIVA + CONTROL DE SELLOS) */}
              <div className="rounded-3xl glass-emerald border border-gold-400/30 p-5 sm:p-6 self-start space-y-5">
                {selectedClient ? (
                  <>
                    <div className="flex items-center justify-between border-b border-gold-400/20 pb-3">
                      <div>
                        <span className="text-[10px] font-mono tracking-widest text-gold-400 uppercase block">
                          TARJETA DIGITAL VIP 3D
                        </span>
                        <h3 className="font-serif text-xl font-bold text-white">
                          {selectedClient.nombre_completo}
                        </h3>
                        <p className="text-xs text-emerald-200/70 font-mono">
                          WhatsApp: {selectedClient.telefono}
                        </p>
                      </div>
                      <div className="px-3 py-1.5 rounded-full bg-gold-400/20 border border-gold-400 text-gold-300 text-xs font-mono font-bold">
                        {selectedClient.sellos_acumulados} / 10
                      </div>
                    </div>

                    {/* 3D INTERACTIVE CARD IN ADMIN (REAL-TIME MOTION & GLARE) */}
                    <div className="py-1">
                      <Interactive3DCard cliente={selectedClient} interactive={true} />
                    </div>

                    {/* QUICK STAMP ASSIGNMENT BY BOTTLE SIZE */}
                    <div className="space-y-2 pt-2">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-gold-300 block">
                        Sumar Sello según Envase Vendido:
                      </label>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleAddStamp(selectedClient.id, 1, 10)}
                          className="p-2 rounded-xl text-xs font-bold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 shadow-sm transition-all text-left flex flex-col"
                        >
                          <span>+1 Sello 10 ML</span>
                          <span className="text-[9px] opacity-80 font-mono">Bs. 40 (Pocket)</span>
                        </button>

                        <button
                          onClick={() => handleAddStamp(selectedClient.id, 1, 30)}
                          className="p-2 rounded-xl text-xs font-bold text-emerald-950 bg-teal-400 hover:bg-teal-300 shadow-sm transition-all text-left flex flex-col"
                        >
                          <span>+1 Sello 30 ML</span>
                          <span className="text-[9px] opacity-80 font-mono">Bs. 70 (Personal)</span>
                        </button>

                        <button
                          onClick={() => handleAddStamp(selectedClient.id, 1, 50)}
                          className="p-2 rounded-xl text-xs font-bold text-emerald-950 bg-gold-400 hover:bg-gold-300 shadow-sm transition-all text-left flex flex-col ring-1 ring-gold-300"
                        >
                          <span>+1 Sello 50 ML</span>
                          <span className="text-[9px] opacity-80 font-mono">Bs. 90 (Signature)</span>
                        </button>

                        <button
                          onClick={() => handleAddStamp(selectedClient.id, 1, 100)}
                          className="p-2 rounded-xl text-xs font-bold text-emerald-950 bg-amber-400 hover:bg-amber-300 shadow-sm transition-all text-left flex flex-col"
                        >
                          <span>+1 Sello 100 ML</span>
                          <span className="text-[9px] opacity-80 font-mono">Bs. 145 (Deluxe)</span>
                        </button>
                      </div>

                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => handleAddStamp(selectedClient.id, -1)}
                          disabled={selectedClient.sellos_acumulados <= 0}
                          className="text-[11px] font-mono text-gray-400 hover:text-red-400 transition-colors disabled:opacity-30"
                        >
                          -1 Sello (Ajuste de error)
                        </button>
                      </div>
                    </div>

                    {/* DYNAMIC PRIZE CALCULATION & REDEMPTION (BASED ON MOST PURCHASED SIZE) */}
                    {(() => {
                      const premio = calculatePremioSugerido(selectedClient);
                      return (
                        <div className="space-y-3 pt-2 border-t border-gold-400/20">
                          {selectedClient.sellos_acumulados >= 10 ? (
                            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-gold-400/25 to-amber-600/20 border-2 border-gold-400 text-center space-y-2.5 shadow-gold-glow animate-pulse">
                              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-400 text-emerald-950 text-xs font-black uppercase tracking-wider">
                                <Award className="w-4 h-4 text-emerald-950" />
                                <span>¡PREMIO GANADO: 10 SELLOS!</span>
                              </div>
                              <h4 className="font-serif text-lg font-bold text-white">
                                Perfume de {premio.tamanoMl} ML GRATIS
                              </h4>
                              <p className="text-[11px] text-gold-200 leading-relaxed">
                                {premio.explicacion}
                              </p>
                              <button
                                onClick={() => handleRedeemPrize(selectedClient.id, premio.tamanoMl)}
                                className="w-full py-3 rounded-full text-xs font-bold uppercase tracking-wider text-emerald-950 bg-gold-gradient hover:bg-gold-gradient-hover shadow-lg transition-all active:scale-95"
                              >
                                🎁 Entregar Perfume {premio.tamanoMl} ML y Reiniciar Tarjeta a 0
                              </button>
                            </div>
                          ) : (
                            <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-gold-400/20 text-xs space-y-1.5">
                              <div className="flex items-center justify-between text-gold-300">
                                <span className="font-semibold">Premio proyectado:</span>
                                <span className="font-bold text-white">Perfume {premio.tamanoMl} ML GRATIS</span>
                              </div>
                              <p className="text-[11px] text-emerald-200/80">
                                Desglose actual: {premio.desglose.ml50} de 50ml • {premio.desglose.ml100} de 100ml • {premio.desglose.ml30} de 30ml • {premio.desglose.ml10} de 10ml.
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </>
                ) : (
                  <div className="text-center py-12 text-xs text-gray-400">
                    <Award className="w-10 h-10 text-gold-400/40 mx-auto mb-2" />
                    <p className="font-medium text-white">Ningún cliente seleccionado</p>
                    <p className="mt-1">Haz clic en un cliente de la lista para ver su tarjeta y administrar sus sellos.</p>
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: GESTIÓN DE CATÁLOGO (CRUD DE PRODUCTOS)            */}
        {/* ========================================================= */}
        {activeTab === "catalogo" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl font-bold text-white">
                  Catálogo de Fragancias (50 ml)
                </h2>
                <p className="text-xs text-emerald-200/70 mt-0.5">
                  Administra los precios, disponibilidad y notas de cada perfume.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingProduct({
                    nombre: "",
                    marca_casa: "Lattafa Perfumes",
                    categoria: "Árabes",
                    volumen_ml: 50,
                    precio_venta: 280,
                    precio_costo: 160,
                    stock_actual: 10,
                    aplica_sello_fidelidad: true,
                    activo: true,
                    imagen_url: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80",
                    notas_olfativas: "",
                    descripcion: "",
                  });
                  setShowProductModal(true);
                }}
                className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-emerald-950 bg-gold-gradient hover:bg-gold-gradient-hover shadow-gold-glow flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Añadir Fragancia</span>
              </button>
            </div>

            {/* PRODUCT SEARCH & STATS */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-emerald-950/60 border border-gold-400/20">
              <div className="w-full sm:w-80 relative">
                <input
                  type="text"
                  value={adminProductSearch}
                  onChange={(e) => setAdminProductSearch(e.target.value)}
                  placeholder="Buscar entre los 215 perfumes..."
                  className="w-full pl-9 pr-4 py-2 rounded-lg bg-emerald-900/40 border border-gold-400/30 text-white placeholder-emerald-200/40 text-xs focus:outline-none focus:border-gold-400"
                />
                <Package className="w-4 h-4 text-gold-400/70 absolute left-3 top-1/2 -translate-y-1/2" />
                {adminProductSearch && (
                  <button
                    onClick={() => setAdminProductSearch("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-gold-300 hover:text-white"
                  >
                    Limpiar
                  </button>
                )}
              </div>
              <div className="text-xs text-emerald-200/80 font-mono self-end sm:self-auto">
                Mostrando <strong className="text-gold-300">{filteredAdminProducts.length}</strong> de <strong className="text-white">{productos.length}</strong> fragancias
              </div>
            </div>

            {/* PRODUCT LIST */}
            <div className="rounded-2xl glass-emerald border border-gold-400/20 overflow-hidden">
              <div className="divide-y divide-gold-500/10 max-h-[680px] overflow-y-auto">
                {filteredAdminProducts.length === 0 ? (
                  <div className="p-8 text-center text-emerald-200/60 text-sm">
                    No se encontraron fragancias con la búsqueda "{adminProductSearch}".
                  </div>
                ) : (
                  filteredAdminProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-emerald-900/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={prod.imagen_url}
                        alt={prod.nombre}
                        className="w-14 h-14 rounded-xl object-cover border border-gold-400/30 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif font-bold text-white text-base">
                            {prod.nombre}
                          </h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold text-emerald-950 bg-gold-400">
                            {prod.categoria}
                          </span>
                          {!prod.activo && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold text-red-200 bg-red-900/60 border border-red-500/40">
                              Agotado
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gold-300 font-mono mt-0.5">
                          {prod.marca_casa} • {prod.volumen_ml} ml • Bs. {prod.precio_venta.toFixed(2)}
                        </p>
                        {prod.notas_olfativas && (
                          <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">
                            Notas: {prod.notas_olfativas}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => {
                          setEditingProduct(prod);
                          setShowProductModal(true);
                        }}
                        className="p-2 rounded-lg bg-emerald-950 border border-gold-400/30 text-gold-300 hover:text-white transition-colors"
                        title="Editar fragancia"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="p-2 rounded-lg bg-emerald-950 border border-red-500/30 text-red-400 hover:text-red-300 transition-colors"
                        title="Eliminar fragancia"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )))}
              </div>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: GENERADOR DE CÓDIGOS QR PARA VITRINAS              */}
        {/* ========================================================= */}
        {/* ========================================================= */}
        {/* TAB 3: GESTIÓN DE PAGOS QR Y CARTELES IMPRIMIBLES         */}
        {/* ========================================================= */}
        {activeTab === "qr" && (
          <div className="space-y-10 animate-in fade-in duration-200">
            
            {/* SECCIÓN 1: SUBIR Y ADMINISTRAR QR OFICIAL DE COBROS */}
            <div className="p-6 rounded-3xl glass-emerald border border-gold-400/30 space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-400/20 text-gold-300 text-[11px] font-bold uppercase tracking-wider mb-2 border border-gold-400/30">
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Cobros por QR Simple en Tienda Online</span>
                </div>
                <h2 className="font-serif text-2xl font-bold text-white">
                  Subir Código QR Oficial de Cobros (Bolivia)
                </h2>
                <p className="text-xs text-emerald-200/70 mt-1 max-w-2xl">
                  Sube aquí la imagen o captura de tu código QR Simple (Banco Unión, BCP, BNB, Mercantil, etc.). Esta imagen se mostrará automáticamente a los clientes en el carrito de compras cuando elijan pagar el 100% o dejar un adelanto de reserva.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                
                {/* UPLOADER & BANK DETAILS FORM */}
                <form onSubmit={handleSaveBankInfo} className="space-y-4">
                  {/* FILE UPLOAD BUTTON */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gold-300 block mb-2">
                      Subir Imagen del Código QR (JPG / PNG):
                    </label>
                    <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gold-400/40 rounded-2xl bg-emerald-950/60 hover:bg-emerald-900/40 cursor-pointer transition-colors group">
                      <Upload className="w-8 h-8 text-gold-400 group-hover:scale-110 transition-transform mb-2" />
                      <span className="text-xs font-semibold text-white">Haz clic para subir o cambiar el QR de cobro</span>
                      <span className="text-[10px] text-emerald-300/60 mt-1">Soporta capturas de banca móvil o PDF exportado como imagen</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleUploadQrImage}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* BANK FIELDS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-emerald-200/80 block mb-1">
                        Banco / Red:
                      </label>
                      <input
                        type="text"
                        value={paymentConfig.banco_nombre}
                        onChange={(e) => setPaymentConfig({ ...paymentConfig, banco_nombre: e.target.value })}
                        placeholder="Ej. Banco Unión (QR Simple)"
                        className="w-full px-3 py-2 rounded-xl text-xs bg-emerald-950 border border-gold-400/30 text-white focus:outline-none focus:border-gold-400"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-emerald-200/80 block mb-1">
                        Titular de la Cuenta:
                      </label>
                      <input
                        type="text"
                        value={paymentConfig.titular_cuenta}
                        onChange={(e) => setPaymentConfig({ ...paymentConfig, titular_cuenta: e.target.value })}
                        placeholder="Ej. Vecar Perfumería"
                        className="w-full px-3 py-2 rounded-xl text-xs bg-emerald-950 border border-gold-400/30 text-white focus:outline-none focus:border-gold-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-emerald-200/80 block mb-1">
                        Número de Cuenta / Detalle:
                      </label>
                      <input
                        type="text"
                        value={paymentConfig.numero_cuenta}
                        onChange={(e) => setPaymentConfig({ ...paymentConfig, numero_cuenta: e.target.value })}
                        placeholder="Caja de Ahorro / QR Interbancario"
                        className="w-full px-3 py-2 rounded-xl text-xs bg-emerald-950 border border-gold-400/30 text-white focus:outline-none focus:border-gold-400"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-emerald-200/80 block mb-1">
                        Adelanto Mínimo para Reservas (Bs.):
                      </label>
                      <input
                        type="number"
                        min={10}
                        value={paymentConfig.adelanto_minimo_bob}
                        onChange={(e) => setPaymentConfig({ ...paymentConfig, adelanto_minimo_bob: Number(e.target.value) || 50 })}
                        className="w-full px-3 py-2 rounded-xl text-xs bg-emerald-950 border border-gold-400/30 text-white focus:outline-none focus:border-gold-400 font-bold"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-emerald-950 bg-gold-gradient hover:bg-gold-gradient-hover shadow-gold-glow transition-all"
                  >
                    Guardar Configuración de Cobro QR
                  </button>
                </form>

                {/* CURRENT LIVE QR PREVIEW */}
                <div className="p-5 rounded-2xl bg-black/50 border border-gold-400/30 flex flex-col items-center text-center space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gold-400">
                    VISTA PREVIA DEL QR EN EL CARRITO
                  </span>

                  <div className="p-3 rounded-2xl bg-white border-2 border-gold-400 shadow-xl max-w-[220px]">
                    <img
                      src={paymentConfig.qr_imagen_url || "/qr_vecar_oficial.png"}
                      alt="QR de Pago Vecar"
                      className="w-48 h-48 object-contain"
                    />
                  </div>

                  <div className="text-xs">
                    <p className="font-bold text-white text-sm">{paymentConfig.titular_cuenta}</p>
                    <p className="text-gold-300 font-medium">{paymentConfig.banco_nombre}</p>
                    <p className="text-[10px] text-emerald-200/60 mt-0.5">{paymentConfig.numero_cuenta}</p>
                  </div>

                  <div className="p-2 rounded-lg bg-emerald-900/40 border border-emerald-700/50 text-[10px] text-emerald-200/90 text-left w-full">
                    ✓ Este es el código que verán los clientes en su celular al seleccionar "QR Simple" o "Dejar Adelanto".
                  </div>
                </div>

              </div>
            </div>

            {/* SECCIÓN 2: CARTELES IMPRIMIBLES PARA VITRINA */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-white">
                Generador de Códigos QR para Mostradores y Vitrinas
              </h2>
              <p className="text-xs text-emerald-200/70 mt-0.5">
                Genera e imprime carteles QR para que los clientes en tu tienda física de Cochabamba escaneen con su celular.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              
              {/* CONFIGURATION */}
              <div className="p-6 rounded-2xl glass-emerald border border-gold-400/30 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gold-300">
                  Selecciona el Destino del Código QR:
                </h3>

                <div className="space-y-2.5">
                  <button
                    onClick={() => setQrType("web")}
                    className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                      qrType === "web"
                        ? "bg-gold-500 text-emerald-950 font-bold border-gold-400 shadow-md"
                        : "bg-emerald-950/70 border-gold-400/20 text-gray-300 hover:text-white"
                    }`}
                  >
                    <span>1. Catálogo Web Completo</span>
                    <span className="text-[10px] font-mono">Tienda en Vivo</span>
                  </button>

                  <button
                    onClick={() => setQrType("club")}
                    className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                      qrType === "club"
                        ? "bg-gold-500 text-emerald-950 font-bold border-gold-400 shadow-md"
                        : "bg-emerald-950/70 border-gold-400/20 text-gray-300 hover:text-white"
                    }`}
                  >
                    <span>2. Consulta de Sellos Vecar Club</span>
                    <span className="text-[10px] font-mono">Para el Mostrador</span>
                  </button>

                  <button
                    onClick={() => setQrType("whatsapp")}
                    className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                      qrType === "whatsapp"
                        ? "bg-gold-500 text-emerald-950 font-bold border-gold-400 shadow-md"
                        : "bg-emerald-950/70 border-gold-400/20 text-gray-300 hover:text-white"
                    }`}
                  >
                    <span>3. Chat Directo de WhatsApp (75462800)</span>
                    <span className="text-[10px] font-mono">Atención Inmediata</span>
                  </button>
                </div>

                <div className="pt-2 text-xs text-gray-400 leading-relaxed">
                  Tip: Imprime este código en un soporte de acrílico y colócalo junto a la vitrina de fragancias de 50 ml.
                </div>
              </div>

              {/* QR CODE PREVIEW CARD */}
              <div className="p-6 rounded-3xl bg-white text-black text-center shadow-2xl flex flex-col items-center justify-center max-w-sm mx-auto">
                <div className="mb-2">
                  <h4 className="font-serif text-xl font-bold tracking-widest text-[#04120e]">
                    VECAR PERFUMERÍA
                  </h4>
                  <p className="text-[10px] font-medium text-[#b89028] uppercase tracking-wider -mt-0.5">
                    Av. Heroínas • Cochabamba
                  </p>
                </div>

                {qrDataUrl && (
                  <div className="p-2 border-2 border-[#d4af37] rounded-2xl my-2">
                    <img src={qrDataUrl} alt="Código QR Vecar" className="w-56 h-56" />
                  </div>
                )}

                <p className="text-xs font-bold text-[#04120e] mt-2">
                  {qrType === "club"
                    ? "¡ESCANEA Y REVISA TUS SELLOS VECAR CLUB!"
                    : qrType === "whatsapp"
                    ? "¡ESCANEA PARA ASESORÍA POR WHATSAPP!"
                    : "¡ESCANEA PARA EXPLORAR NUESTRO CATÁLOGO!"}
                </p>
                <p className="text-[9px] text-gray-600">
                  10 Sellos de 50ml = 1 Perfume Gratis
                </p>

                {qrDataUrl && (
                  <a
                    href={qrDataUrl}
                    download={`QR_Vecar_${qrType}.png`}
                    className="mt-4 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-[#04120e] hover:bg-[#08221b] flex items-center gap-1.5 shadow-md"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Descargar Imagen QR</span>
                  </a>
                )}
              </div>

            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: PROPUESTA Y SIMULADOR POS (PLAN PLUS)              */}
        {/* ========================================================= */}
        {activeTab === "planplus" && (
          <div className="space-y-10 animate-in fade-in duration-200">
            
            {/* PLAN PLUS PRESENTATION HEADER */}
            <div className="p-6 sm:p-8 rounded-3xl glass-emerald border border-gold-400/40 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />

              <div className="max-w-3xl space-y-3 relative z-10">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-emerald-950 bg-gradient-to-r from-emerald-400 to-teal-300">
                  PROPUESTA EJECUTIVA • PLAN PLUS
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
                  ERP Comercial + POS de Mostrador + Tickets Térmicos
                </h2>
                <p className="text-sm text-emerald-100/80 leading-relaxed font-light">
                  Esta es la arquitectura integral diseñada para cuando el negocio decida dar el salto: elimina las notas de papel, previene pérdidas de inventario, automatiza el cálculo de sellos directamente al emitir el recibo físico y envía el arqueo de caja diario al correo del dueño vía Google SMTP.
                </p>
              </div>

              {/* COMPARISON CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="p-4 rounded-xl bg-emerald-950/70 border border-gold-400/20 space-y-2">
                  <h4 className="text-xs font-bold uppercase text-gold-300 flex items-center gap-1.5">
                    <Receipt className="w-4 h-4 text-gold-400" />
                    <span>Tickets Térmicos 58/80mm</span>
                  </h4>
                  <p className="text-[11px] text-gray-300">
                    Impresión instantánea en mostrador con logo, detalle y estado de sellos: <em>«Sellos: 7 de 10. ¡Te faltan 3!»</em>.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-950/70 border border-gold-400/20 space-y-2">
                  <h4 className="text-xs font-bold uppercase text-gold-300 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-gold-400" />
                    <span>Kardex & Control de Costos</span>
                  </h4>
                  <p className="text-[11px] text-gray-300">
                    Descuento automático de stock por unidad vendida, alertas de stock mínimo (2 unidades) y margen de ganancia real.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-950/70 border border-gold-400/20 space-y-2">
                  <h4 className="text-xs font-bold uppercase text-gold-300 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-gold-400" />
                    <span>Arqueo Ciego de Caja</span>
                  </h4>
                  <p className="text-[11px] text-gray-300">
                    El cajero no ve el total del sistema. Al cerrar turno, el dueño recibe el reporte diario al correo con faltantes/sobrantes.
                  </p>
                </div>
              </div>
            </div>

            {/* INTERACTIVE POS SIMULATOR (TOUCH-FRIENDLY DEMONSTRATION) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                    <Smartphone className="w-6 h-6 text-gold-400" />
                    <span>Simulador Interactivo del Punto de Venta (POS)</span>
                  </h3>
                  <p className="text-xs text-emerald-200/70">
                    Prueba cómo funcionará el cobro táctil en mostrador. Selecciona perfumes, añade el teléfono del cliente y emite un ticket.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* POS PRODUCTS GRID (LEFT) */}
                <div className="lg:col-span-7 rounded-2xl glass-emerald border border-gold-400/25 p-5 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gold-300">
                    Toca para añadir al cobro:
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {productos.slice(0, 6).map((prod) => (
                      <button
                        key={prod.id}
                        onClick={() => handlePosAddToCart(prod)}
                        className="p-3 rounded-xl bg-emerald-950 border border-gold-400/20 hover:border-gold-400 text-left transition-all active:scale-95 group"
                      >
                        <span className="text-[9px] font-bold text-gold-400 uppercase block truncate">
                          {prod.marca_casa}
                        </span>
                        <h5 className="font-serif font-bold text-white text-xs truncate mt-0.5 group-hover:text-gold-200">
                          {prod.nombre}
                        </h5>
                        <span className="text-xs font-bold font-mono text-gold-300 mt-1 block">
                          Bs. {prod.precio_venta.toFixed(2)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* POS REGISTER & TICKET PREVIEW (RIGHT) */}
                <div className="lg:col-span-5 rounded-2xl glass-emerald border border-gold-400/30 p-5 space-y-4 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gold-300 pb-2 border-b border-gold-400/20 flex items-center justify-between">
                      <span>Cobro en Mostrador</span>
                      <span className="text-[10px] font-mono text-emerald-300/80">Turno 1</span>
                    </h4>

                    {/* ITEMS IN POS CART */}
                    <div className="divide-y divide-gold-500/10 max-h-48 overflow-y-auto my-2">
                      {posCart.length === 0 ? (
                        <p className="text-xs text-gray-400 text-center py-6">
                          Ningún producto en mostrador. Selecciona de la izquierda.
                        </p>
                      ) : (
                        posCart.map((item) => (
                          <div key={item.prod.id} className="py-2 flex items-center justify-between text-xs">
                            <div>
                              <span className="font-bold text-white block">{item.prod.nombre}</span>
                              <span className="text-[10px] text-gray-400">{item.qty} x Bs. {item.prod.precio_venta}</span>
                            </div>
                            <span className="font-mono font-bold text-gold-300">
                              Bs. {(item.prod.precio_venta * item.qty).toFixed(2)}
                            </span>
                          </div>
                        ))
                      )}
                    </div>

                    {/* CLIENT PHONE FOR AUTO STAMP */}
                    <div className="pt-2">
                      <label className="text-[10px] font-mono uppercase text-emerald-200/80 block mb-1">
                        Celular del Cliente (Para Sello Automático):
                      </label>
                      <input
                        type="text"
                        value={posCustomerPhone}
                        onChange={(e) => setPosCustomerPhone(e.target.value)}
                        placeholder="Ej. 75462800"
                        className="w-full px-3 py-1.5 rounded-lg text-xs bg-emerald-950 border border-gold-400/30 text-white focus:outline-none focus:border-gold-400"
                      />
                    </div>

                    {/* PAYMENT METHOD */}
                    <div className="flex gap-2 pt-3">
                      <button
                        onClick={() => setPosPaymentMethod("EFECTIVO")}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold uppercase ${
                          posPaymentMethod === "EFECTIVO"
                            ? "bg-gold-400 text-emerald-950"
                            : "bg-emerald-950 border border-gold-400/30 text-gray-300"
                        }`}
                      >
                        Efectivo
                      </button>
                      <button
                        onClick={() => setPosPaymentMethod("QR")}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold uppercase ${
                          posPaymentMethod === "QR"
                            ? "bg-gold-400 text-emerald-950"
                            : "bg-emerald-950 border border-gold-400/30 text-gray-300"
                        }`}
                      >
                        QR Simple
                      </button>
                    </div>
                  </div>

                  {/* TOTAL & SUBMIT */}
                  <div className="pt-3 border-t border-gold-400/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase text-gray-400">Total Venta</span>
                      <span className="font-serif text-2xl font-bold text-gold-300">
                        Bs.{" "}
                        {posCart
                          .reduce((acc, i) => acc + i.prod.precio_venta * i.qty, 0)
                          .toFixed(2)}
                      </span>
                    </div>

                    <button
                      onClick={handlePosCheckout}
                      disabled={posCart.length === 0}
                      className="w-full py-3 rounded-full text-xs font-bold uppercase tracking-wider text-emerald-950 bg-gold-gradient hover:bg-gold-gradient-hover shadow-gold-glow disabled:opacity-40 flex items-center justify-center gap-2"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Emitir Ticket & Asignar Sello</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* TICKET SIMULATION OUTPUT (THERMAL PRINTER PREVIEW) */}
              {lastTicket && (
                <div className="mt-6 p-6 rounded-3xl bg-white text-black max-w-sm mx-auto shadow-2xl font-mono text-xs border border-gray-300 animate-in zoom-in-95">
                  <div className="text-center border-b border-dashed border-gray-400 pb-3 mb-3">
                    <h4 className="font-bold text-base tracking-widest">VECAR PERFUMERÍA</h4>
                    <p className="text-[10px]">Av. Heroínas e/ Oquendo y 16 de Julio</p>
                    <p className="text-[10px]">Cochabamba - Bolivia • Tel: 75462800</p>
                    <p className="text-[10px] mt-1 font-bold">RECIBO #{lastTicket.id}</p>
                    <p className="text-[9px] text-gray-600">{lastTicket.date}</p>
                  </div>

                  <div className="space-y-1 mb-3">
                    <p className="text-[10px]">CLIENTE: {lastTicket.clientName}</p>
                    <p className="text-[10px]">PAGO: {lastTicket.method}</p>
                  </div>

                  <div className="border-t border-b border-dashed border-gray-400 py-2 space-y-1 mb-3">
                    {lastTicket.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between text-[11px]">
                        <span>{it.qty}x {it.name}</span>
                        <span>Bs. {it.sub.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between font-bold text-sm mb-3">
                    <span>TOTAL:</span>
                    <span>Bs. {lastTicket.total.toFixed(2)}</span>
                  </div>

                  {/* VECAR CLUB SECTION ON TICKET */}
                  <div className="bg-gray-100 p-2.5 rounded border border-gray-300 text-center space-y-1">
                    <p className="font-bold text-[10px] text-emerald-900 uppercase">
                      *** VECAR CLUB FIDELIDAD ***
                    </p>
                    <p className="text-[11px] font-bold">
                      Sellos Acumulados: {lastTicket.clientStamps} de 10
                    </p>
                    <p className="text-[9px] text-gray-700">
                      {(lastTicket.clientStamps ?? 0) >= 10
                        ? "¡FELICIDADES! ¡TU PRÓXIMO 50ML ES GRATIS!"
                        : `¡Te faltan ${10 - (lastTicket.clientStamps ?? 0)} sellos para tu perfume de 50ml gratis!`}
                    </p>
                  </div>

                  <div className="text-center mt-3 text-[9px] text-gray-500">
                    ¡Gracias por tu compra en Vecar Perfumería!
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

      </main>

      {/* ========================================================= */}
      {/* MODAL: REGISTRAR NUEVO CLIENTE (ADMIN)                    */}
      {/* ========================================================= */}
      {showNewClientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md p-6 rounded-3xl glass-emerald border border-gold-400/40 shadow-2xl">
            <h3 className="font-serif text-xl font-bold text-white mb-4">
              Registrar Cliente en Vecar Club
            </h3>

            <form onSubmit={handleCreateClient} className="space-y-3">
              <div>
                <label className="text-xs text-gold-300 block mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  placeholder="Ej. Roberto Claros"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-emerald-950 border border-gold-400/30 text-white focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="text-xs text-gold-300 block mb-1">Celular / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  value={newClientPhone}
                  onChange={(e) => setNewClientPhone(e.target.value)}
                  placeholder="Ej. 75462800"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-emerald-950 border border-gold-400/30 text-white focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="text-xs text-gold-300 block mb-1">Correo Electrónico (Blindaje) *</label>
                <input
                  type="email"
                  required
                  value={newClientEmail}
                  onChange={(e) => setNewClientEmail(e.target.value)}
                  placeholder="Ej. roberto@gmail.com"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-emerald-950 border border-gold-400/30 text-white focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="text-xs text-gold-300 block mb-1">Fecha de Cumpleaños</label>
                <input
                  type="date"
                  value={newClientBirth}
                  onChange={(e) => setNewClientBirth(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-emerald-950 border border-gold-400/30 text-white focus:outline-none focus:border-gold-400"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNewClientModal(false)}
                  className="flex-1 py-2.5 rounded-full text-xs text-gray-300 bg-emerald-950 border border-gold-400/20"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full text-xs font-bold uppercase text-emerald-950 bg-gold-gradient hover:bg-gold-gradient-hover shadow-gold-glow"
                >
                  Guardar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: EDITAR / CREAR PRODUCTO (ADMIN)                    */}
      {/* ========================================================= */}
      {showProductModal && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 rounded-3xl glass-emerald border border-gold-400/40 shadow-2xl">
            <h3 className="font-serif text-xl font-bold text-white mb-4">
              {editingProduct.id ? "Editar Fragancia" : "Nueva Fragancia (50 ml)"}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-3">
              <div>
                <label className="text-xs text-gold-300 block mb-1">Nombre de la Fragancia *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.nombre || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, nombre: e.target.value })}
                  placeholder="Ej. Khamrah Qahwa"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-emerald-950 border border-gold-400/30 text-white focus:outline-none focus:border-gold-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gold-300 block mb-1">Casa / Marca *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.marca_casa || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, marca_casa: e.target.value })}
                    placeholder="Ej. Lattafa Perfumes"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-emerald-950 border border-gold-400/30 text-white focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="text-xs text-gold-300 block mb-1">Categoría</label>
                  <select
                    value={editingProduct.categoria || "Árabes"}
                    onChange={(e) => setEditingProduct({ ...editingProduct, categoria: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-emerald-950 border border-gold-400/30 text-white focus:outline-none focus:border-gold-400"
                  >
                    <option value="Árabes">Árabes</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gold-300 block mb-1">Precio Venta (Bs.) *</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={editingProduct.precio_venta ?? 280}
                    onChange={(e) => setEditingProduct({ ...editingProduct, precio_venta: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-emerald-950 border border-gold-400/30 text-white focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="text-xs text-gold-300 block mb-1">Volumen (ml)</label>
                  <input
                    type="number"
                    value={editingProduct.volumen_ml ?? 50}
                    onChange={(e) => setEditingProduct({ ...editingProduct, volumen_ml: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-emerald-950 border border-gold-400/30 text-white focus:outline-none focus:border-gold-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gold-300 block mb-1">Notas Olfativas</label>
                <input
                  type="text"
                  value={editingProduct.notas_olfativas || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, notas_olfativas: e.target.value })}
                  placeholder="Ej. Café, Canela, Praliné, Vainilla"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-emerald-950 border border-gold-400/30 text-white focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="text-xs text-gold-300 block mb-1">URL de la Imagen</label>
                <input
                  type="text"
                  value={editingProduct.imagen_url || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, imagen_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl text-xs bg-emerald-950 border border-gold-400/30 text-white focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="text-xs text-gold-300 block mb-1">Descripción</label>
                <textarea
                  rows={2}
                  value={editingProduct.descripcion || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, descripcion: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-emerald-950 border border-gold-400/30 text-white focus:outline-none focus:border-gold-400"
                />
              </div>

              <div className="flex items-center gap-4 py-1">
                <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.activo ?? true}
                    onChange={(e) => setEditingProduct({ ...editingProduct, activo: e.target.checked })}
                    className="rounded text-gold-500 focus:ring-gold-400"
                  />
                  <span>Disponible en Stock</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.destacado ?? false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, destacado: e.target.checked })}
                    className="rounded text-gold-500 focus:ring-gold-400"
                  />
                  <span>Top Trend Destacado</span>
                </label>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="flex-1 py-2.5 rounded-full text-xs text-gray-300 bg-emerald-950 border border-gold-400/20"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full text-xs font-bold uppercase text-emerald-950 bg-gold-gradient hover:bg-gold-gradient-hover shadow-gold-glow"
                >
                  Guardar Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
