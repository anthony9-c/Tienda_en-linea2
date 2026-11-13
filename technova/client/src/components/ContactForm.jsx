import { useState } from "react";
import { Container, Row, Col, Form, Button, Alert, Spinner } from "react-bootstrap";
import { contactService } from "../services/contactService.js";

const VACIO = { nombre: "", correo: "", mensaje: "" };

export default function ContactForm() {
  const [datos, setDatos] = useState(VACIO);
  const [validado, setValidado] = useState(false);
  const [estado, setEstado] = useState({ enviando: false, ok: false, error: null });
  const cambiar = (campo) => (e) => setDatos({ ...datos, [campo]: e.target.value });

  const enviar = async (e) => {
    e.preventDefault();
    setValidado(true);
    if (!e.currentTarget.checkValidity()) return;
    setEstado({ enviando: true, ok: false, error: null });
    try {
      await contactService.send(datos); // POST /api/contact
      setEstado({ enviando: false, ok: true, error: null });
      setDatos(VACIO);
      setValidado(false);
    } catch (err) {
      setEstado({ enviando: false, ok: false, error: err.message });
    }
  };

  return (
    <section id="contacto" className="py-5">
      <Container>
        <h2 className="section-title">Contáctanos</h2>
        <Row className="justify-content-center">
          <Col lg={7}>
            <Form noValidate validated={validado} onSubmit={enviar}>
              <Form.Group className="mb-3" controlId="nombre">
                <Form.Label>Nombre completo</Form.Label>
                <Form.Control required minLength={3} value={datos.nombre} onChange={cambiar("nombre")} />
                <Form.Control.Feedback type="invalid">Ingresa tu nombre (mínimo 3 caracteres).</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="correo">
                <Form.Label>Correo electrónico</Form.Label>
                <Form.Control type="email" required value={datos.correo} onChange={cambiar("correo")} />
                <Form.Control.Feedback type="invalid">Ingresa un correo válido.</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="mensaje">
                <Form.Label>Mensaje</Form.Label>
                <Form.Control as="textarea" rows={4} required minLength={10} value={datos.mensaje} onChange={cambiar("mensaje")} />
                <Form.Control.Feedback type="invalid">El mensaje debe tener al menos 10 caracteres.</Form.Control.Feedback>
              </Form.Group>
              <Button type="submit" className="btn-accent" disabled={estado.enviando}>
                {estado.enviando ? <Spinner size="sm" animation="border" /> : "Enviar mensaje"}
              </Button>
              {estado.ok && <Alert variant="success" className="mt-3" role="status">¡Gracias! Tu mensaje fue enviado correctamente.</Alert>}
              {estado.error && <Alert variant="danger" className="mt-3">{estado.error}</Alert>}
            </Form>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
