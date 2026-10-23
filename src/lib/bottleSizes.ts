export interface BottlePresentation {
  ml: 10 | 30 | 50 | 100;
  label: string;
  tag: string;
  precio: number;
  descripcion: string;
  imagen_frasco: string;
  atomizaciones: string;
  duracion_estimada: string;
  formato: string;
  ideal_para: string;
}

export const BOTTLE_PRESENTATIONS: BottlePresentation[] = [
  {
    ml: 10,
    label: "10 ML",
    tag: "Pocket",
    precio: 40,
    descripcion: "Frasco cilíndrico de cristal premium con atomizador plateado hermético. Tamaño bolsillo de máxima portabilidad.",
    imagen_frasco: "/frascos/frasco_10ml.png",
    atomizaciones: "~120 atomizaciones",
    duracion_estimada: "2 a 3 semanas",
    formato: "Cilíndrico Pocket Silver",
    ideal_para: "Bolsillo, cartera, gimnasio y viajes",
  },
  {
    ml: 30,
    label: "30 ML",
    tag: "Personal",
    precio: 70,
    descripcion: "Envase rectangular elegante de cristal pulido. Atomizador plateado de micro-difusión con 40% de esencia pura.",
    imagen_frasco: "/frascos/frasco_30ml.png",
    atomizaciones: "~360 atomizaciones",
    duracion_estimada: "1 a 2 meses",
    formato: "Rectangular Slim Elegance",
    ideal_para: "Uso personal diario y oficina",
  },
  {
    ml: 50,
    label: "50 ML",
    tag: "Signature",
    precio: 90,
    descripcion: "Presentación clásica de autor de cristal pesado. Nuestra presentación más vendida. ¡Acumula 1 sello Vecar Club!",
    imagen_frasco: "/frascos/frasco_50ml.png",
    atomizaciones: "~600 atomizaciones",
    duracion_estimada: "3 a 4 meses",
    formato: "Cuadrado Clásico Signature",
    ideal_para: "Tu fragancia insignia habitual (Más vendido)",
  },
  {
    ml: 100,
    label: "100 ML",
    tag: "Deluxe",
    precio: 145,
    descripcion: "Frasco señorial ancho de alta capacidad. Máximo ahorro y gran reserva para tus perfumes favoritos.",
    imagen_frasco: "/frascos/frasco_100ml.png",
    atomizaciones: "~1,200 atomizaciones",
    duracion_estimada: "6 a 8 meses",
    formato: "Gran Reserva Señorial Deluxe",
    ideal_para: "Máximo rendimiento y reserva personal",
  },
];

export function getPriceForSize(ml: number): number {
  if (ml === 10) return 40;
  if (ml === 30) return 70;
  if (ml === 100) return 145;
  return 90; // Default 50ml
}

export function getBottleForSize(ml: number): BottlePresentation {
  return BOTTLE_PRESENTATIONS.find((b) => b.ml === ml) || BOTTLE_PRESENTATIONS[2];
}

