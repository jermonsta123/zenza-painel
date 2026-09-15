import React, { useState, useMemo } from 'react';
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
  CreditCard, 
  Search, 
  CheckCircle2, 
  RotateCcw, 
  Eye, 
  FileText, 
  Download, 
  ShieldCheck,
  AlertTriangle,
  Lock,
  Smartphone
} from 'lucide-react';

interface PaymentTransaction {
  id: string;
  orderNumber: string;
  reference: string;
  customerName: string;
  customerPhone: string;
  amountKz: number;
  method: 'multicaixa_express' | 'bai_directo' | 'transferencia';
  status: 'confirmado' | 'pendente_verificacao' | 'reembolsado';
  date: string;
  confirmedBy?: string;
  proofUrl?: string;
}

const initialTransactions: PaymentTransaction[] = [
  {
    id: 'pay-001',
    orderNumber: '#ORD-8492',
    reference: 'MCX-994821034',
    customerName: 'Carlos Mateus',
    customerPhone: '+244 923 456 789',
    amountKz: 48500,
    method: 'multicaixa_express',
    status: 'confirmado',
    date: 'Hoje, às 10:25',
    confirmedBy: 'Webhook EMIS Gateway',
  },
  {
    id: 'pay-002',
    orderNumber: '#ORD-8491',
    reference: 'BAI-DIR-449120',
    customerName: 'Ana Beatriz Afonso',
    customerPhone: '+244 912 884 120',
    amountKz: 125000,
    method: 'bai_directo',
    status: 'confirmado',
    date: 'Hoje, às 09:46',
    confirmedBy: 'API BAI Directo',
  },
  {
    id: 'pay-003',
    orderNumber: '#ORD-8490',
    reference: 'TRF-BFA-109348',
    customerName: 'Domingos Gaspar',
    customerPhone: '+244 945 112 334',
    amountKz: 32000,
    method: 'transferencia',
    status: 'pendente_verificacao',
    date: 'Hoje, às 08:32',
    proofUrl: 'comprovativo_bfa_domingos.pdf',
  },
  {
    id: 'pay-004',
    orderNumber: '#ORD-8486',
    reference: 'MCX-881230192',
    customerName: 'Manuel Dinis',
    customerPhone: '+244 917 554 321',
    amountKz: 210000,
    method: 'multicaixa_express',
    status: 'confirmado',
    date: '14 Set, às 11:06',
    confirmedBy: 'Webhook EMIS Gateway',
  },
  {
    id: 'pay-005',
    orderNumber: '#ORD-8480',
    reference: 'MCX-771920384',
    customerName: 'Joana Baptista',
    customerPhone: '+244 924 111 222',
    amountKz: 38000,
    method: 'multicaixa_express',
    status: 'reembolsado',
    date: '13 Set, às 14:10',
    confirmedBy: 'Manuel Silva (Admin)',
  },
];

