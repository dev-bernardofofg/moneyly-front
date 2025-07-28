"use client"

import { Section } from "@/app/(components)/(bases)/(cards)/section"
import { Header } from "@/app/(components)/(layout)/header"
import { Fade } from "@/app/(components)/(motions)/fade"
import { StaggeredFade } from "@/app/(components)/(motions)/staggered-fade"
import { useAuth } from "@/app/(contexts)/auth-provider"
import { ProfileConfigFinanceForm } from "@/app/(resources)/(forms)/profile-config-finance.form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Settings, User } from "lucide-react"

export default function ProfilePage() {
  const { user } = useAuth()

  return (
    <Fade>
      <Header title="Perfil" />

      <StaggeredFade variant="page">
        <Section
          Icon={User}
          title="Informações Pessoais"
        >
          <StaggeredFade className="flex flex-col gap-2">
            <div className="flex items-center gap-2 w-full">
              <div className="flex flex-col gap-2 w-full">
                <Label className="text-muted-foreground">Nome completo</Label>
                <Input placeholder="Nome completo" value={user?.name} readOnly />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <Label className="text-muted-foreground">Email</Label>
                <Input placeholder="Email" value={user?.email} readOnly />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex flex-col gap-2 w-full">
                <Label className="text-muted-foreground" >Membro desde</Label>
                {user?.createdAt && (
                  <Input placeholder="Membro desde" value={format(user?.createdAt, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })} readOnly />
                )}
              </div>
            </div>
          </StaggeredFade>
        </Section>

        <Section
          Icon={Settings}
          title="Configurações Financeiras"
        >
          {user?.financialDayStart && user?.financialDayEnd && user?.monthlyIncome && (
            <ProfileConfigFinanceForm
              defaultValues={{
                financialDayStart: user?.financialDayStart.toString(),
                financialDayEnd: user?.financialDayEnd.toString(),
                monthlyIncome: user?.monthlyIncome?.toString(),
              }}
            />
          )}
        </Section>
      </StaggeredFade>
    </Fade>
  )
}
