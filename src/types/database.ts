export interface Producto {
  id: string;
  nombre: string;
  marca_casa: string;
  categoria: 'Masculino' | 'Femenino' | 'Árabes' | 'Unisex';
  volumen_ml: number;
  precio_venta: number;
  precio_costo?: number;
  stock_actual: number;
  stock_minimo?: number;
  aplica_sello_fidelidad: boolean;
  activo: boolean;
  destacado?: boolean;
  imagen_url: string;
  notas_olfativas?: string;
  familia_olfativa?: string;
  familias_olfativas?: string[];
  descripcion?: string;
  creado_en?: string;
}

export interface Cliente {
  id: string;
  nombre_completo: string;
  telefono: string;
  email: string;
  fecha_nacimiento?: string;
  sellos_acumulados: number;
  total_compras_bob: number;
  activo?: boolean;
  sellos_por_tamano?: {
    ml20: number;
    ml50: number;
    ml100: number;
  };
  creado_en?: string;
  actualizado_en?: string;
}

export interface SelloHistorial {
  id: string;
  cliente_id: string;
  tipo_movimiento: 'SUMA' | 'CANJE_PREMIO' | 'AJUSTE';
  cantidad: number;
  sellos_resultantes: number;
  presentacion_ml?: number;
  nota?: string;
  registrado_por?: string;
  creado_en: string;
}

export interface CartItem {
  id?: string;
  producto: Producto;
  cantidad: number;
  presentacion_ml?: number; // 20 | 50 | 100
  precio_unitario?: number;
}

export interface VentaItem {
  id?: string;
  producto_id: string;
  producto_nombre: string;
  cantidad: number;
  presentacion_ml?: number;
  precio_unitario: number;
  subtotal: number;
}

export interface Venta {
  id: string;
  codigo_recibo: number;
  cliente_id?: string;
  cliente_nombre?: string;
  cliente_telefono?: string;
  total_bob: number;
  metodo_pago: 'EFECTIVO' | 'QR' | 'TARJETA';
  monto_recibido?: number;
  cambio_entregado?: number;
  items: VentaItem[];
  sello_sumado?: boolean;
  creado_en: string;
}
