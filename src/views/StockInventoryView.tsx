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
  Boxes, 
  Search, 
  AlertTriangle, 
  Plus, 
  Minus, 
  RotateCcw, 
  CheckCircle2, 
  ArrowUpDown, 
  Building2, 
  Download,
  Lock
} from 'lucide-react';

interface StockItem {
  id: string;
  sku: string;
  title: string;
  categoryName: string;
  price: number;
  stockCount: number;
  lowStockThreshold: number;
  location: string;
  lastUpdated: string;
}

const initialStockItems: StockItem[] = [
  {
    id: 'prod-001',
    sku: 'ZNZ-APP-001',
    title: 'Camisa Linho Luanda Slim Fit',
    categoryName: 'Vestuário Masculino',
    price: 32000,
    stockCount: 42,
    lowStockThreshold: 10,
    location: 'Armazém Central Talatona - Prateleira A4',
    lastUpdated: 'Hoje, 09:30',
  },
  {
    id: 'prod-002',
    sku: 'ZNZ-APP-002',
    title: 'Vestido Samakaka Festa Tradicional',
    categoryName: 'Vestuário Feminino',
    price: 78000,
    stockCount: 3, // Low stock alert!
    lowStockThreshold: 5,
    location: 'Armazém Central Talatona - Prateleira B1',
    lastUpdated: 'Ontem, 18:12',
  },
  {
    id: 'prod-003',
    sku: 'ZNZ-SHO-042',
    title: 'Calçado Casual Couro Luanda',
    categoryName: 'Calçado',
    price: 49500,
    stockCount: 0, // Out of stock!
    lowStockThreshold: 8,
    location: 'Armazém Central Talatona - Prateleira C2',
    lastUpdated: '14 Set, 14:00',
  },
  {
    id: 'prod-004',
    sku: 'ZNZ-ACC-015',
    title: 'Óculos de Sol Baía Polarizados',
    categoryName: 'Acessórios & Óptica',
    price: 24000,
    stockCount: 18,
    lowStockThreshold: 5,
    location: 'Armazém Central Talatona - Gaveta D1',
    lastUpdated: '12 Set, 11:20',
  },
  {
    id: 'prod-005',
    sku: 'ZNZ-BEA-088',
    title: 'Perfume Essência de Benguela 100ml',
    categoryName: 'Beleza & Cuidados',
    price: 65000,
    stockCount: 4, // Low stock alert!
    lowStockThreshold: 6,
    location: 'Armazém Central Talatona - Secção Climatizada E',
    lastUpdated: 'Hoje, 08:15',
  },
  {
    id: 'prod-006',
    sku: 'ZNZ-HOM-102',
    title: 'Vaso Cerâmica Artesanal Ilha de Luanda',
    categoryName: 'Casa & Decoração',
    price: 42000,
    stockCount: 12,
    lowStockThreshold: 4,
    location: 'Armazém Central Talatona - Prateleira F3',
    lastUpdated: '13 Set, 16:45',
  },
];

