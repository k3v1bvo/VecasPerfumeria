"use client";

import React, { useState, useEffect } from "react";
import { Producto, CartItem } from "@/types/database";
import { getProductos } from "@/lib/dataService";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { BentoShowcase } from "@/components/BentoShowcase";
import { Catalog } from "@/components/Catalog";
import { CartDrawer } from "@/components/CartDrawer";
import { VecarClubModal } from "@/components/VecarClubModal";
import { ProductModal } from "@/components/ProductModal";
import { FaqSection } from "@/components/FaqSection";
import { Footer } from "@/components/Footer";
import { getPriceForSize } from "@/lib/bottleSizes";

export default function HomePage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isClubModalOpen, setIsClubModalOpen] = useState(false);
  const [clubModalQuery, setClubModalQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
  const [catalogCategory, setCatalogCategory] = useState<string>("Todos");

  // Load products & local cart
  useEffect(() => {
    const fetchProds = async () => {
      const data = await getProductos();
      setProductos(data);
    };
    fetchProds();

    // Load cart from storage
    try {
      const saved = localStorage.getItem("vecar_cart_v1");
      if (saved) setCart(JSON.parse(saved));
    } catch (e) {
      console.warn("Could not load cart", e);
    }

    // Check hash for #club
    if (typeof window !== "undefined" && window.location.hash === "#club") {
      setIsClubModalOpen(true);
    }
  }, []);

  // Save cart to local storage
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    try {
      localStorage.setItem("vecar_cart_v1", JSON.stringify(newCart));
    } catch (e) {
      console.warn("Could not save cart", e);
    }
  };

  // Cart operations
  const handleAddToCart = (producto: Producto, presentacion_ml: number = 50, customPrice?: number) => {
    const unitPrice = customPrice || getPriceForSize(presentacion_ml);
    const cartItemId = `${producto.id}-${presentacion_ml}`;
    const existsIndex = cart.findIndex((item) => (item.id || item.producto.id) === cartItemId);
    let updated: CartItem[];
    if (existsIndex >= 0) {
      updated = cart.map((item, idx) =>
        idx === existsIndex ? { ...item, cantidad: item.cantidad + 1 } : item
      );
    } else {
      updated = [
        ...cart,
        {
          id: cartItemId,
          producto,
          cantidad: 1,
          presentacion_ml,
          precio_unitario: unitPrice,
        },
      ];
    }
    saveCart(updated);
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (cartItemId: string, delta: number) => {
    const updated = cart
      .map((item) => {
        const id = item.id || item.producto.id;
        if (id === cartItemId || item.producto.id === cartItemId) {
          const newQty = item.cantidad + delta;
          return newQty > 0 ? { ...item, cantidad: newQty } : null;
        }
        return item;
      })
      .filter(Boolean) as CartItem[];

    saveCart(updated);
  };

  const handleRemoveItem = (cartItemId: string) => {
    const updated = cart.filter((item) => (item.id || item.producto.id) !== cartItemId && item.producto.id !== cartItemId);
    saveCart(updated);
  };

  const handleClearCart = () => {
    saveCart([]);
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.cantidad, 0);

  // Quick lookup from Hero
  const handleHeroCheckPhone = (phone: string) => {
    setClubModalQuery(phone);
    setIsClubModalOpen(true);
  };

  const handleScrollToCatalog = (category?: string) => {
    if (category) {
      setCatalogCategory(category);
    }
    const el = document.getElementById("catalogo");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#04110d] selection:bg-gold-500 selection:text-emerald-950">
      
      {/* NAVBAR */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenClubModal={() => {
          setClubModalQuery("");
          setIsClubModalOpen(true);
        }}
      />

      {/* HERO SECTION (Option 1 Design with 3D Tilt Card and 3D Wax Seal) */}
      <Hero
        onCheckPhone={handleHeroCheckPhone}
        onExploreCatalog={() => handleScrollToCatalog()}
        onOpenClubModal={() => {
          setClubModalQuery("");
          setIsClubModalOpen(true);
        }}
      />

      {/* BENTO GRID SHOWCASE (Universos Olfativos & Tendencias 2026) */}
      <BentoShowcase
        onSelectCategory={(cat) => handleScrollToCatalog(cat)}
      />

      {/* INTERACTIVE CATALOG */}
      <Catalog
        productos={productos}
        onAddToCart={handleAddToCart}
        onOpenProductModal={(p) => setSelectedProduct(p)}
        selectedCategory={catalogCategory}
        onSelectCategory={setCatalogCategory}
      />

      {/* FAQ SECTION (Preguntas Frecuentes del Catálogo) */}
      <FaqSection />

      {/* FOOTER */}
      <Footer
        onOpenClubModal={() => {
          setClubModalQuery("");
          setIsClubModalOpen(true);
        }}
      />

      {/* CART DRAWER */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* VECAR CLUB MODAL */}
      <VecarClubModal
        isOpen={isClubModalOpen}
        onClose={() => setIsClubModalOpen(false)}
        initialQuery={clubModalQuery}
      />

      {/* PRODUCT DETAILS MODAL */}
      <ProductModal
        producto={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

    </div>
  );
}
