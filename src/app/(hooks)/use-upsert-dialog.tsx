"use client";

import { useDialogCloseGuard } from "@/app/(components)/(bases)/(portals)/base-dialog";
import { getErrorMessage, setFormFieldErrors } from "@/app/(helpers)/errors";
import { CustomAxiosError } from "@/app/(types)/error.type";
import { DialogClose } from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import {
  DefaultValues,
  FieldValues,
  Path,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";
import type { ZodType } from "zod";

interface UseUpsertDialogOptions<TForm extends FieldValues> {
  schema: ZodType<TForm>;
  defaultValues: DefaultValues<TForm>;
  /** Query keys invalidados após sucesso (create e update). */
  invalidateKeys: readonly (readonly unknown[])[];
  /** Campos do form que recebem erro de API (setFormFieldErrors). */
  errorFields: Path<TForm>[];
  successMessage: { create: string; update: string };
}

/**
 * Boilerplate único dos forms upsert em dialog: form RHF+zod, fechar dialog
 * (DialogClose escondido), invalidação de cache e tratamento de erro padrão.
 * Substitui a duplicação de closeRef/mutations gêmeas/onError espalhada.
 */
export const useUpsertDialog = <TForm extends FieldValues>({
  schema,
  defaultValues,
  invalidateKeys,
  errorFields,
  successMessage,
}: UseUpsertDialogOptions<TForm>) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const queryClient = useQueryClient();

  const form = useForm<TForm>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // Bloqueia fechar o dialog (X/Esc/fora) com alterações não salvas.
  const guard = useDialogCloseGuard();
  useEffect(() => {
    guard?.setGuard(() => !form.formState.isDirty);
    return () => guard?.setGuard(null);
  }, [guard, form]);

  const invalidate = () =>
    invalidateKeys.forEach((queryKey) =>
      queryClient.invalidateQueries({ queryKey })
    );

  const close = () => closeRef.current?.click();

  const onCreated = () => {
    toast.success(successMessage.create);
    invalidate();
    form.reset();
    close();
  };

  const onUpdated = () => {
    toast.success(successMessage.update);
    invalidate();
    form.reset(); // limpa isDirty p/ não disparar o guard ao fechar
    close();
  };

  const onError = (error: CustomAxiosError) => {
    toast.error(getErrorMessage(error));
    setFormFieldErrors(error, form.setError, errorFields);
  };

  const DialogCloseHidden = () => (
    <DialogClose ref={closeRef} className="hidden" />
  );

  return { form, closeRef, onCreated, onUpdated, onError, DialogCloseHidden };
};
