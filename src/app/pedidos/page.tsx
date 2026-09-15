'use client';

import React from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { OrdersView } from '../../views/OrdersView';

export default function PedidosPage() {
  return (
    <AdminLayout
      currentView="pedidos"
      title="Gestão de Pedidos & Faturas"
      breadcrumbs={[
        { label: 'Admin', href: '/' },
        { label: 'Operações' },
        { label: 'Pedidos' },
      ]}
    >
      <OrdersView />
    </AdminLayout>
  );
}
