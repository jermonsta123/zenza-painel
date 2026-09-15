'use client';

import React from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { GenericSectionView } from '../../views/GenericSectionView';

export default function AfiliadosPage() {
  return (
    <AdminLayout
      currentView="afiliados"
      title="Afiliados & Parcerias"
      breadcrumbs={[
        { label: 'Admin', href: '/' },
        { label: 'Marketing' },
        { label: 'Afiliados & Parcerias' },
      ]}
    >
      <GenericSectionView
        viewId="afiliados"
        title="Afiliados & Parcerias"
        description="Gestão da rede de criadores de conteúdo, influenciadores e parceiros comerciais Zenza Shop."
        groupLabel="Marketing"
      />
    </AdminLayout>
  );
}
