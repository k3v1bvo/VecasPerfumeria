"use client";

import React, { useState } from "react";
import { CartItem } from "@/types/database";
import { X, Trash2, Plus, Minus, ShoppingBag, MessageCircle, Award, ArrowRight } from "lucide-react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

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

  if (!isOpen) return null;

  const totalAmount = items.reduce(
    (acc, item) => acc + item.producto.precio_venta * item.cantidad,
    0
  );

  const totalItems = items.reduce((acc, item) => acc + item.cantidad, 0);

  // Cada frasco de 50ml con aplica_sello_fidelidad suma 1 sello
  const potentialStamps = items.reduce((acc, item) => {
    return item.producto.aplica_sello_fidelidad ? acc + item.cantidad : acc;
  }, 0);

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
    message += `🛍️ *DETALLE DE FRAGANCIAS:*\n`;

    items.forEach((item, idx) => {
      const sub = (item.producto.precio_venta * item.cantidad).toFixed(2);
      message += `${idx + 1}. *${item.producto.nombre}* (${item.producto.volumen_ml}ml)\n`;
      message += `   Casa: ${item.producto.marca_casa}\n`;
      message += `   Cant: ${item.cantidad} x Bs. ${item.producto.precio_venta.toFixed(2)} = *Bs. ${sub}*\n\n`;
    });

    message += `------------------------------------------\n`;
    message += `💰 *TOTAL GENERAL:* Bs. ${totalAmount.toFixed(2)}\n`;
    message += `🎖️ *SELLOS VECAR CLUB A SUMAR:* +${potentialStamps} Sello(s)\n`;
    message += `------------------------------------------\n`;
    message += `Por favor coordinar entrega y método de pago (QR Simple / Efectivo en tienda).`;

    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/59175462800?text=${encoded}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md h-full glass-emerald border-l border-gold-400/30 flex flex-col justify-between shadow-2xl relative animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* HEADER */}
        <div className="p-5 sm:p-6 border-b border-gold-400/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-full bg-gold-400/20 text-gold-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white">Tu Carrito de Compra</h3>
              <p className="text-xs text-emerald-200/70">{totalItems} fragancia(s) seleccionada(s)</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-white bg-emerald-950/50 hover:bg-emerald-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ITEMS LIST */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="w-12 h-12 text-gold-400/40 mx-auto mb-3" />
              <p className="font-serif text-lg text-white font-semibold">Tu carrito está vacío</p>
              <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
                Explora nuestro catálogo de perfumes exclusivos y añade tus fragancias favoritas.
              </p>
              <button
                onClick={onClose}
                className="mt-5 px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider text-emerald-950 bg-gold-400 hover:bg-gold-300 transition-all"
              >
                Volver al Catálogo
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.producto.id}
                className="p-3.5 rounded-2xl glass-emerald-subtle border border-gold-400/20 flex items-center gap-3.5"
              >
                {/* Image */}
                <img
                  src={item.producto.imagen_url}
                  alt={item.producto.nombre}
                  className="w-16 h-16 rounded-xl object-cover border border-gold-400/30 shrink-0"
                />

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] uppercase tracking-wider text-gold-400 block truncate">
                    {item.producto.marca_casa}
                  </span>
                  <h4 className="text-xs font-bold text-white truncate font-serif">
                    {item.producto.nombre}
                  </h4>
                  <span className="text-xs font-semibold text-gold-300 block mt-0.5">
                    Bs. {(item.producto.precio_venta * item.cantidad).toFixed(2)}
                  </span>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 mt-2">
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

                {/* Remove button */}
                <button
                  onClick={() => onRemoveItem(item.producto.id)}
                  className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  title="Eliminar producto"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* FOOTER & CHECKOUT */}
        {items.length > 0 && (
          <div className="p-5 sm:p-6 border-t border-gold-400/20 glass-emerald space-y-4">
            
            {/* VECAR CLUB BADGE NOTICE */}
            <div className="p-3 rounded-xl bg-gold-400/15 border border-gold-400/40 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-gold-300">
                <Award className="w-4 h-4 text-gold-400 shrink-0" />
                <span>Sellos Vecar Club:</span>
              </div>
              <span className="font-bold font-mono text-gold-200">
                +{potentialStamps} {potentialStamps === 1 ? "Sello" : "Sellos"}
              </span>
            </div>

            {/* CUSTOMER PRE-FILL INPUTS */}
            <div className="space-y-2">
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Tu Nombre (Opcional para el pedido)"
                className="w-full px-3 py-2 rounded-xl text-xs bg-emerald-950/80 border border-gold-400/25 text-white placeholder-emerald-200/40 focus:outline-none focus:border-gold-400"
              />
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Tu Celular / WhatsApp"
                className="w-full px-3 py-2 rounded-xl text-xs bg-emerald-950/80 border border-gold-400/25 text-white placeholder-emerald-200/40 focus:outline-none focus:border-gold-400"
              />
            </div>

            {/* TOTAL */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs uppercase tracking-wider text-emerald-200/70">Total Estimado</span>
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
              <span>Enviar Pedido por WhatsApp</span>
            </button>

            <p className="text-[10px] text-center text-emerald-200/60">
              Atención directa en tienda: Av. Heroínas, Cochabamba • Envíos a todo el país.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
