"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle, ShieldCheck, Clock, Truck, Sparkles, MapPin } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
  icon: React.ReactNode;
}

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      question: "¿Cuánto tiempo duran las fragancias en piel y ropa?",
      answer: "Nuestras formulaciones de alta concentración de autor ofrecen una fijación garantizada de 6 a 8 horas en piel (dependiendo del pH individual) y más de 24 horas (hasta 1 día completo) en prendas de vestir y textiles.",
      icon: <Clock className="w-5 h-5 text-gold-400" />,
    },
    {
      question: "¿Cómo funciona la tarjeta de fidelidad digital Vecar Club?",
      answer: "Por cada perfume de 50 ml que adquieras en nuestra tienda o por WhatsApp, recibes 1 sello digital registrado en el sistema. Al acumular 10 sellos verificados, ¡tu 11va fragancia es completamente GRATIS a tu elección!",
      icon: <Sparkles className="w-5 h-5 text-gold-400" />,
    },
    {
      question: "¿Realizan envíos a otras ciudades de Bolivia?",
      answer: "¡Sí! Realizamos envíos diarios a La Paz, Santa Cruz, Oruro, Sucre, Potosí, Tarija, Beni y Pando mediante transporte terrestre o courier express seguro. En Cochabamba contamos con retiro en tienda o delivery inmediato.",
      icon: <Truck className="w-5 h-5 text-gold-400" />,
    },
    {
      question: "¿Dónde está ubicada la tienda física en Cochabamba?",
      answer: "Te esperamos en Av. Heroínas e/ Oquendo y 16 de Julio, Cochabamba, Bolivia. Puedes visitarnos para probar y catar todas las fragancias con asesoría olfativa personalizada de nuestro equipo.",
      icon: <MapPin className="w-5 h-5 text-gold-400" />,
    },
    {
      question: "¿Cómo realizo mi pedido o reserva?",
      answer: "Puedes armar tu carrito directamente en esta web y presionar 'Confirmar Pedido por WhatsApp', o escribirnos directamente al +591 75462800 indicando el número o nombre de la fragancia que viste en los catálogos de Dama o Varón.",
      icon: <ShieldCheck className="w-5 h-5 text-gold-400" />,
    },
  ];

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="w-full py-16 sm:py-20 relative bg-emerald-950/40 border-t border-emerald-900/40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SECTION HEADER */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-emerald-subtle border border-gold-400/25 mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-gold-400" />
            <span className="text-xs font-semibold tracking-widest uppercase text-gold-300">
              Preguntas Frecuentes
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Todo lo que necesitas saber sobre <span className="gold-text">Vecar Perfumería</span>
          </h2>
          <p className="text-emerald-100/70 text-sm sm:text-base mt-2 font-light">
            Respuestas a las dudas más comunes sobre fijación, envíos, fidelidad y pedidos.
          </p>
        </div>

        {/* ACCORDION */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="glass-emerald rounded-2xl border border-emerald-800/40 hover:border-gold-400/30 transition-all duration-300 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-gold-400/10 border border-gold-400/20 flex items-center justify-center shrink-0">
                      {faq.icon}
                    </div>
                    <span className="font-medium text-base sm:text-lg text-white">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gold-400 transition-transform duration-300 shrink-0 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-emerald-100/80 text-sm sm:text-base leading-relaxed border-t border-emerald-900/30">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
