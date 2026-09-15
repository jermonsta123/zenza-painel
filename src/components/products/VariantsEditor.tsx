import React, { useState } from 'react';
import { ProductColor, SizeCategory } from '../../types/product';
import { FormField } from '../ui/FormField';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Switch } from '../ui/FormControls';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Palette, Ruler, Plus, Trash2, Check, AlertCircle, Sparkles } from 'lucide-react';

interface VariantsEditorProps {
  colors: ProductColor[];
  onChangeColors: (colors: ProductColor[]) => void;
  sizes: string[];
  onChangeSizes: (sizes: string[]) => void;
  sizeCategory: SizeCategory;
  onChangeSizeCategory: (cat: SizeCategory) => void;
  hasSizeGuide: boolean;
  onChangeHasSizeGuide: (enabled: boolean) => void;
  disabled?: boolean;
}

const COLOR_PRESETS: { name: string; hex: string }[] = [
  { name: 'Terracota Zenza', hex: '#a63500' },
  { name: 'Vermelho Samakaka', hex: '#b91c1c' },
  { name: 'Azul Baía de Luanda', hex: '#1e3a8a' },
  { name: 'Dourado Kwanza', hex: '#d97706' },
  { name: 'Areia do Mussulo', hex: '#d4b996' },
  { name: 'Verde Huíla', hex: '#047857' },
  { name: 'Preto Grafite', hex: '#1f2937' },
  { name: 'Branco Neve', hex: '#ffffff' },
  { name: 'Cinza Platina', hex: '#9ca3af' },
];

const SIZE_PRESETS: Record<SizeCategory, string[]> = {
  clothing: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
  footwear: ['37', '38', '39', '40', '41', '42', '43', '44', '45'],
  accessories: ['Único', 'P/M', 'G/GG'],
  none: [],
};

