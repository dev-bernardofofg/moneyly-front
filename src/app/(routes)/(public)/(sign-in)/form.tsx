"use client"


import { BaseInput } from '@/app/(components)/(forms)/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';
import { Key, Mail } from 'lucide-react';
import { Form } from '@/components/ui/form';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { SignInDefaultValues, SignInFormValues, SignInSchema } from './utils';
import Link from 'next/link';
import { SignInRequest } from '@/app/(http)/auth.http';

export const SignInForm = () => {
  const form = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      ...SignInDefaultValues
    }
  })

  const { mutateAsync } = SignInRequest()

  const handleForm = (data: SignInFormValues) => {
    console.log(data)
    mutateAsync(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleForm)} className='p-8 bg-secondary rounded-lg space-y-4'>
        <Image src="/logo-single.png" alt="logo-moneyly" width={100} height={100} className='mx-auto mb-4' />
        <h1 className='text-center text-2xl font-bold mb-4 drop-shadow shadow-primary'>Entrar</h1>
        <p className='text-center text-sm text-muted-foreground mb-4'>Entre com sua conta</p>
        <div className='space-y-4'>
          <BaseInput control={form.control} name='email' Icon={Mail} label='Email' placeholder='Insira seu email' autoFocus />
          <BaseInput control={form.control} name='password' Icon={Key} label='Senha' placeholder='Insira sua senha' type="password" />
          <Button className='w-full' type="submit">Logar</Button>
        </div>

        <div className='flex items-center'>
          <Link href="/sign-up" className='text-neutral-500 hover:text-primary transition-colors duration-200'>
            Nâo possui uma senha? Crie uma conta
          </Link>
        </div>
      </form>
    </Form>
  )
}
