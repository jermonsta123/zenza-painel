import React, { useState } from 'react';
import { useCategories } from '../../context/CategoriesContext';
import { FormField } from '../ui/FormField';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { FolderTree, Plus, Sparkles, Tag } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface CategorySelectorProps {
  category: string;
  subcategory: string;
  onChangeCategory: (categoryId: string, categoryName: string) => void;
  onChangeSubcategory: (subcategoryId: string, subcategoryName: string) => void;
  errors?: {
    category?: string;
    subcategory?: string;
  };
  disabled?: boolean;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  category,
  subcategory,
  onChangeCategory,
  onChangeSubcategory,
  errors,
  disabled = false,
}) => {
  const { categories, addMainCategory, addSubcategory } = useCategories();
  const { success, error: toastError } = useToast();

  const [showAddCatModal, setShowAddCatModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newInitialSub, setNewInitialSub] = useState('');

  const [showAddSubModal, setShowAddSubModal] = useState(false);
  const [newSubName, setNewSubName] = useState('');

  const selectedCat = categories.find((c) => c.id === category);
  const availableSubcategories = selectedCat?.subcategories || [];

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCatId = e.target.value;
    const catObj = categories.find((c) => c.id === newCatId);
    if (catObj) {
      onChangeCategory(catObj.id, catObj.name);
      // Automatically select the first subcategory or clear if none
      if (catObj.subcategories.length > 0) {
        onChangeSubcategory(catObj.subcategories[0].id, catObj.subcategories[0].name);
      } else {
        onChangeSubcategory('', '');
      }
    } else {
      onChangeCategory('', '');
      onChangeSubcategory('', '');
    }
  };

  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSubId = e.target.value;
    const subObj = availableSubcategories.find((s) => s.id === newSubId);
    if (subObj) {
      onChangeSubcategory(subObj.id, subObj.name);
    } else {
      onChangeSubcategory('', '');
    }
  };

  const handleCreateMainCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      toastError('Nome Obrigatório', 'Introduza o nome da nova categoria principal.');
      return;
    }

    const created = addMainCategory({
      name: newCatName.trim(),
      description: newCatDesc.trim(),
      initialSubcategory: newInitialSub.trim() || undefined,
    });

    onChangeCategory(created.id, created.name);
    if (created.subcategories.length > 0) {
      onChangeSubcategory(created.subcategories[0].id, created.subcategories[0].name);
    } else {
      onChangeSubcategory('', '');
    }

    success('Categoria Principal Criada', `"${created.name}" foi adicionada e selecionada para este produto.`);
    setNewCatName('');
    setNewCatDesc('');
    setNewInitialSub('');
    setShowAddCatModal(false);
  };

  const handleCreateSubcategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCat) return;
    if (!newSubName.trim()) {
      toastError('Nome Obrigatório', 'Introduza o nome da nova subcategoria.');
      return;
    }

    addSubcategory(selectedCat.id, newSubName.trim());
    success('Subcategoria Criada', `"${newSubName}" adicionada à categoria ${selectedCat.name}.`);
    setNewSubName('');
    setShowAddSubModal(false);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category Field */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold text-[#191c1d]">
              Categoria Principal <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => setShowAddCatModal(true)}
              className="text-[11px] font-bold text-[#a63500] hover:underline flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              + Nova Categoria
            </button>
          </div>
          <Select
            id="product-category"
            value={category}
            onChange={handleCategoryChange}
            disabled={disabled}
            error={errors?.category}
            options={[
              { value: '', label: 'Selecione uma Categoria...', disabled: true },
              ...categories.map((c) => ({
                value: c.id,
                label: c.name,
              })),
            ]}
          />
          {errors?.category && (
            <p className="text-xs font-medium text-red-600 mt-1">{errors.category}</p>
          )}
          <p className="text-[11px] text-[#191c1d]/50 mt-1">
            Selecione a categoria oficial da taxonomia Zenza Shop
          </p>
        </div>

        {/* Subcategory Field */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold text-[#191c1d]">
              Subcategoria {availableSubcategories.length > 0 && <span className="text-red-500">*</span>}
            </label>
            {selectedCat && (
              <button
                type="button"
                onClick={() => setShowAddSubModal(true)}
                className="text-[11px] font-bold text-[#a63500] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                + Nova Subcategoria
              </button>
            )}
          </div>
          <Select
            id="product-subcategory"
            value={subcategory}
            onChange={handleSubcategoryChange}
            disabled={disabled || !category || availableSubcategories.length === 0}
            error={errors?.subcategory}
            options={[
              { value: '', label: 'Selecione a Subcategoria...', disabled: true },
              ...availableSubcategories.map((s) => ({
                value: s.id,
                label: s.name,
              })),
            ]}
          />
          {errors?.subcategory && (
            <p className="text-xs font-medium text-red-600 mt-1">{errors.subcategory}</p>
          )}
          <p className="text-[11px] text-[#191c1d]/50 mt-1">
            {selectedCat
              ? `${availableSubcategories.length} subcategorias disponíveis em ${selectedCat.name}`
              : 'Selecione primeiro uma categoria principal'}
          </p>
        </div>
      </div>

      {/* Category info context pill */}
      {selectedCat && (
        <div className="p-3 bg-[#fff3ef] rounded-lg border border-[#ffb59c]/50 flex items-start gap-2.5 text-xs">
          <FolderTree className="w-4 h-4 text-[#a63500] shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <span className="font-semibold text-[#a63500]">
              Taxonomia: {selectedCat.name}
              {subcategory && ` → ${availableSubcategories.find((s) => s.id === subcategory)?.name || subcategory}`}
            </span>
            {selectedCat.description && (
              <span className="text-[#191c1d]/70 text-[11px] mt-0.5">
                {selectedCat.description}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Modal: Adicionar Categoria Principal On-The-Fly */}
      <Modal
        isOpen={showAddCatModal}
        onClose={() => setShowAddCatModal(false)}
        title="Criar Nova Categoria Principal"
        size="md"
      >
        <form onSubmit={handleCreateMainCategory} className="space-y-4">
          <p className="text-xs text-[#191c1d]/60">
            Adicione uma nova categoria principal à loja Zenza Shop Angola. Ficará imediatamente disponível para associar a produtos e filtros.
          </p>

          <FormField
            id="new-cat-name"
            label="Nome da Categoria Principal"
            required
            hint="Ex: Artigos para Bebé & Criança, Desporto & Fitness, etc."
          >
            <Input
              id="new-cat-name"
              placeholder="Ex: Artigos para Bebé & Criança"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              autoFocus
            />
          </FormField>

          <FormField
            id="new-cat-desc"
            label="Descrição da Categoria (Opcional)"
            hint="Breve explicação sobre os produtos desta seção"
          >
            <Input
              id="new-cat-desc"
              placeholder="Ex: Roupas infantis, calçados e brinquedos didáticos"
              value={newCatDesc}
              onChange={(e) => setNewCatDesc(e.target.value)}
            />
          </FormField>

          <FormField
            id="new-cat-initial-sub"
            label="Primeira Subcategoria (Opcional)"
            hint="Crie já uma subcategoria para começar"
          >
            <Input
              id="new-cat-initial-sub"
              placeholder="Ex: Roupa de Bebé 0-24M"
              value={newInitialSub}
              onChange={(e) => setNewInitialSub(e.target.value)}
            />
          </FormField>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[rgba(25,28,29,0.10)]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAddCatModal(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Criar e Selecionar
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Adicionar Subcategoria */}
      {selectedCat && (
        <Modal
          isOpen={showAddSubModal}
          onClose={() => setShowAddSubModal(false)}
          title={`Adicionar Subcategoria em "${selectedCat.name}"`}
          size="sm"
        >
          <form onSubmit={handleCreateSubcategory} className="space-y-4">
            <FormField
              id="inline-new-sub"
              label="Nome da Subcategoria"
              required
              hint={`Ficará agrupada dentro de ${selectedCat.name}`}
            >
              <Input
                id="inline-new-sub"
                placeholder="Ex: Sapatilhas de Corrida"
                value={newSubName}
                onChange={(e) => setNewSubName(e.target.value)}
                autoFocus
              />
            </FormField>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[rgba(25,28,29,0.10)]">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowAddSubModal(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Adicionar Subcategoria
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

