import { request } from "./apiClient.js";

export const contactService = {
  send: (datos) => request("/contact", { method: "POST", body: datos }),
};
