import { Producto, Cliente, SelloHistorial, Venta } from "@/types/database";
import { INITIAL_PRODUCTS, INITIAL_CLIENTS } from "./initialData";
import { supabase, isSupabaseConfigured } from "./supabase";

const PRODUCTS_STORAGE_KEY = "vecar_perfumeria_productos_v1";
const CLIENTS_STORAGE_KEY = "vecar_perfumeria_clientes_v1";
const VENTAS_STORAGE_KEY = "vecar_perfumeria_ventas_v1";

// Helpers for localStorage fallback
function getLocal<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setLocal<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Error saving to localStorage", e);
  }
}

// 1. PRODUCTOS
export async function getProductos(): Promise<Producto[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .order("destacado", { ascending: false });
      if (!error && data && data.length > 0) {
        return data as Producto[];
      }
    } catch (e) {
      console.warn("Error fetching from Supabase, using local fallback", e);
    }
  }

  // Fallback to local storage or initial data
  const local = getLocal<Producto[]>(PRODUCTS_STORAGE_KEY, []);
  if (local.length === 0) {
    setLocal(PRODUCTS_STORAGE_KEY, INITIAL_PRODUCTS);
    return INITIAL_PRODUCTS;
  }
  return local;
}

export async function saveProducto(producto: Partial<Producto> & { nombre: string; precio_venta: number }): Promise<Producto> {
  const isNew = !producto.id;
  const newProduct: Producto = {
    id: producto.id || `prod-${Date.now()}`,
    nombre: producto.nombre,
    marca_casa: producto.marca_casa || "Vecar Fragrance",
    categoria: producto.categoria || "Unisex",
    volumen_ml: producto.volumen_ml || 50,
    precio_venta: Number(producto.precio_venta),
    precio_costo: Number(producto.precio_costo || 0),
    stock_actual: Number(producto.stock_actual ?? 10),
    stock_minimo: Number(producto.stock_minimo ?? 2),
    aplica_sello_fidelidad: producto.aplica_sello_fidelidad ?? true,
    activo: producto.activo ?? true,
    destacado: producto.destacado ?? false,
    imagen_url: producto.imagen_url || "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80",
    notas_olfativas: producto.notas_olfativas || "Notas aromáticas elegantes",
    descripcion: producto.descripcion || "Fragancia exclusiva de alta longevidad.",
    creado_en: producto.creado_en || new Date().toISOString()
  };

  if (isSupabaseConfigured && supabase) {
    try {
      if (isNew) {
        const { data, error } = await supabase.from("productos").insert([newProduct]).select().single();
        if (!error && data) return data as Producto;
      } else {
        const { data, error } = await supabase.from("productos").update(newProduct).eq("id", newProduct.id).select().single();
        if (!error && data) return data as Producto;
      }
    } catch (e) {
      console.warn("Supabase save error, persisting locally", e);
    }
  }

  const current = getLocal<Producto[]>(PRODUCTS_STORAGE_KEY, INITIAL_PRODUCTS);
  const exists = current.findIndex(p => p.id === newProduct.id);
  let updated: Producto[];
  if (exists >= 0) {
    updated = current.map(p => p.id === newProduct.id ? newProduct : p);
  } else {
    updated = [newProduct, ...current];
  }
  setLocal(PRODUCTS_STORAGE_KEY, updated);
  return newProduct;
}

export async function deleteProducto(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from("productos").delete().eq("id", id);
    } catch (e) {
      console.warn("Supabase delete error", e);
    }
  }

  const current = getLocal<Producto[]>(PRODUCTS_STORAGE_KEY, INITIAL_PRODUCTS);
  const updated = current.filter(p => p.id !== id);
  setLocal(PRODUCTS_STORAGE_KEY, updated);
  return true;
}

// 2. CLIENTES (VECAR CLUB)
export async function getClientes(): Promise<Cliente[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from("clientes").select("*").order("creado_en", { ascending: false });
      if (!error && data && data.length > 0) return data as Cliente[];
    } catch (e) {
      console.warn("Supabase getClientes error, fallback to local", e);
    }
  }
  const local = getLocal<Cliente[]>(CLIENTS_STORAGE_KEY, []);
  if (local.length === 0) {
    setLocal(CLIENTS_STORAGE_KEY, INITIAL_CLIENTS);
    return INITIAL_CLIENTS;
  }
  return local;
}

export async function findCliente(query: string): Promise<Cliente | null> {
  const clean = query.trim().toLowerCase();
  if (!clean) return null;

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("clientes")
        .select("*")
        .or(`telefono.ilike.%${clean}%,email.ilike.%${clean}%`)
        .limit(1)
        .maybeSingle();
      if (!error && data) return data as Cliente;
    } catch (e) {
      console.warn("Supabase findCliente error, checking local", e);
    }
  }

  const list = await getClientes();
  const found = list.find(c => 
    c.telefono.replace(/\s+/g, "").includes(clean.replace(/\s+/g, "")) || 
    c.email.toLowerCase().includes(clean) ||
    c.nombre_completo.toLowerCase().includes(clean)
  );
  return found || null;
}

