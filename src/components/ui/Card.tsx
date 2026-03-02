import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className }: CardProps) => {
  return (
    <div className={cn('bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden', className)}>
      {children}
    </div>
  );
};
