import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import React from 'react';

interface BaseCardProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
  footer?: React.ReactNode;
}

export const BaseCard = ({ children, title, description, className, footer }: BaseCardProps) => {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>
          {title}
        </CardTitle>
        {description && (
          <CardDescription>
            {description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent >
        {children}
      </CardContent>
      {footer && (
        <CardFooter>
          {footer}
        </CardFooter>
      )}
    </Card >
  )
}
