import { createContext, useContext, useEffect, useMemo, useReducer } from "react";

const CartContext = createContext(null);
const KEY = "tn_carrito_v2";

const cargar = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? [];
  } catch {
    return [];
  }
};

// El carrito guarda una copia de los datos visibles del producto para poder dibujarse sin consultar la API.
function reducer(items, action) {
  switch (action.type) {
    case "add": {
      const p = action.product;
      const existe = items.find((i) => i.id === p.id);
      if (existe) {
        if (existe.cantidad >= p.stock) return items; // no superar el stock disponible
        return items.map((i) => (i.id === p.id ? { ...i, cantidad: i.cantidad + 1, stock: p.stock } : i));
      }
      if (p.stock < 1) return items;
      const { id, nombre, precio, emoji, color, stock } = p;
      return [...items, { id, nombre, precio, emoji, color, stock, cantidad: 1 }];
    }
    case "inc":
      return items.map((i) => (i.id === action.id && i.cantidad < i.stock ? { ...i, cantidad: i.cantidad + 1 } : i));
    case "dec":
      return items.map((i) => (i.id === action.id ? { ...i, cantidad: i.cantidad - 1 } : i)).filter((i) => i.cantidad > 0);
    case "clear":
      return [];
    default:
      return items;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, undefined, cargar);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* almacenamiento no disponible: el carrito sigue funcionando en memoria */
    }
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      unidades: items.reduce((s, i) => s + i.cantidad, 0),
      total: items.reduce((s, i) => s + i.precio * i.cantidad, 0),
      add: (product) => dispatch({ type: "add", product }),
      inc: (id) => dispatch({ type: "inc", id }),
      dec: (id) => dispatch({ type: "dec", id }),
      clear: () => dispatch({ type: "clear" }),
    }),
    [items]
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
