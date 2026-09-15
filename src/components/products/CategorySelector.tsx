import React from 'react';
import { CATEGORIES_CATALOG } from '../../data/categoriesCatalog';
import { FormField } from '../ui/FormField';
import { Select } from '../ui/Select';
import { Badge } from '../ui/Badge';
import { Tag, FolderTree, AlertCircle } from 'lucide-react';

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
  const selectedCat = CATEGORIES_CATALOG.find((c) => c.id === category);
  const availableSubcategories = selectedCat?.subcategories || [];

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCatId = e.target.value;
    const catObj = CATEGORIES_CATALOG.find((c) => c.id === newCatId);
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

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category Field */}
        <FormField
          id="product-category"
          label="Categoria Principal"
          required
          error={errors.category}
          hint="Selecione a categoria oficial da taxonomia Zenza Shop"
        >
          <Select
            id="product-category"
            value={category}
            onChange={handleCategoryChange}
            disabled={disabled}
            error={errors.category}
            options={[
              { value: '', label: 'Selecione uma Categoria...', disabled: true },
              ...CATEGORIES_CATALOG.map((c) => ({
                value: c.id,
                label: c.name,
              })),
            ]}
          />
        </FormField>

        {/* Subcategory Field */}
        <FormField
          id="product-subcategory"
          label="Subcategoria"
          required={availableSubcategories.length > 0}
          error={errors.subcategory}
          hint={
            selectedCat
              ? `${availableSubcategories.length} subcategorias disponíveis em ${selectedCat.name}`
              : 'Selecione primeiro uma categoria principal'
          }
        >
          <Select
            id="product-subcategory"
            value={subcategory}
            onChange={handleSubcategoryChange}
            disabled={disabled || !category || availableSubcategories.length === 0}
            error={errors.subcategory}
            options={[
              { value: '', label: 'Selecione a Subcategoria...', disabled: true },
              ...availableSubcategories.map((s) => ({
                value: s.id,
                label: s.name,
              })),
            ]}
          />
        </FormField>
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
    </div>
  );
};
