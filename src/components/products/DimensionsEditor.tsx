'use client';

import React from 'react';
import { ProductDimensions } from '../../types/product';
import { FormField } from '../ui/FormField';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Badge } from '../ui/Badge';
import { Ruler, Scale, Box, Truck, Sparkles } from 'lucide-react';

interface DimensionsEditorProps {
  dimensions?: ProductDimensions;
  onChange: (dims: ProductDimensions) => void;
  error?: string;
}

const PACKAGE_OPTIONS = [
  { value: 'Caixa Standard Zenza', label: 'Caixa Standard Zenza (Papelão Kraft Rígido)' },
  { value: 'Caixa Calçado Especial', label: 'Caixa Calçado Especial (Com ventilação)' },
  { value: 'Estojo Rígido de Luxo', label: 'Estojo Rígido de Luxo (Joias / Relógios / Óculos)' },
  { value: 'Saco Envio Selado Zenza', label: 'Saco Envio Selado Impermeável (Vestuário)' },
  { value: 'Envelope Bolha Acolchoado', label: 'Envelope Bolha Acolchoado (Pequenos acessórios)' },
  { value: 'Embalagem Especial com Espuma', label: 'Embalagem Especial com Espuma (Perfumes / Vidro)' },
];

const PRESET_TEMPLATES = [
  {
    name: 'Vestuário (Camisa / Vestido)',
    dims: { lengthCm: 32, widthCm: 24, heightCm: 4, weightKg: 0.35, packageType: 'Saco Envio Selado Zenza' },
  },
  {
    name: 'Calçado (Ténis / Sapatos)',
    dims: { lengthCm: 34, widthCm: 22, heightCm: 13, weightKg: 0.95, packageType: 'Caixa Calçado Especial' },
  },
  {
    name: 'Acessório / Relógio',
    dims: { lengthCm: 16, widthCm: 12, heightCm: 8, weightKg: 0.25, packageType: 'Estojo Rígido de Luxo' },
  },
  {
    name: 'Perfumaria / Cosmética',
    dims: { lengthCm: 15, widthCm: 12, heightCm: 18, weightKg: 0.45, packageType: 'Embalagem Especial com Espuma' },
  },
];

export const DimensionsEditor: React.FC<DimensionsEditorProps> = ({
  dimensions = {
    weightKg: 0.5,
    lengthCm: 30,
    widthCm: 20,
    heightCm: 8,
    packageType: 'Caixa Standard Zenza',
  },
  onChange,
  error,
}) => {
  const current: ProductDimensions = {
    weightKg: dimensions?.weightKg ?? 0.5,
    lengthCm: dimensions?.lengthCm ?? 30,
    widthCm: dimensions?.widthCm ?? 20,
    heightCm: dimensions?.heightCm ?? 8,
    packageType: dimensions?.packageType ?? 'Caixa Standard Zenza',
  };

  const update = (field: keyof ProductDimensions, value: any) => {
    onChange({
      ...current,
      [field]: value,
    });
  };

  // Calculate volume
  const length = current.lengthCm || 0;
  const width = current.widthCm || 0;
  const height = current.heightCm || 0;
  const volumeCm3 = Math.round(length * width * height);
  const volumeLiters = (volumeCm3 / 1000).toFixed(2);
  const weightGrams = Math.round((current.weightKg || 0) * 1000);

  return (
    <div className="space-y-4">
      {/* Quick Presets */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-[#fff3ef] rounded-xl border border-[#ffb59c]/50">
        <span className="text-[11px] font-bold text-[#a63500] flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          Predefinições Rápidas por Tipo:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_TEMPLATES.map((tpl) => (
            <button
              key={tpl.name}
              type="button"
              onClick={() => onChange({ ...tpl.dims })}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-white hover:bg-[#a63500] hover:text-white text-[#191c1d] border border-[rgba(25,28,29,0.10)] font-medium transition-all shadow-2xs"
            >
              {tpl.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Peso em Kg */}
        <FormField
          id="dim-weight"
          label="Peso do Produto"
          required
          hint={`${weightGrams}g no total`}
        >
          <Input
            id="dim-weight"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.50"
            value={current.weightKg ?? ''}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              update('weightKg', isNaN(val) ? undefined : Math.max(0, val));
            }}
            rightElement={<span className="text-xs font-semibold text-[#191c1d]/60">kg</span>}
          />
        </FormField>

        {/* Comprimento */}
        <FormField
          id="dim-length"
          label="Comprimento"
          required
          hint="Dimensão maior da embalagem"
        >
          <Input
            id="dim-length"
            type="number"
            step="0.5"
            min="1"
            placeholder="30"
            value={current.lengthCm ?? ''}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              update('lengthCm', isNaN(val) ? undefined : Math.max(0, val));
            }}
            rightElement={<span className="text-xs font-semibold text-[#191c1d]/60">cm</span>}
          />
        </FormField>

        {/* Largura */}
        <FormField
          id="dim-width"
          label="Largura"
          required
          hint="Largura da embalagem"
        >
          <Input
            id="dim-width"
            type="number"
            step="0.5"
            min="1"
            placeholder="20"
            value={current.widthCm ?? ''}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              update('widthCm', isNaN(val) ? undefined : Math.max(0, val));
            }}
            rightElement={<span className="text-xs font-semibold text-[#191c1d]/60">cm</span>}
          />
        </FormField>

        {/* Altura */}
        <FormField
          id="dim-height"
          label="Altura / Espessura"
          required
          hint="Altura da embalagem"
        >
          <Input
            id="dim-height"
            type="number"
            step="0.5"
            min="1"
            placeholder="8"
            value={current.heightCm ?? ''}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              update('heightCm', isNaN(val) ? undefined : Math.max(0, val));
            }}
            rightElement={<span className="text-xs font-semibold text-[#191c1d]/60">cm</span>}
          />
        </FormField>
      </div>

      {/* Tipo de Embalagem */}
      <FormField
        id="dim-package-type"
        label="Tipo de Embalagem Recomendada"
        hint="Utilizado para o empacotamento no armazém e etiquetas de despacho"
      >
        <Select
          id="dim-package-type"
          value={current.packageType}
          onChange={(e) => update('packageType', e.target.value)}
          options={PACKAGE_OPTIONS}
        />
      </FormField>

      {/* Summary Box / Logistics Tag for Luanda Express */}
      <div className="p-3.5 bg-[#f8f9fa] rounded-xl border border-[rgba(25,28,29,0.08)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white border border-[rgba(25,28,29,0.10)] flex items-center justify-center shrink-0 text-[#a63500]">
            <Box className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#191c1d]">Ficha de Dimensão e Envio</span>
              <Badge variant="brand" size="sm">
                Luanda Express
              </Badge>
            </div>
            <p className="text-[#191c1d]/60 text-[11px] mt-0.5 font-mono">
              {length} × {width} × {height} cm • {current.weightKg ?? 0} kg ({volumeLiters} Litros)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] text-[#191c1d]/50 font-medium">Embalagem:</span>
          <span className="text-[11px] font-bold text-[#191c1d] bg-white px-2.5 py-1 rounded-md border border-[rgba(25,28,29,0.10)]">
            {current.packageType}
          </span>
        </div>
      </div>

      {error && <p className="text-xs font-semibold text-red-600">{error}</p>}
    </div>
  );
};
