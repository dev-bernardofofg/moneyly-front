"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then(() => {
            // Service Worker registrado com sucesso
          })
          .catch(() => {
            // Falha silenciosa — SW não é crítico para o funcionamento
          });
      });
    }
  }, []);

  return null;
} 