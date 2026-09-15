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
import { UserRole, UserProfile } from '../types';
import { 
  Shield, 
  KeyRound, 
  Search, 
  Plus, 
  UserCheck, 
  ShieldAlert, 
  ShieldCheck, 
  Lock, 
  AlertTriangle,
  UserX,
  Mail,
  Building2
} from 'lucide-react';

const initialAdminUsers: UserProfile[] = [
  {
    id: 'usr-admin-01',
    name: 'Manuel Silva',
    email: 'manuel.silva@zenza.ao',
    role: 'admin',
    roleLabel: 'Administrador Geral',
    department: 'Direção de Operações & Tecnologia',
    status: 'active',
    lastLogin: 'Hoje, às 08:30',
    twoFactorEnabled: true,
  },
  {
    id: 'usr-cat-02',
    name: 'Esperança Dinis',
    email: 'esperanca.dinis@zenza.ao',
    role: 'catalog_operator',
    roleLabel: 'Operador de Catálogo',
    department: 'Gestão de Produtos e Inventário',
    status: 'active',
    lastLogin: 'Hoje, às 09:12',
    twoFactorEnabled: true,
  },
  {
    id: 'usr-ord-03',
    name: 'António Kuanza',
    email: 'antonio.kuanza@zenza.ao',
    role: 'orders_operator',
    roleLabel: 'Operador de Pedidos',
    department: 'Logística & Atendimento Multicaixa',
    status: 'active',
    lastLogin: 'Hoje, às 07:45',
    twoFactorEnabled: false,
  },
  {
    id: 'usr-view-04',
    name: 'Auditoria KPMG Angola',
    email: 'auditoria.fiscal@zenza.ao',
    role: 'viewer',
    roleLabel: 'Leitor / Auditor',
    department: 'Fiscalização e Conformidade AGT',
    status: 'active',
    lastLogin: 'Ontem, às 16:20',
    twoFactorEnabled: true,
  },
  {
    id: 'usr-sup-05',
    name: 'Fátima Lourenço',
    email: 'fatima.lourenco@zenza.ao',
    role: 'orders_operator',
    roleLabel: 'Operador de Pedidos',
    department: 'Apoio ao Cliente e Devoluções',
    status: 'suspended',
    lastLogin: '05 Set 2026',
    twoFactorEnabled: true,
  },
];

