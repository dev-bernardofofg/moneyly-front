"use client"

import { BaseForm } from "@/app/(components)/(bases)/(forms)/base-form"
import { BaseInput } from "@/app/(components)/(bases)/(forms)/base-input"
import { BaseSelect } from "@/app/(components)/(bases)/(forms)/base-select"
import { useAuth } from "@/app/(contexts)/auth-provider"
import { getErrorMessage } from "@/app/(helpers)/errors"
import { FN_UTILS_STRING } from "@/app/(helpers)/string"
import { InitialConfigDefaultValues, InitialConfigFormValues, InitialConfigSchema } from "@/app/(resources)/(schemas)/initial-config.schema"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { Calendar, DollarSign, Info } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { getGetUserMeQueryKey, getUserMe, usePutUserIncomeAndPeriod } from "../(generated)/hooks/user/user"

interface InitialConfigFormProps {
  onSuccess: () => void
}

export const InitialConfigForm = ({ onSuccess }: InitialConfigFormProps) => {
  const { updateUser } = useAuth()
  const queryClient = useQueryClient()

  const form = useForm<InitialConfigFormValues>({
    resolver: zodResolver(InitialConfigSchema),
    defaultValues: InitialConfigDefaultValues,
  })

  const { mutate: updateIncomeAndPeriod, isPending } = usePutUserIncomeAndPeriod({
    mutation: {
      onSuccess: async () => {
        toast.success("Configurações salvas com sucesso!")
        queryClient.invalidateQueries({ queryKey: getGetUserMeQueryKey() })

          const response = await getUserMe()
          const userData = response.data
          if (userData) {
            // getUserMe já retorna o User atualizado (fonte de verdade pós-update).
            updateUser(userData)
            queryClient.clear()
          }
      
        onSuccess()
      },
      onError: (error) => {
        const errorMessage = getErrorMessage(error as any)
        toast.error(errorMessage || "Erro ao salvar configurações")
      },
    },
  })

  const handleSubmit = (data: InitialConfigFormValues) => {
    updateIncomeAndPeriod({
      data: {
        monthlyIncome: FN_UTILS_STRING.formatCurrentStringToNumber(data.monthlyIncome),
        financialDayStart: data.financialDayStart,
        financialDayEnd: data.financialDayEnd,
      },
    })
  }

  const days = Array.from({ length: 31 }, (_, i) => i + 1)

  return (
    <Form {...form}>
      <BaseForm onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <DollarSign className="size-4 text-income" />
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Renda Mensal</h3>
          </div>

          <BaseInput
            control={form.control}
            label="Qual é o seu rendimento mensal?"
            name="monthlyIncome"
            placeholder="Digite seu rendimento mensal"
            type="money"
          />
        </div>
    
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="size-4 text-info" />
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Período Financeiro</h3>
          </div>

          <div className="bg-info/5 border border-info/20 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Info className="size-4 text-info mt-0.5 flex-shrink-0" />
              <div className="text-sm text-info">
                <p className="font-medium mb-1">Como funciona o período financeiro?</p>
                <p className="text-info/80">
                  Defina em qual dia do mês seu período financeiro começa e termina.
                  Pode cruzar meses (ex: do dia 5 ao dia 4 do próximo mês).
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 dark:bg-gray-800 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-income rounded-full"></div>
                <span className="text-gray-700 dark:text-white/40">Dia 1 ao 31: Período mensal completo</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-info rounded-full"></div>
                <span className="text-gray-700 dark:text-white/40">Dia 5 ao 4: Cruza meses (5 jan - 4 fev)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-gray-700 dark:text-white/40">Dia 15 ao 14: Meio do mês</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-gray-700 dark:text-white/40">Dia 10 ao 9: Início do mês</span>
              </div>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-10 font-medium bg-income text-income-foreground hover:bg-income/90"
          disabled={isPending}
        >
          {isPending ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="text-white">Salvando...</span>
            </div>
          ) : (
            'Salvar Configurações'
          )}
        </Button>
      </BaseForm>
    </Form>
  )
}
