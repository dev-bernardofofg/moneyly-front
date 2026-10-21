import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import React from 'react';

interface BaseCardProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
  contentClassName?: string;
  footer?: React.ReactNode;
}

export const BaseCard = ({
  children,
  title,
  description,
  className,
  contentClassName,
  footer,
}: BaseCardProps) => {
  return (
    <Card className={cn('grid grid-rows-[auto_1fr_auto] overflow-hidden', className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>

      <CardContent className={cn('overflow-y-auto', contentClassName)}>{children}</CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
};
