import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { DataTable, Column } from '../components/ui/Table';
import { Modal, ConfirmDialog } from '../components/ui/Modal';
import { FormField } from '../components/ui/FormField';
import { formatKz } from '../theme/tokens';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { 
  Truck, 
  Search, 
  MapPin, 
  Phone, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Navigation,
  Download,
  UserCheck,
  Building2
} from 'lucide-react';

interface DeliveryMission {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  municipality: string;
  address: string;
  driverName: string;
  driverPhone: string;
  vehicle: string;
  status: 'em_preparacao' | 'em_transito' | 'entregue' | 'falha_tentativa';
  dispatchTime: string;
  estimatedArrival: string;
}

const initialDeliveries: DeliveryMission[] = [
  {
    id: 'del-01',
    orderNumber: '#ORD-8492',
    customerName: 'Carlos Mateus',
    customerPhone: '+244 923 456 789',
    municipality: 'Luanda - Talatona',
    address: 'Condomínio Belas Business Park, Bloco 3, Apto 201',
    driverName: 'Kelson Van-Dúnem',
    driverPhone: '+244 919 888 111',
    vehicle: 'Moto Express (LD-44-88-GG)',
    status: 'em_transito',
    dispatchTime: 'Hoje, 09:40',
    estimatedArrival: 'Hoje, 10:45',
  },
  {
    id: 'del-02',
    orderNumber: '#ORD-8491',
    customerName: 'Ana Beatriz Afonso',
    customerPhone: '+244 912 884 120',
    municipality: 'Luanda - Kilamba',
    address: 'Quarteirão K, Edifício K12, Entrada 2',
    driverName: 'Mateus Bumba',
    driverPhone: '+244 933 222 444',
    vehicle: 'Furgão Zenza (LD-12-34-AZ)',
    status: 'em_transito',
    dispatchTime: 'Hoje, 09:15',
    estimatedArrival: 'Hoje, 11:30',
  },
  {
    id: 'del-03',
    orderNumber: '#ORD-8490',
    customerName: 'Domingos Gaspar',
    customerPhone: '+244 945 112 334',
    municipality: 'Província de Benguela',
    address: 'Avenida 10 de Fevereiro, Porta 45 (Terminal Carga)',
    driverName: 'Transportes Inter-Provinciais Macovi',
    driverPhone: '+244 923 777 999',
    vehicle: 'Camião Linha 04',
    status: 'em_preparacao',
    dispatchTime: 'Previsto: Hoje, 14:00',
    estimatedArrival: 'Amanhã, 16:00',
  },
  {
    id: 'del-04',
    orderNumber: '#ORD-8486',
    customerName: 'Manuel Dinis',
    customerPhone: '+244 917 554 321',
    municipality: 'Luanda - Maianga',
    address: 'Rua Amílcar Cabral, Nº 88',
    driverName: 'Kelson Van-Dúnem',
    driverPhone: '+244 919 888 111',
    vehicle: 'Moto Express (LD-44-88-GG)',
    status: 'entregue',
    dispatchTime: 'Hoje, 08:00',
    estimatedArrival: 'Entregue às 08:52',
  },
  {
    id: 'del-05',
    orderNumber: '#ORD-8482',
    customerName: 'Teresa Capemba',
    customerPhone: '+244 922 990 011',
    municipality: 'Luanda - Viana',
    address: 'Zango 3, Quadra 14, Casa 22',
    driverName: 'Sebastião Pedro',
    driverPhone: '+244 911 000 333',
    vehicle: 'Moto Express (LD-90-11-BC)',
    status: 'falha_tentativa',
    dispatchTime: 'Ontem, 16:00',
    estimatedArrival: 'Cliente incontactável',
  },
];

