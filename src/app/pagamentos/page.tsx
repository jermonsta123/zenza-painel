'use client';

import React from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { PaymentsView } from '../../views/PaymentsView';

export default function PagamentosPage() {
  return (
    <AdminLayout
      currentView="pagamentos"
      title="Pagamentos & Reconciliação (MCX / BAI)"
      breadcrumbs={[
        { label: 'Admin', href: '/' },
        { label: 'Operações' },
        { label: 'Pagamentos' },
      ]}
    >
      <PaymentsView />
    </AdminLayout>
  );
}
