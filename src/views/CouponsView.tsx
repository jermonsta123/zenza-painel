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
  Ticket, 
  Plus, 
  Search, 
  Percent, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Power, 
  Lock,
  Copy
} from 'lucide-react';

interface CouponItem {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValueKz: number;
  usageCount: number;
  usageLimit: number;
  validUntil: string;
  status: 'active' | 'expired' | 'disabled';
}

const initialCoupons: CouponItem[] = [
  {
    id: 'cup-01',
    code: 'BEMVINDOZENZA',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValueKz: 20000,
    usageCount: 142,
    usageLimit: 500,
    validUntil: '31 Dez 2026',
    status: 'active',
  },
  {
    id: 'cup-02',
    code: 'LUANDAFRETE',
    discountType: 'fixed',
    discountValue: 3500,
    minOrderValueKz: 40000,
    usageCount: 89,
    usageLimit: 200,
    validUntil: '30 Out 2026',
    status: 'active',
  },
  {
    id: 'cup-03',
    code: 'SAMAKAKA20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderValueKz: 50000,
    usageCount: 50,
    usageLimit: 50,
    validUntil: '10 Set 2026',
    status: 'expired',
  },
  {
    id: 'cup-04',
    code: 'PROMOFLASH5000',
    discountType: 'fixed',
    discountValue: 5000,
    minOrderValueKz: 60000,
    usageCount: 12,
    usageLimit: 100,
    validUntil: '15 Nov 2026',
    status: 'disabled',
  },
];

