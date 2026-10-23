export interface BottlePresentation {
  ml: 10 | 30 | 50 | 100;
  label: string;
  tag: string;
  precio: number;
  descripcion: string;
}

export const BOTTLE_PRESENTATIONS: BottlePresentation[] = [
  {
    ml: 10,
    label: "10 ML",
    tag: "Pocket",
    precio: 40,
    descripcion: "Frasco cilíndrico de lujo con atomizador plateado. Ideal para retoque o cartera.",
  },
  {
    ml: 30,
    label: "30 ML",
    tag: "Personal",
    precio: 70,
    descripcion: "Envase rectangular elegante para uso diario con 40% de esencia pura.",
  },
  {
    ml: 50,
    label: "50 ML",
    tag: "Signature",
    precio: 90,
    descripcion: "Presentación clásica de autor. La favorita de nuestros clientes en Cochabamba.",
  },
  {
    ml: 100,
    label: "100 ML",
    tag: "Deluxe",
    precio: 145,
    descripcion: "Frasco señorial ancho de máxima duración y rendimiento.",
  },
];

export function getPriceForSize(ml: number): number {
  if (ml === 10) return 40;
  if (ml === 30) return 70;
  if (ml === 100) return 145;
  return 90; // Default 50ml
}
