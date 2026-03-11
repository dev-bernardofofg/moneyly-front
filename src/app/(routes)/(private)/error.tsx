"use client";

import { BaseButton } from "@/app/(components)/(bases)/(clickable)/base-button";
import { useRouter } from "next/navigation";

export default function PrivateError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-8 text-center">
      <h2 className="text-2xl font-semibold">Página com erro</h2>
      <p className="text-muted-foreground max-w-md">
        {error.message || "Não foi possível carregar esta página."}
      </p>
      <div className="flex gap-3">
        <BaseButton variant="outline" onClick={() => router.push("/dashboard")}>
          Ir ao dashboard
        </BaseButton>
        <BaseButton onClick={reset}>Tentar novamente</BaseButton>
      </div>
    </div>
  );
}
