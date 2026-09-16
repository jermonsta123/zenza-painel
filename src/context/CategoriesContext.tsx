'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CATEGORIES_CATALOG, CategoryDefinition } from '../data/categoriesCatalog';

interface CategoriesContextType {
  categories: CategoryDefinition[];
  addMainCategory: (data: {
    name: string;
    description?: string;
    slug?: string;
    initialSubcategory?: string;
  }) => CategoryDefinition;
  updateCategory: (
    categoryId: string,
    data: { name: string; description?: string; slug?: string }
  ) => void;
  deleteCategory: (categoryId: string) => void;
  addSubcategory: (categoryId: string, name: string) => void;
  deleteSubcategory: (categoryId: string, subcategoryId: string) => void;
  resetToDefault: () => void;
}

const STORAGE_KEY = 'zenza_shop_categories_catalog_v1';

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export const CategoriesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<CategoryDefinition[]>(CATEGORIES_CATALOG);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCategories(parsed);
        }
      }
    } catch {
      // Fallback to default catalog
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Sync to localStorage whenever categories change
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
    } catch {
      // Ignore quota errors
    }
  }, [categories, isHydrated]);

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

  const addMainCategory = ({
    name,
    description,
    slug,
    initialSubcategory,
  }: {
    name: string;
    description?: string;
    slug?: string;
    initialSubcategory?: string;
  }): CategoryDefinition => {
    const cleanName = name.trim();
    const finalSlug = (slug?.trim() || slugify(cleanName)) || `cat-${Date.now()}`;
    const id = finalSlug.replace(/-/g, '_');

    const subcategories: CategoryDefinition['subcategories'] = [];
    if (initialSubcategory && initialSubcategory.trim()) {
      const subName = initialSubcategory.trim();
      const subSlug = slugify(subName);
      subcategories.push({
        id: subSlug.replace(/-/g, '_'),
        name: subName,
        slug: subSlug,
      });
    }

    const newCategory: CategoryDefinition = {
      id,
      name: cleanName,
      slug: finalSlug,
      description: description?.trim() || '',
      subcategories,
    };

    setCategories((prev) => [newCategory, ...prev]);
    return newCategory;
  };

  const updateCategory = (
    categoryId: string,
    data: { name: string; description?: string; slug?: string }
  ) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id === categoryId) {
          return {
            ...c,
            name: data.name.trim() || c.name,
            description: data.description !== undefined ? data.description.trim() : c.description,
            slug: data.slug?.trim() || c.slug,
          };
        }
        return c;
      })
    );
  };

  const deleteCategory = (categoryId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
  };

  const addSubcategory = (categoryId: string, name: string) => {
    const cleanName = name.trim();
    if (!cleanName) return;

    const subSlug = slugify(cleanName);
    const subId = `${subSlug.replace(/-/g, '_')}_${Math.floor(100 + Math.random() * 900)}`;

    setCategories((prev) =>
      prev.map((c) => {
        if (c.id === categoryId) {
          return {
            ...c,
            subcategories: [
              ...c.subcategories,
              { id: subId, name: cleanName, slug: subSlug },
            ],
          };
        }
        return c;
      })
    );
  };

  const deleteSubcategory = (categoryId: string, subcategoryId: string) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id === categoryId) {
          return {
            ...c,
            subcategories: c.subcategories.filter((s) => s.id !== subcategoryId),
          };
        }
        return c;
      })
    );
  };

  const resetToDefault = () => {
    setCategories(CATEGORIES_CATALOG);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        addMainCategory,
        updateCategory,
        deleteCategory,
        addSubcategory,
        deleteSubcategory,
        resetToDefault,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error('useCategories deve ser utilizado dentro de CategoriesProvider');
  }
  return context;
};
