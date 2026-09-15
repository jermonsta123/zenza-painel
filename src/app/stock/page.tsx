'use client';

import React from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { StockInventoryView } from '../../views/StockInventoryView';

export default function StockPage() {
  return (
    <AdminLayout
      currentView="stock"
      title="Stock & Inventário"
      breadcrumbs={[
        { label: 'Admin', href: '/' },
        { label: 'Catálogo' },
        { label: 'Stock & Inventário' },
      ]}
    >
      <StockInventoryView />
    </AdminLayout>
  );
}
