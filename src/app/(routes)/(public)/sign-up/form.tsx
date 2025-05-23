"use client"

import { BaseInput } from "@/app/(components)/(forms)/input"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { Key, Mail } from "lucide-react"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { SignUpDefaultValues, SignUpFormValues, SignUpSchema } from "./utils"
import { Form } from "@/components/ui/form"
import Link from "next/link"

export const SignUpForm = () => {
  const form = useForm({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      ...SignUpDefaultValues
    }
  })

  const handleForm = (data: SignUpFormValues) => {
    console.log(data)
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleForm)} className='p-8 bg-secondary rounded-lg space-y-4'>
        <Image src="/logo-single.png" alt="logo-moneyly" width={100} height={100} className='mx-auto mb-4' />
        <h1 className='text-center text-2xl font-bold mb-4 drop-shadow shadow-primary'>Criar sua conta</h1>
        <p className='text-center text-sm text-muted-foreground mb-4'>Insira seus dados</p>
        <div className='space-y-4'>
          <BaseInput control={form.control} name='email' Icon={Mail} label='Email' placeholder='Insira seu nome' autoFocus />
          <BaseInput control={form.control} name='email' Icon={Mail} label='Email' placeholder='Insira seu email' autoFocus />
          <BaseInput control={form.control} name='password' Icon={Key} label='Senha' placeholder='Insira sua senha' type="password" />
          <Button className='w-full' type="submit">Criar conta</Button>
        </div>

        <div className='flex items-center'>
          <Link href="/sign-up" className='text-neutral-500 hover:text-primary transition-colors duration-200'>
            Já possui uma conta? Entre agora
          </Link>
        </div>
      </form>
    </Form>
  )
}
