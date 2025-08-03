"use client";

import { Button } from "@/components/ui/button";
import { usePWA } from "@/hooks/use-pwa";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

const PWA_DISMISSED_KEY = "pwa-install-dismissed";

export function PWAInstallPrompt() {
  const { isInstallable, installPWA } = usePWA();
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    // Check if user has previously dismissed the prompt
    const hasDismissed = localStorage.getItem(PWA_DISMISSED_KEY);
    if (hasDismissed || !isInstallable) return;

    setShowInstallPrompt(true);
  }, [isInstallable]);

  const handleInstallClick = async () => {
    await installPWA();
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    // Save to localStorage that user dismissed the prompt
    localStorage.setItem(PWA_DISMISSED_KEY, "true");
    setShowInstallPrompt(false);
  };

  if (!showInstallPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 dark:bg-slate-800  bg-white border border-border rounded-lg shadow-lg p-4 w-1/2 mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-sm">Instalar Moneyly</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Instale o app para uma experiência melhor e praticidade
          </p>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <Button
            size="sm"
            onClick={handleInstallClick}
            className="text-xs"
          >
            Instalar
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleDismiss}
            className="p-1 h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
} 