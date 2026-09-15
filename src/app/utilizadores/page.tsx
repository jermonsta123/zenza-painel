'use client';

import React from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { AdminUsersView } from '../../views/AdminUsersView';

export default function UtilizadoresPage() {
  return (
    <AdminLayout
      currentView="utilizadores"
      title="Utilizadores & Operadores"
      breadcrumbs={[
        { label: 'Admin', href: '/' },
        { label: 'Administração' },
        { label: 'Utilizadores & Operadores' },
      ]}
    >
      <AdminUsersView />
    </AdminLayout>
  );
}
