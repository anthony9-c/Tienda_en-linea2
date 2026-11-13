import { notFound, badRequest } from "../utils/AppError.js";

const ORDENES = {
  asc: (a, b) => a.precio - b.precio,
  desc: (a, b) => b.precio - a.precio,
  nombre: (a, b) => a.nombre.localeCompare(b.nombre, "es"),
};

/** Reglas de negocio del catálogo: búsqueda, filtro por categoría y ordenamiento. */
export class ProductService {
  constructor(productRepo) {
    this.productRepo = productRepo;
  }

  list({ search = "", category = "", sort = "" } = {}) {
    if (sort && !ORDENES[sort]) throw badRequest(`Orden no válido: "${sort}". Usa asc, desc o nombre.`);
    const q = String(search).trim().toLowerCase();
    const items = this.productRepo.findAll().filter(
      (p) =>
        (!category || category === "Todas" || p.categoria === category) &&
        (!q || p.nombre.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q))
    );
    return sort ? items.sort(ORDENES[sort]) : items;
  }

  getById(id) {
    const product = this.productRepo.findById(id);
    if (!product) throw notFound(`El producto ${id} no existe.`);
    return product;
  }

  categories() {
    return [...new Set(this.productRepo.findAll().map((p) => p.categoria))].sort((a, b) => a.localeCompare(b, "es"));
  }
}
