'use client';

import React from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { DeliveriesView } from '../../views/DeliveriesView';

export default function EntregasPage() {
  return (
    <AdminLayout
      currentView="entregas"
      title="Entregas & Luanda Express"
      breadcrumbs={[
        { label: 'Admin', href: '/' },
        { label: 'Operações' },
        { label: 'Entregas' },
      ]}
    >
      <DeliveriesView />
    </AdminLayout>
  );
}
