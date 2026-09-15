'use client';

import React, { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AdminLayout } from '../components/layout/AdminLayout';
import { DashboardView } from '../views/DashboardView';
import { VIEW_TO_PATH } from '../lib/navigation';

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const legacyView = searchParams.get('view');

  // If a legacy query parameter like ?view=produtos is present, redirect to the real route
  useEffect(() => {
    if (legacyView && legacyView !== 'dashboard') {
      const targetPath = VIEW_TO_PATH[legacyView] || `/${legacyView}`;
      router.replace(targetPath);
    }
  }, [legacyView, router]);

  return (
    <AdminLayout
      currentView="dashboard"
      title="Dashboard & Visão Geral"
      breadcrumbs={[{ label: 'Admin', href: '/' }, { label: 'Visão Geral' }]}
    >
      <DashboardView
        onNavigate={(viewId) => {
          const path = VIEW_TO_PATH[viewId] || `/${viewId}`;
          router.push(path);
        }}
      />
    </AdminLayout>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[#191c1d]/50">A carregar dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
