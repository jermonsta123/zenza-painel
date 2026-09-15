import React, { useState } from 'react';
import { ProductSpec } from '../../types/product';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { Plus, Trash2, Sliders, AlertCircle, Sparkles } from 'lucide-react';

interface SpecsKeyValEditorProps {
  specs: ProductSpec[];
  onChange: (specs: ProductSpec[]) => void;
  disabled?: boolean;
}

const COMMON_SPEC_SUGGESTIONS = [
  'Material',
  'Composição',
  'Origem',
  'Cuidados de Lavagem',
  'Dimensões',
  'Peso',
  'Garantia',
  'Acabamento',
  'Resistência à Água',
  'Autonomia Bateria',
];

export const SpecsKeyValEditor: React.FC<SpecsKeyValEditorProps> = ({
  specs,
  onChange,
  disabled = false,
}) => {
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleAddSpec = (keyToAdd = newKey, valToAdd = newValue) => {
    const trimmedKey = keyToAdd.trim();
    const trimmedVal = valToAdd.trim();

    if (!trimmedKey) {
      setErrorMsg('A chave/propriedade da especificação não pode estar vazia.');
      return;
    }

    // Check duplicate key
    const isDuplicate = specs.some(
      (s) => s.key.toLowerCase() === trimmedKey.toLowerCase()
    );
    if (isDuplicate) {
      setErrorMsg(`A especificação "${trimmedKey}" já existe na lista.`);
      return;
    }

    setErrorMsg('');
    const newSpecItem: ProductSpec = {
      id: `spec-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      key: trimmedKey,
      value: trimmedVal || 'Sob consulta',
    };

    onChange([...specs, newSpecItem]);
    setNewKey('');
    setNewValue('');
  };

  const handleUpdateSpec = (id: string, field: 'key' | 'value', value: string) => {
    const updated = specs.map((s) => (s.id === id ? { ...s, [field]: value } : s));
    onChange(updated);
  };

  const handleRemoveSpec = (id: string) => {
    onChange(specs.filter((s) => s.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#191c1d]">
            Especificações Técnicas ({specs.length})
          </h4>
          <p className="text-[11px] text-[#191c1d]/60">
            Pares Chave/Valor apresentados na aba de ficha técnica do produto.
          </p>
        </div>

        {/* Quick suggestions chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] text-[#191c1d]/50 font-medium">Sugestões:</span>
          {COMMON_SPEC_SUGGESTIONS.slice(0, 4).map((suggestion) => {
            const alreadyAdded = specs.some(
              (s) => s.key.toLowerCase() === suggestion.toLowerCase()
            );
            if (alreadyAdded) return null;
            return (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleAddSpec(suggestion, '')}
                disabled={disabled}
                className="text-[10px] bg-[#f8f9fa] hover:bg-[#fff3ef] hover:text-[#a63500] text-[#191c1d] border border-[rgba(25,28,29,0.12)] px-2 py-0.5 rounded-md font-medium transition-colors"
              >
                + {suggestion}
              </button>
            );
          })}
        </div>
      </div>

      {/* Input Row for adding new Spec */}
      <div className="p-3 bg-[#f8f9fa] rounded-xl border border-[rgba(25,28,29,0.10)] space-y-2">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
          <div className="sm:col-span-5">
            <Input
              id="new-spec-key"
              inputSize="sm"
              placeholder="Propriedade (ex: Material)"
              value={newKey}
              onChange={(e) => {
                setNewKey(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSpec();
                }
              }}
              disabled={disabled}
            />
          </div>
          <div className="sm:col-span-5">
            <Input
              id="new-spec-value"
              inputSize="sm"
              placeholder="Valor (ex: 100% Algodão Samakaka)"
              value={newValue}
              onChange={(e) => {
                setNewValue(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSpec();
                }
              }}
              disabled={disabled}
            />
          </div>
          <div className="sm:col-span-2 flex items-center">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              fullWidth
              onClick={() => handleAddSpec()}
              disabled={disabled || !newKey.trim()}
              leftIcon={<Plus className="w-3.5 h-3.5 text-[#a63500]" />}
            >
              Adicionar
            </Button>
          </div>
        </div>

        {errorMsg && (
          <p className="text-xs font-semibold text-red-600 flex items-center gap-1" role="alert">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {errorMsg}
          </p>
        )}
      </div>

      {/* Existing Specs List */}
      {specs.length > 0 ? (
        <div className="border border-[rgba(25,28,29,0.10)] rounded-xl overflow-hidden divide-y divide-[rgba(25,28,29,0.06)] bg-white">
          {specs.map((spec) => (
            <div
              key={spec.id}
              className="p-2.5 flex items-center gap-3 hover:bg-[#fafafa] transition-colors"
            >
              <div className="w-1/3">
                <input
                  type="text"
                  value={spec.key}
                  onChange={(e) => handleUpdateSpec(spec.id, 'key', e.target.value)}
                  disabled={disabled}
                  className="w-full bg-transparent text-xs font-bold text-[#191c1d] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#a63500] px-2 py-1 rounded"
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={spec.value}
                  onChange={(e) => handleUpdateSpec(spec.id, 'value', e.target.value)}
                  disabled={disabled}
                  className="w-full bg-transparent text-xs text-[#191c1d]/80 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#a63500] px-2 py-1 rounded"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveSpec(spec.id)}
                disabled={disabled}
                className="p-1 text-[#191c1d]/40 hover:text-red-600 rounded transition-colors"
                title="Remover especificação"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-3 bg-white rounded-lg border border-[rgba(25,28,29,0.08)] text-center text-xs text-[#191c1d]/50">
          Nenhuma especificação técnica definida para este produto.
        </div>
      )}
    </div>
  );
};