export const DeliveriesView: React.FC = () => {
  const { success, warning, info } = useToast();
  const { can } = useAuth();
  const [deliveries, setDeliveries] = useState<DeliveryMission[]>(initialDeliveries);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'em_transito' | 'entregue' | 'em_preparacao'>('all');
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryMission | null>(null);

  const canManage = can('manage_orders');

  const filteredDeliveries = deliveries.filter((d) => {
    const q = searchQuery.toLowerCase();
    const match =
      d.orderNumber.toLowerCase().includes(q) ||
      d.customerName.toLowerCase().includes(q) ||
      d.municipality.toLowerCase().includes(q) ||
      d.driverName.toLowerCase().includes(q);

    if (!match) return false;
    if (statusFilter !== 'all' && d.status !== statusFilter) return false;
    return true;
  });

  const handleMarkDelivered = (item: DeliveryMission) => {
    setDeliveries((prev) =>
      prev.map((d) =>
        d.id === item.id
          ? {
              ...d,
              status: 'entregue',
              estimatedArrival: `Entregue agora mesmo por ${d.driverName}`,
            }
          : d
      )
    );
    success(
      'Entrega Concluída',
      `O pedido ${item.orderNumber} foi marcado como entregue com sucesso em ${item.municipality}.`
    );
  };

  const columns: Column<DeliveryMission>[] = [
    {
      key: 'orderNumber',
      header: 'Pedido / Destino',
      priority: 'high',
      render: (item) => (
        <div className="flex flex-col">
          <span className="font-bold text-xs text-[#191c1d]">{item.orderNumber}</span>
          <span className="text-[11px] text-[#a63500] font-semibold flex items-center gap-1 mt-0.5">
            <MapPin className="w-3.5 h-3.5" />
            {item.municipality}
          </span>
        </div>
      ),
    },
    {
      key: 'customerName',
      header: 'Destinatário & Contacto',
      priority: 'high',
      render: (item) => (
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-[#191c1d]">{item.customerName}</span>
          <span className="text-[10px] text-[#191c1d]/50 flex items-center gap-1">
            <Phone className="w-3 h-3 text-[#191c1d]/40" />
            {item.customerPhone}
          </span>
        </div>
      ),
    },
    {
      key: 'driverName',
      header: 'Estafeta / Viatura',
      priority: 'medium',
      render: (item) => (
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-[#191c1d] flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-[#191c1d]/60" />
            {item.driverName}
          </span>
          <span className="text-[10px] text-[#191c1d]/50 font-mono">
            {item.vehicle}
          </span>
        </div>
      ),
    },
    {
      key: 'estimatedArrival',
      header: 'Janela de Entrega',
      priority: 'medium',
      render: (item) => (
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-[#191c1d] flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#191c1d]/40" />
            {item.estimatedArrival}
          </span>
          <span className="text-[10px] text-[#191c1d]/40">Saída: {item.dispatchTime}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Estado Logístico',
      align: 'center',
      priority: 'high',
      render: (item) => {
        if (item.status === 'em_transito') {
          return <Badge variant="brand" size="sm" withDot>Em Trânsito</Badge>;
        }
        if (item.status === 'entregue') {
          return <Badge variant="emerald" size="sm" withDot>Entregue</Badge>;
        }
        if (item.status === 'em_preparacao') {
          return <Badge variant="neutral" size="sm">Em Preparação</Badge>;
        }
        return <Badge variant="red" size="sm">Tentativa Falhada</Badge>;
      },
    },
    {
      key: 'actions',
      header: 'Ações',
      align: 'right',
      priority: 'high',
      render: (item) => (
        <div className="flex items-center justify-end gap-1.5">
          {item.status === 'em_transito' && (
            <Button
              variant="secondary"
              size="sm"
              disabled={!canManage}
              onClick={() => handleMarkDelivered(item)}
              leftIcon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
            >
              Confirmar Entrega
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedDelivery(item)}
          >
            Detalhes
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="brand" size="sm">
              Luanda Express & Frota Própria
            </Badge>
            <Badge variant="emerald" size="sm" withDot>
              {deliveries.filter((d) => d.status === 'em_transito').length} Em Rota Ativa
            </Badge>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#191c1d] tracking-tight">
            Gestão de Entregas & Rastreio de Estafetas
          </h1>
          <p className="text-xs text-[#191c1d]/60 mt-0.5">
            Coordenação logística de expedições para Luanda metropolitana e despachos inter-provinciais.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={() => info('Folha de Rota', 'A gerar guia de remessa para a equipa de estafetas...')}
          >
            Descarregar Guias de Remessa
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-xl border border-[rgba(25,28,29,0.10)] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Pesquisar por pedido, estafeta ou município..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftElement={<Search className="w-4 h-4 text-[#191c1d]/40" />}
            inputSize="sm"
          />
        </div>

        <div className="flex items-center gap-2">
          {(['all', 'em_transito', 'entregue', 'em_preparacao'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                statusFilter === s
                  ? 'bg-[#a63500] text-white shadow-xs'
                  : 'bg-[#f8f9fa] text-[#191c1d]/70 hover:bg-gray-200'
              }`}
            >
              {s === 'all'
                ? 'Todas as Rotas'
                : s === 'em_transito'
                ? 'Em Trânsito'
                : s === 'entregue'
                ? 'Entregues'
                : 'Em Preparação'}
            </button>
          ))}
        </div>
      </div>

      {/* Deliveries Table */}
      <DataTable
        columns={columns}
        data={filteredDeliveries}
        keyExtractor={(item) => item.id}
        totalItems={filteredDeliveries.length}
      />

      {/* Delivery Detail Modal */}
      {selectedDelivery && (
        <Modal
          isOpen={Boolean(selectedDelivery)}
          onClose={() => setSelectedDelivery(null)}
          title={`Guia de Entrega: ${selectedDelivery.orderNumber}`}
          description={`Destino: ${selectedDelivery.municipality}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 bg-[#f8f9fa] rounded-xl border border-[rgba(25,28,29,0.08)] space-y-2">
              <div className="flex justify-between">
                <span className="text-[#191c1d]/60 font-medium">Destinatário:</span>
                <span className="font-bold text-[#191c1d]">{selectedDelivery.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#191c1d]/60 font-medium">Telefone Destinatário:</span>
                <span className="font-bold text-[#191c1d]">{selectedDelivery.customerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#191c1d]/60 font-medium">Estafeta Responsável:</span>
                <span className="font-bold text-[#a63500]">
                  {selectedDelivery.driverName} ({selectedDelivery.driverPhone})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#191c1d]/60 font-medium">Viatura:</span>
                <span className="font-mono text-[#191c1d]">{selectedDelivery.vehicle}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-[#191c1d]/50 block mb-1">
                Endereço Completo de Entrega
              </span>
              <p className="p-3 bg-white border border-[rgba(25,28,29,0.10)] rounded-xl text-[#191c1d]">
                {selectedDelivery.address}
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[rgba(25,28,29,0.08)]">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDelivery(null)}
              >
                Fechar
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
