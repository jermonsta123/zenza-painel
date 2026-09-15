import React, { useState, useMemo } from 'react';
import { DataTable, Column } from '../components/ui/Table';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Tabs } from '../components/ui/NavigationControls';
import { Modal, ConfirmDialog } from '../components/ui/Modal';
import { OrderItem } from '../types';
import { formatKz } from '../theme/tokens';
import { useToast } from '../context/ToastContext';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Trash2, 
  CheckCircle2, 
  Truck, 
  MapPin, 
  Phone, 
  Calendar, 
  CreditCard,
  Printer,
  XCircle,
  Clock
} from 'lucide-react';

const initialOrders: OrderItem[] = [
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
    date: '15 Set 2026, 10:24',
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
    date: '15 Set 2026, 09:45',
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
    date: '15 Set 2026, 08:30',
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
    date: '14 Set 2026, 17:15',
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
    date: '14 Set 2026, 15:40',
  },
  {
    id: '6',
    orderNumber: '#ORD-8487',
    customerName: 'Teresa Capemba',
    customerPhone: '+244 922 990 011',
    customerCity: 'Luanda (Viana - Zango)',
    totalKz: 64200,
    itemsCount: 2,
    status: 'em_preparacao',
    paymentMethod: 'multicaixa_express',
    date: '14 Set 2026, 14:10',
  },
  {
    id: '7',
    orderNumber: '#ORD-8486',
    customerName: 'Manuel Dinis',
    customerPhone: '+244 917 554 321',
    customerCity: 'Huíla (Lubango)',
    totalKz: 210000,
    itemsCount: 6,
    status: 'pago',
    paymentMethod: 'bai_directo',
    date: '14 Set 2026, 11:05',
  },
];

