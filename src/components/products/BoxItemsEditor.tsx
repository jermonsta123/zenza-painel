import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Plus, Trash2, Package, AlertCircle, Check } from 'lucide-react';

interface BoxItemsEditorProps {
  boxItems: string[];
  onChange: (items: string[]) => void;
  disabled?: boolean;
}

export const BoxItemsEditor: React.FC<BoxItemsEditorProps> = ({
  boxItems,
  onChange,
  disabled = false,
}) => {
  const [newItemText, setNewItemText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleAddItem = () => {
    const trimmed = newItemText.trim();
    if (!trimmed) {
      setErrorMsg('O item incluído na embalagem não pode estar vazio.');
      return;
    }

    if (boxItems.some((item) => item.toLowerCase() === trimmed.toLowerCase())) {
      setErrorMsg(`"${trimmed}" já foi adicionado à lista.`);
      return;
    }

    setErrorMsg('');
    onChange([...boxItems, trimmed]);
    setNewItemText('');
  };

  const handleRemoveItem = (index: number) => {
    const updated = boxItems.filter((_, idx) => idx !== index);
    onChange(updated);
  };

  const handleEditItem = (index: number, val: string) => {
    const updated = [...boxItems];
    updated[index] = val;
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#191c1d] flex items-center gap-1.5">
          <Package className="w-4 h-4 text-[#a63500]" />
          Conteúdo da Embalagem / O que vem na caixa ({boxItems.length})
        </h4>
        <p className="text-[11px] text-[#191c1d]/60 mt-0.5">
          Lista clara dos itens que o cliente recebe ao abrir a encomenda.
        </p>
      </div>

      {/* Input Row */}
      <div className="p-3 bg-[#f8f9fa] rounded-xl border border-[rgba(25,28,29,0.10)] space-y-2">
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              id="new-box-item"
              inputSize="sm"
              placeholder="Ex: 1x Capa protetora de viagem Zenza"
              value={newItemText}
              onChange={(e) => {
                setNewItemText(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddItem();
                }
              }}
              disabled={disabled}
            />
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleAddItem}
            disabled={disabled || !newItemText.trim()}
            leftIcon={<Plus className="w-3.5 h-3.5 text-[#a63500]" />}
          >
            Adicionar Item
          </Button>
        </div>

        {errorMsg && (
          <p className="text-xs font-semibold text-red-600 flex items-center gap-1" role="alert">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {errorMsg}
          </p>
        )}
      </div>

      {/* Items list */}
      {boxItems.length > 0 ? (
        <div className="space-y-2">
          {boxItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-2 bg-white rounded-lg border border-[rgba(25,28,29,0.10)]"
            >
              <div className="w-5 h-5 rounded-full bg-[#fff3ef] text-[#a63500] flex items-center justify-center text-[10px] font-bold shrink-0">
                {index + 1}
              </div>
              <input
                type="text"
                value={item}
                onChange={(e) => handleEditItem(index, e.target.value)}
                disabled={disabled}
                className="flex-1 bg-transparent text-xs font-medium text-[#191c1d] focus:outline-none focus:ring-1 focus:ring-[#a63500] px-2 py-0.5 rounded"
              />
              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                disabled={disabled}
                className="p-1 text-[#191c1d]/40 hover:text-red-600 rounded transition-colors"
                title="Remover item"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-3 bg-white rounded-lg border border-[rgba(25,28,29,0.08)] text-center text-xs text-[#191c1d]/50">
          Nenhum item adicionado à lista da embalagem.
        </div>
      )}
    </div>
  );
};
