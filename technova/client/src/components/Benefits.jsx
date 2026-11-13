import { Container, Row, Col } from "react-bootstrap";

const BENEFICIOS = [
  { icono: "🚚", titulo: "Envío rápido", texto: "Entrega en 24 a 72 horas en las principales ciudades." },
  { icono: "🛡️", titulo: "Garantía real", texto: "12 meses de garantía en todos nuestros productos." },
  { icono: "💳", titulo: "Pago seguro", texto: "Tarjeta, Yape, Plin o contra entrega." },
];

export default function Benefits() {
  return (
    <section id="beneficios" className="py-5 bg-body-tertiary">
      <Container>
        <h2 className="section-title">¿Por qué comprar en TechNova?</h2>
        <Row className="g-4 text-center">
          {BENEFICIOS.map((b) => (
            <Col md={4} key={b.titulo}>
              <div className="feature">
                <div className="feature-icon">{b.icono}</div>
                <h3 className="h5">{b.titulo}</h3>
                <p>{b.texto}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}