export const VariantsEditor: React.FC<VariantsEditorProps> = ({
  colors,
  onChangeColors,
  sizes,
  onChangeSizes,
  sizeCategory,
  onChangeSizeCategory,
  hasSizeGuide,
  onChangeHasSizeGuide,
  disabled = false,
}) => {
  // Color State
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#a63500');
  const [colorError, setColorError] = useState('');

  // Size State
  const [newCustomSize, setNewCustomSize] = useState('');
  const [sizeError, setSizeError] = useState('');

  const handleAddColor = (nameToAdd = newColorName, hexToAdd = newColorHex) => {
    const trimmedName = nameToAdd.trim();
    if (!trimmedName) {
      setColorError('Introduza o nome da cor (ex: Azul Marinho).');
      return;
    }

    // Validate hex
    const isValidHex = /^#([0-9A-F]{3}){1,2}$/i.test(hexToAdd);
    if (!isValidHex) {
      setColorError('Código hexadecimal de cor inválido (ex: #1E3A8A).');
      return;
    }

    // Duplicate check
    if (colors.some((c) => c.name.toLowerCase() === trimmedName.toLowerCase())) {
      setColorError(`A cor "${trimmedName}" já está cadastrada.`);
      return;
    }

    setColorError('');
    const newColor: ProductColor = {
      id: `col-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      name: trimmedName,
      hex: hexToAdd,
    };

    onChangeColors([...colors, newColor]);
    setNewColorName('');
  };

  const handleRemoveColor = (id: string) => {
    onChangeColors(colors.filter((c) => c.id !== id));
  };

  const handleApplySizePreset = (cat: SizeCategory) => {
    onChangeSizeCategory(cat);
    if (cat !== 'none') {
      onChangeSizes(SIZE_PRESETS[cat]);
    } else {
      onChangeSizes([]);
    }
  };

  const handleAddSize = () => {
    const trimmed = newCustomSize.trim().toUpperCase();
    if (!trimmed) return;
    if (sizes.includes(trimmed)) {
      setSizeError(`O tamanho "${trimmed}" já está na lista.`);
      return;
    }
    setSizeError('');
    onChangeSizes([...sizes, trimmed]);
    setNewCustomSize('');
  };

  const handleRemoveSize = (sizeToRemove: string) => {
    onChangeSizes(sizes.filter((s) => s !== sizeToRemove));
  };

  return (
    <div className="space-y-6">
      {/* 1. Colors Variant Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#191c1d] flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-[#a63500]" />
              Variações de Cor ({colors.length})
            </h4>
            <p className="text-[11px] text-[#191c1d]/60">
              Cores disponíveis com amostra visual (*swatches*) para o cliente escolher na loja.
            </p>
          </div>

          {/* Quick Color Presets */}
          <div className="flex flex-wrap items-center gap-1.5">
            {COLOR_PRESETS.slice(0, 5).map((preset) => {
              const isAdded = colors.some((c) => c.hex === preset.hex);
              return (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleAddColor(preset.name, preset.hex)}
                  disabled={disabled || isAdded}
                  className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border transition-all ${
                    isAdded
                      ? 'opacity-40 cursor-not-allowed bg-gray-100'
                      : 'bg-white hover:border-[#a63500] hover:text-[#a63500] text-[#191c1d]'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-black/15 shrink-0"
                    style={{ backgroundColor: preset.hex }}
                  />
                  {preset.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Color Creator Row */}
        <div className="p-3 bg-[#f8f9fa] rounded-xl border border-[rgba(25,28,29,0.10)] space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
            <div className="sm:col-span-6">
              <Input
                id="new-color-name"
                inputSize="sm"
                placeholder="Nome da Cor (ex: Azul Noite Luanda)"
                value={newColorName}
                onChange={(e) => {
                  setNewColorName(e.target.value);
                  if (colorError) setColorError('');
                }}
                disabled={disabled}
              />
            </div>
            <div className="sm:col-span-4 flex items-center gap-2">
              <input
                type="color"
                value={newColorHex}
                onChange={(e) => setNewColorHex(e.target.value)}
                disabled={disabled}
                className="w-8 h-8 rounded-lg cursor-pointer border border-[rgba(25,28,29,0.15)] p-0.5 shrink-0"
                title="Escolher Cor"
              />
              <Input
                id="new-color-hex"
                inputSize="sm"
                placeholder="#A63500"
                value={newColorHex}
                onChange={(e) => setNewColorHex(e.target.value)}
                disabled={disabled}
                className="font-mono"
              />
            </div>
            <div className="sm:col-span-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                fullWidth
                onClick={() => handleAddColor()}
                disabled={disabled || !newColorName.trim()}
                leftIcon={<Plus className="w-3.5 h-3.5 text-[#a63500]" />}
              >
                Adicionar
              </Button>
            </div>
          </div>

          {colorError && (
            <p className="text-xs font-semibold text-red-600 flex items-center gap-1" role="alert">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {colorError}
            </p>
          )}
        </div>

        {/* Registered Colors List */}
        {colors.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <div
                key={color.id}
                className="flex items-center gap-2 pl-2 pr-1.5 py-1 bg-white rounded-lg border border-[rgba(25,28,29,0.12)] shadow-2xs text-xs font-medium text-[#191c1d]"
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0"
                  style={{ backgroundColor: color.hex }}
                />
                <span>{color.name}</span>
                <span className="text-[10px] text-[#191c1d]/40 font-mono">({color.hex})</span>
                <button
                  type="button"
                  onClick={() => handleRemoveColor(color.id)}
                  disabled={disabled}
                  className="p-1 text-[#191c1d]/40 hover:text-red-600 rounded transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-3 bg-white rounded-lg border border-[rgba(25,28,29,0.08)] text-center text-xs text-[#191c1d]/50">
            Nenhuma cor configurada. O produto será exibido com a cor padrão da foto.
          </div>
        )}
      </div>

      {/* 2. Sizes Variant Section */}
      <div className="space-y-4 pt-4 border-t border-[rgba(25,28,29,0.08)]">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#191c1d] flex items-center gap-1.5">
            <Ruler className="w-4 h-4 text-[#a63500]" />
            Tamanhos & Dimensões
          </h4>
          <p className="text-[11px] text-[#191c1d]/60 mt-0.5">
            Grade de tamanhos para vestuário, calçado ou dimensões específicas.
          </p>
        </div>

        {/* Size Category Preset Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'clothing', label: 'Vestuário (S, M, L...)' },
            { id: 'footwear', label: 'Calçado (38, 39, 40...)' },
            { id: 'accessories', label: 'Acessórios / Único' },
            { id: 'none', label: 'Sem Tamanhos' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleApplySizePreset(cat.id as SizeCategory)}
              disabled={disabled}
              className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                sizeCategory === cat.id
                  ? 'bg-[#fff3ef] border-[#ffb59c] text-[#a63500] ring-1 ring-[#a63500]'
                  : 'bg-white border-[rgba(25,28,29,0.12)] text-[#191c1d] hover:border-[#a63500]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Size Chips & Custom Adder */}
        {sizeCategory !== 'none' && (
          <div className="space-y-3 p-3 bg-white rounded-xl border border-[rgba(25,28,29,0.10)]">
            <div className="flex items-center gap-2">
              <Input
                id="custom-size-input"
                inputSize="sm"
                placeholder="Adicionar tamanho manual (ex: 46 ou XL)"
                value={newCustomSize}
                onChange={(e) => {
                  setNewCustomSize(e.target.value);
                  if (sizeError) setSizeError('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSize();
                  }
                }}
                disabled={disabled}
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleAddSize}
                disabled={disabled || !newCustomSize.trim()}
              >
                + Inserir
              </Button>
            </div>

            {sizeError && (
              <p className="text-xs font-semibold text-red-600" role="alert">
                {sizeError}
              </p>
            )}

            {/* Active sizes chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {sizes.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#f8f9fa] border border-[rgba(25,28,29,0.12)] text-xs font-bold text-[#191c1d]"
                >
                  {s}
                  <button
                    type="button"
                    onClick={() => handleRemoveSize(s)}
                    disabled={disabled}
                    className="text-[#191c1d]/40 hover:text-red-600 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Size Guide Switch */}
        {sizeCategory !== 'none' && (
          <div className="p-3 bg-[#f8f9fa] rounded-xl border border-[rgba(25,28,29,0.08)]">
            <Switch
              id="has-size-guide-toggle"
              label="Exibir Guia de Medidas na Loja"
              description="Mostra aos clientes o botão e tabela de correspondência de medidas angolana/europeia."
              checked={hasSizeGuide}
              onChange={(e) => onChangeHasSizeGuide(e.target.checked)}
              disabled={disabled}
            />
          </div>
        )}
      </div>
    </div>
  );
};
