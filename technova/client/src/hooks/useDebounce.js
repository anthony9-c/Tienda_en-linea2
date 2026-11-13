import { useEffect, useState } from "react";

/** Devuelve el valor solo cuando el usuario deja de escribir, para no llamar a la API en cada tecla. */
export function useDebounce(value, ms = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return debounced;
}
