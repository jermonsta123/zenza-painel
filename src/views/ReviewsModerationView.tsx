import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { DataTable, Column } from '../components/ui/Table';
import { Modal, ConfirmDialog } from '../components/ui/Modal';
import { FormField } from '../components/ui/FormField';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { 
  Star, 
  Search, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  MessageSquare, 
  Eye, 
  Lock,
  ThumbsUp,
  ShieldCheck
} from 'lucide-react';

interface ReviewItem {
  id: string;
  productTitle: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  status: 'pendente' | 'aprovada' | 'rejeitada';
  rejectionReason?: string;
  verifiedPurchase: boolean;
}

const initialReviews: ReviewItem[] = [
  {
    id: 'rev-01',
    productTitle: 'Camisa Linho Luanda Slim Fit',
    customerName: 'Carlos Mateus',
    rating: 5,
    comment: 'Tecido de altíssima qualidade e acabamento impecável! Chegou a Talatona em menos de 24 horas.',
    date: 'Hoje, às 09:15',
    status: 'pendente',
    verifiedPurchase: true,
  },
  {
    id: 'rev-02',
    productTitle: 'Vestido Samakaka Festa Tradicional',
    customerName: 'Ana Beatriz Afonso',
    rating: 5,
    comment: 'Padrão autêntico e corte perfeito para cerimónias. Recomendo vivamente a Zenza!',
    date: 'Ontem, às 17:40',
    status: 'aprovada',
    verifiedPurchase: true,
  },
  {
    id: 'rev-03',
    productTitle: 'Calçado Casual Couro Luanda',
    customerName: 'Domingos Gaspar',
    rating: 2,
    comment: 'O número 42 ficou um pouco apertado no peito do pé. Aconselho pedir um tamanho acima.',
    date: '14 Set, às 12:10',
    status: 'pendente',
    verifiedPurchase: true,
  },
  {
    id: 'rev-04',
    productTitle: 'Perfume Essência de Benguela 100ml',
    customerName: 'Anónimo 99',
    rating: 1,
    comment: 'Propaganda não autorizada de outra marca concorrente no WhatsApp +244 999 000 111 ligar já!',
    date: '13 Set, às 18:22',
    status: 'rejeitada',
    rejectionReason: 'Spam e publicidade não autorizada de terceiros.',
    verifiedPurchase: false,
  },
  {
    id: 'rev-05',
    productTitle: 'Óculos de Sol Baía Polarizados',
    customerName: 'Maria Helena Silva',
    rating: 4,
    comment: 'Muito bonitos e com boa proteção solar para o clima de Luanda. O estojo é resistente.',
    date: '12 Set, às 14:05',
    status: 'aprovada',
    verifiedPurchase: true,
  },
];

