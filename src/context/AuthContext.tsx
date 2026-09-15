import React, { createContext, useContext, useState } from 'react';
import { UserRole, UserProfile, PermissionAction } from '../types';

interface AuthContextType {
  currentUser: UserProfile;
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  can: (action: PermissionAction) => boolean;
  roleDescription: string;
}

const USERS_BY_ROLE: Record<UserRole, UserProfile> = {
  admin: {
    id: 'usr-admin-01',
    name: 'Manuel Silva',
    email: 'manuel.silva@zenza.ao',
    role: 'admin',
    roleLabel: 'Administrador Geral',
    department: 'Direção de Operações & Tecnologia',
    status: 'active',
    lastLogin: 'Hoje, às 08:30 (Luanda)',
    twoFactorEnabled: true,
  },
  catalog_operator: {
    id: 'usr-cat-02',
    name: 'Esperança Dinis',
    email: 'esperanca.dinis@zenza.ao',
    role: 'catalog_operator',
    roleLabel: 'Operador de Catálogo',
    department: 'Gestão de Produtos e Inventário',
    status: 'active',
    lastLogin: 'Hoje, às 09:12 (Luanda)',
    twoFactorEnabled: true,
  },
  orders_operator: {
    id: 'usr-ord-03',
    name: 'António Kuanza',
    email: 'antonio.kuanza@zenza.ao',
    role: 'orders_operator',
    roleLabel: 'Operador de Pedidos',
    department: 'Logística & Atendimento Multicaixa',
    status: 'active',
    lastLogin: 'Hoje, às 07:45 (Luanda)',
    twoFactorEnabled: false,
  },
  viewer: {
    id: 'usr-view-04',
    name: 'Auditores Externos / Leitor',
    email: 'auditoria@zenza.ao',
    role: 'viewer',
    roleLabel: 'Leitor / Auditor',
    department: 'Consulta e Fiscalização',
    status: 'active',
    lastLogin: 'Ontem, às 16:20 (Luanda)',
    twoFactorEnabled: true,
  },
};

const ROLE_PERMISSIONS: Record<UserRole, PermissionAction[]> = {
  admin: [
    'manage_products',
    'publish_products',
    'delete_products',
    'edit_prices',
    'manage_stock',
    'manage_categories',
    'manage_orders',
    'cancel_orders',
    'confirm_payments',
    'refund_orders',
    'manage_coupons',
    'moderate_reviews',
    'manage_users',
    'view_audit_logs',
    'edit_settings',
  ],
  catalog_operator: [
    'manage_products',
    'publish_products',
    'edit_prices',
    'manage_stock',
    'manage_categories',
    'manage_coupons',
  ],
  orders_operator: [
    'manage_orders',
    'cancel_orders',
    'confirm_payments',
    'refund_orders',
    'moderate_reviews',
  ],
  viewer: [
    'view_audit_logs',
  ],
};

const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  admin: 'Acesso total a todas as operações, utilizadores e configurações da Zenza Shop.',
  catalog_operator: 'Gestão do catálogo de produtos, categorias, stock e campanhas de cupões.',
  orders_operator: 'Processamento de encomendas, confirmação de Multicaixa Express e moderação de avaliações.',
  viewer: 'Apenas leitura para auditoria e relatórios. Ações de modificação e gravação estão desativadas.',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');

  const setRole = (role: UserRole) => {
    setCurrentRole(role);
  };

  const can = (action: PermissionAction): boolean => {
    const permissions = ROLE_PERMISSIONS[currentRole] || [];
    return permissions.includes(action);
  };

  const currentUser = USERS_BY_ROLE[currentRole];
  const roleDescription = ROLE_DESCRIPTIONS[currentRole];

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole,
        setRole,
        can,
        roleDescription,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
