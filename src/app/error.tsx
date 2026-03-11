"use client";

import { BaseButton } from "./(components)/(bases)/(clickable)/base-button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8 text-center">
      <h2 className="text-2xl font-semibold">Algo deu errado</h2>
      <p className="text-muted-foreground max-w-md">
        {error.message || "Ocorreu um erro inesperado. Tente novamente."}
      </p>
      <BaseButton onClick={reset}>Tentar novamente</BaseButton>
    </div>
  );
}
