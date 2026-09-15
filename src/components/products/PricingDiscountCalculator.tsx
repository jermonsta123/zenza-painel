import React from 'react';
import { FormField } from '../ui/FormField';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { formatKz } from '../../theme/tokens';
import { DollarSign, TrendingDown, Percent, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

interface PricingDiscountCalculatorProps {
  price: number;
  originalPrice?: number;
  costPrice?: number;
  onChangePrice: (val: number) => void;
  onChangeOriginalPrice: (val: number | undefined) => void;
  onChangeCostPrice?: (val: number | undefined) => void;
  errors?: {
    price?: string;
    originalPrice?: string;
  };
  disabled?: boolean;
}

export const PricingDiscountCalculator: React.FC<PricingDiscountCalculatorProps> = ({
  price,
  originalPrice,
  costPrice,
  onChangePrice,
  onChangeOriginalPrice,
  onChangeCostPrice,
  errors,
  disabled = false,
}) => {
  // Compute discount percentage if original price is valid and higher than price
  const discountPct =
    originalPrice && originalPrice > price && price > 0
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  // Compute gross margin if cost price is provided
  const grossMarginPct =
    costPrice && price > 0 && price > costPrice
      ? Math.round(((price - costPrice) / price) * 100)
      : null;

  const handleApplyDiscountPreset = (percent: number) => {
    if (price <= 0) return;
    // Set originalPrice as the previous higher value, or calculate based on current price
    const calculatedOriginal = Math.round(price / (1 - percent / 100));
    onChangeOriginalPrice(calculatedOriginal);
  };

  const handleClearDiscount = () => {
    onChangeOriginalPrice(undefined);
  };

  const hasIncoherentDiscount = Boolean(
    originalPrice && originalPrice > 0 && originalPrice <= price
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Current Selling Price (Required) */}
        <FormField
          id="product-price"
          label="Preço de Venda (Kz)"
          required
          error={errors?.price}
          hint="Valor final cobrado ao cliente"
        >
          <Input
            id="product-price"
            type="number"
            min={0}
            step={100}
            placeholder="0"
            value={price === 0 ? '' : price}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              onChangePrice(isNaN(val) ? 0 : Math.max(0, val));
            }}
            rightElement={<span className="text-xs font-bold text-[#a63500]">Kz</span>}
            disabled={disabled}
            error={errors?.price}
          />
        </FormField>

        {/* Original Price / Preço Riscado (Optional) */}
        <FormField
          id="product-original-price"
          label="Preço Anterior / Riscado (Kz)"
          error={
            errors?.originalPrice ||
            (hasIncoherentDiscount ? 'O preço anterior deve ser superior ao preço de venda.' : undefined)
          }
          hint="Opcional. Ativa badge de promoção na loja"
        >
          <Input
            id="product-original-price"
            type="number"
            min={0}
            step={100}
            placeholder="Ex: 35000"
            value={originalPrice === undefined ? '' : originalPrice}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              onChangeOriginalPrice(isNaN(val) || val <= 0 ? undefined : val);
            }}
            rightElement={<span className="text-xs font-medium text-[#191c1d]/50">Kz</span>}
            disabled={disabled}
            error={
              errors?.originalPrice ||
              (hasIncoherentDiscount ? 'Preço incoerente' : undefined)
            }
          />
        </FormField>

        {/* Cost Price / Custo Operacional (Optional) */}
        {onChangeCostPrice && (
          <FormField
            id="product-cost-price"
            label="Preço de Custo (Kz)"
            hint="Para cálculo de margem interna (não público)"
          >
            <Input
              id="product-cost-price"
              type="number"
              min={0}
              step={100}
              placeholder="Ex: 15000"
              value={costPrice === undefined ? '' : costPrice}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                onChangeCostPrice(isNaN(val) || val <= 0 ? undefined : val);
              }}
              rightElement={<span className="text-xs font-medium text-[#191c1d]/50">Kz</span>}
              disabled={disabled}
            />
          </FormField>
        )}
      </div>

      {/* Quick Discount Presets Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#f8f9fa] rounded-xl border border-[rgba(25,28,29,0.08)]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#191c1d]/70 flex items-center gap-1">
            <Percent className="w-3.5 h-3.5 text-[#a63500]" />
            Atalhos de Promoção:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {[10, 15, 20, 30, 50].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => handleApplyDiscountPreset(pct)}
                disabled={disabled || price <= 0}
                className={`text-xs px-2.5 py-1 rounded-md font-semibold border transition-all ${
                  discountPct === pct
                    ? 'bg-[#a63500] text-white border-[#a63500]'
                    : 'bg-white text-[#191c1d] border-[rgba(25,28,29,0.15)] hover:border-[#a63500] hover:text-[#a63500]'
                }`}
              >
                -{pct}%
              </button>
            ))}
            {originalPrice && (
              <button
                type="button"
                onClick={handleClearDiscount}
                disabled={disabled}
                className="text-xs text-red-600 hover:underline px-2 py-1 font-medium"
              >
                Remover Promoção
              </button>
            )}
          </div>
        </div>

        {/* Live Calculation Display */}
        <div className="flex items-center gap-3">
          {discountPct > 0 && !hasIncoherentDiscount && (
            <Badge variant="brand" size="sm" withDot>
              Poupança: {discountPct}% ({formatKz((originalPrice || 0) - price)})
            </Badge>
          )}

          {grossMarginPct !== null && (
            <Badge variant="emerald" size="sm">
              Margem Bruta: {grossMarginPct}%
            </Badge>
          )}
        </div>
      </div>

      {/* Visual Pricing Summary */}
      <div className="p-3 bg-white rounded-lg border border-[rgba(25,28,29,0.10)] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[#191c1d]/60 font-medium">Exibição na Zenza Shop:</span>
          <span className="font-bold text-[#191c1d] text-sm">{formatKz(price)}</span>
          {originalPrice && originalPrice > price && (
            <span className="line-through text-[#191c1d]/40 text-xs">
              {formatKz(originalPrice)}
            </span>
          )}
        </div>
        <span className="text-[11px] text-[#191c1d]/50">
          * Faturação fiscal processada em Kwanza Angolano (AOA)
        </span>
      </div>
    </div>
  );
};
