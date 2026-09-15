'use client';

import React from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { DesignSystemShowcaseView } from '../../views/DesignSystemShowcaseView';

export default function DesignSystemPage() {
  return (
    <AdminLayout
      currentView="design-system"
      title="Design System & UI Guide"
      breadcrumbs={[
        { label: 'Admin', href: '/' },
        { label: 'Principal' },
        { label: 'Design System & UI' },
      ]}
    >
      <DesignSystemShowcaseView />
    </AdminLayout>
  );
}
