import { BaseForm } from "@/app/(components)/(bases)/(forms)/base-form"
import { BaseInput } from "@/app/(components)/(bases)/(forms)/base-input"
import { BaseSelect } from "@/app/(components)/(bases)/(forms)/base-select"
import { FN_UTILS_STRING } from "@/app/(helpers)/string"
import { InitialConfigDefaultValues, InitialConfigFormValues, InitialConfigSchema } from "@/app/(resources)/(schemas)/initial-config.schema"
import { UpdateInitialConfigRequest } from "@/app/(services)/user.service"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNumberFormat } from "@react-input/number-format"
import { Calendar, DollarSign, Info } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

interface InitialConfigFormProps {
  onSuccess: () => void
}

export const InitialConfigForm = ({ onSuccess }: InitialConfigFormProps) => {
  const form = useForm<InitialConfigFormValues>({
    resolver: zodResolver(InitialConfigSchema),
    defaultValues: InitialConfigDefaultValues,
  })

  const { mutate: updateInitialConfig } = UpdateInitialConfigRequest({
    onSuccess: () => {
      toast.success("Configurações financeiras salvas com sucesso!")
      onSuccess()
    },
    onError: () => {
      toast.error("Erro ao salvar configurações")
    },
  })

  const handleSubmit = async (data: InitialConfigFormValues) => {
    updateInitialConfig({
      monthlyIncome: FN_UTILS_STRING.formatCurrencyToNumber(data.monthlyIncome),
      financialDayStart: data.financialDayStart,
      financialDayEnd: data.financialDayEnd,
    })
  }

  const days = Array.from({ length: 31 }, (_, i) => i + 1)

  const currencyInputRef = useNumberFormat({
    format: "currency",
    currency: "BRL",
    locales: "pt-BR",
    maximumFractionDigits: 2,
  })

  return (
    <Form {...form}>
      <BaseForm onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">

        {/* Seção 1: Rendimento Mensal */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <DollarSign className="size-4 text-green-600" />
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Rendimento Mensal</h3>
          </div>

          <BaseInput
            control={form.control}
            ref={currencyInputRef}
            label="Qual é o seu rendimento mensal?"
            name="monthlyIncome"
            placeholder="Digite seu rendimento mensal"
          />
        </div>

        {/* Seção 2: Período Financeiro */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="size-4 text-blue-600" />
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Período Financeiro</h3>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 dark:bg-blue-950 dark:border-blue-800">
            <div className="flex items-start gap-2">
              <Info className="size-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800 dark:text-blue-400">
                <p className="font-medium mb-1">Como funciona o período financeiro?</p>
                <p className="text-blue-700 dark:text-blue-400">
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
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700 dark:text-white/40">Dia 1 ao 31: Período mensal completo</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
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
          className="w-full h-10 font-medium bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 dark:from-green-500 dark:to-emerald-600 dark:hover:from-green-600 dark:hover:to-emerald-700"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
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
