export default function Footer() {
  return (
    <footer className="app-footer py-4 text-center">
      <div className="container">
        <p className="mb-1">© {new Date().getFullYear()} TechNova. Proyecto académico — Programación Web, avance al 50%.</p>
        <small>Universidad Continental · Ingeniería de Sistemas e Informática</small>
      </div>
    </footer>
  );
}
