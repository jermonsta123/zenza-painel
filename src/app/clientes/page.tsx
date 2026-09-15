'use client';

import React from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { CustomersView } from '../../views/CustomersView';

export default function ClientesPage() {
  return (
    <AdminLayout
      currentView="clientes"
      title="Clientes Zenza Shop"
      breadcrumbs={[
        { label: 'Admin', href: '/' },
        { label: 'Clientes' },
        { label: 'Lista de Clientes' },
      ]}
    >
      <CustomersView />
    </AdminLayout>
  );
}
