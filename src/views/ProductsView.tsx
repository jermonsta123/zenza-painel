import React, { useState } from 'react';
import { Product, ProductStatus } from '../types/product';
import { SAMPLE_PRODUCTS } from '../data/sampleProducts';
import { CATEGORIES_CATALOG } from '../data/categoriesCatalog';
import { DataTable, Column } from '../components/ui/Table';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal, ConfirmDialog } from '../components/ui/Modal';
import { ProductFormView } from './ProductFormView';
import { formatKz } from '../theme/tokens';
import { useToast } from '../context/ToastContext';
import { 
  Package, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Filter, 
  AlertTriangle, 
  Boxes, 
  CheckCircle2,
  Sparkles,
  Copy,
  Globe,
  Archive,
  Eye,
  SlidersHorizontal,
  DollarSign,
  TrendingDown
} from 'lucide-react';

export const ProductsView: React.FC = () => {
  const { success, warning, info, error: toastError } = useToast();

  // Products Database State
  const [productsList, setProductsList] = useState<Product[]>(SAMPLE_PRODUCTS);

  // Active view mode: 'list' | 'form'
  const [viewState, setViewState] = useState<'list' | 'form'>('list');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'todos' | 'published' | 'draft' | 'low_stock' | 'out_of_stock'>('todos');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Deletion Modal
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Open creation mode
  const handleOpenCreate = () => {
    setEditingProduct(null);
    setViewState('form');
  };

  // Open edit mode
  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setViewState('form');
  };

  // Duplicate product
  const handleDuplicate = (product: Product) => {
    const duplicated: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      title: `${product.title} (Cópia)`,
      slug: `${product.slug}-copia-${Math.floor(100 + Math.random() * 900)}`,
      sku: `${product.sku}-CPY`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: undefined,
    };
    setProductsList([duplicated, ...productsList]);
    success('Produto Duplicado', `"${duplicated.title}" foi criado como rascunho.`);
  };

  // Save product from form (create or edit)
  const handleSaveProductFromForm = (savedProduct: Product) => {
    setProductsList((prev) => {
      const existsIndex = prev.findIndex((p) => p.id === savedProduct.id);
      if (existsIndex >= 0) {
        const updated = [...prev];
        updated[existsIndex] = savedProduct;
        return updated;
      }
      return [savedProduct, ...prev];
    });
    setViewState('list');
    setEditingProduct(null);
  };

  // Delete product confirmation
  const handleConfirmDelete = () => {
    if (!productToDelete) return;
    setProductsList((prev) => prev.filter((p) => p.id !== productToDelete.id));
    success('Produto Eliminado', `"${productToDelete.title}" foi removido do sistema.`);
    setProductToDelete(null);
  };

  // Toggle Publish / Unpublish quick action
  const handleTogglePublish = (product: Product) => {
    const nextStatus: ProductStatus = product.status === 'published' ? 'draft' : 'published';
    const updated: Product = {
      ...product,
      status: nextStatus,
      updatedAt: new Date().toISOString(),
      publishedAt: nextStatus === 'published' ? new Date().toISOString() : product.publishedAt,
    };
    setProductsList((prev) => prev.map((p) => (p.id === product.id ? updated : p)));

    if (nextStatus === 'published') {
      success('Produto Publicado', `"${product.title}" está agora disponível na loja.`);
    } else {
      info('Produto em Rascunho', `"${product.title}" foi ocultado da loja.`);
    }
  };

  // Batch delete selected products
  const handleBatchDelete = () => {
    if (selectedIds.length === 0) return;
    setProductsList((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
    success('Lote Eliminado', `${selectedIds.length} produtos foram removidos.`);
    setSelectedIds([]);
  };

  // Filtering logic
  const filteredProducts = productsList.filter((p) => {
    // Category filter
    if (selectedCategory !== 'todas' && p.category !== selectedCategory) {
      return false;
    }
    // Status filter
    if (selectedStatusFilter === 'published' && p.status !== 'published') return false;
    if (selectedStatusFilter === 'draft' && p.status !== 'draft') return false;
    if (selectedStatusFilter === 'out_of_stock' && p.stockCount > 0) return false;
    if (selectedStatusFilter === 'low_stock' && (p.stockCount === 0 || p.stockCount > p.lowStockThreshold)) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.categoryName?.toLowerCase().includes(q) ||
        p.subcategoryName?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // KPI calculations
  const totalProducts = productsList.length;
  const publishedCount = productsList.filter((p) => p.status === 'published').length;
  const lowStockCount = productsList.filter((p) => p.stockCount > 0 && p.stockCount <= p.lowStockThreshold).length;
  const outOfStockCount = productsList.filter((p) => p.stockCount === 0).length;
  const totalCatalogValueKz = productsList.reduce((acc, p) => acc + p.price * p.stockCount, 0);

  // Table Columns Definition
  const columns: Column<Product>[] = [
    {
      key: 'title',
      header: 'Produto & SKU',
      sortable: true,
      priority: 'high',
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-[#fff3ef] border border-[rgba(25,28,29,0.12)] shrink-0 flex items-center justify-center">
            {item.image ? (
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
                onError={(e) => ((e.target as HTMLElement).style.display = 'none')}
              />
            ) : (
              <Package className="w-5 h-5 text-[#a63500]" />
            )}
            {item.discountPct && item.discountPct > 0 ? (
              <span className="absolute -top-1 -right-1 bg-[#a63500] text-white text-[9px] font-bold px-1 rounded-full">
                -{item.discountPct}%
              </span>
            ) : null}
          </div>
          <div className="flex flex-col min-w-0">
            <span
              onClick={() => handleOpenEdit(item)}
              className="font-bold text-[#191c1d] hover:text-[#a63500] cursor-pointer truncate max-w-[220px] transition-colors"
            >
              {item.title}
            </span>
            <div className="flex items-center gap-1.5 text-[11px] text-[#191c1d]/50 font-mono">
              <span>SKU: {item.sku}</span>
              {item.colors && item.colors.length > 0 && (
                <>
                  <span>•</span>
                  <span>{item.colors.length} cores</span>
                </>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Categoria & Subcategoria',
      sortable: true,
      priority: 'medium',
      render: (item) => (
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-[#191c1d]">
            {item.categoryName || item.category}
          </span>
          {item.subcategoryName && (
            <span className="text-[10px] text-[#191c1d]/50">
              {item.subcategoryName}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'price',
      header: 'Preço Venda (Kz)',
      sortable: true,
      align: 'right',
      priority: 'high',
      render: (item) => (
        <div className="flex flex-col text-right">
          <span className="font-bold text-[#191c1d]">{formatKz(item.price)}</span>
          {item.originalPrice && item.originalPrice > item.price ? (
            <span className="text-[10px] line-through text-[#191c1d]/40">
              {formatKz(item.originalPrice)}
            </span>
          ) : item.costPrice ? (
            <span className="text-[10px] text-[#191c1d]/40">
              Custo: {formatKz(item.costPrice)}
            </span>
          ) : null}
        </div>
      ),
    },
    {
      key: 'stockCount',
      header: 'Stock Armazém',
      sortable: true,
      priority: 'high',
      render: (item) => {
        if (item.stockCount === 0) {
          return <Badge variant="red" size="sm" withDot>Esgotado (0)</Badge>;
        }
        if (item.stockCount <= item.lowStockThreshold) {
          return <Badge variant="amber" size="sm" withDot>Baixo ({item.stockCount})</Badge>;
        }
        return <Badge variant="emerald" size="sm" withDot>{item.stockCount} unid.</Badge>;
      },
    },
    {
      key: 'status',
      header: 'Estado Loja',
      sortable: true,
      priority: 'medium',
      render: (item) => (
        <Badge
          variant={
            item.status === 'published'
              ? 'emerald'
              : item.status === 'draft'
              ? 'amber'
              : 'neutral'
          }
          size="sm"
        >
          {item.status === 'published'
            ? 'Publicado'
            : item.status === 'draft'
            ? 'Rascunho'
            : 'Despublicado'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Ações',
      align: 'right',
      priority: 'high',
      render: (item) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleTogglePublish(item)}
            title={item.status === 'published' ? 'Passar a Rascunho' : 'Publicar na Loja'}
          >
            {item.status === 'published' ? (
              <Archive className="w-4 h-4 text-[#191c1d]/60 hover:text-amber-600" />
            ) : (
              <Globe className="w-4 h-4 text-[#191c1d]/60 hover:text-emerald-600" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDuplicate(item)}
            title="Duplicar Produto"
          >
            <Copy className="w-4 h-4 text-[#191c1d]/60 hover:text-[#a63500]" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleOpenEdit(item)}
            title="Editar Produto Completo"
          >
            <Edit3 className="w-4 h-4 text-[#191c1d]/70 hover:text-[#a63500]" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setProductToDelete(item)}
            title="Eliminar Produto"
          >
            <Trash2 className="w-4 h-4 text-[#191c1d]/40 hover:text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  // If in Form View, render master product form
  if (viewState === 'form') {
    return (
      <ProductFormView
        initialProduct={editingProduct}
        onSave={handleSaveProductFromForm}
        onCancel={() => {
          setViewState('list');
          setEditingProduct(null);
        }}
      />
    );
  }

  // Otherwise, render Catalog View
  return (
    <div className="space-y-6">
      {/* Top Title & CTA Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#191c1d] tracking-tight">
            Catálogo & Gestão de Produtos
          </h1>
          <p className="text-xs text-[#191c1d]/60 mt-0.5">
            Cadastre, edite, defina preços em Kwanza (AOA), controle variantes e publique no e-commerce Zenza Shop.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={handleOpenCreate}
          className="shadow-xs font-bold"
        >
          + Adicionar Novo Produto
        </Button>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-white rounded-xl border border-[rgba(25,28,29,0.10)] space-y-1 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#191c1d]/50 block">
            Total no Catálogo
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-bold text-[#191c1d]">{totalProducts}</span>
            <Badge variant="neutral" size="sm">{publishedCount} online</Badge>
          </div>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-[rgba(25,28,29,0.10)] space-y-1 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#191c1d]/50 block">
            Valor em Armazém
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-bold text-[#a63500] truncate">{formatKz(totalCatalogValueKz)}</span>
            <span className="text-[10px] text-[#191c1d]/40">Kz</span>
          </div>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-[rgba(25,28,29,0.10)] space-y-1 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#191c1d]/50 block">
            Baixo Stock
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-bold text-amber-600">{lowStockCount}</span>
            <span className="text-[10px] text-amber-700 font-medium">Requer atenção</span>
          </div>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-[rgba(25,28,29,0.10)] space-y-1 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#191c1d]/50 block">
            Esgotados
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-bold text-red-600">{outOfStockCount}</span>
            <span className="text-[10px] text-red-700 font-medium">Sem stock</span>
          </div>
        </div>
      </div>

      {/* Status Filter Tabs & Search Bar */}
      <div className="space-y-3 bg-white p-4 rounded-xl border border-[rgba(25,28,29,0.10)] shadow-xs">
        {/* Quick Status Pill Filters */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[rgba(25,28,29,0.06)]">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'todos', label: 'Todos os Produtos', count: totalProducts },
              { id: 'published', label: 'Publicados na Loja', count: publishedCount },
              { id: 'draft', label: 'Rascunhos', count: totalProducts - publishedCount },
              { id: 'low_stock', label: 'Baixo Stock', count: lowStockCount },
              { id: 'out_of_stock', label: 'Esgotados', count: outOfStockCount },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedStatusFilter(tab.id as any)}
                className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  selectedStatusFilter === tab.id
                    ? 'bg-[#a63500] text-white shadow-2xs'
                    : 'bg-[#f8f9fa] text-[#191c1d]/70 hover:text-[#191c1d] hover:bg-[#fff3ef]'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#a63500]">
                {selectedIds.length} selecionados
              </span>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBatchDelete}
                leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              >
                Eliminar Seleção
              </Button>
            </div>
          )}
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:w-96">
            <Input
              id="catalog-search"
              placeholder="Pesquisar por nome, SKU ou subcategoria..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftElement={<Search className="w-4 h-4 text-[#191c1d]/40" />}
              inputSize="sm"
            />
          </div>

          <div className="w-full sm:w-64">
            <Select
              id="catalog-category-filter"
              selectSize="sm"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              options={[
                { value: 'todas', label: 'Todas as Categorias' },
                ...CATEGORIES_CATALOG.map((c) => ({
                  value: c.id,
                  label: c.name,
                })),
              ]}
            />
          </div>
        </div>
      </div>

      {/* Products Data Table */}
      <DataTable
        columns={columns}
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        selectable
        selectedIds={selectedIds}
        onSelectChange={setSelectedIds}
        pageSize={10}
        totalItems={filteredProducts.length}
        currentPage={1}
        totalPages={1}
        onRowClick={(item) => handleOpenEdit(item)}
      />

      {/* Deletion Confirm Dialog */}
      <ConfirmDialog
        isOpen={Boolean(productToDelete)}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Produto do Catálogo?"
        description={`Tens a certeza de que desejas eliminar definitivamente o produto "${productToDelete?.title}" (SKU: ${productToDelete?.sku})? Esta ação não pode ser revertida.`}
        confirmLabel="Sim, Eliminar Produto"
        cancelLabel="Cancelar"
        variant="destructive"
      />
    </div>
  );
};
