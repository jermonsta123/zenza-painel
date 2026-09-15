import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { DataTable, Column } from '../components/ui/Table';
import { FormField } from '../components/ui/FormField';
import { formatKz } from '../theme/tokens';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { 
  Settings, 
  ShieldCheck, 
  FileText, 
  Lock, 
  Server, 
  Clock, 
  AlertCircle, 
  Database, 
  CheckCircle2,
  Sliders,
  EyeOff
} from 'lucide-react';

interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  resource: string;
  ipMasked: string;
  status: 'sucesso' | 'bloqueado' | 'aviso';
}

const initialAuditLogs: AuditLogEntry[] = [
  {
    id: 'log-01',
    timestamp: 'Hoje, 10:25:12',
    actor: 'manuel.silva@zenza.ao (Admin)',
    action: 'POST /api/products/publish',
    resource: 'Produto ZNZ-APP-001 (Camisa Linho)',
    ipMasked: '102.214.**.** (Luanda)',
    status: 'sucesso',
  },
  {
    id: 'log-02',
    timestamp: 'Hoje, 09:46:04',
    actor: 'webhook-emis@gateway.emis.ao',
    action: 'POST /api/webhooks/multicaixa',
    resource: 'Ref MCX-994821034 - Kz 48.500',
    ipMasked: '197.149.**.** (EMIS)',
    status: 'sucesso',
  },
  {
    id: 'log-03',
    timestamp: 'Hoje, 09:12:40',
    actor: 'auditoria.fiscal@zenza.ao (Leitor)',
    action: 'PUT /api/products/price [TENTATIVA]',
    resource: 'Tentativa de alteração de preço não autorizada',
    ipMasked: '165.255.**.** (Luanda)',
    status: 'bloqueado',
  },
  {
    id: 'log-04',
    timestamp: 'Hoje, 08:32:19',
    actor: 'esperanca.dinis@zenza.ao (Catálogo)',
    action: 'POST /api/stock/adjust',
    resource: 'Lote +10 unidades SKU ZNZ-APP-001',
    ipMasked: '102.214.**.** (Luanda)',
    status: 'sucesso',
  },
  {
    id: 'log-05',
    timestamp: 'Ontem, 22:15:00',
    actor: 'sistema-automacao@zenza.ao',
    action: 'CRON /jobs/inventory-sync',
    resource: 'Sincronização com Armazém Talatona',
    ipMasked: '10.0.**.** (VPC Interna)',
    status: 'sucesso',
  },
];

