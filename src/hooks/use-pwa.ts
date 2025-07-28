"use client";

import { useEffect, useState } from "react";

export function usePWA() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Verificar se está rodando como PWA standalone
    const checkStandalone = () => {
      const standalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true;
      setIsStandalone(standalone);
    };

    // Verificar se está online
    const checkOnline = () => {
      setIsOnline(navigator.onLine);
    };

    // Verificar se foi instalado
    const checkInstalled = () => {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
          // Verificar se há um service worker ativo
          if (registration.active) {
            setIsInstalled(true);
          }
        });
      }
    };

    checkStandalone();
    checkOnline();
    checkInstalled();

    // Event listeners
    window.addEventListener("online", checkOnline);
    window.addEventListener("offline", checkOnline);
    window.addEventListener("load", checkInstalled);

    return () => {
      window.removeEventListener("online", checkOnline);
      window.removeEventListener("offline", checkOnline);
      window.removeEventListener("load", checkInstalled);
    };
  }, []);

  return {
    isInstalled,
    isStandalone,
    isOnline,
    canInstall: "serviceWorker" in navigator && "PushManager" in window,
  };
}