export const OrdersView: React.FC = () => {
  const { success, error, info } = useToast();
  const [orders, setOrders] = useState<OrderItem[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>('todos');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('todos');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortColumn, setSortColumn] = useState('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Selected Order for Detail View
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);

  // Filtered and sorted data
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Tab filter
      if (activeTab !== 'todos' && order.status !== activeTab) {
        return false;
      }
      // Payment filter
      if (selectedPaymentMethod !== 'todos' && order.paymentMethod !== selectedPaymentMethod) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesNumber = order.orderNumber.toLowerCase().includes(q);
        const matchesName = order.customerName.toLowerCase().includes(q);
        const matchesCity = order.customerCity.toLowerCase().includes(q);
        const matchesPhone = order.customerPhone.includes(q);
        if (!matchesNumber && !matchesName && !matchesCity && !matchesPhone) {
          return false;
        }
      }
      return true;
    });
  }, [orders, activeTab, selectedPaymentMethod, searchQuery]);

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

  const getPaymentLabel = (method: OrderItem['paymentMethod']) => {
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

  const handleBulkStatusChange = (newStatus: OrderItem['status']) => {
    if (selectedIds.length === 0) return;
    setOrders((prev) =>
      prev.map((o) => (selectedIds.includes(o.id) ? { ...o, status: newStatus } : o))
    );
    success(
      'Estado Atualizado',
      `${selectedIds.length} pedidos foram marcados como ${newStatus.toUpperCase()}.`
    );
    setSelectedIds([]);
  };

  const columns: Column<OrderItem>[] = [
    {
      key: 'orderNumber',
      header: 'Nº Pedido',
      sortable: true,
      priority: 'high',
      render: (item) => (
        <button
          onClick={() => setSelectedOrder(item)}
          className="font-bold text-[#a63500] hover:text-[#d04400] hover:underline text-left focus:outline-none"
        >
          {item.orderNumber}
        </button>
      ),
    },
    {
      key: 'customerName',
      header: 'Cliente / Contacto',
      sortable: true,
      priority: 'high',
      render: (item) => (
        <div className="flex flex-col">
          <span className="font-semibold text-[#191c1d]">{item.customerName}</span>
          <span className="text-[11px] text-[#191c1d]/60 flex items-center gap-1">
            <Phone className="w-3 h-3 text-[#191c1d]/40" />
            {item.customerPhone}
          </span>
        </div>
      ),
    },
    {
      key: 'customerCity',
      header: 'Destino / Província',
      priority: 'medium',
      render: (item) => (
        <span className="text-xs text-[#191c1d]/80 flex items-center gap-1">
          <MapPin className="w-3 h-3 text-[#a63500]" />
          {item.customerCity}
        </span>
      ),
    },
    {
      key: 'totalKz',
      header: 'Total (Kz)',
      sortable: true,
      align: 'right',
      priority: 'high',
      render: (item) => (
        <div className="flex flex-col text-right">
          <span className="font-bold text-[#191c1d]">{formatKz(item.totalKz)}</span>
          <span className="text-[10px] text-[#191c1d]/50">{item.itemsCount} itens</span>
        </div>
      ),
    },
    {
      key: 'paymentMethod',
      header: 'Método Pagamento',
      priority: 'medium',
      render: (item) => (
        <span className="text-xs text-[#191c1d]/75 font-medium">
          {getPaymentLabel(item.paymentMethod)}
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
      header: 'Data / Hora',
      sortable: true,
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
          variant="outline"
          size="sm"
          onClick={() => setSelectedOrder(item)}
          leftIcon={<Eye className="w-3.5 h-3.5" />}
        >
          Detalhes
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Title & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#191c1d] tracking-tight">
            Gestão de Pedidos & Faturas
          </h1>
          <p className="text-xs text-[#191c1d]/60 mt-0.5">
            Acompanha pedidos recebidos pela loja Zenza Shop, pagamentos Multicaixa Express e entregas em Angola.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={() => info('Exportar Relatório', 'A gerar folha de cálculo CSV dos pedidos selecionados...')}
          >
            Exportar CSV
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => success('Novo Pedido Manual', 'A abrir assistente de registo de pedido.')}
          >
            + Criar Pedido
          </Button>
        </div>
      </div>

      {/* Tabs Filter Bar */}
      <Card padding="none" className="p-2 sm:p-3">
        <Tabs
          tabs={[
            { id: 'todos', label: 'Todos', count: orders.length },
            { id: 'pendente', label: 'Pendentes', count: orders.filter((o) => o.status === 'pendente').length },
            { id: 'pago', label: 'Pagos', count: orders.filter((o) => o.status === 'pago').length },
            { id: 'em_preparacao', label: 'Em Preparação', count: orders.filter((o) => o.status === 'em_preparacao').length },
            { id: 'a_caminho', label: 'A Caminho', count: orders.filter((o) => o.status === 'a_caminho').length },
            { id: 'entregue', label: 'Entregues', count: orders.filter((o) => o.status === 'entregue').length },
            { id: 'cancelado', label: 'Cancelados', count: orders.filter((o) => o.status === 'cancelado').length },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
          variant="underline"
        />
      </Card>

      {/* Search & Advanced Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-xl border border-[rgba(25,28,29,0.10)] shadow-xs">
        <div className="w-full md:w-80">
          <Input
            placeholder="Pesquisar por nº de pedido, nome, telefone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftElement={<Search className="w-4 h-4 text-[#191c1d]/40" />}
            inputSize="sm"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <div className="w-48">
            <Select
              selectSize="sm"
              value={selectedPaymentMethod}
              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              options={[
                { value: 'todos', label: 'Todos os Pagamentos' },
                { value: 'multicaixa_express', label: 'Multicaixa Express' },
                { value: 'bai_directo', label: 'BAI Directo' },
                { value: 'transferencia', label: 'Transferência' },
                { value: 'pagamento_entrega', label: 'Pagamento na Entrega' },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Bulk Action Bar (When rows selected) */}
      {selectedIds.length > 0 && (
        <div className="bg-[#fff3ef] border border-[#ffb59c] p-3 rounded-xl flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#a63500]">
              {selectedIds.length} pedidos selecionados
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleBulkStatusChange('pago')}
              leftIcon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
            >
              Marcar como Pagos
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleBulkStatusChange('a_caminho')}
              leftIcon={<Truck className="w-3.5 h-3.5 text-blue-600" />}
            >
              Enviar para Rota
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleBulkStatusChange('cancelado')}
              leftIcon={<XCircle className="w-3.5 h-3.5" />}
            >
              Cancelar Selecionados
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedIds([])}
            >
              Desmarcar
            </Button>
          </div>
        </div>
      )}

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        selectable
        selectedIds={selectedIds}
        onSelectChange={setSelectedIds}
        currentPage={currentPage}
        totalPages={Math.ceil(filteredOrders.length / pageSize)}
        totalItems={filteredOrders.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        renderMobileCard={(item, isSelected, onToggle) => (
          <div
            className={`p-4 rounded-xl border transition-colors ${
              isSelected ? 'bg-[#fff3ef] border-[#ffb59c]' : 'bg-white border-[rgba(25,28,29,0.1)]'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={onToggle}
                  className="w-4 h-4 rounded text-[#a63500]"
                />
                <button
                  onClick={() => setSelectedOrder(item)}
                  className="font-bold text-[#a63500] text-sm hover:underline"
                >
                  {item.orderNumber}
                </button>
              </div>
              {getStatusBadge(item.status)}
            </div>

            <p className="text-xs font-semibold text-[#191c1d]">{item.customerName}</p>
            <p className="text-xs text-[#191c1d]/60 mb-2 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#a63500]" />
              {item.customerCity}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-[rgba(25,28,29,0.06)] text-xs">
              <span className="font-bold text-[#191c1d]">{formatKz(item.totalKz)}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedOrder(item)}
              >
                Ver Detalhes
              </Button>
            </div>
          </div>
        )}
      />

      {/* Order Detail Modal */}
      {selectedOrder && (
        <Modal
          isOpen={Boolean(selectedOrder)}
          onClose={() => setSelectedOrder(null)}
          title={`Pedido ${selectedOrder.orderNumber}`}
          description={`Registado em ${selectedOrder.date} • Zenza Shop Angola`}
          size="lg"
        >
          <div className="space-y-6">
            {/* Status & Payment Banner */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#f8f9fa] rounded-xl border border-[rgba(25,28,29,0.08)]">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-semibold text-[#191c1d]/60">Estado do Pedido:</span>
                {getStatusBadge(selectedOrder.status)}
              </div>
              <div className="flex items-center gap-2 text-xs">
                <CreditCard className="w-4 h-4 text-[#a63500]" />
                <span className="font-bold text-[#191c1d]">
                  {getPaymentLabel(selectedOrder.paymentMethod)}
                </span>
              </div>
            </div>

            {/* Customer & Shipping Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-white rounded-xl border border-[rgba(25,28,29,0.10)] space-y-1.5">
                <span className="font-bold uppercase tracking-wider text-[#191c1d]/50 text-[10px]">
                  Dados do Cliente
                </span>
                <p className="font-bold text-sm text-[#191c1d]">{selectedOrder.customerName}</p>
                <p className="text-[#191c1d]/70">{selectedOrder.customerPhone}</p>
                <p className="text-[#191c1d]/70">cliente.angola@zenza.ao</p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-[rgba(25,28,29,0.10)] space-y-1.5">
                <span className="font-bold uppercase tracking-wider text-[#191c1d]/50 text-[10px]">
                  Endereço de Entrega
                </span>
                <p className="font-bold text-sm text-[#191c1d]">{selectedOrder.customerCity}</p>
                <p className="text-[#191c1d]/70">Condomínio Jardim de Rosas, Bloco B-12</p>
                <p className="text-emerald-700 font-semibold">Rota: Luanda Express Sul</p>
              </div>
            </div>

            {/* Items Summary */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#191c1d]/60">
                Itens da Encomenda
              </h4>
              <div className="border border-[rgba(25,28,29,0.10)] rounded-xl divide-y divide-[rgba(25,28,29,0.06)] text-xs">
                <div className="p-3 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-[#191c1d]">Camisa Linho Luanda Slim (Azul - M)</p>
                    <p className="text-[#191c1d]/50 text-[11px]">SKU: ZNZ-APP-001 • Qtd: 2</p>
                  </div>
                  <span className="font-bold">{formatKz(32000)}</span>
                </div>
                <div className="p-3 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-[#191c1d]">Calçado Casual Couro Luanda (Tam 42)</p>
                    <p className="text-[#191c1d]/50 text-[11px]">SKU: ZNZ-SHO-042 • Qtd: 1</p>
                  </div>
                  <span className="font-bold">{formatKz(16500)}</span>
                </div>
                <div className="p-3 bg-[#f8f9fa] flex items-center justify-between font-bold text-sm">
                  <span>Total a Liquidar</span>
                  <span className="text-[#a63500]">{formatKz(selectedOrder.totalKz)}</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-end gap-2.5 pt-4 border-t border-[rgba(25,28,29,0.08)]">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Printer className="w-4 h-4" />}
                onClick={() => info('Imprimir Fatura', 'A preparar guia de transporte e fatura AGT...')}
              >
                Imprimir Guia
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  success('Pedido Atualizado', `Pedido ${selectedOrder.orderNumber} verificado com sucesso.`);
                  setSelectedOrder(null);
                }}
              >
                Confirmar e Despachar
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
