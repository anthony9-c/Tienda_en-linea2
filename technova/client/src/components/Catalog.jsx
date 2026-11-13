import { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import ProductCard from "./ProductCard.jsx";
import { useProducts } from "../hooks/useProducts.js";
import { useDebounce } from "../hooks/useDebounce.js";

export default function Catalog({ categories, reloadKey, onSelect }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const [sort, setSort] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const { products, loading, error } = useProducts({ search: debouncedSearch, category, sort }, reloadKey);

  const limpiar = () => {
    setSearch("");
    setCategory("Todas");
    setSort("");
  };

  return (
    <section id="catalogo" className="py-5">
      <Container>
        <h2 className="section-title">Catálogo de productos</h2>

        <Form className="row g-2 mb-4" role="search" onSubmit={(e) => e.preventDefault()}>
          <Col md={5}>
            <Form.Control type="search" aria-label="Buscar producto" placeholder="Buscar producto..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </Col>
          <Col md={3}>
            <Form.Select aria-label="Categoría" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="Todas">Todas las categorías</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Select aria-label="Ordenar" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="">Ordenar: Destacados</option>
              <option value="asc">Precio: menor a mayor</option>
              <option value="desc">Precio: mayor a menor</option>
              <option value="nombre">Nombre (A-Z)</option>
            </Form.Select>
          </Col>
          <Col md={1} className="d-grid">
            <Button variant="outline-secondary" onClick={limpiar}>Limpiar</Button>
          </Col>
        </Form>

        {error && <Alert variant="danger">{error}</Alert>}
        {!error && !loading && (
          <p className="text-secondary" aria-live="polite">Mostrando {products.length} productos</p>
        )}

        <Row className="g-4">
          {loading
            ? Array.from({ length: 8 }, (_, i) => (
                <Col key={i} sm={6} lg={4} xl={3}><div className="skeleton" /></Col>
              ))
            : products.map((p, i) => (
                <Col key={p.id} sm={6} lg={4} xl={3}>
                  <ProductCard product={p} delay={i * 50} onSelect={onSelect} />
                </Col>
              ))}
        </Row>
        {!loading && !error && products.length === 0 && (
          <Alert variant="warning">No se encontraron productos con esos filtros.</Alert>
        )}
      </Container>
    </section>
  );
}
