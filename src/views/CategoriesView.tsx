import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Modal, ConfirmDialog } from '../components/ui/Modal';
import { FormField } from '../components/ui/FormField';
import { CATEGORIES_CATALOG } from '../data/categoriesCatalog';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { 
  FolderTree, 
  Plus, 
  Tag, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  ChevronRight, 
  Layers, 
  Search,
  Sparkles,
  Lock
} from 'lucide-react';

export const CategoriesView: React.FC = () => {
  const { success, warning, info, error: toastError } = useToast();
  const { can } = useAuth();
  const [categories, setCategories] = useState(CATEGORIES_CATALOG);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(CATEGORIES_CATALOG[0]?.id || '');
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [categoryToDelete, setCategoryToDelete] = useState<{ catId: string; subId?: string; name: string } | null>(null);

  const canManage = can('manage_categories');

  const filteredCategories = categories.filter((cat) => {
    const q = searchQuery.toLowerCase();
    const matchName = cat.name.toLowerCase().includes(q);
    const matchSub = cat.subcategories.some((s) => s.name.toLowerCase().includes(q));
    return matchName || matchSub;
  });

  const activeCategory = categories.find((c) => c.id === selectedCategory) || categories[0];

  const handleAddSubcategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManage) {
      toastError('Permissão Negada', 'O teu perfil atual não tem permissão para adicionar categorias.');
      return;
    }
    if (!newSubcategoryName.trim()) {
      toastError('Campo Obrigatório', 'Insira o nome da nova subcategoria.');
      return;
    }

    const newSubId = newSubcategoryName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    setCategories((prev) =>
      prev.map((c) => {
        if (c.id === activeCategory.id) {
          return {
            ...c,
            subcategories: [
              ...c.subcategories,
              { id: newSubId, name: newSubcategoryName.trim(), slug: newSubId },
            ],
          };
        }
        return c;
      })
    );

    success('Subcategoria Adicionada', `"${newSubcategoryName}" adicionada à categoria ${activeCategory.name}.`);
    setNewSubcategoryName('');
    setShowAddModal(false);
  };

  const handleDeleteConfirmed = () => {
    if (!categoryToDelete) return;

    if (categoryToDelete.subId) {
      setCategories((prev) =>
        prev.map((c) => {
          if (c.id === categoryToDelete.catId) {
            return {
              ...c,
              subcategories: c.subcategories.filter((s) => s.id !== categoryToDelete.subId),
            };
          }
          return c;
        })
      );
      warning('Subcategoria Removida', `"${categoryToDelete.name}" foi removida do catálogo.`);
    }
    setCategoryToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="brand" size="sm">
              Taxonomia Oficial
            </Badge>
            <Badge variant="neutral" size="sm">
              {categories.length} Categorias Principais
            </Badge>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#191c1d] tracking-tight">
            Categorias & Subcategorias do Catálogo
          </h1>
          <p className="text-xs text-[#191c1d]/60 mt-0.5">
            Estrutura hierárquica oficial de produtos para navegação, filtros e recomendações na Zenza Shop.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            disabled={!canManage}
            onClick={() => setShowAddModal(true)}
          >
            + Nova Subcategoria
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-xl border border-[rgba(25,28,29,0.10)] flex items-center gap-3">
        <div className="w-full max-w-md">
          <Input
            placeholder="Filtrar categorias ou subcategorias..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftElement={<Search className="w-4 h-4 text-[#191c1d]/40" />}
            inputSize="sm"
          />
        </div>
        {!canManage && (
          <span className="text-xs text-amber-700 font-medium flex items-center gap-1.5 ml-auto">
            <Lock className="w-3.5 h-3.5" /> Modo Leitura (Apenas visualização)
          </span>
        )}
      </div>

      {/* Categories Hierarchy Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Main Categories List */}
        <div className="lg:col-span-4 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#191c1d]/50 px-1 block">
            Categorias Principais
          </span>
          <div className="bg-white rounded-2xl border border-[rgba(25,28,29,0.10)] overflow-hidden divide-y divide-[rgba(25,28,29,0.06)] shadow-xs">
            {filteredCategories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full p-3.5 flex items-center justify-between text-left transition-all ${
                    isSelected
                      ? 'bg-[#fff3ef] text-[#a63500] font-bold'
                      : 'hover:bg-[#f8f9fa] text-[#191c1d]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs shrink-0 ${
                        isSelected
                          ? 'bg-[#a63500] text-white'
                          : 'bg-[#f8f9fa] text-[#191c1d]/60 border border-[rgba(25,28,29,0.10)]'
                      }`}
                    >
                      <FolderTree className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate">{cat.name}</p>
                      <span className="text-[10px] text-[#191c1d]/50 font-normal">
                        {cat.subcategories.length} subcategorias
                      </span>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isSelected ? 'text-[#a63500] translate-x-0.5' : 'text-[#191c1d]/30'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Subcategories & Management Details */}
        <div className="lg:col-span-8 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="brand" size="sm">
                      {activeCategory?.id}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">
                    {activeCategory?.name}
                  </CardTitle>
                  <CardDescription>
                    Subdivisões oficiais da categoria {activeCategory?.name} na loja Zenza Shop Angola.
                  </CardDescription>
                </div>

                {canManage && (
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Plus className="w-3.5 h-3.5" />}
                    onClick={() => setShowAddModal(true)}
                  >
                    Adicionar Subcategoria
                  </Button>
                )}
              </div>
            </CardHeader>

            <div className="space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#191c1d]/50 block">
                Subcategorias Registadas ({activeCategory?.subcategories.length || 0})
              </span>

              {activeCategory?.subcategories.length === 0 ? (
                <div className="p-8 text-center bg-[#f8f9fa] rounded-xl border border-dashed border-[rgba(25,28,29,0.15)] text-xs text-[#191c1d]/60">
                  Nenhuma subcategoria registada para esta categoria.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeCategory?.subcategories.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-3 bg-[#fdfefe] border border-[rgba(25,28,29,0.10)] hover:border-[#ffb59c] rounded-xl flex items-center justify-between gap-2 transition-all shadow-2xs group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Tag className="w-4 h-4 text-[#a63500] shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#191c1d] truncate">
                            {sub.name}
                          </p>
                          <span className="text-[10px] font-mono text-[#191c1d]/50">
                            ID: {sub.id}
                          </span>
                        </div>
                      </div>

                      {canManage && (
                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() =>
                              setCategoryToDelete({
                                catId: activeCategory.id,
                                subId: sub.id,
                                name: sub.name,
                              })
                            }
                            className="p-1.5 text-[#191c1d]/40 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remover subcategoria"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Modal: Add Subcategory */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title={`Nova Subcategoria em ${activeCategory?.name}`}
        description="A subcategoria ficará imediatamente disponível para classificação de novos produtos."
      >
        <form onSubmit={handleAddSubcategory} className="space-y-4">
          <FormField
            id="subcat-name"
            label="Nome da Subcategoria"
            required
            hint="Ex: Calças de Linho, Perfumes Unissexo, Sapatilhas Urbanas"
          >
            <Input
              id="subcat-name"
              placeholder="Nome da subcategoria..."
              value={newSubcategoryName}
              onChange={(e) => setNewSubcategoryName(e.target.value)}
              autoFocus
            />
          </FormField>

          <div className="flex justify-end gap-2 pt-3 border-t border-[rgba(25,28,29,0.08)]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAddModal(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Criar Subcategoria
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete Subcategory (Dangerous Operation) */}
      <ConfirmDialog
        isOpen={Boolean(categoryToDelete)}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={handleDeleteConfirmed}
        title={`Eliminar Subcategoria "${categoryToDelete?.name}"?`}
        description="Esta ação removerá a subcategoria da taxonomia do catálogo. Os produtos associados precisarão de ser reclassificados."
        confirmLabel="Sim, Eliminar"
        cancelLabel="Cancelar"
        variant="danger"
      />
    </div>
  );
};
