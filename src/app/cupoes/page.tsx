'use client';

import React from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { CouponsView } from '../../views/CouponsView';

export default function CupoesPage() {
  return (
    <AdminLayout
      currentView="cupoes"
      title="Cupões de Desconto & Campanhas"
      breadcrumbs={[
        { label: 'Admin', href: '/' },
        { label: 'Marketing' },
        { label: 'Cupões de Desconto' },
      ]}
    >
      <CouponsView />
    </AdminLayout>
  );
}
