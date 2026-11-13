import { Container, Row, Col, Badge, Button } from "react-bootstrap";

export default function Hero() {
  return (
    <section id="inicio" className="hero">
      <Container className="py-5">
        <Row className="align-items-center g-4">
          <Col lg={7} className="hero-text">
            <Badge bg="light" text="dark" className="mb-3">Envíos a todo el Perú</Badge>
            <h1 className="display-4 fw-bold">La tecnología que necesitas, al mejor precio</h1>
            <p className="lead">Audífonos, teclados, smartwatches y más. Compra fácil, paga seguro y recibe en casa.</p>
            <Button href="#catalogo" variant="light" size="lg" className="me-2">Ver catálogo</Button>
            <Button href="#contacto" variant="outline-light" size="lg">Escríbenos</Button>
          </Col>
          <Col lg={5} className="text-center d-none d-lg-block">
            <div className="hero-orb" aria-hidden="true">🎧</div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
