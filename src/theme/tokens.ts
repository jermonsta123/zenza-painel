import { NavGroup } from '../types';

export const THEME_TOKENS = {
  colors: {
    primary: '#a63500',        // Cor principal
    primaryHover: '#d04400',   // Hover e destaque forte
    primarySoft: '#ffb59c',    // Destaque suave
    primaryLight: '#fff3ef',   // Fundo de destaque sutil
    background: '#f8f9fa',     // Fundo geral
    textPrimary: '#191c1d',    // Texto principal
    surface: '#ffffff',        // Superfícies
    border: 'rgba(25, 28, 29, 0.10)', // Bordas
    borderHover: 'rgba(25, 28, 29, 0.20)',
    // Semânticas
    success: {
      bg: '#ecfdf5',
      text: '#065f46',
      border: '#a7f3d0',
      dot: '#10b981',
    },
    warning: {
      bg: '#fffbeb',
      text: '#92400e',
      border: '#fde68a',
      dot: '#f59e0b',
    },
    error: {
      bg: '#fef2f2',
      text: '#991b1b',
      border: '#fecaca',
      dot: '#ef4444',
    },
    info: {
      bg: '#eff6ff',
      text: '#1e40af',
      border: '#bfdbfe',
      dot: '#3b82f6',
    },
    neutral: {
      bg: '#f3f4f6',
      text: '#374151',
      border: '#e5e7eb',
      dot: '#6b7280',
    },
  },
  typography: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    weights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    }
  },
  radii: {
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    pill: '9999px',
  }
};

/**
 * Format numerical amounts into Angolan Kwanza (AOA / Kz)
 * Example: 24500 -> "24.500,00 Kz"
 */
export function formatKz(amount: number, includeDecimals = true): string {
  if (isNaN(amount)) return '0,00 Kz';
  
  const parts = amount.toFixed(includeDecimals ? 2 : 0).split('.');
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
  if (includeDecimals) {
    return `${integerPart},${parts[1]} Kz`;
  }
  return `${integerPart} Kz`;
}

/**
 * Standard Navigation Groups as defined in the specification
 */
export const NAVIGATION_GROUPS: NavGroup[] = [
  {
    id: 'dashboard',
    label: 'Principal',
    items: [
      { id: 'dashboard', label: 'Dashboard', iconName: 'LayoutDashboard', groupId: 'dashboard' },
      { id: 'design-system', label: 'Design System & UI', iconName: 'Palette', badge: 'Guia Base', badgeVariant: 'brand', groupId: 'dashboard' },
    ],
  },
  {
    id: 'catalogo',
    label: 'Catálogo',
    items: [
      { id: 'produtos', label: 'Produtos', iconName: 'Package', badge: '1.240', badgeVariant: 'neutral', groupId: 'catalogo' },
      { id: 'categorias', label: 'Categorias', iconName: 'FolderTree', groupId: 'catalogo' },
      { id: 'stock', label: 'Stock & Inventário', iconName: 'Boxes', badge: '4 em alerta', badgeVariant: 'amber', groupId: 'catalogo' },
    ],
  },
  {
    id: 'operacoes',
    label: 'Operações',
    items: [
      { id: 'pedidos', label: 'Pedidos', iconName: 'ShoppingBag', badge: '12 novos', badgeVariant: 'emerald', groupId: 'operacoes' },
      { id: 'pagamentos', label: 'Pagamentos (MCX/BAI)', iconName: 'CreditCard', groupId: 'operacoes' },
      { id: 'entregas', label: 'Entregas & Luanda Express', iconName: 'Truck', badge: '3 em rota', badgeVariant: 'neutral', groupId: 'operacoes' },
    ],
  },
  {
    id: 'clientes',
    label: 'Clientes',
    items: [
      { id: 'clientes', label: 'Lista de Clientes', iconName: 'Users', groupId: 'clientes' },
    ],
  },
  {
    id: 'marketing',
    label: 'Marketing',
    items: [
      { id: 'cupoes', label: 'Cupões de Desconto', iconName: 'Ticket', groupId: 'marketing' },
      { id: 'afiliados', label: 'Afiliados & Parcerias', iconName: 'Handshake', groupId: 'marketing' },
    ],
  },
  {
    id: 'conteudo',
    label: 'Conteúdo',
    items: [
      { id: 'avaliacoes', label: 'Avaliações de Clientes', iconName: 'Star', badge: '5 pendentes', badgeVariant: 'amber', groupId: 'conteudo' },
    ],
  },
  {
    id: 'administracao',
    label: 'Administração',
    items: [
      { id: 'utilizadores', label: 'Utilizadores & Operadores', iconName: 'ShieldAlert', groupId: 'administracao' },
      { id: 'permissoes', label: 'Permissões (RBAC)', iconName: 'KeyRound', groupId: 'administracao' },
      { id: 'configuracoes', label: 'Configurações da Loja', iconName: 'Settings', groupId: 'administracao' },
      { id: 'erros-demo', label: 'Estados de Erro & HTTP', iconName: 'AlertTriangle', badge: 'HTTP', badgeVariant: 'neutral', groupId: 'administracao' },
    ],
  },
];
