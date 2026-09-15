'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { ProductsView } from '../../views/ProductsView';

function ProdutosContent() {
  const searchParams = useSearchParams();
  const isNovo = searchParams.get('novo') === 'true';

  return (
    <AdminLayout
      currentView="produtos"
      title="Gestão de Produtos & Catálogo"
      breadcrumbs={[
        { label: 'Admin', href: '/' },
        { label: 'Catálogo' },
        { label: 'Produtos' },
      ]}
    >
      <ProductsView initialCreate={isNovo} />
    </AdminLayout>
  );
}

export default function ProdutosPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[#191c1d]/50">A carregar catálogo de produtos...</div>}>
      <ProdutosContent />
    </Suspense>
  );
}