export const AdminUsersView: React.FC = () => {
  const { success, warning, error: toastError, info } = useToast();
  const { currentUser, currentRole, setRole, can } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>(initialAdminUsers);
  const [searchQuery, setSearchQuery] = useState('');

  // Dangerous Operation States
  const [userToEditRole, setUserToEditRole] = useState<UserProfile | null>(null);
  const [targetNewRole, setTargetNewRole] = useState<UserRole>('viewer');
  const [showRoleConfirmDialog, setShowRoleConfirmDialog] = useState(false);

  const canManageUsers = can('manage_users');

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.roleLabel.toLowerCase().includes(q) ||
      u.department.toLowerCase().includes(q)
    );
  });

  const handleOpenRoleEdit = (user: UserProfile) => {
    if (!canManageUsers) {
      toastError('Acesso Negado (HTTP 403)', 'Apenas o Administrador Geral pode alterar papéis e permissões.');
      return;
    }
    setUserToEditRole(user);
    setTargetNewRole(user.role);
  };

  const handleApplyRoleChange = () => {
    if (!userToEditRole) return;

    const roleLabels: Record<UserRole, string> = {
      admin: 'Administrador Geral',
      catalog_operator: 'Operador de Catálogo',
      orders_operator: 'Operador de Pedidos',
      viewer: 'Leitor / Auditor',
    };

    setUsers((prev) =>
      prev.map((u) =>
        u.id === userToEditRole.id
          ? { ...u, role: targetNewRole, roleLabel: roleLabels[targetNewRole] }
          : u
      )
    );

    warning(
      'Permissões Alteradas com Sucesso',
      `O utilizador ${userToEditRole.name} agora possui o perfil de ${roleLabels[targetNewRole]}. O token de sessão foi invalidado no servidor para forçar nova autenticação.`
    );

    setShowRoleConfirmDialog(false);
    setUserToEditRole(null);
  };

  const columns: Column<UserProfile>[] = [
    {
      key: 'name',
      header: 'Utilizador / Email',
      priority: 'high',
      render: (item) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs text-[#191c1d]">{item.name}</span>
            {item.id === currentUser.id && (
              <Badge variant="brand" size="sm">Você</Badge>
            )}
          </div>
          <span className="text-[11px] text-[#191c1d]/50 flex items-center gap-1 mt-0.5">
            <Mail className="w-3 h-3" />
            {item.email}
          </span>
        </div>
      ),
    },
    {
      key: 'department',
      header: 'Departamento',
      priority: 'medium',
      render: (item) => (
        <span className="text-xs text-[#191c1d]/70 flex items-center gap-1">
          <Building2 className="w-3.5 h-3.5 text-[#a63500]" />
          {item.department}
        </span>
      ),
    },
    {
      key: 'role',
      header: 'Perfil RBAC',
      priority: 'high',
      render: (item) => {
        if (item.role === 'admin') {
          return <Badge variant="brand" size="sm" withDot>Administrador</Badge>;
        }
        if (item.role === 'catalog_operator') {
          return <Badge variant="neutral" size="sm">Catálogo & Stock</Badge>;
        }
        if (item.role === 'orders_operator') {
          return <Badge variant="emerald" size="sm">Pedidos & Caixa</Badge>;
        }
        return <Badge variant="neutral" size="sm">Leitor</Badge>;
      },
    },
    {
      key: 'twoFactor',
      header: 'Segurança (2FA)',
      priority: 'medium',
      render: (item) => (
        item.twoFactorEnabled ? (
          <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            2FA Ativo
          </span>
        ) : (
          <span className="text-[11px] text-amber-700 font-semibold flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            2FA Pendente
          </span>
        )
      ),
    },
    {
      key: 'status',
      header: 'Estado',
      align: 'center',
      priority: 'medium',
      render: (item) => (
        item.status === 'active' ? (
          <Badge variant="emerald" size="sm">Ativo</Badge>
        ) : (
          <Badge variant="red" size="sm">Suspenso</Badge>
        )
      ),
    },
    {
      key: 'actions',
      header: 'Ações',
      align: 'right',
      priority: 'high',
      render: (item) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            variant="outline"
            size="sm"
            disabled={!canManageUsers}
            onClick={() => handleOpenRoleEdit(item)}
            leftIcon={<KeyRound className="w-3.5 h-3.5" />}
          >
            Alterar Papel
          </Button>
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
              Segurança & RBAC
            </Badge>
            <Badge variant="emerald" size="sm" withDot>
              Autenticação Centralizada
            </Badge>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#191c1d] tracking-tight">
            Utilizadores Administrativos & Matriz de Permissões
          </h1>
          <p className="text-xs text-[#191c1d]/60 mt-0.5">
            Controlo de acessos baseado em funções (RBAC). A autorização é estritamente validada no servidor.
          </p>
        </div>
      </div>

      {/* Role Switcher Test Bar (For Testing Visual Permissions) */}
      <div className="p-4 bg-[#fff3ef] border border-[#ffb59c] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <span className="text-xs font-bold text-[#a63500] uppercase tracking-wider block">
            Simulação de Papéis no Frontend (Visual Testing)
          </span>
          <p className="text-xs text-[#191c1d]/75 mt-0.5 max-w-xl">
            Teste como a interface reage para cada perfil. As regras visuais escondem botões para melhorar a experiência, mas todas as ações perigosas e chamadas de API são protegidas e autorizadas pelo servidor (HTTP 401/403).
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {(['admin', 'catalog_operator', 'orders_operator', 'viewer'] as UserRole[]).map((r) => (
            <button
              key={r}
              onClick={() => {
                setRole(r);
                info('Papel Alterado', `Agora está a simular o perfil de ${r}.`);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentRole === r
                  ? 'bg-[#a63500] text-white shadow-xs'
                  : 'bg-white text-[#191c1d]/80 border border-[rgba(25,28,29,0.15)] hover:bg-gray-100'
              }`}
            >
              {r === 'admin'
                ? 'Admin'
                : r === 'catalog_operator'
                ? 'Catálogo'
                : r === 'orders_operator'
                ? 'Pedidos'
                : 'Leitor'}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-xl border border-[rgba(25,28,29,0.10)] flex items-center justify-between gap-3 shadow-xs">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Pesquisar por nome, email ou departamento..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftElement={<Search className="w-4 h-4 text-[#191c1d]/40" />}
            inputSize="sm"
          />
        </div>

        {!canManageUsers && (
          <span className="text-xs text-amber-700 font-medium flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" /> Apenas Administradores podem gerir privilégios
          </span>
        )}
      </div>

      {/* Users Table */}
      <DataTable
        columns={columns}
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        totalItems={filteredUsers.length}
      />

      {/* Modal: Select New Role */}
      {userToEditRole && !showRoleConfirmDialog && (
        <Modal
          isOpen={Boolean(userToEditRole)}
          onClose={() => setUserToEditRole(null)}
          title={`Alterar Permissões de ${userToEditRole.name}`}
          description={`Email: ${userToEditRole.email} • Perfil atual: ${userToEditRole.roleLabel}`}
        >
          <div className="space-y-4 text-xs">
            <FormField id="select-role" label="Novo Papel Atribuído" required>
              <select
                id="select-role"
                value={targetNewRole}
                onChange={(e) => setTargetNewRole(e.target.value as UserRole)}
                className="w-full h-10 px-3 rounded-lg border border-[rgba(25,28,29,0.15)] bg-white text-xs font-medium focus:ring-2 focus:ring-[#a63500]"
              >
                <option value="admin">Administrador Geral (Acesso Pleno)</option>
                <option value="catalog_operator">Operador de Catálogo (Produtos & Stock)</option>
                <option value="orders_operator">Operador de Pedidos (Vendas & Pagamentos)</option>
                <option value="viewer">Leitor / Auditor (Apenas Consulta)</option>
              </select>
            </FormField>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900">
              <span className="font-bold block">Impacto da Operação:</span>
              <p className="mt-1 text-amber-800">
                Esta alteração modifica imediatamente o acesso a dados confidenciais, emissão de faturas e configurações críticas da loja.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[rgba(25,28,29,0.08)]">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setUserToEditRole(null)}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowRoleConfirmDialog(true)}
              >
                Avançar para Confirmação
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Confirm Role Change (Dangerous Operation Dialog) */}
      <ConfirmDialog
        isOpen={showRoleConfirmDialog}
        onClose={() => setShowRoleConfirmDialog(false)}
        onConfirm={handleApplyRoleChange}
        title={`Confirmar alteração de permissões para ${userToEditRole?.name}?`}
        description={`Tem certeza de que deseja atribuir o papel de "${targetNewRole}" a este utilizador? Todas as sessões ativas do utilizador serão invalidadas e os novos privilégios passarão a vigorar.`}
        confirmLabel="Sim, Confirmar Alteração de Papel"
        cancelLabel="Voltar"
        variant="warning"
      />
    </div>
  );
};
