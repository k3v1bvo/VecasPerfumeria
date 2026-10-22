-- ==========================================================
-- VECAR PERFUMERÍA - ESQUEMA DE BASE DE DATOS EN SUPABASE
-- Cochabamba, Bolivia | Versión Unificada: Plan Económico + Plan Plus
-- ==========================================================

-- Habilitar extensión pgcrypto para UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. TABLA DE CLIENTES (Fidelización Blindada Vecar Club)
CREATE TABLE IF NOT EXISTS clientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre_completo VARCHAR(150) NOT NULL,
    telefono VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    fecha_nacimiento DATE,
    sellos_acumulados INT DEFAULT 0 CHECK (sellos_acumulados >= 0 AND sellos_acumulados <= 10),
    total_compras_bob NUMERIC(10,2) DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices de búsqueda rápida por celular y correo para atención en tienda
CREATE INDEX IF NOT EXISTS idx_clientes_telefono ON clientes(telefono);
CREATE INDEX IF NOT EXISTS idx_clientes_email ON clientes(email);

-- 2. TABLA DE PRODUCTOS / CATÁLOGO
CREATE TABLE IF NOT EXISTS productos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(150) NOT NULL,
    marca_casa VARCHAR(100) NOT NULL,
    categoria VARCHAR(50) NOT NULL, -- 'Masculino', 'Femenino', 'Árabes', 'Unisex'
    volumen_ml INT DEFAULT 50,
    precio_venta NUMERIC(10,2) NOT NULL,
    precio_costo NUMERIC(10,2) DEFAULT 0,       -- Exclusivo Plan Plus
    stock_actual INT DEFAULT 10,                -- Exclusivo Plan Plus
    stock_minimo INT DEFAULT 2,                 -- Exclusivo Plan Plus
    aplica_sello_fidelidad BOOLEAN DEFAULT TRUE,
    activo BOOLEAN DEFAULT TRUE,
    destacado BOOLEAN DEFAULT FALSE,
    imagen_url TEXT,
    notas_olfativas TEXT,                        -- Ej: "Vainilla Bourbon, Ámbar, Oud blanco"
    descripcion TEXT,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos(categoria);
CREATE INDEX IF NOT EXISTS idx_productos_activo ON productos(activo);

-- 3. HISTORIAL DE SELLOS Y CANJES
CREATE TABLE IF NOT EXISTS sellos_historial (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
    tipo_movimiento VARCHAR(20) NOT NULL, -- 'SUMA', 'CANJE_PREMIO', 'AJUSTE'
    cantidad INT NOT NULL,
    sellos_resultantes INT NOT NULL,
    nota TEXT,
    registrado_por VARCHAR(100) DEFAULT 'Administrador',
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sellos_cliente ON sellos_historial(cliente_id);

-- ==========================================================
-- TABLAS PREPARADAS PARA EL PLAN PLUS (POS, CAJA Y KARDEX)
-- ==========================================================

-- 4. CONTROL DE CAJA Y TURNOS (Plan Plus)
CREATE TABLE IF NOT EXISTS caja_turnos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_cajero UUID REFERENCES auth.users(id),
    monto_apertura NUMERIC(10,2) NOT NULL DEFAULT 0,
    monto_cierre_declarado NUMERIC(10,2),
    monto_cierre_sistema NUMERIC(10,2),
    diferencia NUMERIC(10,2),
    estado VARCHAR(20) DEFAULT 'ABIERTA', -- 'ABIERTA', 'CERRADA'
    observaciones TEXT,
    abierta_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    cerrada_en TIMESTAMP WITH TIME ZONE
);

-- 5. TABLA DE VENTAS (Plan Plus / Tickets)
CREATE TABLE IF NOT EXISTS ventas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo_recibo SERIAL,
    cliente_id UUID REFERENCES clientes(id),
    usuario_vendedor UUID REFERENCES auth.users(id),
    caja_turno_id UUID REFERENCES caja_turnos(id),
    total_bob NUMERIC(10,2) NOT NULL,
    metodo_pago VARCHAR(30) NOT NULL, -- 'EFECTIVO', 'QR', 'TARJETA'
    monto_recibido NUMERIC(10,2),
    cambio_entregado NUMERIC(10,2),
    numero_comprobante_qr VARCHAR(100),
    sello_sumado BOOLEAN DEFAULT FALSE,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ventas_cliente ON ventas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_ventas_fecha ON ventas(creado_en);

-- 6. DETALLE DE VENTAS (Plan Plus)
CREATE TABLE IF NOT EXISTS venta_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venta_id UUID REFERENCES ventas(id) ON DELETE CASCADE,
    producto_id UUID REFERENCES productos(id),
    cantidad INT NOT NULL,
    precio_unitario NUMERIC(10,2) NOT NULL,
    subtotal NUMERIC(10,2) NOT NULL
);

-- 7. KARDEX DE MOVIMIENTOS DE STOCK (Plan Plus)
CREATE TABLE IF NOT EXISTS kardex_movimientos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    producto_id UUID REFERENCES productos(id) ON DELETE CASCADE,
    tipo VARCHAR(30) NOT NULL, -- 'ENTRADA', 'VENTA', 'AJUSTE', 'MERMA'
    cantidad INT NOT NULL,
    stock_anterior INT NOT NULL,
    stock_nuevo INT NOT NULL,
    motivo TEXT,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================================

-- Habilitar RLS en tablas públicas y sensibles
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE sellos_historial ENABLE ROW LEVEL SECURITY;

