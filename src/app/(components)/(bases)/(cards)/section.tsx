'use client';

import { StaggeredFade } from '@/app/(components)/(motions)/staggered-fade';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import { LucideIcon } from 'lucide-react';

interface SectionProps {
  Icon: LucideIcon;
  title: string;
  children: React.ReactNode;
  className?: string;
  classNameHeader?: string;
  variant?: 'default' | 'secondary';
}

const headerVariants = cva(
  'bg-slate-100 dark:bg-slate-800 rounded-lg dark:border-slate-700 border border-slate-200',
  {
    variants: {
      variant: {
        default: 'border-b border-slate-200 dark:border-slate-700',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      },
    },
  }
);

export const Section = ({ Icon, title, children, className, classNameHeader }: SectionProps) => {
  return (
    <StaggeredFade className="bg-slate-100 dark:bg-slate-800 rounded-lg dark:border-slate-700 border border-slate-200">
      <Card className="w-full border-none">
        <CardHeader
          className={cn('border-b border-slate-200 dark:border-slate-700', classNameHeader)}
        >
          <CardTitle className="flex items-center gap-2">
            <Icon className="size-5 text-primary" />
            <span className="text-lg font-bold">{title}</span>
          </CardTitle>
        </CardHeader>

        <CardContent className={cn('pt-4', className)}>{children}</CardContent>
      </Card>
    </StaggeredFade>
  );
};
