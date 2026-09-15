'use client';

import React from 'react';
import { AdminLayout } from '../../../components/layout/AdminLayout';
import { ProductsView } from '../../../views/ProductsView';

export default function NovoProdutoPage() {
  return (
    <AdminLayout
      currentView="produtos"
      title="Cadastrar Novo Produto"
      breadcrumbs={[
        { label: 'Admin', href: '/' },
        { label: 'Produtos', href: '/produtos' },
        { label: 'Novo Cadastro' },
      ]}
    >
      <ProductsView initialCreate={true} />
    </AdminLayout>
  );
}
