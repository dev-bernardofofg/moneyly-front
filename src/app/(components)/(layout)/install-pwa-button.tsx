"use client";

import { Button } from "@/components/ui/button";
import { usePWA } from "@/hooks/use-pwa";
import { Download } from "lucide-react";
import { useState } from "react";

export function InstallPWAButton() {
  const { isInstallable, installPWA } = usePWA();
  const [isInstalling, setIsInstalling] = useState(false);

  const handleInstall = async () => {
    if (!isInstallable) return;

    setIsInstalling(true);
    try {
      await installPWA();
    } catch (error) {
      console.error("Error installing PWA:", error);
    } finally {
      setIsInstalling(false);
    }
  };

  if (!isInstallable) return null;

  return (
    <Button
      onClick={handleInstall}
      disabled={isInstalling}
      size="sm"
      className={`w-full gap-2 text-xs ${isInstallable && 'hidden'}`}
    >
      <Download className="h-4 w-4" />
      {isInstalling ? "Instalando..." : "Instalar App"}
    </Button>
  );
} 