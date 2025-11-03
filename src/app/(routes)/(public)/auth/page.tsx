"use client";

import { Logo } from "@/app/(components)/(elements)/logo";
import { StaggeredFade } from "@/app/(components)/(motions)/staggered-fade";
import { SignInForm } from "@/app/(routes)/(public)/auth/(sign-in)/sign-in.form";
import { SignUpForm } from "@/app/(routes)/(public)/auth/(sign-up)/sign-up.form";
import { AuthFloatingElements } from "@/app/(routes)/(public)/auth/auth-floating-elements";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AuthPage = () => {
  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      <AuthFloatingElements />

      <div className="w-full max-w-md relative z-30 px-4">
        <Card
          className="dark:bg-slate-800/95 dark:border-slate-700/50 dark:shadow-black/20 bg-white/95 backdrop-blur-xs border border-slate-200/50 shadow-slate-900/10"
        >
          <CardHeader className="text-center space-y-4 pb-8">
            <StaggeredFade>
              <Logo className="w-full" />
              <div className="space-y-2">
                <CardTitle
                  className="text-3xl font-bold transition-colors duration-300 dark:text-white text-slate-800"
                >
                  Moneyly
                </CardTitle>
                <CardDescription
                  className="text-base transition-colors duration-300 dark:text-slate-400 text-slate-600"
                >
                  Gerencie suas finanças de forma inteligente
                </CardDescription>
              </div>
            </StaggeredFade>
          </CardHeader>

          <CardContent className="space-y-6">
            <Tabs defaultValue="login" className="w-full">
              <StaggeredFade>
                <TabsList
                  className="grid w-full grid-cols-2 transition-colors duration-300 dark:bg-slate-700/50 dark:border-slate-600 bg-slate-100 border-slate-200"
                >
                  <TabsTrigger
                    value="login"
                    className="data-[state=active]:bg-primary data-[state=active]:text-slate-700 dark:data-[state=active]:text-slate-700 font-medium transition-colors duration-300  dark:text-slate-300 text-slate-600"
                  >
                    Entrar
                  </TabsTrigger>
                  <TabsTrigger
                    value="register"
                    className="data-[state=active]:bg-primary data-[state=active]:text-slate-700 dark:data-[state=active]:text-slate-700 font-medium transition-colors duration-300  dark:text-slate-300 text-slate-600"
                  >
                    Criar Conta
                  </TabsTrigger>
                </TabsList>
                <div>
                  <TabsContent value="login">
                    <SignInForm />
                  </TabsContent>
                  <TabsContent value="register">
                    <SignUpForm />
                  </TabsContent>
                </div>
                <div className="text-center mt-6">
                  <p className="text-sm transition-colors duration-300 dark:text-slate-500 text-slate-500">
                    Protegido por criptografia de ponta a ponta
                  </p>
                </div>
              </StaggeredFade>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;