export const StockInventoryView: React.FC = () => {
  const { success, warning, error: toastError, info } = useToast();
  const { can } = useAuth();
  const [stockItems, setStockItems] = useState<StockItem[]>(initialStockItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'low' | 'out'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Dangerous Operation Modals
  const [itemToZero, setItemToZero] = useState<StockItem | null>(null);
  const [quickAdjustItem, setQuickAdjustItem] = useState<{ item: StockItem; newQty: number } | null>(null);

  const canManageStock = can('manage_stock');

  const filteredItems = useMemo(() => {
    return stockItems.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        item.title.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.categoryName.toLowerCase().includes(q);

      if (!matchSearch) return false;

      if (filterType === 'low') {
        return item.stockCount > 0 && item.stockCount <= item.lowStockThreshold;
      }
      if (filterType === 'out') {
        return item.stockCount === 0;
      }
      return true;
    });
  }, [stockItems, searchQuery, filterType]);

  const lowStockCount = stockItems.filter(
    (i) => i.stockCount > 0 && i.stockCount <= i.lowStockThreshold
  ).length;
  const outOfStockCount = stockItems.filter((i) => i.stockCount === 0).length;

  const handleStockUpdate = (item: StockItem, delta: number) => {
    if (!canManageStock) {
      toastError('Permissão Negada', 'O teu perfil não tem permissão para alterar unidades de stock.');
      return;
    }

    const nextCount = Math.max(0, item.stockCount + delta);

    // If decreasing to zero, prompt dangerous operation confirmation
    if (nextCount === 0 && item.stockCount > 0) {
      setItemToZero(item);
      return;
    }

    setStockItems((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? { ...i, stockCount: nextCount, lastUpdated: 'Agora mesmo' }
          : i
      )
    );

    success(
      'Stock Atualizado',
      `"${item.title}" agora tem ${nextCount} unidades disponíveis.`
    );
  };

  const handleConfirmZeroStock = () => {
    if (!itemToZero) return;
    setStockItems((prev) =>
      prev.map((i) =>
        i.id === itemToZero.id
          ? { ...i, stockCount: 0, lastUpdated: 'Agora mesmo' }
          : i
      )
    );
    warning(
      'Stock Esgotado',
      `"${itemToZero.title}" foi marcado com 0 unidades. O botão de compra na loja foi desativado.`
    );
    setItemToZero(null);
  };

  const columns: Column<StockItem>[] = [
    {
      key: 'sku',
      header: 'Código SKU',
      priority: 'high',
      render: (item) => (
        <span className="font-mono text-xs font-bold text-[#191c1d]">
          {item.sku}
        </span>
      ),
    },
    {
      key: 'title',
      header: 'Produto / Categoria',
      priority: 'high',
      render: (item) => (
        <div className="flex flex-col">
          <span className="font-semibold text-xs text-[#191c1d]">{item.title}</span>
          <span className="text-[10px] text-[#191c1d]/50">{item.categoryName}</span>
        </div>
      ),
    },
    {
      key: 'location',
      header: 'Localização Física',
      priority: 'medium',
      render: (item) => (
        <span className="text-[11px] text-[#191c1d]/70 flex items-center gap-1">
          <Building2 className="w-3.5 h-3.5 text-[#a63500]" />
          {item.location}
        </span>
      ),
    },
    {
      key: 'price',
      header: 'Preço Venda',
      align: 'right',
      priority: 'medium',
      render: (item) => (
        <span className="text-xs font-semibold text-[#191c1d]">
          {formatKz(item.price)}
        </span>
      ),
    },
    {
      key: 'stockCount',
      header: 'Stock Atual',
      align: 'center',
      priority: 'high',
      render: (item) => {
        if (item.stockCount === 0) {
          return (
            <Badge variant="red" size="sm" withDot>
              0 (Esgotado)
            </Badge>
          );
        }
        if (item.stockCount <= item.lowStockThreshold) {
          return (
            <Badge variant="amber" size="sm" withDot>
              {item.stockCount} unid. (Alerta)
            </Badge>
          );
        }
        return (
          <Badge variant="emerald" size="sm">
            {item.stockCount} unid.
          </Badge>
        );
      },
    },
    {
      key: 'actions',
      header: 'Ajuste Rápido de Stock',
      align: 'right',
      priority: 'high',
      render: (item) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => handleStockUpdate(item, -1)}
            disabled={!canManageStock || item.stockCount === 0}
            className="p-1 rounded-md border border-[rgba(25,28,29,0.15)] hover:bg-gray-100 disabled:opacity-40 transition-colors"
            title="Decrementar 1 unidade"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono font-bold text-xs px-1 min-w-[2rem] text-center">
            {item.stockCount}
          </span>
          <button
            onClick={() => handleStockUpdate(item, 1)}
            disabled={!canManageStock}
            className="p-1 rounded-md border border-[rgba(25,28,29,0.15)] hover:bg-gray-100 disabled:opacity-40 transition-colors"
            title="Incrementar 1 unidade"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleStockUpdate(item, 10)}
            disabled={!canManageStock}
            className="text-[10px] font-bold px-1.5 py-1 rounded-md bg-[#fff3ef] text-[#a63500] hover:bg-[#ffb59c]/30 transition-colors ml-1"
            title="Adicionar lote de 10 unidades"
          >
            +10
          </button>
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
              Armazém Luanda Talatona
            </Badge>
            <Badge variant="emerald" size="sm" withDot>
              Inventário Sincronizado
            </Badge>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#191c1d] tracking-tight">
            Stock & Controlo de Inventário Físico
          </h1>
          <p className="text-xs text-[#191c1d]/60 mt-0.5">
            Monitorização de unidades disponíveis, limites de alerta e reposição de mercadoria.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={() => info('Exportar Inventário', 'A gerar relatório de stock em armazém...')}
          >
            Exportar Inventário
          </Button>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => setFilterType('all')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            filterType === 'all'
              ? 'bg-[#fff3ef] border-[#ffb59c] ring-1 ring-[#a63500]'
              : 'bg-white border-[rgba(25,28,29,0.10)] hover:border-[rgba(25,28,29,0.20)]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#191c1d]/60">Total de Itens</span>
            <Boxes className="w-4 h-4 text-[#a63500]" />
          </div>
          <p className="text-2xl font-bold text-[#191c1d] mt-1">{stockItems.length}</p>
          <span className="text-[10px] text-[#191c1d]/50">Linhas ativas em armazém</span>
        </div>

        <div
          onClick={() => setFilterType('low')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            filterType === 'low'
              ? 'bg-amber-50 border-amber-300 ring-1 ring-amber-500'
              : 'bg-white border-[rgba(25,28,29,0.10)] hover:border-amber-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-900">Em Alerta (&le; 5 unid.)</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-amber-700 mt-1">{lowStockCount}</p>
          <span className="text-[10px] text-amber-800/60">Necessitam de reposição urgente</span>
        </div>

        <div
          onClick={() => setFilterType('out')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            filterType === 'out'
              ? 'bg-red-50 border-red-300 ring-1 ring-red-500'
              : 'bg-white border-[rgba(25,28,29,0.10)] hover:border-red-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-red-900">Esgotados (0 unid.)</span>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-red-700 mt-1">{outOfStockCount}</p>
          <span className="text-[10px] text-red-800/60">Ocultos para compra imediata</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-xl border border-[rgba(25,28,29,0.10)] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Pesquisar por SKU, produto ou categoria..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftElement={<Search className="w-4 h-4 text-[#191c1d]/40" />}
            inputSize="sm"
          />
        </div>

        {!canManageStock && (
          <span className="text-xs text-amber-700 font-medium flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" /> Ações de alteração de stock bloqueadas para o teu perfil
          </span>
        )}
      </div>

      {/* Stock Table */}
      <DataTable
        columns={columns}
        data={filteredItems}
        keyExtractor={(item) => item.id}
        currentPage={currentPage}
        totalPages={Math.ceil(filteredItems.length / pageSize)}
        totalItems={filteredItems.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />

      {/* Confirm Setting Stock to Zero (Dangerous Operation Modal) */}
      <ConfirmDialog
        isOpen={Boolean(itemToZero)}
        onClose={() => setItemToZero(null)}
        onConfirm={handleConfirmZeroStock}
        title={`Definir Stock como Zero para "${itemToZero?.title}"?`}
        description="Ao reduzir as unidades a zero, o produto será exibido na Zenza Shop com a etiqueta 'Esgotado' e os clientes não poderão adicionar ao carrinho até haver nova entrada de mercadoria."
        confirmLabel="Sim, Marcar como Esgotado"
        cancelLabel="Cancelar"
        variant="warning"
      />
    </div>
  );
};
