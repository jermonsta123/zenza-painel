import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/FeedbackStates';
import { useToast } from '../context/ToastContext';
import { Plus, Download, RefreshCw, Sparkles, FolderTree, Users, Ticket, Star, Settings, KeyRound, ShieldAlert } from 'lucide-react';

interface GenericSectionViewProps {
  viewId: string;
  title: string;
  description: string;
  groupLabel: string;
}

export const GenericSectionView: React.FC<GenericSectionViewProps> = ({
  viewId,
  title,
  description,
  groupLabel,
}) => {
  const { info, success } = useToast();

  const getIcon = () => {
    switch (viewId) {
      case 'categorias':
        return <FolderTree className="w-6 h-6" />;
      case 'clientes':
        return <Users className="w-6 h-6" />;
      case 'cupoes':
        return <Ticket className="w-6 h-6" />;
      case 'avaliacoes':
        return <Star className="w-6 h-6" />;
      case 'permissoes':
        return <KeyRound className="w-6 h-6" />;
      case 'utilizadores':
        return <ShieldAlert className="w-6 h-6" />;
      case 'configuracoes':
      default:
        return <Settings className="w-6 h-6" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="neutral" size="sm">
              {groupLabel}
            </Badge>
            <Badge variant="emerald" size="sm" withDot>
              Módulo Ativo
            </Badge>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#191c1d] tracking-tight">
            {title}
          </h1>
          <p className="text-xs text-[#191c1d]/60 mt-0.5">
            {description}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<RefreshCw className="w-4 h-4" />}
            onClick={() => info('Atualizado', `Dados de ${title} sincronizados com o servidor.`)}
          >
            Sincronizar
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => success(`Novo Item`, `Abertura do fluxo de criação em ${title}.`)}
          >
            + Adicionar Registo
          </Button>
        </div>
      </div>

      {/* Module Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle>Painel de Gestão: {title}</CardTitle>
          <CardDescription>
            Layout estruturado e integrado à navegação unificada da Zenza Shop.
          </CardDescription>
        </CardHeader>

        <EmptyState
          icon={getIcon()}
          title={`Área Operacional: ${title}`}
          description={`Os controlos visuais, tabelas, filtros e botões desta seção herdam todos os tokens e regras do Design System Zenza Shop.`}
          action={{
            label: `Configurar ${title}`,
            onClick: () => success('Ação Registada', `A abrir opções avançadas para ${title}.`),
            icon: <Sparkles className="w-4 h-4" />,
          }}
          secondaryAction={{
            label: 'Exportar Relatório',
            onClick: () => info('Exportação', 'A gerar ficheiro compatível...'),
          }}
        />
      </Card>
    </div>
  );
};
