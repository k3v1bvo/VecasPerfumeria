# 💎 Vecar Perfumería — Web Commerce & Vecar Club

> **Perfumería de Autor & Fragancias de Tendencia en Cochabamba, Bolivia**  
> *Av. Heroínas entre Av. Oquendo y Calle 16 de Julio | WhatsApp: +591 75462800*

---

## 🌟 1. Visión del Proyecto y Opciones Planteadas

Este proyecto implementa la solución web integral para **Vecar Perfumería**, desarrollado con estética **Dark Emerald & Warm Gold** (inspirado en la *Opción 1* de diseño de autor y principios de Apple Fluid Design).

El sistema fue concebido bajo dos niveles de alcance:

### ✅ Opción 1: Plan Económico *(Actualmente Implementado y en Funcionamiento)*
* **Catálogo Web Interactivo:** Presentación de 50 ml con filtros rápidos (*Todos, Árabes / Tendencia, Masculino, Femenino, Unisex*), buscador inteligente por notas olfativas y pirámide aromática.
* **Carrito WhatsApp Commerce:** Cálculo automático en tiempo real en Bolivianos (Bs.) con generador de pedido estructurado hacia `wa.me/59175462800`.
* **Descarga de Catálogo en PDF:** Generador de catálogo editorial de lujo al vuelo (`jspdf`) para clientes y difusión comercial.
* **Módulo de Fidelidad "Vecar Club":** Consulta rápida de sellos (1 al 10) introduciendo WhatsApp o correo. Blindaje de datos y tarjeta digital estilo Apple Wallet.
* **Panel de Control del Dueño (`/admin`):**
  * Asignación manual de sellos (`+1 Sello`) por compra de 50 ml y botón de canje de perfume gratis.
  * CRUD completo de productos (precios, disponibilidad, fotos y notas olfativas).
  * Generador y descargador de códigos QR para mostradores físicos y vitrinas.

---

### 🚀 Opción 2: Plan Plus *(Propuesta Arquitectónica Lista para Escalar)*
* **Punto de Venta de Mostrador (POS Táctil):** Cobro rápido para tablets o pantallas táctiles con soporte para Efectivo y QR Simple.
* **Impresión de Tickets Térmicos (58mm / 80mm):** Recibos físicos con el estado del Vecar Club al pie del ticket (*«Sellos acumulados: 7 de 10. ¡Te faltan 3 sellos!»*).
* **Control de Inventario & Kardex:** Descuento automático de stock, alertas de stock mínimo (2-3 unidades) y cálculo de margen de ganancia real.
* **Control de Caja y Arqueo Ciego:** Registro de apertura, salidas menores y cierre diario con envío automático de reporte vía Google SMTP al dueño.
* *Nota:* En el panel de administración (`/admin` pestaña *Propuesta & Simulador POS*) se encuentra disponible un simulador interactivo de esta experiencia para el cliente.

---

## 🛠️ 2. Stack Tecnológico

* **Frontend:** [Next.js](https://nextjs.org/) (App Router, React 19, TypeScript)
* **Estilos:** Tailwind CSS con tokens a medida (`Dark Emerald #04110d`, `Warm Gold #d4af37`, `Wine #5c1a29`) y efectos de desenfoque translúcido (*Liquid Glass*).
* **Iconografía:** [Lucide React](https://lucide.dev/)
* **Animaciones & Microinteracciones:** CSS Transitions, Spring animations y `canvas-confetti` al completar 10 sellos.
* **Base de Datos & Backend:** [Supabase](https://supabase.com/) (PostgreSQL relacional) con fallback offline/local storage automático para desarrollo y pruebas inmediatas.
* **Generación de PDF:** `jspdf`
* **Generación de QR:** `qrcode`

---

## 🚀 3. Instrucciones de Ejecución Local

### Prerrequisitos
* Node.js v18+ instalado.

### Instalación y arranque
```bash
# 1. Clonar el repositorio
git clone https://github.com/k3v1bvo/VecasPerfumeria.git
cd VecasPerfumeria

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la tienda pública.

---

## 🔐 4. Acceso Administrativo (Dueño)

* **Ruta del Panel:** [http://localhost:3000/admin](http://localhost:3000/admin)
* **PIN Maestro por Defecto:** `5910`
* **Funciones Disponibles:**
  1. **Control de Sellos:** Busca por celular (`75462800`) o correo para sumar sellos (`+1 Sello`) o canjear el premio de 50ml.
  2. **Gestión de Catálogo:** Agregar, editar precios en Bs. o marcar fragancias como agotadas.
  3. **Generador QR:** Descargar códigos QR listos para imprimir en mostradores.
  4. **Propuesta Plan Plus:** Probar el simulador de cobro POS con emisión de ticket térmico.

---

## 🗄️ 5. Configuración de Supabase (Opcional)

La aplicación funciona de forma inmediata sin necesidad de configurar credenciales (utilizando almacenamiento local con datos iniciales precargados). Para conectar tu base de datos de producción:

1. Crea un proyecto en [Supabase](https://supabase.com).
2. Ve al **SQL Editor** y pega el contenido del archivo [`supabase/schema.sql`](./supabase/schema.sql).
3. Copia tus claves en un archivo `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

---

## 📍 Datos de la Tienda
* **Nombre:** Vecar Perfumería
* **Ubicación:** Av. Heroínas entre Av. Oquendo y Calle 16 de Julio, Cochabamba, Bolivia.
* **WhatsApp:** [+591 75462800](https://wa.me/59175462800)
* **TikTok:** [@Perfumeria.Vecar](https://www.tiktok.com/@Perfumeria.Vecar)
