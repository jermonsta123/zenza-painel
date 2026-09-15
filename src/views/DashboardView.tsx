import React, { useState } from 'react';
import { MetricCard } from '../components/ui/MetricCard';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { DataTable, Column } from '../components/ui/Table';
import { formatKz } from '../theme/tokens';
import { OrderItem } from '../types';
import { useToast } from '../context/ToastContext';
import { 
  ShoppingBag, 
  CreditCard, 
  Truck, 
  Boxes, 
  Plus, 
  ArrowRight, 
  ExternalLink, 
  Eye, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  MapPin,
  TrendingUp,
  Sparkles
} from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (viewId: string) => void;
}

const sampleRecentOrders: OrderItem[] = [
  {
    id: '1',
    orderNumber: '#ORD-8492',
    customerName: 'Carlos Mateus',
    customerPhone: '+244 923 456 789',
    customerCity: 'Luanda (Talatona)',
    totalKz: 48500,
    itemsCount: 3,
    status: 'pendente',
    paymentMethod: 'multicaixa_express',
    date: 'Hoje, 10:24',
  },
  {
    id: '2',
    orderNumber: '#ORD-8491',
    customerName: 'Ana Beatriz Afonso',
    customerPhone: '+244 912 884 120',
    customerCity: 'Luanda (Kilamba)',
    totalKz: 125000,
    itemsCount: 5,
    status: 'pago',
    paymentMethod: 'bai_directo',
    date: 'Hoje, 09:45',
  },
  {
    id: '3',
    orderNumber: '#ORD-8490',
    customerName: 'Domingos Gaspar',
    customerPhone: '+244 945 112 334',
    customerCity: 'Benguela (Zona Comercial)',
    totalKz: 32000,
    itemsCount: 2,
    status: 'a_caminho',
    paymentMethod: 'transferencia',
    date: 'Hoje, 08:30',
  },
  {
    id: '4',
    orderNumber: '#ORD-8489',
    customerName: 'Maria Helena Silva',
    customerPhone: '+244 931 776 543',
    customerCity: 'Luanda (Maianga)',
    totalKz: 89900,
    itemsCount: 4,
    status: 'entregue',
    paymentMethod: 'multicaixa_express',
    date: 'Ontem, 17:15',
  },
  {
    id: '5',
    orderNumber: '#ORD-8488',
    customerName: 'João Kuanza',
    customerPhone: '+244 928 333 111',
    customerCity: 'Huambo (Centro)',
    totalKz: 15400,
    itemsCount: 1,
    status: 'cancelado',
    paymentMethod: 'pagamento_entrega',
    date: 'Ontem, 15:40',
  },
];

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { info } = useToast();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const getStatusBadge = (status: OrderItem['status']) => {
    switch (status) {
      case 'pago':
        return <Badge variant="emerald" withDot>Pago</Badge>;
      case 'entregue':
        return <Badge variant="emerald">Entregue</Badge>;
      case 'pendente':
        return <Badge variant="amber" withDot>Pendente</Badge>;
      case 'em_preparacao':
        return <Badge variant="amber">Em Preparação</Badge>;
      case 'a_caminho':
        return <Badge variant="blue" withDot>A Caminho</Badge>;
      case 'cancelado':
        return <Badge variant="red" withDot>Cancelado</Badge>;
    }
  };

  const getPaymentMethodLabel = (method: OrderItem['paymentMethod']) => {
    switch (method) {
      case 'multicaixa_express':
        return 'Multicaixa Express';
      case 'bai_directo':
        return 'BAI Directo';
      case 'transferencia':
        return 'Transferência Bancária';
      case 'pagamento_entrega':
        return 'Pagamento na Entrega';
    }
  };

  const columns: Column<OrderItem>[] = [
    {
      key: 'orderNumber',
      header: 'Nº Pedido',
      sortable: true,
      priority: 'high',
      render: (item) => (
        <span className="font-bold text-[#a63500] hover:underline cursor-pointer">
          {item.orderNumber}
        </span>
      ),
    },
    {
      key: 'customerName',
      header: 'Cliente & Localização',
      priority: 'high',
      render: (item) => (
        <div className="flex flex-col">
          <span className="font-semibold text-[#191c1d]">{item.customerName}</span>
          <span className="text-[11px] text-[#191c1d]/60 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[#a63500]" />
            {item.customerCity}
          </span>
        </div>
      ),
    },
    {
      key: 'totalKz',
      header: 'Valor Total',
      sortable: true,
      priority: 'high',
      render: (item) => (
        <div className="flex flex-col">
          <span className="font-bold text-[#191c1d]">{formatKz(item.totalKz)}</span>
          <span className="text-[11px] text-[#191c1d]/50">{item.itemsCount} itens</span>
        </div>
      ),
    },
    {
      key: 'paymentMethod',
      header: 'Pagamento',
      priority: 'medium',
      render: (item) => (
        <span className="text-xs text-[#191c1d]/80 font-medium">
          {getPaymentMethodLabel(item.paymentMethod)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Estado',
      sortable: true,
      priority: 'high',
      render: (item) => getStatusBadge(item.status),
    },
    {
      key: 'date',
      header: 'Data',
      priority: 'low',
      render: (item) => <span className="text-xs text-[#191c1d]/60">{item.date}</span>,
    },
    {
      key: 'actions',
      header: 'Ações',
      align: 'right',
      priority: 'high',
      render: (item) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => info(`Pedido ${item.orderNumber}`, `Cliente: ${item.customerName} - ${formatKz(item.totalKz)}`)}
        >
          <Eye className="w-4 h-4 text-[#191c1d]/60" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner with Quick Actions */}
      <div className="bg-gradient-to-r from-white via-white to-[#fff8f5] rounded-2xl border border-[rgba(25,28,29,0.10)] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#a63500]">
              Zenza Shop Angola • Painel de Controlo
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#191c1d] tracking-tight">
            Bom dia, Operador Central Luanda
          </h2>
          <p className="text-xs text-[#191c1d]/70">
            Tens 12 pedidos a aguardar confirmação e 4 produtos com stock crítico.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('design-system')}
            leftIcon={<Sparkles className="w-4 h-4 text-[#a63500]" />}
          >
            Ver Design System
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onNavigate('pedidos')}
            leftIcon={<ShoppingBag className="w-4 h-4" />}
          >
            Ver Todos os Pedidos
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Faturação de Hoje"
          value={formatKz(1485200, false)}
          iconName="CreditCard"
          variant="brand"
          change={{ value: '+22.5%', trend: 'up', label: 'vs. mesmo dia na semana passada' }}
        />
        <MetricCard
          title="Novos Pedidos Hoje"
          value="34"
          unit="pedidos"
          iconName="ShoppingBag"
          variant="emerald"
          change={{ value: '+8', trend: 'up', label: 'via Multicaixa Express' }}
        />
        <MetricCard
          title="Entregas em Rota Luanda"
          value="18"
          unit="em trânsito"
          iconName="Truck"
          variant="blue"
          change={{ value: '100%', trend: 'up', label: 'dentro da janela de entrega' }}
        />
        <MetricCard
          title="Stock em Alerta"
          value="4"
          unit="itens"
          iconName="Boxes"
          variant="amber"
          change={{ value: '2 esgotados', trend: 'down', label: 'requerem compra urgente' }}
        />
      </div>

      {/* Operational Highlights Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#191c1d]">
                Últimos Pedidos Recebidos
              </h3>
              <p className="text-xs text-[#191c1d]/60">
                Acompanhamento em tempo real das encomendas dos clientes.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('pedidos')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Ver Tabela Completa
            </Button>
          </div>

          <DataTable
            columns={columns}
            data={sampleRecentOrders}
            keyExtractor={(item) => item.id}
            selectable
            selectedIds={selectedIds}
            onSelectChange={setSelectedIds}
            pageSize={5}
            totalItems={sampleRecentOrders.length}
            currentPage={1}
            totalPages={1}
            renderMobileCard={(item, isSelected, onToggle) => (
              <div className={`p-4 rounded-xl border transition-colors ${
                isSelected ? 'bg-[#fff3ef] border-[#ffb59c]' : 'bg-white border-[rgba(25,28,29,0.1)]'
              }`}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={onToggle}
                      className="w-4 h-4 rounded text-[#a63500]"
                    />
                    <span className="font-bold text-[#a63500] text-sm">{item.orderNumber}</span>
                  </div>
                  {getStatusBadge(item.status)}
                </div>

                <p className="text-xs font-semibold text-[#191c1d]">{item.customerName}</p>
                <p className="text-xs text-[#191c1d]/60 mb-2">{item.customerCity}</p>

                <div className="flex items-center justify-between pt-2 border-t border-[rgba(25,28,29,0.06)] text-xs">
                  <span className="font-bold text-[#191c1d]">{formatKz(item.totalKz)}</span>
                  <span className="text-[#191c1d]/60">{item.date}</span>
                </div>
              </div>
            )}
          />
        </div>

        {/* Quick Operations & Store Status (1 col) */}
        <div className="space-y-6">
          {/* Quick Operations Card */}
          <Card>
            <CardHeader>
              <CardTitle>Operações Rápidas</CardTitle>
              <CardDescription>Atalhos para tarefas diárias do armazém</CardDescription>
            </CardHeader>

            <div className="space-y-2.5">
              <Button
                variant="secondary"
                size="sm"
                fullWidth
                leftIcon={<Plus className="w-4 h-4 text-[#a63500]" />}
                onClick={() => onNavigate('produtos')}
                className="justify-start text-xs font-semibold"
              >
                Gerir Catálogo de Produtos
              </Button>
              <Button
                variant="secondary"
                size="sm"
                fullWidth
                leftIcon={<CreditCard className="w-4 h-4 text-emerald-600" />}
                onClick={() => onNavigate('pedidos')}
                className="justify-start text-xs font-semibold"
              >
                Validar Comprovativos de Transferência
              </Button>
              <Button
                variant="secondary"
                size="sm"
                fullWidth
                leftIcon={<Truck className="w-4 h-4 text-blue-600" />}
                onClick={() => onNavigate('pedidos')}
                className="justify-start text-xs font-semibold"
              >
                Atribuir Rotas de Entrega Luanda
              </Button>
            </div>
          </Card>

          {/* Delivery Coverage Info */}
          <Card>
            <CardHeader>
              <CardTitle>Cobertura e Métodos de Pagamento</CardTitle>
            </CardHeader>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-[rgba(25,28,29,0.06)]">
                <span className="font-medium text-[#191c1d]">Multicaixa Express (EMIS)</span>
                <Badge variant="emerald" size="sm" withDot>Operacional</Badge>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-[rgba(25,28,29,0.06)]">
                <span className="font-medium text-[#191c1d]">BAI Directo API</span>
                <Badge variant="emerald" size="sm" withDot>Operacional</Badge>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-[rgba(25,28,29,0.06)]">
                <span className="font-medium text-[#191c1d]">Luanda Express Estafetas</span>
                <Badge variant="blue" size="sm">8 estafetas ativos</Badge>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="font-medium text-[#191c1d]">Envios Províncias (DHL/Cargomix)</span>
                <Badge variant="neutral" size="sm">Em dias úteis</Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
