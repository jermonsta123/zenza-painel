'use client';

import React from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { AdminUsersView } from '../../views/AdminUsersView';

export default function PermissoesPage() {
  return (
    <AdminLayout
      currentView="permissoes"
      title="Permissões & Papéis (RBAC)"
      breadcrumbs={[
        { label: 'Admin', href: '/' },
        { label: 'Administração' },
        { label: 'Permissões (RBAC)' },
      ]}
    >
      <AdminUsersView />
    </AdminLayout>
  );
}
