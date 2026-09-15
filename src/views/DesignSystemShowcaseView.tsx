import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { MetricCard } from '../components/ui/MetricCard';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { FormField } from '../components/ui/FormField';
import { Textarea, Checkbox, Switch } from '../components/ui/FormControls';
import { Tabs } from '../components/ui/NavigationControls';
import { Modal, ConfirmDialog } from '../components/ui/Modal';
import { Skeleton, EmptyState } from '../components/ui/FeedbackStates';
import { StateView, HttpErrorCode } from '../components/ui/StateView';
import { useToast } from '../context/ToastContext';
import { THEME_TOKENS, formatKz } from '../theme/tokens';
import { 
  Check, 
  Trash2, 
  Sparkles, 
  Plus, 
  Search, 
  Download, 
  Filter, 
  Package, 
  ShoppingBag, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle, 
  DollarSign, 
  Eye, 
  Layers,
  Smartphone,
  Laptop,
  Monitor
} from 'lucide-react';

export const DesignSystemShowcaseView: React.FC = () => {
  const { success, error, warning, info } = useToast();

  // Interactive component state for playground
  const [activeTab, setActiveTab] = useState<'tokens' | 'buttons' | 'forms' | 'feedback' | 'dialogs' | 'errors'>('tokens');
  const [buttonLoading, setButtonLoading] = useState(false);
  
  // Modals state
  const [isBasicModalOpen, setIsBasicModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);

  // Form input values
  const [sampleEmail, setSampleEmail] = useState('operador@zenza.ao');
  const [samplePrice, setSamplePrice] = useState('45000');
  const [hasFormError, setHasFormError] = useState(false);
  const [switchActive, setSwitchActive] = useState(true);
  const [checkboxAccepted, setCheckboxAccepted] = useState(true);
  const [selectedHttpError, setSelectedHttpError] = useState<HttpErrorCode>('403');

  const handleSimulateSubmit = () => {
    setButtonLoading(true);
    setTimeout(() => {
      setButtonLoading(false);
      success('Operação Concluída com Sucesso', 'Os dados do formulário foram validados conforme o Design System Zenza.');
    }, 1200);
  };

  const handleConfirmAction = () => {
    setIsConfirmLoading(true);
    setTimeout(() => {
      setIsConfirmLoading(false);
      setIsConfirmOpen(false);
      error('Item Eliminado', 'O registo foi removido após confirmação explícita.');
    }, 1000);
  };

  return (
    <div className="space-y-8">
      {/* Design System Hero Header */}
      <div className="bg-white rounded-2xl border border-[rgba(25,28,29,0.10)] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge variant="brand" size="md">
                Etapa 1: Design System & Fundação
              </Badge>
              <Badge variant="emerald" size="sm" withDot>
                Zenza Shop Angola
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#191c1d] tracking-tight">
              Design System & Biblioteca de Componentes Admin
            </h1>
            <p className="text-sm text-[#191c1d]/70 leading-relaxed">
              Fundação visual padronizada para o painel de gestão operacional Zenza Shop.
              Tokens de cor `#a63500`, tipografia Plus Jakarta Sans, feedback acessível e conformidade com os requisitos da loja.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={() => info('Design Tokens', 'Paleta: Primária #a63500, Fundo #f8f9fa, Superfície #ffffff')}
            >
              Exportar Tokens
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Sparkles className="w-4 h-4" />}
              onClick={() => success('Ambiente Pronto', 'O Design System está pronto para suportar a Etapa 2 (Cadastro de Produtos).')}
            >
              Validar Conformidade
            </Button>
          </div>
        </div>

        {/* Navigation Tabs for Showcase */}
        <div className="mt-8 pt-4 border-t border-[rgba(25,28,29,0.08)]">
          <Tabs
            tabs={[
              { id: 'tokens', label: '1. Tokens Visuais & Cores' },
              { id: 'buttons', label: '2. Botões & Badges' },
              { id: 'forms', label: '3. Formulários & Validação' },
              { id: 'feedback', label: '4. Toasts, Skeleton & Empty' },
              { id: 'dialogs', label: '5. Modais & Confirmações' },
              { id: 'errors', label: '6. Estados HTTP (401, 403, 500)' },
            ]}
            activeTab={activeTab}
            onChange={(tab) => setActiveTab(tab as typeof activeTab)}
            variant="underline"
          />
        </div>
      </div>

      {/* TAB 1: TOKENS & METRICS */}
      {activeTab === 'tokens' && (
        <div className="space-y-6">
          {/* Color Palette Cards */}
          <Card>
            <CardHeader>
              <CardTitle>Paleta Oficial Zenza Shop</CardTitle>
              <CardDescription>
                Tokens estritos definidos na especificação. Nunca usar cores aleatórias ou gradientes desconectados.
              </CardDescription>
            </CardHeader>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="flex flex-col gap-2">
                <div className="h-16 rounded-xl bg-[#a63500] shadow-sm flex items-end p-2 text-white font-mono text-xs font-bold">
                  #a63500
                </div>
                <div className="text-xs">
                  <p className="font-bold text-[#191c1d]">Cor Principal</p>
                  <p className="text-[#191c1d]/60 text-[11px]">Ações, active items</p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="h-16 rounded-xl bg-[#d04400] shadow-sm flex items-end p-2 text-white font-mono text-xs font-bold">
                  #d04400
                </div>
                <div className="text-xs">
                  <p className="font-bold text-[#191c1d]">Hover & Destaque</p>
                  <p className="text-[#191c1d]/60 text-[11px]">Hover primário</p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="h-16 rounded-xl bg-[#ffb59c] shadow-sm flex items-end p-2 text-[#a63500] font-mono text-xs font-bold">
                  #ffb59c
                </div>
                <div className="text-xs">
                  <p className="font-bold text-[#191c1d]">Destaque Suave</p>
                  <p className="text-[#191c1d]/60 text-[11px]">Bordas de badge, focus</p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="h-16 rounded-xl bg-[#f8f9fa] border border-[rgba(25,28,29,0.12)] flex items-end p-2 text-[#191c1d] font-mono text-xs font-bold">
                  #f8f9fa
                </div>
                <div className="text-xs">
                  <p className="font-bold text-[#191c1d]">Fundo Geral</p>
                  <p className="text-[#191c1d]/60 text-[11px]">Canvas do admin</p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="h-16 rounded-xl bg-[#191c1d] shadow-sm flex items-end p-2 text-white font-mono text-xs font-bold">
                  #191c1d
                </div>
                <div className="text-xs">
                  <p className="font-bold text-[#191c1d]">Texto Principal</p>
                  <p className="text-[#191c1d]/60 text-[11px]">Tipografia de leitura</p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="h-16 rounded-xl bg-white border border-[rgba(25,28,29,0.15)] flex items-end p-2 text-[#191c1d] font-mono text-xs font-bold">
                  #ffffff
                </div>
                <div className="text-xs">
                  <p className="font-bold text-[#191c1d]">Superfícies</p>
                  <p className="text-[#191c1d]/60 text-[11px]">Cards, modais, tabelas</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Metric KPI Cards in Kwanza */}
          <div>
            <h2 className="text-base font-bold text-[#191c1d] mb-4">
              Cards de Métricas Operacionais (Kwanza - AOA)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Vendas Hoje (Kz)"
                value={formatKz(845200, false)}
                iconName="CreditCard"
                variant="brand"
                change={{ value: '+18.4%', trend: 'up', label: 'vs. ontem' }}
              />
              <MetricCard
                title="Pedidos Concluídos"
                value="48"
                unit="pedidos"
                iconName="ShoppingBag"
                variant="emerald"
                change={{ value: '+6', trend: 'up', label: 'nesta manhã' }}
              />
              <MetricCard
                title="Alertas de Stock"
                value="4"
                unit="produtos"
                iconName="AlertTriangle"
                variant="amber"
                change={{ value: '2 críticos', trend: 'down', label: 'precisam reposição' }}
              />
              <MetricCard
                title="Taxa de Entrega Luanda"
                value="96.2%"
                iconName="Truck"
                variant="blue"
                change={{ value: '+1.2%', trend: 'up', label: 'no mesmo dia' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BUTTONS & BADGES */}
      {activeTab === 'buttons' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Variações de Botões</CardTitle>
              <CardDescription>
                Regra matemática: Padding horizontal é exatamente 2x o padding vertical. Estados loading desativam o botão e exibem spinner.
              </CardDescription>
            </CardHeader>

            <div className="space-y-6">
              {/* Variants */}
              <div>
                <span className="text-xs font-bold text-[#191c1d]/50 uppercase tracking-wider block mb-3">
                  Variantes de Ação
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="primary">Botão Primário</Button>
                  <Button variant="secondary">Botão Secundário</Button>
                  <Button variant="outline">Botão Outline</Button>
                  <Button variant="soft">Botão Soft</Button>
                  <Button variant="destructive" leftIcon={<Trash2 className="w-4 h-4" />}>
                    Eliminar Registo
                  </Button>
                  <Button variant="ghost">Botão Ghost</Button>
                </div>
              </div>

              {/* Sizes */}
              <div>
                <span className="text-xs font-bold text-[#191c1d]/50 uppercase tracking-wider block mb-3">
                  Escala de Tamanhos
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm">Pequeno (sm - 32px)</Button>
                  <Button size="md">Normal (md - 40px)</Button>
                  <Button size="lg">Grande (lg - 48px)</Button>
                  <Button size="icon" aria-label="Ação rápida">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* States: Loading and Disabled */}
              <div>
                <span className="text-xs font-bold text-[#191c1d]/50 uppercase tracking-wider block mb-3">
                  Estados Interativos (Loading & Desativado)
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    variant="primary"
                    isLoading={buttonLoading}
                    onClick={handleSimulateSubmit}
                  >
                    {buttonLoading ? 'A Guardar...' : 'Simular Operação com Loading'}
                  </Button>
                  <Button variant="primary" disabled>
                    Primário Desativado
                  </Button>
                  <Button variant="outline" disabled>
                    Outline Desativado
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Badges & Chips Semânticos</CardTitle>
              <CardDescription>
                Texto estritamente em uma linha (sem quebra ou hifenização). Combina cor com texto ou ponto indicador.
              </CardDescription>
            </CardHeader>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <Badge variant="emerald" withDot>Pago (Multicaixa)</Badge>
                <Badge variant="emerald">Entregue</Badge>
                <Badge variant="amber" withDot>Pendente de Validação</Badge>
                <Badge variant="amber">Stock Baixo (2 un)</Badge>
                <Badge variant="red" withDot>Cancelado</Badge>
                <Badge variant="red">Esgotado</Badge>
                <Badge variant="blue" withDot>A Caminho (Luanda Express)</Badge>
                <Badge variant="brand">Zenza Destaque</Badge>
                <Badge variant="neutral">Rascunho</Badge>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 pt-3 border-t border-[rgba(25,28,29,0.06)]">
                <span className="text-xs font-medium text-[#191c1d]/60 mr-2">Tamanho Pequeno (sm):</span>
                <Badge variant="emerald" size="sm" withDot>Ativo</Badge>
                <Badge variant="amber" size="sm" withDot>Pendente</Badge>
                <Badge variant="red" size="sm" withDot>Erro</Badge>
                <Badge variant="brand" size="sm">Zenza</Badge>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 3: FORMS */}
      {activeTab === 'forms' && (
        <div className="space-y-6">
          <Card>
            <CardHeader
              action={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setHasFormError(!hasFormError)}
                >
                  {hasFormError ? 'Limpar Erros' : 'Simular Estado de Erro'}
                </Button>
              }
            >
              <CardTitle>Controlos de Formulário</CardTitle>
              <CardDescription>
                Labels explicitamente associadas via htmlFor, mensagens de erro acessíveis e suporte a moeda Kwanza.
              </CardDescription>
            </CardHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl">
              <FormField
                label="Email do Operador"
                htmlFor="input-email"
                required
                error={hasFormError ? 'Email inválido ou já registado no sistema da loja.' : undefined}
                helperText="Endereço corporativo autorizado para o painel."
              >
                <Input
                  id="input-email"
                  type="email"
                  value={sampleEmail}
                  onChange={(e) => setSampleEmail(e.target.value)}
                  error={hasFormError}
                  placeholder="ex: gestor@zenza.ao"
                />
              </FormField>

              <FormField
                label="Preço em Kwanza (AOA)"
                htmlFor="input-price"
                required
                error={hasFormError ? 'O valor deve ser superior a 100 Kz.' : undefined}
                helperText="Valor de venda final com IVA incluído."
              >
                <Input
                  id="input-price"
                  type="number"
                  value={samplePrice}
                  onChange={(e) => setSamplePrice(e.target.value)}
                  error={hasFormError}
                  rightElement={<span className="text-xs font-bold text-[#a63500]">Kz</span>}
                />
              </FormField>

              <FormField
                label="Província de Entrega"
                htmlFor="select-province"
                required
                helperText="Zona de cobertura de estafetas Zenza."
              >
                <Select
                  id="select-province"
                  options={[
                    { value: 'luanda', label: 'Luanda (Entrega Express no mesmo dia)' },
                    { value: 'benguela', label: 'Benguela (24-48h)' },
                    { value: 'huambo', label: 'Huambo (48h)' },
                    { value: 'huila', label: 'Huíla / Lubango (48h)' },
                    { value: 'cabinda', label: 'Cabinda (Via Aérea)' },
                  ]}
                  defaultValue="luanda"
                />
              </FormField>

              <FormField
                label="Método de Pagamento Autorizado"
                htmlFor="select-payment"
                required
              >
                <Select
                  id="select-payment"
                  options={[
                    { value: 'mcx', label: 'Multicaixa Express (Automático)' },
                    { value: 'bai', label: 'BAI Directo (Validação Instantânea)' },
                    { value: 'transfer', label: 'Transferência Bancária com Comprovativo' },
                    { value: 'cod', label: 'Pagamento na Entrega (Apenas Luanda)' },
                  ]}
                  defaultValue="mcx"
                />
              </FormField>

              <div className="md:col-span-2">
                <FormField
                  label="Notas Operacionais para a Equipa de Entrega"
                  htmlFor="textarea-notes"
                  helperText="Observações internas visíveis apenas para operadores e estafetas."
                >
                  <Textarea
                    id="textarea-notes"
                    placeholder="Ex: Ligar antes de entregar na portaria do condomínio em Talatona..."
                    defaultValue="Cliente solicitou entrega preferencial no período da manhã."
                  />
                </FormField>
              </div>

              {/* Switches & Checkboxes */}
              <div className="md:col-span-2 pt-4 border-t border-[rgba(25,28,29,0.08)] space-y-4">
                <Switch
                  id="switch-active"
                  label="Notificações em tempo real via SMS/WhatsApp para o cliente"
                  description="Envia atualizações de estado do pedido para números (+244) Angola."
                  checked={switchActive}
                  onChange={(e) => setSwitchActive(e.target.checked)}
                />

                <Checkbox
                  id="checkbox-rules"
                  label="Confirmo que as taxas aduaneiras e IVA de 14% foram calculados"
                  description="Conformidade fiscal com a AGT para comércio eletrónico em Angola."
                  checked={checkboxAccepted}
                  onChange={(e) => setCheckboxAccepted(e.target.checked)}
                />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 4: FEEDBACK & SKELETON */}
      {activeTab === 'feedback' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sistema de Notificações Toast</CardTitle>
              <CardDescription>
                Mensagens de feedback não invasivas, acessíveis via live region, com barra lateral semântica e suporte a ação de desfazer.
              </CardDescription>
            </CardHeader>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="primary"
                onClick={() => success('Pedido #ORD-8492 Criado', 'O pedido foi registado e enviado para a fila de empacotamento.')}
              >
                Disparar Toast Sucesso
              </Button>
              <Button
                variant="destructive"
                onClick={() => error('Falha na Comunicação MCX', 'O serviço Multicaixa Express não respondeu. Tenta novamente.')}
              >
                Disparar Toast Erro
              </Button>
              <Button
                variant="secondary"
                onClick={() => warning('Stock Baixo Detectado', 'Restam apenas 3 unidades do produto "Ténis Urban Luanda".')}
              >
                Disparar Toast Aviso
              </Button>
              <Button
                variant="outline"
                onClick={() => info('Sincronização Concluída', '48 novos pedidos foram sincronizados com o armazém.')}
              >
                Disparar Toast Informativo
              </Button>
            </div>
          </Card>

          {/* Skeleton Loaders */}
          <Card>
            <CardHeader>
              <CardTitle>Estados de Carregamento (Skeleton)</CardTitle>
              <CardDescription>
                Skeletons fluidos com pulsação suave em vez de spinners invasivos que bloqueiam o ecrã.
              </CardDescription>
            </CardHeader>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Skeleton variant="circle" width={48} height={48} />
                <div className="space-y-2 flex-1">
                  <Skeleton variant="text" width="40%" />
                  <Skeleton variant="text" width="60%" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <Skeleton variant="card" />
                <Skeleton variant="card" />
                <Skeleton variant="card" />
              </div>
            </div>
          </Card>

          {/* Empty States */}
          <div>
            <h2 className="text-base font-bold text-[#191c1d] mb-4">
              Estado Vazio com Próxima Ação Clara
            </h2>
            <EmptyState
              icon={<ShoppingBag className="w-6 h-6" />}
              title="Nenhum Pedido Pendente para Hoje"
              description="Todos os pedidos recebidos em Luanda e províncias já foram despachados pelos estafetas Zenza."
              action={{
                label: 'Criar Pedido Manual',
                onClick: () => success('Novo Pedido Manual', 'Abertura de formulário de registo rápido.'),
                icon: <Plus className="w-4 h-4" />,
              }}
              secondaryAction={{
                label: 'Ver Histórico Completo',
                onClick: () => info('Histórico', 'A navegar para pedidos concluídos...'),
              }}
            />
          </div>
        </div>
      )}

      {/* TAB 5: DIALOGS & MODALS */}
      {activeTab === 'dialogs' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Modais e Diálogos de Confirmação</CardTitle>
              <CardDescription>
                Ações destrutivas exigem confirmação explícita. Modais não ultrapassam o viewport e são fechados com a tecla Escape.
              </CardDescription>
            </CardHeader>

            <div className="flex flex-wrap items-center gap-4">
              <Button
                variant="primary"
                onClick={() => setIsBasicModalOpen(true)}
              >
                Abrir Modal Informativo Padrão
              </Button>

              <Button
                variant="destructive"
                leftIcon={<Trash2 className="w-4 h-4" />}
                onClick={() => setIsConfirmOpen(true)}
              >
                Disparar Confirmação Destrutiva
              </Button>
            </div>
          </Card>

          {/* Basic Modal */}
          <Modal
            isOpen={isBasicModalOpen}
            onClose={() => setIsBasicModalOpen(false)}
            title="Detalhes da Política de Entregas Zenza Shop"
            description="Informação de rotas e estafetas para Luanda e províncias de Angola."
          >
            <div className="space-y-4 text-xs text-[#191c1d]/80 leading-relaxed">
              <p>
                Os pedidos realizados até às 13:00 são entregues no mesmo dia na área metropolitana de Luanda (Talatona, Kilamba, Maianga, Viana, Cazenga, Morro Bento).
              </p>
              <div className="p-3 bg-[#fff3ef] rounded-lg border border-[#ffb59c]/50 text-[#a63500] font-medium">
                Taxa Base Luanda: 2.500,00 Kz • Províncias: Sob consulta por peso.
              </div>
              <div className="flex justify-end gap-2.5 pt-4 border-t border-[rgba(25,28,29,0.08)]">
                <Button variant="secondary" size="sm" onClick={() => setIsBasicModalOpen(false)}>
                  Fechar
                </Button>
                <Button variant="primary" size="sm" onClick={() => setIsBasicModalOpen(false)}>
                  Entendido
                </Button>
              </div>
            </div>
          </Modal>

          {/* Destructive Confirm Dialog */}
          <ConfirmDialog
            isOpen={isConfirmOpen}
            onClose={() => setIsConfirmOpen(false)}
            onConfirm={handleConfirmAction}
            title="Eliminar Pedido #ORD-8492?"
            message="Esta ação é irreversível. O registo será arquivado e o stock reservado será devolvido ao armazém central Zenza."
            confirmText="Sim, Eliminar Definitivamente"
            cancelText="Cancelar"
            variant="destructive"
            isLoading={isConfirmLoading}
          />
        </div>
      )}

      {/* TAB 6: HTTP ERROR STATES */}
      {activeTab === 'errors' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Simulador de Estados HTTP & Permissões</CardTitle>
              <CardDescription>
                Mensagens compreensíveis para erros 401, 403, 404, 409 e 500 sem mensagens técnicas indecifráveis.
              </CardDescription>
            </CardHeader>

            <div className="flex flex-wrap items-center gap-2 mb-6">
              {(['401', '403', '404', '409', '500'] as HttpErrorCode[]).map((code) => (
                <Button
                  key={code}
                  variant={selectedHttpError === code ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedHttpError(code)}
                >
                  HTTP {code}
                </Button>
              ))}
            </div>

            <StateView
              code={selectedHttpError}
              onRetry={() => success('A Retentar Ligação', 'Serviço restabelecido com sucesso.')}
              onBack={() => info('Navegação', 'A regressar à tela anterior...')}
            />
          </Card>
        </div>
      )}
    </div>
  );
};
