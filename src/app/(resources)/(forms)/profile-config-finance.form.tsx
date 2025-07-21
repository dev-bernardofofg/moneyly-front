"use client"

import { BaseForm } from "@/app/(components)/(bases)/(forms)/base-form"
import { BaseInput } from "@/app/(components)/(bases)/(forms)/base-input"
import { BaseSelect } from "@/app/(components)/(bases)/(forms)/base-select"
import { BaseButton } from "@/app/(components)/(bases)/base-button"
import { useAuth } from "@/app/(contexts)/auth-provider"
import { FN_UTILS_STRING } from "@/app/(helpers)/string"
import { GetMeRequest, UpdateProfileRequest } from "@/app/(services)/user.service"
import { Form } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { ProfileConfigFinanceFormValues, profileConfigFinanceFormSchema } from "../(schemas)/profile-config-finance.schema"

export const ProfileConfigFinanceForm = ({ defaultValues }: { defaultValues: ProfileConfigFinanceFormValues }) => {
  const { updateUser } = useAuth()

  const form = useForm<ProfileConfigFinanceFormValues>({
    resolver: zodResolver(profileConfigFinanceFormSchema),
    defaultValues: {
      financialDayStart: defaultValues.financialDayStart!,
      financialDayEnd: defaultValues.financialDayEnd!,
      monthlyIncome: FN_UTILS_STRING.formatCurrencyToCents(defaultValues.monthlyIncome),
    },
  })
  const { mutate: getMe } = GetMeRequest({
    onSuccess: (data) => {
      updateUser(data.data.user)
    }
  })

  const { mutate: updateProfile } = UpdateProfileRequest({
    onSuccess: () => {
      toast.success("Configurações atualizadas com sucesso")
      getMe()
      form.reset(form.getValues())
    },
    onError: () => {
      toast.error("Erro ao atualizar configurações")
    },
  })

  const onSubmit = (data: ProfileConfigFinanceFormValues) => {
    if (form.formState.isDirty) {
      updateProfile({
        monthlyIncome: FN_UTILS_STRING.formatCurrencyToNumber(data.monthlyIncome),
        financialDayStart: data.financialDayStart,
        financialDayEnd: data.financialDayEnd,
      })
    } else {
      toast.info("Nenhuma alteração foi feita")
    }
  }

  const days = Array.from({ length: 31 }, (_, i) => i + 1)

  return (
    <Form {...form}>
      <BaseForm onSubmit={form.handleSubmit(onSubmit)} className="space-y-0 grid grid-cols-3 gap-3 w-full">
        <BaseInput
          control={form.control}
          label="Renda Mensal"
          name="monthlyIncome"
          placeholder="R$ 0,00"
          type="money"
        />
        <BaseSelect
          control={form.control}
          label="Dia de início"
          name="financialDayStart"
          options={days.map((day) => ({ label: day.toString(), value: day }))}
        />

        <BaseSelect
          control={form.control}
          label="Dia de fim"
          name="financialDayEnd"
          options={days.map((day) => ({ label: day.toString(), value: day }))}
        />

        <BaseButton
          type="submit"
          className="w-fit"
          disabled={!form.formState.isDirty}
        >
          Salvar
        </BaseButton>
      </BaseForm>
    </Form>
  )
}