-- Políticas completas para permitir lectura y gestión desde la app web
DROP POLICY IF EXISTS "Productos visibles públicamente" ON productos;
CREATE POLICY "Productos visibles públicamente" ON productos FOR SELECT USING (true);
CREATE POLICY "Permitir insertar productos" ON productos FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir actualizar productos" ON productos FOR UPDATE USING (true);
CREATE POLICY "Permitir eliminar productos" ON productos FOR DELETE USING (true);

-- Políticas para clientes (Vecar Club)
DROP POLICY IF EXISTS "Clientes pueden consultar su perfil" ON clientes;
CREATE POLICY "Clientes lectura pública" ON clientes FOR SELECT USING (true);
CREATE POLICY "Permitir registrar clientes" ON clientes FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir actualizar sellos de clientes" ON clientes FOR UPDATE USING (true);

-- Políticas para historial de sellos
CREATE POLICY "Historial sellos lectura" ON sellos_historial FOR SELECT USING (true);
CREATE POLICY "Historial sellos inserción" ON sellos_historial FOR INSERT WITH CHECK (true);

-- ==========================================================
-- DATOS INICIALES SEMILLA (SEED DATA)
-- Perfumería de Autor, Fragancias Árabes de Tendencia y Más
-- ==========================================================

INSERT INTO productos (nombre, marca_casa, categoria, volumen_ml, precio_venta, precio_costo, stock_actual, aplica_sello_fidelidad, activo, destacado, imagen_url, notas_olfativas, descripcion)
VALUES
(
    'Khamrah Qahwa',
    'Lattafa Perfumes',
    'Árabes',
    50,
    280.00,
    160.00,
    12,
    true,
    true,
    true,
    'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80',
    'Café tostado, Canela de Ceilán, Cardamomo, Praliné y Haba Tonka',
    'Fragancia árabe gourmand ultra seductora con notas cálidas de café recién tostado y especias orientales. Longevidad extrema.'
),
(
    'Club de Nuit Intense Man',
    'Armaf',
    'Masculino',
    50,
    260.00,
    150.00,
    15,
    true,
    true,
    true,
    'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80',
    'Limón, Piña ahumada, Abedul negro, Ámbar gris y Almizcle',
    'El icónico best-seller masculino. Aroma cítrico-ahumado de alto impacto y proyección magnética ideal para eventos y noche.'
),
(
    'Yara Pink',
    'Lattafa Perfumes',
    'Femenino',
    50,
    230.00,
    130.00,
    18,
    true,
    true,
    true,
    'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80',
    'Orquídea, Mandarina, Helado de Fresa, Vainilla y Almizcle suave',
    'Sensación dulce, cremosa y juvenil. Una nube envolvente de malvavisco frutal con fondo atalcado irresistible.'
),
(
    'Bade''e Al Oud (Oud for Glory)',
    'Lattafa Perfumes',
    'Árabes',
    50,
    290.00,
    170.00,
    8,
    true,
    true,
    true,
    'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
    'Azafrán, Nuez moscada, Lavanda, Madera de Oud natural y Pachulí',
    'Opulencia oriental pura. Madera oscura, azafrán noble y notas terrosas de altísima distinción para ocasiones especiales.'
),
(
    'Sauvage Elixir Eau de Parfum',
    'Inspiración Alta Gama',
    'Masculino',
    50,
    295.00,
    175.00,
    10,
    true,
    true,
    true,
    'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80',
    'Canela, Cardamomo, Lavanda de Nyons, Regaliz y Sándalo rico',
    'Concentración deslumbrante con especias vibrantes y corazón licoroso de sándalo profundo. Estela inconfundible.'
),
(
    'Baccarat Rouge 540 Extrait',
    'Inspiración Nicho De Lujo',
    'Unisex',
    50,
    320.00,
    190.00,
    7,
    true,
    true,
    true,
    'https://images.unsplash.com/photo-1587017539504-67cfbddac569?auto=format&fit=crop&w=800&q=80',
    'Jazmín Grandiflorum, Azafrán, Almendra amarga, Madera de cedro y Ámbar gris',
    'Aura luminosa y cristalina. Dulzura mineral etérea con matices amaderados de la más alta perfumería mundial.'
),
(
    'Delina Exclusif',
    'Inspiración Parfums de Marly',
    'Femenino',
    50,
    310.00,
    180.00,
    9,
    true,
    true,
    false,
    'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80',
    'Lichi, Pera, Rosa Turca, Incienso, Vainilla y Ámbar',
    'Feminidad señorial. Una rosa turca aterciopelada envuelta en velos de incienso misterioso y vainilla radiante.'
),
(
    'Asad (Black Gold)',
    'Lattafa Perfumes',
    'Masculino',
    50,
    250.00,
    145.00,
    14,
    true,
    true,
    false,
    'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=800&q=80',
    'Pimienta negra, Piña, Tabaco dulce, Café, Ámbar seco y Benjuí',
    'Elegancia madura y contundente con notas especiadas de tabaco rubio y toques de vainilla seca.'
);

-- CLIENTES DE DEMOSTRACIÓN (Para probar el Vecar Club de inmediato)
INSERT INTO clientes (nombre_completo, telefono, email, fecha_nacimiento, sellos_acumulados, total_compras_bob)
VALUES
(
    'Alejandro Montaño',
    '75462800',
    'vecarperfumeria@gmail.com',
    '1992-06-15',
    7,
    1820.00
),
(
    'Valeria Quiroga',
    '70712345',
    'valeria.q@gmail.com',
    '1996-11-20',
    4,
    920.00
),
(
    'Carlos Fernández',
    '71789456',
    'carlos.f@hotmail.com',
    '1988-03-08',
    10,
    2650.00
);
