import { useEffect, useState } from "react";
import { productService } from "../services/productService.js";

/** Pide los productos a la API cada vez que cambian los filtros; cancela la petición anterior. */
export function useProducts(filters, reloadKey = 0) {
  const [state, setState] = useState({ products: [], loading: true, error: null });
  const { search, category, sort } = filters;

  useEffect(() => {
    const controller = new AbortController();
    setState((s) => ({ ...s, loading: true, error: null }));
    productService
      .list({ search, category, sort }, controller.signal)
      .then((products) => setState({ products, loading: false, error: null }))
      .catch((e) => {
        if (e.name !== "AbortError") setState({ products: [], loading: false, error: e.message });
      });
    return () => controller.abort();
  }, [search, category, sort, reloadKey]);

  return state;
}
