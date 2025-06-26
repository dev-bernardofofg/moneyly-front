"use client";

import { BaseDialog } from "@/app/(components)/(bases)/(portals)/base-dialog";
import { BaseButton } from "@/app/(components)/(bases)/base-button";
import { Header } from "@/app/(components)/(layout)/header";
import { Fade } from "@/app/(components)/(motions)/fade";
import { useAuth } from "@/app/(contexts)/auth-provider";
import { UpsertTransactionForm } from "@/app/(resources)/(forms)/upsert-transaction.form";

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <Fade>
      <Header
        actions={
          <BaseDialog
            title="Nova transação"
            description="Adicione uma nova transação"
            trigger={<BaseButton>
              Nova transação
            </BaseButton>}
          >
            <UpsertTransactionForm />
          </BaseDialog>
        }
      />
    </Fade>
  )
};

export default DashboardPage;
