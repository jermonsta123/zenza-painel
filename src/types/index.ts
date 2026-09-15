export type NavGroupId = 
  | 'dashboard'
  | 'catalogo'
  | 'operacoes'
  | 'clientes'
  | 'marketing'
  | 'conteudo'
  | 'administracao';

export interface NavItem {
  id: string;
  label: string;
  href?: string;
  iconName: string;
  badge?: string | number;
  badgeVariant?: 'brand' | 'amber' | 'emerald' | 'neutral';
  groupId: NavGroupId;
}

export interface NavGroup {
  id: NavGroupId;
  label: string;
  items: NavItem[];
}

export type StatusVariant = 
  | 'emerald' // Success / Pago / Entregue / Ativo
  | 'amber'   // Warning / Pendente / Em Preparação / Stock Baixo
  | 'red'     // Error / Cancelado / Sem Stock / Rejeitado
  | 'blue'    // Info / A Caminho / Processando
  | 'brand'   // Highlight / Zenza Accent
  | 'neutral';// Draft / Inativo / Arquivado

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

export interface MetricCardData {
  id: string;
  title: string;
  value: string;
  unit?: string;
  change?: {
    value: string;
    trend: 'up' | 'down' | 'neutral';
    label: string;
  };
  iconName: string;
  variant?: 'brand' | 'emerald' | 'amber' | 'blue' | 'neutral';
  tooltip?: string;
}

export interface OrderItem {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerCity: string;
  totalKz: number;
  itemsCount: number;
  status: 'pendente' | 'pago' | 'em_preparacao' | 'a_caminho' | 'entregue' | 'cancelado';
  paymentMethod: 'multicaixa_express' | 'bai_directo' | 'transferencia' | 'pagamento_entrega';
  date: string;
  deliveryDate?: string;
}

export * from './product';

export type UserRole = 'admin' | 'catalog_operator' | 'orders_operator' | 'viewer';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleLabel: string;
  avatarUrl?: string;
  status: 'active' | 'suspended';
  lastLogin: string;
  twoFactorEnabled: boolean;
  department: string;
}

export type PermissionAction =
  | 'manage_products'
  | 'publish_products'
  | 'delete_products'
  | 'edit_prices'
  | 'manage_stock'
  | 'manage_categories'
  | 'manage_orders'
  | 'cancel_orders'
  | 'confirm_payments'
  | 'refund_orders'
  | 'manage_coupons'
  | 'moderate_reviews'
  | 'manage_users'
  | 'view_audit_logs'
  | 'edit_settings';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}
