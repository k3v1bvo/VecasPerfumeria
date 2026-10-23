"use client";

export interface BusinessPaymentConfig {
  qr_imagen_url: string;
  banco_nombre: string;
  titular_cuenta: string;
  numero_cuenta: string;
  adelanto_minimo_bob: number;
  whatsapp_pedidos: string;
  mensaje_instruccion_qr: string;
}

const STORAGE_KEY = "vecar_payment_config_v1";

export const DEFAULT_PAYMENT_CONFIG: BusinessPaymentConfig = {
  qr_imagen_url: "/qr_vecar_oficial.png",
  banco_nombre: "Cualquier Banco de Bolivia (QR Simple Interbancario)",
  titular_cuenta: "Vecar Perfumería",
  numero_cuenta: "Cta. Ahorros / QR Simple BCP, BNB, Banco Unión",
  adelanto_minimo_bob: 50,
  whatsapp_pedidos: "59175462800",
  mensaje_instruccion_qr: "Escanea con tu banca móvil (Banco Unión, BCP, BNB, Banco Sol, Mercantil, etc.). Al presionar 'Enviar Pedido', adjunta la captura del comprobante por WhatsApp."
};

export function getBusinessPaymentConfig(): BusinessPaymentConfig {
  if (typeof window === "undefined") return DEFAULT_PAYMENT_CONFIG;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PAYMENT_CONFIG;
    return { ...DEFAULT_PAYMENT_CONFIG, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PAYMENT_CONFIG;
  }
}

export function saveBusinessPaymentConfig(config: Partial<BusinessPaymentConfig>): BusinessPaymentConfig {
  if (typeof window === "undefined") return DEFAULT_PAYMENT_CONFIG;
  try {
    const current = getBusinessPaymentConfig();
    const updated = { ...current, ...config };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error("Error al guardar configuracion de pago", e);
    return DEFAULT_PAYMENT_CONFIG;
  }
}
