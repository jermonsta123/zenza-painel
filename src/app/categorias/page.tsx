'use client';

import React from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { CategoriesView } from '../../views/CategoriesView';

export default function CategoriasPage() {
  return (
    <AdminLayout
      currentView="categorias"
      title="Categorias & Taxonomia"
      breadcrumbs={[
        { label: 'Admin', href: '/' },
        { label: 'Catálogo' },
        { label: 'Categorias' },
      ]}
    >
      <CategoriesView />
    </AdminLayout>
  );
}
