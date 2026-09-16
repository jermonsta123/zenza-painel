'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Modal, ConfirmDialog } from '../components/ui/Modal';
import { FormField } from '../components/ui/FormField';
import { useCategories } from '../context/CategoriesContext';
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
  Lock,
  RotateCcw,
  Info
} from 'lucide-react';

export const CategoriesView: React.FC = () => {
  const { success, warning, info, error: toastError } = useToast();
  const { can } = useAuth();
  const {
    categories,
    addMainCategory,
    updateCategory,
    deleteCategory,
    addSubcategory,
    deleteSubcategory,
    resetToDefault,
  } = useCategories();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(categories[0]?.id || '');
  
  // Modals
  const [showAddMainModal, setShowAddMainModal] = useState(false);
  const [mainCatName, setMainCatName] = useState('');
  const [mainCatSlug, setMainCatSlug] = useState('');
  const [mainCatDesc, setMainCatDesc] = useState('');
  const [mainCatInitialSub, setMainCatInitialSub] = useState('');

  const [showAddSubModal, setShowAddSubModal] = useState(false);
  const [newSubcategoryName, setNewSubcategoryName] = useState('');

  const [editingCategory, setEditingCategory] = useState<{ id: string; name: string; description: string; slug: string } | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{
    type: 'main' | 'sub';
    catId: string;
    subId?: string;
    name: string;
  } | null>(null);

  const canManage = can('manage_categories');

  const filteredCategories = categories.filter((cat) => {
    const q = searchQuery.toLowerCase();
    const matchName = cat.name.toLowerCase().includes(q);
    const matchSub = cat.subcategories.some((s) => s.name.toLowerCase().includes(q));
    return matchName || matchSub;
  });

  const activeCategory =
    categories.find((c) => c.id === selectedCategoryId) ||
    filteredCategories[0] ||
    categories[0];

  const handleSlugify = (text: string) =>
    text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

  const handleCreateMainCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManage) {
      toastError('Permissão Negada', 'O teu perfil atual não tem permissão para gerir categorias.');
      return;
    }
    if (!mainCatName.trim()) {
      toastError('Nome Obrigatório', 'Introduza o nome da nova categoria principal.');
      return;
    }

    const created = addMainCategory({
      name: mainCatName.trim(),
      slug: mainCatSlug.trim() || undefined,
      description: mainCatDesc.trim() || undefined,
      initialSubcategory: mainCatInitialSub.trim() || undefined,
    });

    setSelectedCategoryId(created.id);
    success('Categoria Principal Criada', `A categoria "${created.name}" foi criada com sucesso.`);
    setMainCatName('');
    setMainCatSlug('');
    setMainCatDesc('');
    setMainCatInitialSub('');
    setShowAddMainModal(false);
  };

  const handleUpdateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    if (!editingCategory.name.trim()) {
      toastError('Nome Obrigatório', 'O nome da categoria não pode estar vazio.');
      return;
    }

    updateCategory(editingCategory.id, {
      name: editingCategory.name,
      description: editingCategory.description,
      slug: editingCategory.slug,
    });

    success('Categoria Atualizada', `"${editingCategory.name}" foi atualizada com sucesso.`);
    setEditingCategory(null);
  };

  const handleAddSubcategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManage) {
      toastError('Permissão Negada', 'O teu perfil atual não tem permissão para adicionar subcategorias.');
      return;
    }
    if (!activeCategory) return;
    if (!newSubcategoryName.trim()) {
      toastError('Campo Obrigatório', 'Insira o nome da nova subcategoria.');
      return;
    }

    addSubcategory(activeCategory.id, newSubcategoryName.trim());
    success('Subcategoria Adicionada', `"${newSubcategoryName}" adicionada à categoria ${activeCategory.name}.`);
    setNewSubcategoryName('');
    setShowAddSubModal(false);
  };

  const handleDeleteConfirmed = () => {
    if (!itemToDelete) return;

    if (itemToDelete.type === 'sub' && itemToDelete.subId) {
      deleteSubcategory(itemToDelete.catId, itemToDelete.subId);
      warning('Subcategoria Removida', `"${itemToDelete.name}" foi removida do catálogo.`);
    } else if (itemToDelete.type === 'main') {
      deleteCategory(itemToDelete.catId);
      warning('Categoria Principal Removida', `A categoria "${itemToDelete.name}" e as suas subcategorias foram removidas.`);
      const remaining = categories.filter((c) => c.id !== itemToDelete.catId);
      if (remaining.length > 0) {
        setSelectedCategoryId(remaining[0].id);
      }
    }
    setItemToDelete(null);
  };

  const totalSubcategories = categories.reduce((acc, c) => acc + c.subcategories.length, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="brand" size="sm">
              Taxonomia Zenza Shop
            </Badge>
            <Badge variant="neutral" size="sm">
              {categories.length} Categorias Principais
            </Badge>
            <Badge variant="neutral" size="sm">
              {totalSubcategories} Subcategorias
            </Badge>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#191c1d] tracking-tight">
            Categorias & Subcategorias do Catálogo
          </h1>
          <p className="text-xs text-[#191c1d]/60 mt-0.5">
            Adicione e organize categorias principais e subcategorias para o catálogo da sua loja em Angola.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Nova Categoria Principal Button */}
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            disabled={!canManage}
            onClick={() => setShowAddMainModal(true)}
          >
            + Nova Categoria Principal
          </Button>

          {/* Nova Subcategoria Button */}
          {activeCategory && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              disabled={!canManage}
              onClick={() => setShowAddSubModal(true)}
            >
              + Nova Subcategoria
            </Button>
          )}
        </div>
      </div>

      {/* Search and Helper Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-xl border border-[rgba(25,28,29,0.10)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="w-full max-w-md">
          <Input
            placeholder="Filtrar categorias principais ou subcategorias..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftElement={<Search className="w-4 h-4 text-[#191c1d]/40" />}
            inputSize="sm"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (confirm('Deseja restaurar as categorias padrão da Zenza Shop?')) {
                resetToDefault();
                info('Catálogo Restaurado', 'As categorias originais foram restauradas.');
              }
            }}
            className="text-[11px] text-[#191c1d]/60 hover:text-[#a63500] flex items-center gap-1 font-medium transition-colors"
            title="Restaurar categorias iniciais de fábrica"
          >
            <RotateCcw className="w-3 h-3" />
            Restaurar Padrões
          </button>

          {!canManage && (
            <span className="text-xs text-amber-700 font-medium flex items-center gap-1.5 ml-auto">
              <Lock className="w-3.5 h-3.5" /> Modo Leitura
            </span>
          )}
        </div>
      </div>

      {/* Categories Hierarchy Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Main Categories List */}
        <div className="lg:col-span-4 space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#191c1d]/50 block">
              Categorias Principais ({filteredCategories.length})
            </span>
            {canManage && (
              <button
                type="button"
                onClick={() => setShowAddMainModal(true)}
                className="text-[11px] font-bold text-[#a63500] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Criar Principal
              </button>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-[rgba(25,28,29,0.10)] overflow-hidden divide-y divide-[rgba(25,28,29,0.06)] shadow-xs">
            {filteredCategories.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#191c1d]/50">
                Nenhuma categoria encontrada para "{searchQuery}".
              </div>
            ) : (
              filteredCategories.map((cat) => {
                const isSelected = activeCategory?.id === cat.id;
                return (
                  <div
                    key={cat.id}
                    className={`w-full p-3.5 flex items-center justify-between text-left transition-all ${
                      isSelected
                        ? 'bg-[#fff3ef] text-[#a63500]'
                        : 'hover:bg-[#f8f9fa] text-[#191c1d]'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedCategoryId(cat.id)}
                      className="flex items-center gap-3 min-w-0 flex-1 text-left"
                    >
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
                        <p className={`text-xs truncate ${isSelected ? 'font-extrabold' : 'font-semibold'}`}>
                          {cat.name}
                        </p>
                        <span className="text-[10px] text-[#191c1d]/50 font-normal">
                          {cat.subcategories.length} subcategorias
                        </span>
                      </div>
                    </button>

                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      {canManage && (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              setEditingCategory({
                                id: cat.id,
                                name: cat.name,
                                description: cat.description || '',
                                slug: cat.slug || cat.id,
                              })
                            }
                            className="p-1 text-[#191c1d]/40 hover:text-[#a63500] hover:bg-white rounded transition-colors"
                            title="Editar categoria principal"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setItemToDelete({
                                type: 'main',
                                catId: cat.id,
                                name: cat.name,
                              })
                            }
                            className="p-1 text-[#191c1d]/40 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Eliminar categoria principal"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                      <ChevronRight
                        className={`w-4 h-4 shrink-0 transition-transform ${
                          isSelected ? 'text-[#a63500] translate-x-0.5' : 'text-[#191c1d]/30'
                        }`}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Subcategories & Management Details */}
        <div className="lg:col-span-8 space-y-4">
          {activeCategory ? (
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Badge variant="brand" size="sm">
                        Categoria Principal: {activeCategory.name}
                      </Badge>
                      <span className="text-[10px] font-mono text-[#191c1d]/50 bg-[#f8f9fa] px-2 py-0.5 rounded border border-[rgba(25,28,29,0.08)]">
                        ID: {activeCategory.id}
                      </span>
                    </div>
                    <CardTitle className="text-xl text-[#191c1d]">
                      {activeCategory.name}
                    </CardTitle>
                    <CardDescription>
                      {activeCategory.description ||
                        `Subdivisões e departamentos oficiais da categoria ${activeCategory.name} na loja Zenza Shop.`}
                    </CardDescription>
                  </div>

                  {canManage && (
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="primary"
                        size="sm"
                        leftIcon={<Plus className="w-3.5 h-3.5" />}
                        onClick={() => setShowAddSubModal(true)}
                      >
                        + Nova Subcategoria
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                        onClick={() =>
                          setEditingCategory({
                            id: activeCategory.id,
                            name: activeCategory.name,
                            description: activeCategory.description || '',
                            slug: activeCategory.slug || activeCategory.id,
                          })
                        }
                      >
                        Editar
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>

              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[rgba(25,28,29,0.06)] pb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#191c1d]/60 block">
                    Subcategorias de {activeCategory.name} ({activeCategory.subcategories.length})
                  </span>
                  {activeCategory.subcategories.length > 0 && (
                    <span className="text-[11px] text-[#191c1d]/50">
                      Utilizadas no cadastro de produtos para segmentação precisa
                    </span>
                  )}
                </div>

                {activeCategory.subcategories.length === 0 ? (
                  <div className="p-8 text-center bg-[#f8f9fa] rounded-2xl border border-dashed border-[rgba(25,28,29,0.15)] text-xs text-[#191c1d]/60 space-y-3">
                    <p>Nenhuma subcategoria registada ainda para <strong>{activeCategory.name}</strong>.</p>
                    {canManage && (
                      <Button
                        variant="primary"
                        size="sm"
                        leftIcon={<Plus className="w-3.5 h-3.5" />}
                        onClick={() => setShowAddSubModal(true)}
                      >
                        Adicionar Primeira Subcategoria
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeCategory.subcategories.map((sub) => (
                      <div
                        key={sub.id}
                        className="p-3.5 bg-[#fdfefe] border border-[rgba(25,28,29,0.10)] hover:border-[#ffb59c] rounded-xl flex items-center justify-between gap-2 transition-all shadow-2xs group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-[#fff3ef] text-[#a63500] flex items-center justify-center shrink-0">
                            <Tag className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-[#191c1d] truncate">
                              {sub.name}
                            </p>
                            <span className="text-[10px] font-mono text-[#191c1d]/50 block">
                              slug: {sub.slug || sub.id}
                            </span>
                          </div>
                        </div>

                        {canManage && (
                          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() =>
                                setItemToDelete({
                                  type: 'sub',
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
          ) : (
            <Card>
              <div className="p-8 text-center text-xs text-[#191c1d]/50">
                Selecione ou crie uma categoria principal para gerir subcategorias.
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Modal: CRIAR NOVA CATEGORIA PRINCIPAL */}
      <Modal
        isOpen={showAddMainModal}
        onClose={() => setShowAddMainModal(false)}
        title="Criar Nova Categoria Principal"
        size="md"
      >
        <form onSubmit={handleCreateMainCategory} className="space-y-4">
          <div className="p-3 bg-[#fff3ef] rounded-xl border border-[#ffb59c]/50 flex items-start gap-2.5 text-xs text-[#191c1d]">
            <Sparkles className="w-4 h-4 text-[#a63500] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#a63500] block">Nova Secção do Catálogo Zenza Shop</span>
              <p className="text-[#191c1d]/70 text-[11px] mt-0.5">
                A nova categoria principal aparecerá imediatamente no menu de navegação, nos filtros de busca e no formulário de cadastro de novos produtos.
              </p>
            </div>
          </div>

          <FormField
            id="main-cat-name"
            label="Nome da Categoria Principal"
            required
            hint="Ex: Artigos para Bebé & Criança, Desporto & Lazer, Cosméticos Naturais"
          >
            <Input
              id="main-cat-name"
              placeholder="Ex: Artigos para Bebé & Criança"
              value={mainCatName}
              onChange={(e) => {
                const val = e.target.value;
                setMainCatName(val);
                if (!mainCatSlug || mainCatSlug === handleSlugify(mainCatName)) {
                  setMainCatSlug(handleSlugify(val));
                }
              }}
              autoFocus
            />
          </FormField>

          <FormField
            id="main-cat-slug"
            label="Identificador / Slug URL"
            hint="Identificador único para URLs amigáveis (auto-gerado)"
          >
            <Input
              id="main-cat-slug"
              placeholder="artigos-bebe-crianca"
              value={mainCatSlug}
              onChange={(e) => setMainCatSlug(handleSlugify(e.target.value))}
            />
          </FormField>

          <FormField
            id="main-cat-desc"
            label="Descrição da Categoria (Opcional)"
            hint="Aparecerá nos detalhes da categoria e na documentação do catálogo"
          >
            <Input
              id="main-cat-desc"
              placeholder="Ex: Roupas de recém-nascido, calçados infantis e acessórios"
              value={mainCatDesc}
              onChange={(e) => setMainCatDesc(e.target.value)}
            />
          </FormField>

          <FormField
            id="main-cat-sub"
            label="Subcategoria Inicial (Opcional)"
            hint="Já pode criar a primeira subcategoria para esta secção"
          >
            <Input
              id="main-cat-sub"
              placeholder="Ex: Roupas de Bebé 0-24 Meses"
              value={mainCatInitialSub}
              onChange={(e) => setMainCatInitialSub(e.target.value)}
            />
          </FormField>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[rgba(25,28,29,0.10)]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAddMainModal(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Criar Categoria Principal
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: EDITAR CATEGORIA PRINCIPAL */}
      {editingCategory && (
        <Modal
          isOpen={Boolean(editingCategory)}
          onClose={() => setEditingCategory(null)}
          title={`Editar Categoria "${editingCategory.name}"`}
          size="md"
        >
          <form onSubmit={handleUpdateCategory} className="space-y-4">
            <FormField
              id="edit-cat-name"
              label="Nome da Categoria"
              required
            >
              <Input
                id="edit-cat-name"
                value={editingCategory.name}
                onChange={(e) =>
                  setEditingCategory({ ...editingCategory, name: e.target.value })
                }
              />
            </FormField>

            <FormField
              id="edit-cat-slug"
              label="Slug da Categoria"
            >
              <Input
                id="edit-cat-slug"
                value={editingCategory.slug}
                onChange={(e) =>
                  setEditingCategory({ ...editingCategory, slug: handleSlugify(e.target.value) })
                }
              />
            </FormField>

            <FormField
              id="edit-cat-desc"
              label="Descrição"
            >
              <Input
                id="edit-cat-desc"
                value={editingCategory.description}
                onChange={(e) =>
                  setEditingCategory({ ...editingCategory, description: e.target.value })
                }
              />
            </FormField>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[rgba(25,28,29,0.10)]">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setEditingCategory(null)}
              >
                Cancelar
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Guardar Alterações
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal: ADD SUBCATEGORY */}
      {activeCategory && (
        <Modal
          isOpen={showAddSubModal}
          onClose={() => setShowAddSubModal(false)}
          title={`Nova Subcategoria em "${activeCategory.name}"`}
          size="sm"
        >
          <form onSubmit={handleAddSubcategory} className="space-y-4">
            <FormField
              id="subcat-name"
              label="Nome da Subcategoria"
              required
              hint={`Ficará associada a ${activeCategory.name}`}
            >
              <Input
                id="subcat-name"
                placeholder="Ex: Calças de Linho, Sapatilhas Urbanas"
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
                onClick={() => setShowAddSubModal(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Adicionar Subcategoria
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(itemToDelete)}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleDeleteConfirmed}
        title={
          itemToDelete?.type === 'main'
            ? `Eliminar Categoria Principal "${itemToDelete?.name}"?`
            : `Eliminar Subcategoria "${itemToDelete?.name}"?`
        }
        description={
          itemToDelete?.type === 'main'
            ? `Esta ação removerá a categoria principal "${itemToDelete?.name}" e todas as subcategorias pertencentes a ela do catálogo da Zenza Shop. Esta ação é irreversível.`
            : `Esta ação removerá a subcategoria "${itemToDelete?.name}" da taxonomia. Os produtos com esta subcategoria precisarão de ser reclassificados.`
        }
        confirmLabel="Sim, Eliminar"
        cancelLabel="Cancelar"
        variant="destructive"
      />
    </div>
  );
};
