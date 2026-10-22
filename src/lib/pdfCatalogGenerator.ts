import { jsPDF } from "jspdf";
import { Producto } from "@/types/database";

export function generatePdfCatalog(productos: Producto[]): void {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let y = 18;

  // Background deep emerald gradient simulation
  doc.setFillColor(4, 18, 14); // #04120e
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Top luxury gold double line
  doc.setDrawColor(212, 175, 55); // #d4af37
  doc.setLineWidth(0.8);
  doc.line(margin, 12, pageWidth - margin, 12);
  doc.setLineWidth(0.2);
  doc.line(margin, 13.5, pageWidth - margin, 13.5);

  // Title: VECAR PERFUMERÍA
  doc.setFont("times", "bold");
  doc.setFontSize(26);
  doc.setTextColor(247, 230, 167); // Gold light
  doc.text("VECAR PERFUMERÍA", pageWidth / 2, y + 4, { align: "center" });

  // Subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(212, 175, 55);
  doc.text("PERFUMERÍA DE AUTOR • FRAGANCIAS DE TENDENCIA • COCHABAMBA", pageWidth / 2, y + 11, { align: "center" });

  // Address & WhatsApp
  doc.setFontSize(8);
  doc.setTextColor(200, 205, 200);
  doc.text("Av. Heroínas entre Av. Oquendo y Calle 16 de Julio | WhatsApp: +591 75462800 | TikTok: @Perfumeria.Vecar", pageWidth / 2, y + 16, { align: "center" });

  // Loyalty Banner Box
  y += 22;
  doc.setFillColor(9, 36, 28);
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, pageWidth - (margin * 2), 12, 2, 2, "FD");

  doc.setFont("times", "bold");
  doc.setFontSize(9);
  doc.setTextColor(247, 230, 167);
  doc.text("TARJETA DE FIDELIDAD VECAR CLUB", margin + 5, y + 5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(220, 225, 220);
  doc.text("Por cada perfume de 50ml acumulas 1 sello digital. ¡Al llegar a 10 sellos recibes un perfume de 50ml GRATIS!", margin + 5, y + 9.5);

  y += 18;

  // Group products by category
  const categories = ["Árabes", "Masculino", "Femenino", "Unisex"] as const;
  
  for (const cat of categories) {
    const items = productos.filter(p => p.categoria === cat && p.activo);
    if (items.length === 0) continue;

    // Check space before category header
    if (y > pageHeight - 35) {
      doc.addPage();
      doc.setFillColor(4, 18, 14);
      doc.rect(0, 0, pageWidth, pageHeight, "F");
      y = 20;
    }

    // Category Header
    doc.setFont("times", "bold");
    doc.setFontSize(13);
    doc.setTextColor(212, 175, 55);
    doc.text(`COLECCIÓN ${cat.toUpperCase()}`, margin, y);
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(0.2);
    doc.line(margin, y + 1.5, pageWidth - margin, y + 1.5);
    y += 7;

    for (const item of items) {
      if (y > pageHeight - 26) {
        doc.addPage();
        doc.setFillColor(4, 18, 14);
        doc.rect(0, 0, pageWidth, pageHeight, "F");
        y = 20;
      }

      // Card Box
      doc.setFillColor(7, 25, 20);
      doc.setDrawColor(36, 97, 78);
      doc.setLineWidth(0.15);
      doc.roundedRect(margin, y, pageWidth - (margin * 2), 16, 1.5, 1.5, "FD");

      // Product Title
      doc.setFont("times", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(255, 255, 255);
      doc.text(item.nombre, margin + 4, y + 5);

      // Brand & volume
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(212, 175, 55);
      doc.text(`${item.marca_casa} • ${item.volumen_ml} ml`, margin + 4, y + 9);

      // Olfactory Notes
      doc.setFontSize(7);
      doc.setTextColor(170, 185, 175);
      const notes = item.notas_olfativas 
        ? `Notas: ${item.notas_olfativas}` 
        : item.descripcion || "Fragancia exclusiva de alta concentración";
      const truncatedNotes = doc.splitTextToSize(notes, pageWidth - margin * 2 - 40);
      doc.text(truncatedNotes[0] || "", margin + 4, y + 13);

      // Price Tag
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(247, 230, 167);
      doc.text(`Bs. ${item.precio_venta.toFixed(2)}`, pageWidth - margin - 5, y + 7, { align: "right" });

      doc.setFontSize(6.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(16, 185, 129);
      doc.text("Aplica Sello Club", pageWidth - margin - 5, y + 12, { align: "right" });

      y += 19;
    }

    y += 3;
  }

  // Footer on last page
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(150, 160, 150);
  const footerText = "Pedidos y envíos nacionales: WhatsApp +591 75462800 • Visítanos en Cochabamba";
  doc.text(footerText, pageWidth / 2, pageHeight - 8, { align: "center" });

  doc.save("Catalogo_Vecar_Perfumeria_Cochabamba.pdf");
}
