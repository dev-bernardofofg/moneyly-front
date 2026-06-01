'use client';

import { Section } from '@/app/(components)/(bases)/(cards)/section';
import { Header } from '@/app/(components)/(layout)/header';
import { Fade } from '@/app/(components)/(motions)/fade';
import { StaggeredFade } from '@/app/(components)/(motions)/staggered-fade';
import { FN_UTILS_DATE } from '@/app/(helpers)/date';
import { ProfileConfigFinanceForm } from '@/app/(routes)/(private)/profile/profile-config-finance.form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ptBR } from 'date-fns/locale';
import { Settings, User } from 'lucide-react';
import { useProfileAction } from './profile.action';

export default function ProfilePage() {
  const { user, financeDefaultValues } = useProfileAction();

  return (
    <Fade>
      <Header title="Perfil" />

      <StaggeredFade variant="page">
        <Section Icon={User} title="Informações Pessoais">
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
                <Label className="text-muted-foreground">Membro desde</Label>
                {user?.createdAt && (
                  <Input
                    placeholder="Membro desde"
                    value={FN_UTILS_DATE.formatInBusinessTZ(
                      user.createdAt,
                      "dd 'de' MMMM 'de' yyyy",
                      ptBR
                    )}
                    readOnly
                  />
                )}
              </div>
            </div>
          </StaggeredFade>
        </Section>

        <Section Icon={Settings} title="Configurações Financeiras">
          {user && <ProfileConfigFinanceForm defaultValues={financeDefaultValues} />}
        </Section>
      </StaggeredFade>
    </Fade>
  );
}
