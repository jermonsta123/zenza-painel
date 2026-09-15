'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { AdminLayout } from '../components/layout/AdminLayout';
import { DashboardView } from '../views/DashboardView';
import { DesignSystemShowcaseView } from '../views/DesignSystemShowcaseView';
import { OrdersView } from '../views/OrdersView';
import { ProductsView } from '../views/ProductsView';
import { CategoriesView } from '../views/CategoriesView';
import { StockInventoryView } from '../views/StockInventoryView';
import { PaymentsView } from '../views/PaymentsView';
import { DeliveriesView } from '../views/DeliveriesView';
import { CustomersView } from '../views/CustomersView';
import { CouponsView } from '../views/CouponsView';
import { ReviewsModerationView } from '../views/ReviewsModerationView';
import { AdminUsersView } from '../views/AdminUsersView';
import { SettingsAuditView } from '../views/SettingsAuditView';
import { GenericSectionView } from '../views/GenericSectionView';
import { StateView } from '../components/ui/StateView';
import { NAVIGATION_GROUPS } from '../theme/tokens';

function AdminContent() {
  const searchParams = useSearchParams();
  const initialView = searchParams.get('view') || 'dashboard';
  const [currentView, setCurrentView] = useState<string>(initialView);
  const { success, info } = useToast();

  // Determine current page title, group label, and dynamic breadcrumb
  const currentNavInfo = React.useMemo(() => {
    for (const group of NAVIGATION_GROUPS) {
      const item = group.items.find((i) => i.id === currentView);
      if (item) {
        return {
          title: item.label,
          groupLabel: group.label,
          breadcrumbs: [
            { label: 'Admin', onClick: () => setCurrentView('dashboard') },
            { label: group.label },
            { label: item.label },
          ],
        };
      }
    }
    return {
      title: 'Painel Admin',
      groupLabel: 'Principal',
      breadcrumbs: [{ label: 'Admin' }, { label: 'Visão Geral' }],
    };
  }, [currentView]);

  const renderViewContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView onNavigate={(viewId) => setCurrentView(viewId)} />;
      case 'design-system':
        return <DesignSystemShowcaseView />;
      case 'produtos':
        return <ProductsView />;
      case 'categorias':
        return <CategoriesView />;
      case 'stock':
        return <StockInventoryView />;
      case 'pedidos':
        return <OrdersView />;
      case 'pagamentos':
        return <PaymentsView />;
      case 'entregas':
        return <DeliveriesView />;
      case 'clientes':
        return <CustomersView />;
      case 'cupoes':
        return <CouponsView />;
      case 'avaliacoes':
        return <ReviewsModerationView />;
      case 'utilizadores':
      case 'permissoes':
        return <AdminUsersView />;
      case 'configuracoes':
        return <SettingsAuditView />;
      case 'erros-demo':
        return (
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
                onRetry={() => success('Permissão Verificada', 'Sessão revalidada.')}
                onNavigateHome={() => setCurrentView('dashboard')}
              />
            </div>
          </div>
        );
      default:
        return (
          <GenericSectionView
            viewId={currentView}
            title={currentNavInfo.title}
            description={`Gestão operacional de ${currentNavInfo.title.toLowerCase()} para o comércio eletrónico Zenza Shop.`}
            groupLabel={currentNavInfo.groupLabel}
          />
        );
    }
  };

  return (
    <AdminLayout
      currentView={currentView}
      onSelectView={setCurrentView}
      title={currentNavInfo.title}
      breadcrumbs={currentNavInfo.breadcrumbs}
      onQuickAction={() => {
        setCurrentView('produtos');
        info('Cadastro Rápido', 'Redirecionado para a gestão de produtos.');
      }}
    >
      {renderViewContent()}
    </AdminLayout>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[#191c1d]/50">A carregar painel administrativo...</div>}>
      <AdminContent />
    </Suspense>
  );
}
