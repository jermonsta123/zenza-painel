'use client';

import React from 'react';
import { ToastProvider } from '../context/ToastContext';
import { AuthProvider } from '../context/AuthContext';
import { CategoriesProvider } from '../context/CategoriesContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CategoriesProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </CategoriesProvider>
    </AuthProvider>
  );
}
