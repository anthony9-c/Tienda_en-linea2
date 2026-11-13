import path from "node:path";
import { fileURLToPath } from "node:url";
import { createApp } from "./app.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

const app = createApp({
  dataDir: process.env.DATA_DIR || path.join(here, "..", "data"),
  clientDir: path.join(here, "..", "..", "client", "dist"),
});

app.listen(PORT, () => {
  console.log(`TechNova listo en http://localhost:${PORT}  (API en /api)`);
});