export const ReviewsModerationView: React.FC = () => {
  const { success, warning, error: toastError } = useToast();
  const { can } = useAuth();
  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pendente' | 'aprovada' | 'rejeitada'>('all');

  // Dangerous Operation States
  const [reviewToApprove, setReviewToApprove] = useState<ReviewItem | null>(null);
  const [reviewToReject, setReviewToReject] = useState<ReviewItem | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('Violação das diretrizes da comunidade ou conteúdo inadequado.');

  const canModerate = can('moderate_reviews');

  const filteredReviews = reviews.filter((r) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      r.productTitle.toLowerCase().includes(q) ||
      r.customerName.toLowerCase().includes(q) ||
      r.comment.toLowerCase().includes(q);

    if (!matchSearch) return false;

    if (statusFilter !== 'all' && r.status !== statusFilter) {
      return false;
    }
    return true;
  });

  const handleApproveConfirmed = () => {
    if (!reviewToApprove) return;
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewToApprove.id ? { ...r, status: 'aprovada' } : r
      )
    );
    success(
      'Avaliação Aprovada e Publicada',
      `O comentário de ${reviewToApprove.customerName} sobre "${reviewToApprove.productTitle}" ficará visível publicamente na loja Zenza Shop.`
    );
    setReviewToApprove(null);
  };

  const handleRejectConfirmed = () => {
    if (!reviewToReject) return;
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewToReject.id
          ? { ...r, status: 'rejeitada', rejectionReason: rejectionReasonInput }
          : r
      )
    );
    warning(
      'Avaliação Rejeitada',
      `O comentário foi ocultado da loja. Motivo registado: ${rejectionReasonInput}.`
    );
    setReviewToReject(null);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={`w-3.5 h-3.5 ${
              s <= rating ? 'fill-amber-400 text-amber-500' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const columns: Column<ReviewItem>[] = [
    {
      key: 'productTitle',
      header: 'Produto / Cliente',
      priority: 'high',
      render: (item) => (
        <div className="flex flex-col">
          <span className="font-bold text-xs text-[#191c1d]">{item.productTitle}</span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[11px] text-[#191c1d]/60">{item.customerName}</span>
            {item.verifiedPurchase && (
              <Badge variant="emerald" size="sm">
                Compra Verificada
              </Badge>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'rating',
      header: 'Pontuação',
      priority: 'medium',
      render: (item) => (
        <div className="flex items-center gap-1.5">
          {renderStars(item.rating)}
          <span className="text-xs font-bold text-[#191c1d]">{item.rating}/5</span>
        </div>
      ),
    },
    {
      key: 'comment',
      header: 'Comentário do Cliente',
      priority: 'high',
      render: (item) => (
        <div className="max-w-md">
          <p className="text-xs text-[#191c1d] italic">"{item.comment}"</p>
          {item.rejectionReason && (
            <span className="text-[10px] text-red-600 font-semibold block mt-1">
              Motivo rejeição: {item.rejectionReason}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Estado',
      align: 'center',
      priority: 'high',
      render: (item) => {
        if (item.status === 'aprovada') {
          return <Badge variant="emerald" size="sm" withDot>Pública na Loja</Badge>;
        }
        if (item.status === 'pendente') {
          return <Badge variant="amber" size="sm" withDot>Pendente Moderação</Badge>;
        }
        return <Badge variant="red" size="sm">Rejeitada</Badge>;
      },
    },
    {
      key: 'actions',
      header: 'Moderação de Conteúdo',
      align: 'right',
      priority: 'high',
      render: (item) => (
        <div className="flex items-center justify-end gap-1.5">
          {item.status !== 'aprovada' && (
            <Button
              variant="secondary"
              size="sm"
              disabled={!canModerate}
              onClick={() => setReviewToApprove(item)}
              leftIcon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
            >
              Aprovar
            </Button>
          )}

          {item.status !== 'rejeitada' && (
            <Button
              variant="destructive"
              size="sm"
              disabled={!canModerate}
              onClick={() => setReviewToReject(item)}
              leftIcon={<XCircle className="w-3.5 h-3.5" />}
            >
              Rejeitar
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="brand" size="sm">
              Fila de Moderação
            </Badge>
            <Badge variant="amber" size="sm" withDot>
              {reviews.filter((r) => r.status === 'pendente').length} Pendentes
            </Badge>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#191c1d] tracking-tight">
            Avaliações & Opiniões de Clientes
          </h1>
          <p className="text-xs text-[#191c1d]/60 mt-0.5">
            Moderação editorial de comentários antes da exibição nas páginas públicas de detalhe do produto.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-xl border border-[rgba(25,28,29,0.10)] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Pesquisar por produto, autor ou comentário..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftElement={<Search className="w-4 h-4 text-[#191c1d]/40" />}
            inputSize="sm"
          />
        </div>

        <div className="flex items-center gap-2">
          {(['all', 'pendente', 'aprovada', 'rejeitada'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                statusFilter === s
                  ? 'bg-[#a63500] text-white shadow-xs'
                  : 'bg-[#f8f9fa] text-[#191c1d]/70 hover:bg-gray-200'
              }`}
            >
              {s === 'all' ? 'Todas as Opiniões' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredReviews}
        keyExtractor={(item) => item.id}
        totalItems={filteredReviews.length}
      />

      {/* Confirm Approve Review Modal (Dangerous Operation) */}
      <ConfirmDialog
        isOpen={Boolean(reviewToApprove)}
        onClose={() => setReviewToApprove(null)}
        onConfirm={handleApproveConfirmed}
        title={`Aprovar e Publicar Avaliação de ${reviewToApprove?.customerName}?`}
        description={`Ao aprovar esta avaliação (${reviewToApprove?.rating} estrelas), ela ficará imediatamente visível para todos os visitantes do produto "${reviewToApprove?.productTitle}" na loja Zenza Shop e influenciará a classificação média global.`}
        confirmLabel="Sim, Aprovar e Publicar"
        cancelLabel="Cancelar"
        variant="default"
      />

      {/* Confirm Reject Review Modal (Dangerous Operation) */}
      <Modal
        isOpen={Boolean(reviewToReject)}
        onClose={() => setReviewToReject(null)}
        title={`Rejeitar Avaliação de ${reviewToReject?.customerName}?`}
        description={`Ao rejeitar esta avaliação, ela NÃO será publicada na loja pública. O motivo da rejeição será arquivado para conformidade de auditoria.`}
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
            <span className="font-bold block">Comentário a Rejeitar:</span>
            <p className="italic mt-1 text-amber-800">"{reviewToReject?.comment}"</p>
          </div>

          <FormField
            id="rejection-reason"
            label="Justificação da Rejeição"
            required
            hint="Indique o motivo pelo qual este conteúdo não cumpre as regras da Zenza Shop"
          >
            <Input
              id="rejection-reason"
              value={rejectionReasonInput}
              onChange={(e) => setRejectionReasonInput(e.target.value)}
            />
          </FormField>

          <div className="flex justify-end gap-2 pt-3 border-t border-[rgba(25,28,29,0.08)]">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setReviewToReject(null)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleRejectConfirmed}
            >
              Confirmar Rejeição
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