export const SettingsAuditView: React.FC = () => {
  const { success, warning, info, error: toastError } = useToast();
  const { can, currentRole } = useAuth();
  const [activeTab, setActiveTab] = useState<'config' | 'audit'>('config');

  // Store Configuration state
  const [storeName, setStoreName] = useState('Zenza Shop Angola');
  const [nif, setNif] = useState('5417082910');
  const [vatRate, setVatRate] = useState(14); // 14% AGT Angola
  const [currency, setCurrency] = useState('AOA (Kwanza)');
  const [freeShippingThresholdKz, setFreeShippingThresholdKz] = useState(50000);
  const [luandaExpressFeeKz, setLuandaExpressFeeKz] = useState(3500);

  const canEditSettings = can('edit_settings');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEditSettings) {
      toastError('Acesso Negado (HTTP 403)', 'Apenas o Administrador Geral pode alterar parâmetros fiscais e de loja.');
      return;
    }
    success('Configurações Atualizadas', 'As diretrizes da loja e taxas de entrega foram gravadas no servidor.');
  };

  const auditColumns: Column<AuditLogEntry>[] = [
    {
      key: 'timestamp',
      header: 'Carimbo de Data/Hora',
      priority: 'medium',
      render: (item) => (
        <span className="font-mono text-[11px] text-[#191c1d]/70 flex items-center gap-1">
          <Clock className="w-3 h-3 text-[#191c1d]/40" />
          {item.timestamp}
        </span>
      ),
    },
    {
      key: 'actor',
      header: 'Autor / Origem',
      priority: 'high',
      render: (item) => (
        <span className="font-semibold text-xs text-[#191c1d]">{item.actor}</span>
      ),
    },
    {
      key: 'action',
      header: 'Operação API',
      priority: 'high',
      render: (item) => (
        <span className="font-mono text-xs text-[#a63500] font-bold">
          {item.action}
        </span>
      ),
    },
    {
      key: 'resource',
      header: 'Recurso Acedido',
      priority: 'medium',
      render: (item) => (
        <span className="text-xs text-[#191c1d]/80">{item.resource}</span>
      ),
    },
    {
      key: 'ipMasked',
      header: 'Origem IP (Mascarada)',
      priority: 'low',
      render: (item) => (
        <span className="font-mono text-[10px] text-[#191c1d]/50 flex items-center gap-1">
          <EyeOff className="w-3 h-3 text-[#191c1d]/30" />
          {item.ipMasked}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Resultado',
      align: 'center',
      priority: 'high',
      render: (item) => {
        if (item.status === 'sucesso') {
          return <Badge variant="emerald" size="sm">200 OK</Badge>;
        }
        if (item.status === 'bloqueado') {
          return <Badge variant="red" size="sm">403 Bloqueado</Badge>;
        }
        return <Badge variant="amber" size="sm">Aviso</Badge>;
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="brand" size="sm">
              Conformidade Legal & Fiscal AGT
            </Badge>
            <Badge variant="emerald" size="sm" withDot>
              Ambiente Seguro
            </Badge>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#191c1d] tracking-tight">
            Configurações da Loja & Auditoria de Segurança
          </h1>
          <p className="text-xs text-[#191c1d]/60 mt-0.5">
            Parametrização do negócio em Angola e registo inalterável de eventos do sistema com mascaramento de dados sensíveis.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center bg-white p-1 rounded-xl border border-[rgba(25,28,29,0.12)]">
          <button
            onClick={() => setActiveTab('config')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'config'
                ? 'bg-[#a63500] text-white shadow-xs'
                : 'text-[#191c1d]/70 hover:text-[#191c1d]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Parâmetros da Loja
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'audit'
                ? 'bg-[#a63500] text-white shadow-xs'
                : 'text-[#191c1d]/70 hover:text-[#191c1d]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Logs de Auditoria
          </button>
        </div>
      </div>

      {activeTab === 'config' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Store Settings Form */}
          <div className="lg:col-span-8">
            <Card>
              <CardHeader>
                <CardTitle>Identificação Fiscal & Regras Comerciais</CardTitle>
                <CardDescription>
                  Dados aplicados na emissão de faturas proforma, recibos Multicaixa e termos de entrega.
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField id="cfg-store-name" label="Nome Comercial da Loja" required>
                    <Input
                      id="cfg-store-name"
                      value={storeName}
                      disabled={!canEditSettings}
                      onChange={(e) => setStoreName(e.target.value)}
                    />
                  </FormField>

                  <FormField id="cfg-nif" label="NIF (Número de Identificação Fiscal)" required hint="Certificado pela AGT">
                    <Input
                      id="cfg-nif"
                      value={nif}
                      disabled={!canEditSettings}
                      onChange={(e) => setNif(e.target.value)}
                    />
                  </FormField>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField id="cfg-vat" label="Taxa Normal de IVA (%)" required hint="Regime Geral de IVA em Angola (14%)">
                    <Input
                      id="cfg-vat"
                      type="number"
                      value={vatRate}
                      disabled={!canEditSettings}
                      onChange={(e) => setVatRate(Number(e.target.value))}
                    />
                  </FormField>

                  <FormField id="cfg-currency" label="Moeda Base de Operação">
                    <Input
                      id="cfg-currency"
                      value={currency}
                      disabled
                    />
                  </FormField>
                </div>

                <div className="border-t border-[rgba(25,28,29,0.08)] pt-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#191c1d]/60 mb-3">
                    Taxas de Envio para Luanda & Províncias
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      id="cfg-shipping-express"
                      label="Custo Padrão Luanda Express (Kz)"
                      hint="Entrega no mesmo dia em Talatona, Kilamba, Maianga, etc."
                    >
                      <Input
                        id="cfg-shipping-express"
                        type="number"
                        value={luandaExpressFeeKz}
                        disabled={!canEditSettings}
                        onChange={(e) => setLuandaExpressFeeKz(Number(e.target.value))}
                      />
                    </FormField>

                    <FormField
                      id="cfg-shipping-free"
                      label="Portes Grátis a partir de (Kz)"
                      hint="Compras acima deste valor têm entrega gratuita"
                    >
                      <Input
                        id="cfg-shipping-free"
                        type="number"
                        value={freeShippingThresholdKz}
                        disabled={!canEditSettings}
                        onChange={(e) => setFreeShippingThresholdKz(Number(e.target.value))}
                      />
                    </FormField>
                  </div>
                </div>

                <div className="flex justify-end pt-3 border-t border-[rgba(25,28,29,0.08)]">
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={!canEditSettings}
                  >
                    Gravar Parâmetros
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Security Summary Panel */}
          <div className="lg:col-span-4 space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <CardTitle className="text-base">Garantias de Segurança</CardTitle>
                </div>
              </CardHeader>
              <div className="space-y-3 text-xs text-[#191c1d]/80">
                <div className="p-3 bg-[#f8f9fa] rounded-xl border border-[rgba(25,28,29,0.08)]">
                  <span className="font-bold text-[#191c1d] block">Zero Segredos no Frontend</span>
                  <p className="mt-0.5 text-[11px] text-[#191c1d]/60">
                    Chaves de API da EMIS, senhas e tokens de administração permanecem exclusivamente nas variáveis de ambiente server-side.
                  </p>
                </div>

                <div className="p-3 bg-[#f8f9fa] rounded-xl border border-[rgba(25,28,29,0.08)]">
                  <span className="font-bold text-[#191c1d] block">Autoridade Server-Side</span>
                  <p className="mt-0.5 text-[11px] text-[#191c1d]/60">
                    O frontend oculta botões para usabilidade, mas é o backend que bloqueia requisições com códigos HTTP 401 e 403.
                  </p>
                </div>

                <div className="p-3 bg-[#f8f9fa] rounded-xl border border-[rgba(25,28,29,0.08)]">
                  <span className="font-bold text-[#191c1d] block">Conformidade de Auditoria</span>
                  <p className="mt-0.5 text-[11px] text-[#191c1d]/60">
                    Todas as operações perigosas (preço, stock, publicação, reembolso) geram registo de auditoria com data, autor e IP mascarado.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Trilha de Auditoria Interna (Audit Trail)</CardTitle>
                  <CardDescription>
                    Registo em tempo real das mutações e tentativas de acesso aos dados da Zenza Shop.
                  </CardDescription>
                </div>
                <Badge variant="emerald" size="sm" withDot>
                  Logs Criptografados
                </Badge>
              </div>
            </CardHeader>

            <DataTable
              columns={auditColumns}
              data={initialAuditLogs}
              keyExtractor={(item) => item.id}
              totalItems={initialAuditLogs.length}
            />
          </Card>
        </div>
      )}
    </div>
  );
};
