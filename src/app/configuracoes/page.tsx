'use client';

import React from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { SettingsAuditView } from '../../views/SettingsAuditView';

export default function ConfiguracoesPage() {
  return (
    <AdminLayout
      currentView="configuracoes"
      title="Configurações da Loja & Auditoria"
      breadcrumbs={[
        { label: 'Admin', href: '/' },
        { label: 'Administração' },
        { label: 'Configurações' },
      ]}
    >
      <SettingsAuditView />
    </AdminLayout>
  );
}