export const PaymentsView: React.FC = () => {
  const { success, warning, error: toastError, info } = useToast();
  const { can } = useAuth();
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(initialTransactions);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Dangerous Operation Modals
  const [transactionToConfirm, setTransactionToConfirm] = useState<PaymentTransaction | null>(null);
  const [transactionToRefund, setTransactionToRefund] = useState<PaymentTransaction | null>(null);
  const [refundReason, setRefundReason] = useState('Desistência do cliente / Devolução do artigo');

  const canConfirm = can('confirm_payments');
  const canRefund = can('refund_orders');

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        t.orderNumber.toLowerCase().includes(q) ||
        t.reference.toLowerCase().includes(q) ||
        t.customerName.toLowerCase().includes(q) ||
        t.customerPhone.includes(q);

      if (!matchSearch) return false;

      if (selectedMethod !== 'all' && t.method !== selectedMethod) {
        return false;
      }
      return true;
    });
  }, [transactions, searchQuery, selectedMethod]);

  const handleConfirmPayment = () => {
    if (!transactionToConfirm) return;
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === transactionToConfirm.id
          ? {
              ...t,
              status: 'confirmado',
              confirmedBy: 'Operador Financeiro Zenza (Manual)',
            }
          : t
      )
    );
    success(
      'Pagamento Confirmado',
      `O pagamento de ${formatKz(transactionToConfirm.amountKz)} para o pedido ${transactionToConfirm.orderNumber} foi validado com sucesso.`
    );
    setTransactionToConfirm(null);
  };

  const handleRefundConfirmed = () => {
    if (!transactionToRefund) return;
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === transactionToRefund.id
          ? {
              ...t,
              status: 'reembolsado',
              confirmedBy: 'Reembolso Processado (Manual)',
            }
          : t
      )
    );
    warning(
      'Reembolso Processado',
      `Reembolso de ${formatKz(transactionToRefund.amountKz)} emitido para ${transactionToRefund.customerName}. Motivo: ${refundReason}.`
    );
    setTransactionToRefund(null);
  };

  const columns: Column<PaymentTransaction>[] = [
    {
      key: 'reference',
      header: 'Referência / Transação',
      priority: 'high',
      render: (item) => (
        <div className="flex flex-col">
          <span className="font-mono text-xs font-bold text-[#a63500]">
            {item.reference}
          </span>
          <span className="text-[10px] text-[#191c1d]/50">
            Pedido: {item.orderNumber}
          </span>
        </div>
      ),
    },
    {
      key: 'customerName',
      header: 'Cliente / Contacto',
      priority: 'high',
      render: (item) => (
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-[#191c1d]">
            {item.customerName}
          </span>
          <span className="text-[10px] text-[#191c1d]/50">
            {item.customerPhone}
          </span>
        </div>
      ),
    },
    {
      key: 'method',
      header: 'Canal de Pagamento',
      priority: 'medium',
      render: (item) => {
        if (item.method === 'multicaixa_express') {
          return (
            <span className="text-xs font-medium text-[#191c1d] flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-[#a63500]" />
              Multicaixa Express
            </span>
          );
        }
        if (item.method === 'bai_directo') {
          return (
            <span className="text-xs font-medium text-[#191c1d] flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-blue-600" />
              BAI Directo
            </span>
          );
        }
        return (
          <span className="text-xs font-medium text-[#191c1d] flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-gray-600" />
            Transferência Bancária
          </span>
        );
      },
    },
    {
      key: 'amountKz',
      header: 'Montante Liquidado',
      align: 'right',
      priority: 'high',
      render: (item) => (
        <span className="font-bold text-xs text-[#191c1d]">
          {formatKz(item.amountKz)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Estado',
      align: 'center',
      priority: 'high',
      render: (item) => {
        if (item.status === 'confirmado') {
          return (
            <Badge variant="emerald" size="sm" withDot>
              Confirmado
            </Badge>
          );
        }
        if (item.status === 'pendente_verificacao') {
          return (
            <Badge variant="amber" size="sm" withDot>
              Pendente Verificação
            </Badge>
          );
        }
        return (
          <Badge variant="neutral" size="sm">
            Reembolsado
          </Badge>
        );
      },
    },
    {
      key: 'date',
      header: 'Data / Autenticação',
      priority: 'low',
      render: (item) => (
        <div className="flex flex-col">
          <span className="text-[11px] text-[#191c1d]/70">{item.date}</span>
          {item.confirmedBy && (
            <span className="text-[9px] text-[#191c1d]/40 truncate max-w-xs">
              {item.confirmedBy}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Ações Operacionais',
      align: 'right',
      priority: 'high',
      render: (item) => (
        <div className="flex items-center justify-end gap-1.5">
          {item.status === 'pendente_verificacao' && (
            <Button
              variant="secondary"
              size="sm"
              disabled={!canConfirm}
              onClick={() => setTransactionToConfirm(item)}
              leftIcon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
            >
              Validar
            </Button>
          )}

          {item.status === 'confirmado' && (
            <Button
              variant="outline"
              size="sm"
              disabled={!canRefund}
              onClick={() => setTransactionToRefund(item)}
              leftIcon={<RotateCcw className="w-3.5 h-3.5 text-amber-600" />}
            >
              Reembolsar
            </Button>
          )}
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
              Gateway Nacional de Pagamentos
            </Badge>
            <Badge variant="emerald" size="sm" withDot>
              EMIS / MCX Conectado
            </Badge>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#191c1d] tracking-tight">
            Pagamentos & Transações Multicaixa Express
          </h1>
          <p className="text-xs text-[#191c1d]/60 mt-0.5">
            Conciliação de fluxos financeiros, validação de comprovativos e emissão segura de reembolsos em Kwanza (AOA).
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={() => info('Exportação Financeira', 'A exportar mapa de transações para reconciliação bancária...')}
          >
            Exportar Extrato
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-xl border border-[rgba(25,28,29,0.10)] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Pesquisar por referência, cliente, telefone ou nº de pedido..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftElement={<Search className="w-4 h-4 text-[#191c1d]/40" />}
            inputSize="sm"
          />
        </div>

        <div className="flex items-center gap-2">
          {['all', 'multicaixa_express', 'bai_directo', 'transferencia'].map((methodKey) => (
            <button
              key={methodKey}
              onClick={() => setSelectedMethod(methodKey)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedMethod === methodKey
                  ? 'bg-[#a63500] text-white shadow-xs'
                  : 'bg-[#f8f9fa] text-[#191c1d]/70 hover:bg-gray-200'
              }`}
            >
              {methodKey === 'all'
                ? 'Todos os Métodos'
                : methodKey === 'multicaixa_express'
                ? 'Multicaixa Express'
                : methodKey === 'bai_directo'
                ? 'BAI Directo'
                : 'Transferência'}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <DataTable
        columns={columns}
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        currentPage={currentPage}
        totalPages={Math.ceil(filteredTransactions.length / pageSize)}
        totalItems={filteredTransactions.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />

      {/* Confirm Manual Payment Validation Modal (Dangerous Operation) */}
      <ConfirmDialog
        isOpen={Boolean(transactionToConfirm)}
        onClose={() => setTransactionToConfirm(null)}
        onConfirm={handleConfirmPayment}
        title={`Confirmar Recebimento de ${formatKz(transactionToConfirm?.amountKz || 0)}?`}
        description={`Confirma que o comprovativo bancário do cliente ${transactionToConfirm?.customerName} foi verificado na conta da Zenza Shop? O pedido ${transactionToConfirm?.orderNumber} avançará para despacho imediato.`}
        confirmLabel="Sim, Confirmar Pagamento"
        cancelLabel="Cancelar"
        variant="warning"
      />

      {/* Confirm Refund Modal (Dangerous Operation) */}
      <Modal
        isOpen={Boolean(transactionToRefund)}
        onClose={() => setTransactionToRefund(null)}
        title="Iniciar Processo de Reembolso"
        description="Esta operação devolverá o valor pago pelo cliente e anulará a respetiva fatura comercial."
      >
        <div className="space-y-4">
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900">
            <span className="font-bold block">Atenção: Ação Financeira Irreversível</span>
            <p className="mt-0.5 text-red-800/80">
              Valor a reembolsar: <strong>{formatKz(transactionToRefund?.amountKz || 0)}</strong> para <strong>{transactionToRefund?.customerName}</strong> ({transactionToRefund?.customerPhone}).
            </p>
          </div>

          <FormField
            id="refund-reason"
            label="Motivo do Reembolso"
            required
            hint="Obrigatório para auditoria fiscal e conformidade AGT"
          >
            <Input
              id="refund-reason"
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
            />
          </FormField>

          <div className="flex justify-end gap-2 pt-3 border-t border-[rgba(25,28,29,0.08)]">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTransactionToRefund(null)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleRefundConfirmed}
            >
              Executar Reembolso
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
