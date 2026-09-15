import { NAVIGATION_GROUPS } from '../theme/tokens';

export const VIEW_TO_PATH: Record<string, string> = {
  dashboard: '/',
  'design-system': '/design-system',
  produtos: '/produtos',
  categorias: '/categorias',
  stock: '/stock',
  pedidos: '/pedidos',
  pagamentos: '/pagamentos',
  entregas: '/entregas',
  clientes: '/clientes',
  cupoes: '/cupoes',
  afiliados: '/afiliados',
  avaliacoes: '/avaliacoes',
  utilizadores: '/utilizadores',
  permissoes: '/permissoes',
  configuracoes: '/configuracoes',
  'erros-demo': '/erros-demo',
};

export const PATH_TO_VIEW: Record<string, string> = {
  '/': 'dashboard',
  '/design-system': 'design-system',
  '/produtos': 'produtos',
  '/categorias': 'categorias',
  '/stock': 'stock',
  '/pedidos': 'pedidos',
  '/pagamentos': 'pagamentos',
  '/entregas': 'entregas',
  '/clientes': 'clientes',
  '/cupoes': 'cupoes',
  '/afiliados': 'afiliados',
  '/avaliacoes': 'avaliacoes',
  '/utilizadores': 'utilizadores',
  '/permissoes': 'permissoes',
  '/configuracoes': 'configuracoes',
  '/erros-demo': 'erros-demo',
};

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export function getNavInfo(pathname: string): {
  currentView: string;
  title: string;
  groupLabel: string;
  breadcrumbs: BreadcrumbItem[];
} {
  // Normalize pathname: remove trailing slash if not root
  const cleanPath = pathname !== '/' && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  
  // Find matching view from cleanPath or subpath
  let viewId = PATH_TO_VIEW[cleanPath];
  if (!viewId) {
    const firstSegment = '/' + cleanPath.split('/')[1];
    viewId = PATH_TO_VIEW[firstSegment] || 'dashboard';
  }

  for (const group of NAVIGATION_GROUPS) {
    const item = group.items.find((i) => i.id === viewId);
    if (item) {
      return {
        currentView: item.id,
        title: item.label,
        groupLabel: group.label,
        breadcrumbs: [
          { label: 'Admin', href: '/' },
          { label: group.label },
          { label: item.label },
        ],
      };
    }
  }

  return {
    currentView: 'dashboard',
    title: 'Painel Central',
    groupLabel: 'Principal',
    breadcrumbs: [{ label: 'Admin', href: '/' }, { label: 'Visão Geral' }],
  };
}
