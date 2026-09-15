import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Zenza Shop Admin',
  description: 'Painel Administrativo Zenza Shop Angola — Gestão de Catálogo, Cadastro e Edição de Produtos',
  openGraph: {
    title: 'Zenza Shop Admin',
    description: 'Painel Administrativo Zenza Shop Angola — Gestão de Catálogo, Cadastro e Edição de Produtos',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen bg-[#f8f9fa] text-[#191c1d]">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
