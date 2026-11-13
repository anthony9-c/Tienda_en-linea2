import { useEffect, useState } from "react";
import AppNavbar from "./components/AppNavbar.jsx";
import Hero from "./components/Hero.jsx";
import Catalog from "./components/Catalog.jsx";
import Benefits from "./components/Benefits.jsx";
import ContactForm from "./components/ContactForm.jsx";
import Footer from "./components/Footer.jsx";
import CartDrawer from "./components/CartDrawer.jsx";
import ProductModal from "./components/ProductModal.jsx";
import { productService } from "./services/productService.js";
import { useTheme } from "./hooks/useTheme.js";

export default function App() {
  const [tema, alternarTema] = useTheme();
  const [showCart, setShowCart] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [reloadKey, setReloadKey] = useState(0); // al subirlo, el catálogo vuelve a pedir datos (stock actualizado)

  useEffect(() => {
    productService.categories().then(setCategories).catch(() => setCategories([]));
  }, [reloadKey]);

  return (
    <>
      <AppNavbar tema={tema} onToggleTema={alternarTema} onOpenCart={() => setShowCart(true)} />
      <main>
        <Hero />
        <Catalog categories={categories} reloadKey={reloadKey} onSelect={setSelectedId} />
        <Benefits />
        <ContactForm />
      </main>
      <Footer />
      <CartDrawer show={showCart} onHide={() => setShowCart(false)} onOrdered={() => setReloadKey((k) => k + 1)} />
      <ProductModal productId={selectedId} onHide={() => setSelectedId(null)} />
    </>
  );
}
