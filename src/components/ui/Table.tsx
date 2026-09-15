import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown } from 'lucide-react';
import { Checkbox } from './FormControls';
import { TableSkeleton, EmptyState } from './FeedbackStates';
import { Button } from './Button';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T, index: number) => React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  priority?: 'high' | 'medium' | 'low'; // high = always visible on mobile/tablet, low = hidden on mobile
  width?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: {
    label: string;
    onClick: () => void;
  };
  selectable?: boolean;
  selectedIds?: string[];
  onSelectChange?: (selectedIds: string[]) => void;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (columnKey: string) => void;
  // Pagination
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  // Mobile Card View Rendering (optional fallback)
  renderMobileCard?: (item: T, isSelected: boolean, onToggleSelect: () => void) => React.ReactNode;
  onRowClick?: (item: T) => void;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  emptyTitle = 'Nenhum registo encontrado',
  emptyDescription = 'Tenta ajustar os teus filtros ou termos de pesquisa para ver resultados.',
  emptyAction,
  selectable = false,
  selectedIds = [],
  onSelectChange,
  sortColumn,
  sortDirection,
  onSort,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  renderMobileCard,
  onRowClick,
}: DataTableProps<T>) {
  const allIds = data.map(keyExtractor);
  const isAllSelected = allIds.length > 0 && allIds.every((id) => selectedIds.includes(id));
  const isSomeSelected = selectedIds.length > 0 && !isAllSelected;

  const handleSelectAll = () => {
    if (isAllSelected) {
      onSelectChange?.([]);
    } else {
      onSelectChange?.(allIds);
    }
  };

  const handleToggleRow = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectChange?.(selectedIds.filter((item) => item !== id));
    } else {
      onSelectChange?.([...selectedIds, id]);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-[rgba(25,28,29,0.10)] overflow-hidden shadow-xs">
        <TableSkeleton rows={pageSize > 6 ? 6 : pageSize} columns={columns.length + (selectable ? 1 : 0)} />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
      />
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[rgba(25,28,29,0.10)] shadow-xs overflow-hidden flex flex-col">
      {/* Mobile Card List (visible on sm/mobile if mobile renderer provided) */}
      {renderMobileCard && (
        <div className="block md:hidden divide-y divide-[rgba(25,28,29,0.08)]">
          {data.map((item) => {
            const id = keyExtractor(item);
            const isSelected = selectedIds.includes(id);
            return (
              <div key={id} className="p-4">
                {renderMobileCard(item, isSelected, () => handleToggleRow(id))}
              </div>
            );
          })}
        </div>
      )}

      {/* Standard Table (hidden on mobile if mobile card provided, or scrolls cleanly) */}
      <div className={`${renderMobileCard ? 'hidden md:block' : 'block'} overflow-x-auto`}>
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-[#f8f9fa] border-b border-[rgba(25,28,29,0.10)] text-[#191c1d]/65 text-xs font-semibold uppercase tracking-wider">
              {selectable && (
                <th className="py-3.5 px-4 w-12 text-center">
                  <Checkbox
                    checked={isAllSelected}
                    aria-label="Selecionar todas as linhas"
                    onChange={handleSelectAll}
                  />
                </th>
              )}
              {columns.map((col) => {
                const isSorted = sortColumn === col.key;
                const alignClass =
                  col.align === 'right'
                    ? 'text-right'
                    : col.align === 'center'
                    ? 'text-center'
                    : 'text-left';

                return (
                  <th
                    key={col.key}
                    style={{ width: col.width }}
                    className={`py-3.5 px-4 select-none ${alignClass} ${
                      col.priority === 'low' ? 'hidden xl:table-cell' : ''
                    } ${col.priority === 'medium' ? 'hidden lg:table-cell' : ''}`}
                  >
                    {col.sortable ? (
                      <button
                        type="button"
                        onClick={() => onSort?.(col.key)}
                        className="inline-flex items-center gap-1.5 font-semibold text-[#191c1d]/75 hover:text-[#a63500] focus:outline-none transition-colors"
                      >
                        <span>{col.header}</span>
                        <ArrowUpDown className={`w-3.5 h-3.5 ${isSorted ? 'text-[#a63500]' : 'opacity-40'}`} />
                      </button>
                    ) : (
                      <span>{col.header}</span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(25,28,29,0.06)] bg-white text-[#191c1d]">
            {data.map((item, index) => {
              const id = keyExtractor(item);
              const isSelected = selectedIds.includes(id);

              return (
                <tr
                  key={id}
                  onClick={() => onRowClick?.(item)}
                  className={`transition-colors hover:bg-[#fff9f6]/60 ${
                    isSelected ? 'bg-[#fff3ef]/70' : ''
                  } ${onRowClick ? 'cursor-pointer' : ''}`}
                >
                  {selectable && (
                    <td className="py-3 px-4 text-center">
                      <Checkbox
                        checked={isSelected}
                        aria-label={`Selecionar linha ${id}`}
                        onChange={() => handleToggleRow(id)}
                      />
                    </td>
                  )}
                  {columns.map((col) => {
                    const alignClass =
                      col.align === 'right'
                        ? 'text-right'
                        : col.align === 'center'
                        ? 'text-center'
                        : 'text-left';

                    return (
                      <td
                        key={col.key}
                        className={`py-3.5 px-4 text-xs sm:text-sm ${alignClass} ${
                          col.priority === 'low' ? 'hidden xl:table-cell' : ''
                        } ${col.priority === 'medium' ? 'hidden lg:table-cell' : ''}`}
                      >
                        {col.render
                          ? col.render(item, index)
                          : ((item as Record<string, unknown>)[col.key] as React.ReactNode)}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Pagination Footer */}
      {(totalPages > 1 || totalItems > 0) && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-white border-t border-[rgba(25,28,29,0.08)] text-xs text-[#191c1d]/70">
          <div className="flex items-center gap-2">
            <span>
              A mostrar{' '}
              <strong className="text-[#191c1d] font-bold">
                {Math.min((currentPage - 1) * pageSize + 1, totalItems)}
              </strong>{' '}
              a{' '}
              <strong className="text-[#191c1d] font-bold">
                {Math.min(currentPage * pageSize, totalItems)}
              </strong>{' '}
              de <strong className="text-[#191c1d] font-bold">{totalItems}</strong> registos
            </span>
            {onPageSizeChange && (
              <div className="hidden sm:flex items-center gap-1.5 ml-4">
                <span>Por página:</span>
                <select
                  value={pageSize}
                  onChange={(e) => onPageSizeChange(Number(e.target.value))}
                  className="bg-[#f8f9fa] border border-[rgba(25,28,29,0.15)] rounded-md px-2 py-1 text-xs text-[#191c1d] focus:outline-none focus:ring-1 focus:ring-[#a63500]"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {onPageChange && (
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage <= 1}
                onClick={() => onPageChange(1)}
                aria-label="Primeira página"
                className="p-1.5 rounded-md hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed text-[#191c1d]/70"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button
                disabled={currentPage <= 1}
                onClick={() => onPageChange(currentPage - 1)}
                aria-label="Página anterior"
                className="p-1.5 rounded-md hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed text-[#191c1d]/70"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="px-3 py-1 font-semibold text-[#191c1d] bg-[#f8f9fa] rounded-md border border-[rgba(25,28,29,0.10)]">
                {currentPage} / {totalPages || 1}
              </span>

              <button
                disabled={currentPage >= totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                aria-label="Próxima página"
                className="p-1.5 rounded-md hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed text-[#191c1d]/70"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => onPageChange(totalPages)}
                aria-label="Última página"
                className="p-1.5 rounded-md hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed text-[#191c1d]/70"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