export const CouponsView: React.FC = () => {
  const { success, warning, error: toastError, info } = useToast();
  const { can } = useAuth();
  const [coupons, setCoupons] = useState<CouponItem[]>(initialCoupons);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [couponToToggle, setCouponToToggle] = useState<CouponItem | null>(null);

  // Form State
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [minOrder, setMinOrder] = useState<number>(20000);
  const [usageLimit, setUsageLimit] = useState<number>(100);
  const [validUntil, setValidUntil] = useState('31 Dez 2026');

  const canManage = can('manage_coupons');

  const filteredCoupons = coupons.filter((c) => {
    const q = searchQuery.toLowerCase();
    return c.code.toLowerCase().includes(q);
  });

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManage) {
      toastError('Permissão Negada', 'O teu perfil não tem permissão para criar cupões.');
      return;
    }
    if (!code.trim()) {
      toastError('Código Obrigatório', 'Insira o código alfanumérico do cupão.');
      return;
    }

    const cleanCode = code.toUpperCase().replace(/[^A-Z0-9_-]/g, '');

    const newCoupon: CouponItem = {
      id: `cup-${Date.now()}`,
      code: cleanCode,
      discountType,
      discountValue,
      minOrderValueKz: minOrder,
      usageCount: 0,
      usageLimit,
      validUntil,
      status: 'active',
    };

    setCoupons((prev) => [newCoupon, ...prev]);
    success('Cupão Criado', `Código ${cleanCode} ativado com sucesso.`);
    setShowCreateModal(false);
    setCode('');
  };

  const handleToggleStatus = () => {
    if (!couponToToggle) return;
    const newStatus = couponToToggle.status === 'active' ? 'disabled' : 'active';
    setCoupons((prev) =>
      prev.map((c) =>
        c.id === couponToToggle.id ? { ...c, status: newStatus } : c
      )
    );

    if (newStatus === 'disabled') {
      warning('Cupão Desativado', `O código ${couponToToggle.code} não pode mais ser aplicado no checkout.`);
    } else {
      success('Cupão Reativado', `O código ${couponToToggle.code} está agora ativo na loja.`);
    }
    setCouponToToggle(null);
  };

  const copyCode = (c: string) => {
    navigator.clipboard?.writeText(c);
    info('Copiado', `Código ${c} copiado para a área de transferência.`);
  };

  const columns: Column<CouponItem>[] = [
    {
      key: 'code',
      header: 'Código Promocional',
      priority: 'high',
      render: (item) => (
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-xs bg-[#fff3ef] text-[#a63500] px-2.5 py-1 rounded-md border border-[#ffb59c]/50">
            {item.code}
          </span>
          <button
            onClick={() => copyCode(item.code)}
            className="p-1 text-[#191c1d]/40 hover:text-[#191c1d]"
            title="Copiar código"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
    {
      key: 'discountValue',
      header: 'Benefício Comercial',
      priority: 'high',
      render: (item) => (
        <div className="flex flex-col">
          <span className="font-bold text-xs text-[#191c1d]">
            {item.discountType === 'percentage'
              ? `${item.discountValue}% de Desconto`
              : `${formatKz(item.discountValue)} de Abate Fixo`}
          </span>
          <span className="text-[10px] text-[#191c1d]/50">
            Mínimo: {formatKz(item.minOrderValueKz)}
          </span>
        </div>
      ),
    },
    {
      key: 'usage',
      header: 'Utilização',
      align: 'center',
      priority: 'medium',
      render: (item) => (
        <div className="flex flex-col items-center">
          <span className="text-xs font-semibold text-[#191c1d]">
            {item.usageCount} / {item.usageLimit}
          </span>
          <div className="w-20 bg-gray-200 rounded-full h-1.5 mt-1 overflow-hidden">
            <div
              className="bg-[#a63500] h-1.5 rounded-full"
              style={{ width: `${Math.min(100, (item.usageCount / item.usageLimit) * 100)}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      key: 'validUntil',
      header: 'Validade',
      priority: 'medium',
      render: (item) => (
        <span className="text-xs text-[#191c1d]/70 flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-[#191c1d]/40" />
          {item.validUntil}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Estado',
      align: 'center',
      priority: 'high',
      render: (item) => {
        if (item.status === 'active') {
          return <Badge variant="emerald" size="sm" withDot>Ativo</Badge>;
        }
        if (item.status === 'expired') {
          return <Badge variant="neutral" size="sm">Expirado</Badge>;
        }
        return <Badge variant="red" size="sm">Desativado</Badge>;
      },
    },
    {
      key: 'actions',
      header: 'Ação Operacional',
      align: 'right',
      priority: 'high',
      render: (item) => (
        <Button
          variant={item.status === 'active' ? 'outline' : 'secondary'}
          size="sm"
          disabled={!canManage || item.status === 'expired'}
          onClick={() => setCouponToToggle(item)}
          leftIcon={<Power className="w-3.5 h-3.5" />}
        >
          {item.status === 'active' ? 'Desativar' : 'Reativar'}
        </Button>
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
              Marketing & Campanhas
            </Badge>
            <Badge variant="emerald" size="sm" withDot>
              {coupons.filter((c) => c.status === 'active').length} Ativos na Loja
            </Badge>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#191c1d] tracking-tight">
            Cupões Promocionais & Descontos
          </h1>
          <p className="text-xs text-[#191c1d]/60 mt-0.5">
            Criação de códigos de desconto, regras de compra mínima e limites de utilização na Zenza Shop.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            size="sm"
            disabled={!canManage}
            onClick={() => setShowCreateModal(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            + Novo Cupão
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-xl border border-[rgba(25,28,29,0.10)] flex items-center justify-between gap-3 shadow-xs">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Pesquisar por código do cupão..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftElement={<Search className="w-4 h-4 text-[#191c1d]/40" />}
            inputSize="sm"
          />
        </div>
        {!canManage && (
          <span className="text-xs text-amber-700 font-medium flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" /> Ações de edição restritas
          </span>
        )}
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredCoupons}
        keyExtractor={(item) => item.id}
        totalItems={filteredCoupons.length}
      />

      {/* Modal: Create Coupon */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Criar Novo Cupão de Desconto"
        description="Defina o código promocional e as condições de elegibilidade para os clientes da Zenza Shop."
      >
        <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
          <FormField
            id="coupon-code"
            label="Código do Cupão"
            required
            hint="Apenas letras maiúsculas e números (ex: VERAO2026, FESTALUANDA)"
          >
            <Input
              id="coupon-code"
              placeholder="Ex: PROMO2026"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              autoFocus
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField id="discount-type" label="Tipo de Benefício">
              <select
                id="discount-type"
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as any)}
                className="w-full h-10 px-3 rounded-lg border border-[rgba(25,28,29,0.15)] bg-white text-xs font-medium focus:ring-2 focus:ring-[#a63500]"
              >
                <option value="percentage">Percentagem (%)</option>
                <option value="fixed">Abate Fixo (Kz)</option>
              </select>
            </FormField>

            <FormField
              id="discount-val"
              label={discountType === 'percentage' ? 'Percentagem (%)' : 'Valor (Kz)'}
              required
            >
              <Input
                id="discount-val"
                type="number"
                value={discountValue}
                onChange={(e) => setDiscountValue(Number(e.target.value))}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField id="min-order" label="Compra Mínima (Kz)">
              <Input
                id="min-order"
                type="number"
                value={minOrder}
                onChange={(e) => setMinOrder(Number(e.target.value))}
              />
            </FormField>

            <FormField id="limit-usage" label="Limite Máximo de Usos">
              <Input
                id="limit-usage"
                type="number"
                value={usageLimit}
                onChange={(e) => setUsageLimit(Number(e.target.value))}
              />
            </FormField>
          </div>

          <FormField id="validity" label="Data Limite de Validade">
            <Input
              id="validity"
              placeholder="Ex: 31 Dez 2026"
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
            />
          </FormField>

          <div className="flex justify-end gap-2 pt-3 border-t border-[rgba(25,28,29,0.08)]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowCreateModal(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Criar e Ativar Cupão
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Deactivation (Dangerous Operation Modal) */}
      <ConfirmDialog
        isOpen={Boolean(couponToToggle)}
        onClose={() => setCouponToToggle(null)}
        onConfirm={handleToggleStatus}
        title={
          couponToToggle?.status === 'active'
            ? `Desativar Cupão "${couponToToggle?.code}"?`
            : `Reativar Cupão "${couponToToggle?.code}"?`
        }
        description={
          couponToToggle?.status === 'active'
            ? `Ao desativar este cupão, os clientes que estiverem no checkout não poderão mais usufruir do desconto de ${couponToToggle?.discountType === 'percentage' ? `${couponToToggle.discountValue}%` : formatKz(couponToToggle?.discountValue || 0)}.`
            : `O cupão voltará a ser aceito em todas as compras com valor superior a ${formatKz(couponToToggle?.minOrderValueKz || 0)}.`
        }
        confirmLabel={couponToToggle?.status === 'active' ? 'Sim, Desativar' : 'Sim, Reativar'}
        cancelLabel="Voltar"
        variant={couponToToggle?.status === 'active' ? 'danger' : 'default'}
      />
    </div>
  );
};
