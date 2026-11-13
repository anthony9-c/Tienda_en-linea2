import { request } from "./apiClient.js";

// Servicio de productos: los componentes no conocen URLs, solo llaman a estos métodos.
export const productService = {
  list({ search = "", category = "", sort = "" } = {}, signal) {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category && category !== "Todas") params.set("category", category);
    if (sort) params.set("sort", sort);
    const qs = params.toString();
    return request(`/products${qs ? `?${qs}` : ""}`, { signal });
  },
  get: (id, signal) => request(`/products/${id}`, { signal }),
  categories: (signal) => request("/categories", { signal }),
};
