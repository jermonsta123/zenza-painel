'use client';

import React from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { ReviewsModerationView } from '../../views/ReviewsModerationView';

export default function AvaliacoesPage() {
  return (
    <AdminLayout
      currentView="avaliacoes"
      title="Avaliações & Moderação"
      breadcrumbs={[
        { label: 'Admin', href: '/' },
        { label: 'Conteúdo' },
        { label: 'Avaliações de Clientes' },
      ]}
    >
      <ReviewsModerationView />
    </AdminLayout>
  );
}
