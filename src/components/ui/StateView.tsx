import React from 'react';
import { Button } from './Button';
import { Badge } from './Badge';
import { 
  ShieldAlert, 
  Lock, 
  FileQuestion, 
  AlertOctagon, 
  ServerCrash, 
  RefreshCw, 
  Home, 
  ArrowLeft 
} from 'lucide-react';

export type HttpErrorCode = '401' | '403' | '404' | '409' | '500';

export interface StateViewProps {
  code: HttpErrorCode;
  title?: string;
  description?: string;
  onRetry?: () => void;
  onNavigateHome?: () => void;
  onBack?: () => void;
  fullPage?: boolean;
}

export const StateView: React.FC<StateViewProps> = ({
  code,
  title,
  description,
  onRetry,
  onNavigateHome,
  onBack,
  fullPage = false,
}) => {
  const configs: Record<
    HttpErrorCode,
    {
      defaultTitle: string;
      defaultDesc: string;
      icon: React.ReactNode;
      badgeVariant: 'amber' | 'red' | 'neutral' | 'blue';
      badgeText: string;
    }
  > = {
    '401': {
      defaultTitle: 'Sessão Expirada ou Não Autenticado',
      defaultDesc: 'A tua sessão de operador Zenza Shop terminou por segurança. Por favor, faz login novamente para aceder a esta área.',
      icon: <Lock className="w-8 h-8 text-amber-600" />,
      badgeVariant: 'amber',
      badgeText: 'HTTP 401 • Não Autenticado',
    },
    '403': {
      defaultTitle: 'Acesso Restrito / Sem Permissão',
      defaultDesc: 'A tua conta de operador não possui as permissões necessárias (RBAC) para visualizar ou editar este recurso. Contacta um Administrador Zenza.',
      icon: <ShieldAlert className="w-8 h-8 text-red-600" />,
      badgeVariant: 'red',
      badgeText: 'HTTP 403 • Acesso Negado',
    },
    '404': {
      defaultTitle: 'Registo Não Encontrado',
      defaultDesc: 'O item, pedido ou recurso que tentaste aceder não existe no sistema ou foi movido/removido.',
      icon: <FileQuestion className="w-8 h-8 text-blue-600" />,
      badgeVariant: 'blue',
      badgeText: 'HTTP 404 • Não Encontrado',
    },
    '409': {
      defaultTitle: 'Conflito de Operação / Stock',
      defaultDesc: 'Ocorreu uma colisão de dados (ex: o stock foi reservado por outro operador simultaneamente ou a fatura já foi emitida).',
      icon: <AlertOctagon className="w-8 h-8 text-amber-600" />,
      badgeVariant: 'amber',
      badgeText: 'HTTP 409 • Conflito de Estado',
    },
    '500': {
      defaultTitle: 'Erro Inesperado no Servidor',
      defaultDesc: 'O serviço de processamento da Zenza Shop encontrou uma instabilidade. Os nossos engenheiros foram notificados automaticamente.',
      icon: <ServerCrash className="w-8 h-8 text-red-600" />,
      badgeVariant: 'red',
      badgeText: 'HTTP 500 • Falha de Servidor',
    },
  };

  const current = configs[code] || configs['500'];
  const displayTitle = title || current.defaultTitle;
  const displayDesc = description || current.defaultDesc;

  const content = (
    <div className="flex flex-col items-center text-center max-w-md mx-auto p-6 sm:p-8">
      {/* Icon with soft highlight container */}
      <div className="w-16 h-16 rounded-2xl bg-white border border-[rgba(25,28,29,0.12)] shadow-sm flex items-center justify-center mb-4">
        {current.icon}
      </div>

      <Badge variant={current.badgeVariant} className="mb-3">
        {current.badgeText}
      </Badge>

      <h2 className="text-xl font-bold text-[#191c1d] tracking-tight mb-2">
        {displayTitle}
      </h2>

      <p className="text-xs text-[#191c1d]/70 leading-relaxed mb-6">
        {displayDesc}
      </p>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 w-full">
        {onBack && (
          <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={onBack}>
            Voltar
          </Button>
        )}
        {onRetry && (
          <Button variant="secondary" size="sm" leftIcon={<RefreshCw className="w-4 h-4" />} onClick={onRetry}>
            Tentar Novamente
          </Button>
        )}
        {onNavigateHome && (
          <Button variant="primary" size="sm" leftIcon={<Home className="w-4 h-4" />} onClick={onNavigateHome}>
            Ir para o Dashboard
          </Button>
        )}
      </div>
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-[rgba(25,28,29,0.10)] shadow-xs w-full max-w-lg">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[rgba(25,28,29,0.10)] p-4">
      {content}
    </div>
  );
};
