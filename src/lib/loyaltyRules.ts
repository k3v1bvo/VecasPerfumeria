import { Cliente } from "@/types/database";

export interface PremioLoyaltyResult {
  tamanoMl: 10 | 30 | 50 | 100;
  nombrePresentacion: string;
  tituloPremio: string;
  explicacion: string;
  esElegibleParaCanje: boolean;
  sellosRestantesParaPremio: number;
  desglose: {
    ml10: number;
    ml30: number;
    ml50: number;
    ml100: number;
  };
}

export function calculatePremioSugerido(cliente: Cliente | null | undefined): PremioLoyaltyResult {
  if (!cliente) {
    return {
      tamanoMl: 50,
      nombrePresentacion: "50 ML (Signature - Bs. 90)",
      tituloPremio: "Perfume de 50 ML GRATIS",
      explicacion: "Al completar 10 sellos recibirás gratis el tamaño que más hayas comprado.",
      esElegibleParaCanje: false,
      sellosRestantesParaPremio: 10,
      desglose: { ml10: 0, ml30: 0, ml50: 0, ml100: 0 },
    };
  }

  const sellosTotal = cliente.sellos_acumulados || 0;
  
  // Cast or adapt existing sellos_por_tamano
  const raw = (cliente.sellos_por_tamano as Record<string, number>) || {};
  const desglose = {
    ml10: raw.ml10 || 0,
    ml30: raw.ml30 || raw.ml20 || 0, // Fallback if 20ml was logged
    ml50: raw.ml50 !== undefined ? raw.ml50 : sellosTotal,
    ml100: raw.ml100 || 0,
  };

  // Determine which presentation was purchased the most (the mode)
  let maxCount = -1;
  let tamanoMl: 10 | 30 | 50 | 100 = 50;

  const candidates: Array<{ ml: 10 | 30 | 50 | 100; count: number; name: string }> = [
    { ml: 100, count: desglose.ml100, name: "100 ML Deluxe (Bs. 145)" },
    { ml: 50, count: desglose.ml50, name: "50 ML Signature (Bs. 90)" },
    { ml: 30, count: desglose.ml30, name: "30 ML Personal (Bs. 70)" },
    { ml: 10, count: desglose.ml10, name: "10 ML Pocket (Bs. 40)" },
  ];

  for (const c of candidates) {
    if (c.count > maxCount) {
      maxCount = c.count;
      tamanoMl = c.ml;
    }
  }

  let nombrePresentacion = "50 ML Signature (Bs. 90)";
  if (tamanoMl === 100) nombrePresentacion = "100 ML Deluxe (Bs. 145)";
  if (tamanoMl === 30) nombrePresentacion = "30 ML Personal (Bs. 70)";
  if (tamanoMl === 10) nombrePresentacion = "10 ML Pocket (Bs. 40)";

  const esElegible = sellosTotal >= 10;
  const restantes = Math.max(0, 10 - sellosTotal);

  const explicacion = esElegible
    ? `¡Felicitaciones! Has completado tus 10 sellos en Vecar Club. Tu presentación más adquirida fue ${tamanoMl} ML (${desglose[`ml${tamanoMl}` as keyof typeof desglose]} de tus ${sellosTotal} compras), por lo que tu premio es un perfume de ${tamanoMl} ML totalmente GRATIS a tu elección.`
    : `Llevas acumulados ${sellosTotal} de 10 sellos. Según tus compras registradas (${desglose.ml50} de 50ml, ${desglose.ml100} de 100ml, ${desglose.ml30} de 30ml, ${desglose.ml10} de 10ml), tu premio proyectado al llegar a 10 sellos es un perfume de ${tamanoMl} ML GRATIS.`;

  return {
    tamanoMl,
    nombrePresentacion,
    tituloPremio: `Perfume de ${tamanoMl} ML GRATIS`,
    explicacion,
    esElegibleParaCanje: esElegible,
    sellosRestantesParaPremio: restantes,
    desglose,
  };
}
