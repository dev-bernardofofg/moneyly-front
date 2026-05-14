import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UpsertTransactionForm } from "./upsert-transaction.form"
import { UpsertTransactionRecurringForm } from "./upsert-transaction-recurring.form"

export const TransactionTabs = () => {
  return (
    <Tabs>
      <TabsList className="grid w-full grid-cols-2 transition-colors duration-300 dark:bg-slate-700/50 dark:border-slate-600 bg-slate-100 border-slate-200">
        <TabsTrigger value="transaction" className="data-[state=active]:bg-primary data-[state=active]:text-slate-700 dark:data-[state=active]:text-slate-700 font-medium transition-colors duration-300  dark:text-slate-300 text-slate-600">Transação Comum</TabsTrigger>
        <TabsTrigger value="recurring-transaction" className="data-[state=active]:bg-primary data-[state=active]:text-slate-700 dark:data-[state=active]:text-slate-700 font-medium transition-colors duration-300  dark:text-slate-300 text-slate-600">Transação Recorrente</TabsTrigger>
      </TabsList>

      <TabsContent value="transaction">
        <UpsertTransactionForm />
      </TabsContent>

      <TabsContent value="recurring-transaction">
        <UpsertTransactionRecurringForm />
      </TabsContent>
    </Tabs>
  )
}   