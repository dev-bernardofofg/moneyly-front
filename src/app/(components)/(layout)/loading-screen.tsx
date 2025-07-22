import { LoaderCircle } from 'lucide-react'
import Image from 'next/image'

export const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-800">
      <div className='flex flex-col items-center justify-center gap-4'>
        <Image src="/logo-moneyly.png" alt="Moneyly" width={64} height={64} />
        <span className='text-lg font-bold text-slate-950 dark:text-white'>Moneyly</span>
        <LoaderCircle className='animate-spin size-10 text-primary' />
      </div>
    </div>
  )
} 