export async function registerCliente(clienteData: {
  nombre_completo: string;
  telefono: string;
  email: string;
  fecha_nacimiento?: string;
}): Promise<Cliente> {
  const newClient: Cliente = {
    id: `cli-${Date.now()}`,
    nombre_completo: clienteData.nombre_completo.trim(),
    telefono: clienteData.telefono.trim(),
    email: clienteData.email.trim().toLowerCase(),
    fecha_nacimiento: clienteData.fecha_nacimiento || undefined,
    sellos_acumulados: 1, // Regalamos el primer sello de bienvenida al unirse
    total_compras_bob: 0,
    activo: true,
    creado_en: new Date().toISOString()
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from("clientes").insert([newClient]).select().single();
      if (!error && data) return data as Cliente;
    } catch (e) {
      console.warn("Supabase register error", e);
    }
  }

  const list = await getClientes();
  const updated = [newClient, ...list];
  setLocal(CLIENTS_STORAGE_KEY, updated);
  return newClient;
}

export async function updateClienteSellos(
  clienteId: string, 
  delta: number, 
  motivo?: string
): Promise<{ cliente: Cliente; anterior: number; nuevo: number }> {
  const list = await getClientes();
  const index = list.findIndex(c => c.id === clienteId);
  if (index === -1) throw new Error("Cliente no encontrado");

  const actual = list[index];
  const anterior = actual.sellos_acumulados;
  let nuevo = Math.max(0, Math.min(10, anterior + delta));

  const updatedClient: Cliente = {
    ...actual,
    sellos_acumulados: nuevo,
    actualizado_en: new Date().toISOString()
  };

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from("clientes").update({ sellos_acumulados: nuevo }).eq("id", clienteId);
      // Registrar en historial
      await supabase.from("sellos_historial").insert([{
        cliente_id: clienteId,
        tipo_movimiento: delta > 0 ? "SUMA" : "AJUSTE",
        cantidad: delta,
        sellos_resultantes: nuevo,
        nota: motivo || "Actualización manual en panel"
      }]);
    } catch (e) {
      console.warn("Supabase update sellos error", e);
    }
  }

  list[index] = updatedClient;
  setLocal(CLIENTS_STORAGE_KEY, list);

  return { cliente: updatedClient, anterior, nuevo };
}

export async function canjearPremioFidelidad(clienteId: string): Promise<Cliente> {
  const list = await getClientes();
  const index = list.findIndex(c => c.id === clienteId);
  if (index === -1) throw new Error("Cliente no encontrado");

  const actual = list[index];
  const updatedClient: Cliente = {
    ...actual,
    sellos_acumulados: 0, // Reinicia la tarjeta para el próximo ciclo
    actualizado_en: new Date().toISOString()
  };

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from("clientes").update({ sellos_acumulados: 0 }).eq("id", clienteId);
      await supabase.from("sellos_historial").insert([{
        cliente_id: clienteId,
        tipo_movimiento: "CANJE_PREMIO",
        cantidad: -10,
        sellos_resultantes: 0,
        nota: "Canje exitoso de Perfume 50ml Gratis por 10 sellos completados"
      }]);
    } catch (e) {
      console.warn("Supabase canjear premio error", e);
    }
  }

  list[index] = updatedClient;
  setLocal(CLIENTS_STORAGE_KEY, list);
  return updatedClient;
}

// 3. VENTAS (Plan Plus)
export async function getVentas(): Promise<Venta[]> {
  return getLocal<Venta[]>(VENTAS_STORAGE_KEY, []);
}

export async function registrarVenta(venta: Omit<Venta, "id" | "codigo_recibo" | "creado_en">): Promise<Venta> {
  const list = await getVentas();
  const nextCode = 1000 + list.length + 1;
  const newVenta: Venta = {
    ...venta,
    id: `ven-${Date.now()}`,
    codigo_recibo: nextCode,
    creado_en: new Date().toISOString()
  };

  const updated = [newVenta, ...list];
  setLocal(VENTAS_STORAGE_KEY, updated);

  // Si tiene cliente y suma sello, actualizar el cliente
  if (venta.cliente_id && venta.sello_sumado) {
    try {
      await updateClienteSellos(venta.cliente_id, 1, `Venta en mostrador #${nextCode}`);
    } catch (e) {
      console.warn("No se pudo sumar sello automático a la venta", e);
    }
  }

  return newVenta;
}
