import { useEffect, useState } from "react";

const leer = () => {
  try {
    const guardado = localStorage.getItem("tn_tema");
    if (guardado) return guardado;
  } catch {
    /* sin almacenamiento */
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export function useTheme() {
  const [tema, setTema] = useState(leer);
  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", tema);
    try {
      localStorage.setItem("tn_tema", tema);
    } catch {
      /* sin almacenamiento */
    }
  }, [tema]);
  return [tema, () => setTema((t) => (t === "dark" ? "light" : "dark"))];
}
