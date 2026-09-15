'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { StateView } from '../../components/ui/StateView';
import { useToast } from '../../context/ToastContext';

export default function ErrosDemoPage() {
  const router = useRouter();
  const { success } = useToast();

  return (
    <AdminLayout
      currentView="erros-demo"
      title="Estados de Erro & HTTP"
      breadcrumbs={[
        { label: 'Admin', href: '/' },
        { label: 'Administração' },
        { label: 'Estados de Erro & HTTP' },
      ]}
    >
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-[rgba(25,28,29,0.10)]">
          <h2 className="text-lg font-bold text-[#191c1d] mb-1">
            Demonstração de Estados de Permissão e Erros HTTP
          </h2>
          <p className="text-xs text-[#191c1d]/60 mb-6">
            Exemplo de ecrã para permissão negada (HTTP 403) ou sessão expirada (HTTP 401).
          </p>
          <StateView
            code="403"
            onRetry={() => success('Permissão Verificada', 'Sessão revalidada com sucesso.')}
            onNavigateHome={() => router.push('/')}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
