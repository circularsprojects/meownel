'use client';

import React from 'react';
import { toast as sonnerToast } from 'sonner';

export function toast(toast: Omit<ToastProps, 'id'>) {
  return sonnerToast.custom((id) => (
    <Toast
      id={id}
      title={toast.title}
      description={toast.description}
    />
  ));
}

function Toast(props: ToastProps) {
  const { title, description } = props;

  return (
    <div className="flex rounded-lg bg-black border border-zinc-900 shadow-lg ring-1 ring-black/5 w-full sm:w-[364px] items-center p-4">
      <div className="flex flex-1 items-center">
        <div className="w-full">
          <p className="text-md font-bold text-white">{title}</p>
          <p className="mt-1 text-sm text-zinc-200">{description}</p>
        </div>
      </div>
    </div>
  );
}

interface ToastProps {
  id: string | number;
  title: string;
  description: string;
}
