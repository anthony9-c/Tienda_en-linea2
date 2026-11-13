import { createContext, useCallback, useContext, useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";

const ToastContext = createContext(() => {});

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ show: false, text: "", variant: "dark" });
  const notify = useCallback((text, variant = "dark") => setToast({ show: true, text, variant }), []);
  return (
    <ToastContext.Provider value={notify}>
      {children}
      <ToastContainer position="bottom-end" className="p-3 position-fixed">
        <Toast
          show={toast.show}
          onClose={() => setToast((t) => ({ ...t, show: false }))}
          delay={3000}
          autohide
          bg={toast.variant}
          role="status"
        >
          <Toast.Body className="text-white">{toast.text}</Toast.Body>
        </Toast>
      </ToastContainer>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
