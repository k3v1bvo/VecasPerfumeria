"use client";

import React, { useState, useEffect } from "react";
import { CartItem } from "@/types/database";
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  MessageCircle,
  Award,
  QrCode,
  Banknote,
  ShieldCheck,
  Sparkles,
  Info,
  CheckCircle2,
} from "lucide-react";
import { getBusinessPaymentConfig, BusinessPaymentConfig } from "@/lib/configService";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

type PaymentMethodType = "qr_total" | "qr_adelanto" | "efectivo";

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("qr_total");
  const [adelantoCustom, setAdelantoCustom] = useState<number>(50);
  const [paymentConfig, setPaymentConfig] = useState<BusinessPaymentConfig>(getBusinessPaymentConfig());

  useEffect(() => {
    if (isOpen) {
      setPaymentConfig(getBusinessPaymentConfig());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const totalAmount = items.reduce((acc, item) => {
    const unitPrice = item.precio_unitario || item.producto.precio_venta;
    return acc + unitPrice * item.cantidad;
  }, 0);

  const totalItems = items.reduce((acc, item) => acc + item.cantidad, 0);

  // Cada frasco suma 1 sello
  const potentialStamps = items.reduce((acc, item) => {
    return item.producto.aplica_sello_fidelidad ? acc + item.cantidad : acc;
  }, 0);

  const adelantoAmount = Math.min(totalAmount, Math.max(10, adelantoCustom || paymentConfig.adelanto_minimo_bob));
  const saldoPendiente = Math.max(0, totalAmount - adelantoAmount);

  const handleCheckoutWhatsApp = () => {
    if (items.length === 0) return;

    let message = `🌟 *NUEVO PEDIDO - VECAR PERFUMERÍA* 🌟\n`;
    message += `------------------------------------------\n`;
    if (customerName.trim()) {
      message += `👤 *Cliente:* ${customerName.trim()}\n`;
    }
    if (customerPhone.trim()) {
      message += `📱 *Teléfono:* ${customerPhone.trim()}\n`;
    }
    message += `📍 *Ciudad:* Cochabamba / Envío Nacional\n`;
    message += `------------------------------------------\n\n`;
    message += `🛍️ *FRAGANCIAS SOLICITADAS:*\n`;

    items.forEach((item, idx) => {
      const vol = item.presentacion_ml || item.producto.volumen_ml || 50;
      const unit = item.precio_unitario || item.producto.precio_venta;
      const sub = (unit * item.cantidad).toFixed(2);
      message += `${idx + 1}. *${item.producto.nombre}*\n`;
      message += `   • Presentación: *${vol} ml*\n`;
      message += `   • Casa: ${item.producto.marca_casa}\n`;
      message += `   • Cantidad: ${item.cantidad} x Bs. ${unit.toFixed(2)} = *Bs. ${sub}*\n\n`;
    });

    message += `------------------------------------------\n`;
    message += `💰 *TOTAL GENERAL:* Bs. ${totalAmount.toFixed(2)}\n`;

    // Payment details
    if (paymentMethod === "qr_total") {
      message += `💳 *MÉTODO DE PAGO:* Pago Total con QR Simple (Bs. ${totalAmount.toFixed(2)})\n`;
      message += `📸 *Comprobante de Pago:* Adjunto a continuación la captura del QR.\n`;
    } else if (paymentMethod === "qr_adelanto") {
      message += `💳 *MÉTODO DE PAGO:* Reserva con Adelanto QR\n`;
      message += `   • Adelanto Pagado por QR: *Bs. ${adelantoAmount.toFixed(2)}*\n`;
      message += `   • Saldo a pagar al recoger en tienda: *Bs. ${saldoPendiente.toFixed(2)}*\n`;
      message += `📸 *Comprobante de Adelanto:* Adjunto a continuación la captura.\n`;
    } else {
      message += `💵 *MÉTODO DE PAGO:* Efectivo en tienda o contra entrega al recoger (Bs. ${totalAmount.toFixed(2)})\n`;
    }

    message += `🎖️ *SELLOS VECAR CLUB:* Acumula +${potentialStamps} sello(s) para tarjeta de fidelidad.\n`;
    message += `------------------------------------------\n`;
    message += `Por favor confirmar disponibilidad y recepción del pedido.`;

    const encoded = encodeURIComponent(message);
    const targetPhone = paymentConfig.whatsapp_pedidos || "59175462800";
    const whatsappUrl = `https://wa.me/${targetPhone}?text=${encoded}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg h-full glass-emerald border-l border-gold-400/30 flex flex-col justify-between shadow-2xl relative animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* HEADER */}
        <div className="p-4 sm:p-5 border-b border-gold-400/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-full bg-gold-400/20 text-gold-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white">Tu Carrito de Fragancias</h3>
              <p className="text-xs text-emerald-200/70">{totalItems} producto(s) • Entrega en Cochabamba y envíos</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-white bg-emerald-950/50 hover:bg-emerald-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ITEMS & PAYMENT FLOW */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="w-12 h-12 text-gold-400/40 mx-auto mb-3" />
              <p className="font-serif text-lg text-white font-semibold">Tu carrito está vacío</p>
              <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
                Explora nuestro catálogo de perfumes y añade tus fragancias favoritas.
              </p>
              <button
                onClick={onClose}
                className="mt-5 px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider text-emerald-950 bg-gold-400 hover:bg-gold-300 transition-all"
              >
                Explorar Catálogo
              </button>
            </div>
          ) : (
            <>
              {/* CART ITEMS */}
              <div className="space-y-3">
                {items.map((item) => {
                  const vol = item.presentacion_ml || item.producto.volumen_ml || 50;
                  const unitPrice = item.precio_unitario || item.producto.precio_venta;
                  const subtotal = unitPrice * item.cantidad;

                  return (
                    <div
                      key={item.id || item.producto.id}
                      className="p-3 rounded-2xl glass-emerald-subtle border border-gold-400/20 flex items-center gap-3.5"
                    >
                      <img
                        src={item.producto.imagen_url}
                        alt={item.producto.nombre}
                        className="w-16 h-16 rounded-xl object-cover border border-gold-400/30 shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] uppercase tracking-wider text-gold-400 font-medium truncate">
                            {item.producto.marca_casa}
                          </span>
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-gold-400/20 text-gold-300 border border-gold-400/30">
                            {vol} ml
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white truncate font-serif mt-0.5">
                          {item.producto.nombre}
                        </h4>
                        <span className="text-xs font-semibold text-gold-300 block mt-0.5">
                          Bs. {subtotal.toFixed(2)}
                          {item.cantidad > 1 && (
                            <span className="text-[10px] text-gray-400 ml-1 font-normal">
                              ({item.cantidad} x Bs. {unitPrice.toFixed(2)})
                            </span>
                          )}
                        </span>

                        <div className="flex items-center gap-2 mt-1.5">
                          <button
                            onClick={() => onUpdateQuantity(item.producto.id, -1)}
                            className="w-6 h-6 rounded-full bg-emerald-950 border border-gold-400/30 text-gold-300 hover:text-white flex items-center justify-center transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-mono font-bold text-white px-1">
                            {item.cantidad}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.producto.id, 1)}
                            className="w-6 h-6 rounded-full bg-emerald-950 border border-gold-400/30 text-gold-300 hover:text-white flex items-center justify-center transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.producto.id)}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                        title="Eliminar producto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* PAYMENT METHOD SELECTION (BEFORE WHATSAPP) */}
              <div className="mt-4 p-4 rounded-2xl bg-emerald-950/70 border border-gold-400/30 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gold-300 flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-gold-400" />
                    <span>¿Cómo prefieres pagar tu pedido?</span>
                  </h4>
                  <span className="text-[10px] text-emerald-200/70">Paso previo</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {/* OPTION 1: QR TOTAL */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("qr_total")}
                    className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      paymentMethod === "qr_total"
                        ? "bg-gold-500/20 border-gold-400 text-white shadow-sm ring-1 ring-gold-400/50"
                        : "bg-emerald-900/40 border-emerald-800 text-gray-300 hover:border-gold-400/40"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <QrCode className="w-4 h-4 text-gold-400" />
                      {paymentMethod === "qr_total" && <CheckCircle2 className="w-3.5 h-3.5 text-gold-400" />}
                    </div>
                    <div>
                      <span className="text-[11px] font-bold block leading-tight">QR Simple</span>
                      <span className="text-[9px] text-emerald-200/70">Pago Total</span>
                    </div>
                  </button>

                  {/* OPTION 2: QR ADELANTO */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("qr_adelanto")}
                    className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      paymentMethod === "qr_adelanto"
                        ? "bg-gold-500/20 border-gold-400 text-white shadow-sm ring-1 ring-gold-400/50"
                        : "bg-emerald-900/40 border-emerald-800 text-gray-300 hover:border-gold-400/40"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <Sparkles className="w-4 h-4 text-gold-400" />
                      {paymentMethod === "qr_adelanto" && <CheckCircle2 className="w-3.5 h-3.5 text-gold-400" />}
                    </div>
                    <div>
                      <span className="text-[11px] font-bold block leading-tight">Dejar Adelanto</span>
                      <span className="text-[9px] text-emerald-200/70">Reserva con QR</span>
                    </div>
                  </button>

                  {/* OPTION 3: EFECTIVO */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("efectivo")}
                    className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      paymentMethod === "efectivo"
                        ? "bg-gold-500/20 border-gold-400 text-white shadow-sm ring-1 ring-gold-400/50"
                        : "bg-emerald-900/40 border-emerald-800 text-gray-300 hover:border-gold-400/40"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <Banknote className="w-4 h-4 text-emerald-400" />
                      {paymentMethod === "efectivo" && <CheckCircle2 className="w-3.5 h-3.5 text-gold-400" />}
                    </div>
                    <div>
                      <span className="text-[11px] font-bold block leading-tight">Efectivo</span>
                      <span className="text-[9px] text-emerald-200/70">Al Recoger</span>
                    </div>
                  </button>
                </div>

                {/* QR DISPLAY CARD (WHEN QR OR ADELANTO IS CHOSEN) */}
                {(paymentMethod === "qr_total" || paymentMethod === "qr_adelanto") && (
                  <div className="p-3.5 rounded-xl bg-black/50 border border-gold-400/30 space-y-3 animate-in fade-in duration-200">
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      {/* QR IMAGE */}
                      <div className="p-2 rounded-xl bg-white border border-gold-400/50 shadow-md shrink-0">
                        <img
                          src={paymentConfig.qr_imagen_url || "/qr_vecar_oficial.png"}
                          alt="QR Simple Vecar Perfumería"
                          className="w-28 h-28 object-contain"
                        />
                      </div>

                      {/* QR DETAILS */}
                      <div className="space-y-1.5 text-center sm:text-left flex-1 min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gold-400 block">
                          {paymentConfig.titular_cuenta}
                        </span>
                        <p className="text-xs font-semibold text-white">
                          {paymentConfig.banco_nombre}
                        </p>
                        
                        {/* AMOUNTS */}
                        {paymentMethod === "qr_total" ? (
                          <div className="pt-1">
                            <span className="text-[10px] text-emerald-200/70 block">Monto total a transferir:</span>
                            <span className="font-serif text-lg font-bold text-gold-300">
                              Bs. {totalAmount.toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <div className="space-y-1 pt-1">
                            <div className="flex items-center justify-between sm:justify-start gap-2">
                              <span className="text-[10px] text-emerald-200/70">Adelanto de reserva:</span>
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-gold-300 font-bold">Bs.</span>
                                <input
                                  type="number"
                                  min={10}
                                  max={totalAmount}
                                  value={adelantoCustom}
                                  onChange={(e) => setAdelantoCustom(Number(e.target.value) || 0)}
                                  className="w-16 px-1.5 py-0.5 rounded text-xs font-bold text-emerald-950 bg-gold-400 focus:outline-none"
                                />
                              </div>
                            </div>
                            <span className="text-[10px] text-emerald-300/80 block">
                              Saldo pendiente al recoger: <strong className="text-white">Bs. {saldoPendiente.toFixed(2)}</strong>
                            </span>
                          </div>
                        )}

                        <span className="text-[9px] text-gray-300/80 block leading-tight pt-1">
                          Compatible con BNB, BCP, Banco Unión, Mercantil, Sol, Fie, GanaMóvil.
                        </span>
                      </div>
                    </div>

                    <div className="p-2 rounded-lg bg-gold-400/10 border border-gold-400/20 text-[10px] text-gold-200 flex items-start gap-1.5">
                      <Info className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
                      <span>
                        Haz captura o escanea el QR. Al presionar <strong>"Enviar Pedido por WhatsApp"</strong> podrás adjuntar la captura del comprobante bancario.
                      </span>
                    </div>
                  </div>
                )}

                {/* EFECTIVO NOTICE */}
                {paymentMethod === "efectivo" && (
                  <div className="p-3 rounded-xl bg-emerald-900/30 border border-emerald-700/40 text-[11px] text-emerald-100/90 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      Pagarás el total de <strong>Bs. {totalAmount.toFixed(2)}</strong> en efectivo directamente al retirar tu fragancia en nuestra tienda (Av. Heroínas e/ Oquendo y 16 de Julio) o al recibirla.
                    </span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* FOOTER & CHECKOUT */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-gold-400/20 glass-emerald space-y-3 shrink-0">
            
            {/* VECAR CLUB BADGE */}
            <div className="p-2.5 rounded-xl bg-gold-400/15 border border-gold-400/40 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-gold-300">
                <Award className="w-4 h-4 text-gold-400 shrink-0" />
                <span>Sellos que acumulas:</span>
              </div>
              <span className="font-bold font-mono text-gold-200">
                +{potentialStamps} {potentialStamps === 1 ? "Sello" : "Sellos"}
              </span>
            </div>

            {/* CUSTOMER PRE-FILL INPUTS */}
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Tu Nombre (Opcional)"
                className="w-full px-3 py-2 rounded-xl text-xs bg-emerald-950/80 border border-gold-400/25 text-white placeholder-emerald-200/40 focus:outline-none focus:border-gold-400"
              />
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Celular / WhatsApp"
                className="w-full px-3 py-2 rounded-xl text-xs bg-emerald-950/80 border border-gold-400/25 text-white placeholder-emerald-200/40 focus:outline-none focus:border-gold-400"
              />
            </div>

            {/* TOTAL */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="text-xs uppercase tracking-wider text-emerald-200/70 block">
                  {paymentMethod === "qr_adelanto" ? "Total del Pedido" : "Total a Pagar"}
                </span>
                {paymentMethod === "qr_adelanto" && (
                  <span className="text-[10px] text-gold-300 font-mono">
                    (Adelanto QR: Bs. {adelantoAmount.toFixed(2)})
                  </span>
                )}
              </div>
              <span className="font-serif text-2xl font-bold text-gold-300">
                Bs. {totalAmount.toFixed(2)}
              </span>
            </div>

            {/* WHATSAPP ORDER BUTTON */}
            <button
              onClick={handleCheckoutWhatsApp}
              className="w-full py-3.5 rounded-full text-xs sm:text-sm font-bold tracking-wider uppercase text-emerald-950 bg-gold-gradient hover:bg-gold-gradient-hover shadow-gold-glow flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <MessageCircle className="w-4 h-4 text-emerald-950" />
              <span>Confirmar Pedido por WhatsApp</span>
            </button>

            <p className="text-[10px] text-center text-emerald-200/60">
              Tienda física: Av. Heroínas e/ Oquendo y 16 de Julio, Cochabamba • Envíos a todo el país.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
