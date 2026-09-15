import React from 'react';
import { NAVIGATION_GROUPS } from '../../theme/tokens';
import { Badge } from '../ui/Badge';
import { 
  LayoutDashboard, 
  Palette, 
  Package, 
  FolderTree, 
  Boxes, 
  ShoppingBag, 
  CreditCard, 
  Truck, 
  Users, 
  Ticket, 
  Handshake, 
  Star, 
  ShieldAlert, 
  KeyRound, 
  Settings, 
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Store,
  ExternalLink,
  Sparkles
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="w-4 h-4" />,
  Palette: <Palette className="w-4 h-4" />,
  Package: <Package className="w-4 h-4" />,
  FolderTree: <FolderTree className="w-4 h-4" />,
  Boxes: <Boxes className="w-4 h-4" />,
  ShoppingBag: <ShoppingBag className="w-4 h-4" />,
  CreditCard: <CreditCard className="w-4 h-4" />,
  Truck: <Truck className="w-4 h-4" />,
  Users: <Users className="w-4 h-4" />,
  Ticket: <Ticket className="w-4 h-4" />,
  Handshake: <Handshake className="w-4 h-4" />,
  Star: <Star className="w-4 h-4" />,
  ShieldAlert: <ShieldAlert className="w-4 h-4" />,
  KeyRound: <KeyRound className="w-4 h-4" />,
  Settings: <Settings className="w-4 h-4" />,
  AlertTriangle: <AlertTriangle className="w-4 h-4" />,
};

interface SidebarProps {
  currentView: string;
  onSelectView: (viewId: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  isCollapsed = false,
  onToggleCollapse,
  onCloseMobile,
}) => {
  return (
    <aside
      className={`bg-white border-r border-[rgba(25,28,29,0.10)] h-full flex flex-col justify-between transition-all duration-200 select-none z-30 ${
        isCollapsed ? 'w-20' : 'w-64 sm:w-72'
      }`}
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-[rgba(25,28,29,0.08)] flex items-center justify-between">
        <div 
          onClick={() => {
            onSelectView('dashboard');
            onCloseMobile?.();
          }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          {/* Logo Badge */}
          <div className="w-9 h-9 rounded-xl bg-[#a63500] text-white flex items-center justify-center font-extrabold text-lg shadow-sm group-hover:bg-[#d04400] transition-colors shrink-0">
            Z
          </div>
          
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-[#191c1d]">
                  ZENZA
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#fff3ef] text-[#a63500] border border-[#ffb59c]/50">
                  Admin
                </span>
              </div>
              <span className="text-[11px] text-[#191c1d]/60 truncate font-medium">
                Loja Angola • Luanda
              </span>
            </div>
          )}
        </div>

        {/* Collapse toggle on Desktop */}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? 'Expandir barra lateral' : 'Recolher barra lateral'}
            className="hidden lg:flex p-1.5 rounded-lg text-[#191c1d]/50 hover:text-[#191c1d] hover:bg-black/5 transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Navigation Links Scrollable Area */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-5">
        {NAVIGATION_GROUPS.map((group) => (
          <div key={group.id} className="space-y-1">
            {!isCollapsed && (
              <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#191c1d]/45">
                {group.label}
              </div>
            )}

            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = currentView === item.id;
                const icon = iconMap[item.iconName] || <LayoutDashboard className="w-4 h-4" />;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectView(item.id);
                      onCloseMobile?.();
                    }}
                    title={isCollapsed ? item.label : undefined}
                    className={`w-full flex items-center justify-between rounded-lg transition-all duration-150 text-left font-medium text-xs sm:text-sm ${
                      isCollapsed ? 'px-0 py-2.5 justify-center' : 'px-3 py-2'
                    } ${
                      isActive
                        ? 'bg-[#fff3ef] text-[#a63500] font-semibold border border-[#ffb59c]/60 shadow-xs'
                        : 'text-[#191c1d]/75 hover:bg-[#f8f9fa] hover:text-[#191c1d]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`shrink-0 ${isActive ? 'text-[#a63500]' : 'text-[#191c1d]/60'}`}>
                        {icon}
                      </span>
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </div>

                    {!isCollapsed && item.badge && (
                      <span className="shrink-0 ml-1.5">
                        <Badge
                          variant={item.badgeVariant || 'neutral'}
                          size="sm"
                        >
                          {item.badge}
                        </Badge>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Profile / Store Quick Status */}
      <div className="p-3 border-t border-[rgba(25,28,29,0.08)] bg-[#fdfefe]">
        {!isCollapsed ? (
          <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-[#f8f9fa] border border-[rgba(25,28,29,0.08)]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-[#191c1d] text-white flex items-center justify-center font-bold text-xs">
                  AO
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-[#191c1d] truncate">
                  Admin Central
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold truncate">
                  Multicaixa & BAI Ativos
                </span>
              </div>
            </div>
            
            <button
              onClick={() => onSelectView('design-system')}
              title="Design System"
              className="p-1.5 text-[#191c1d]/50 hover:text-[#a63500] hover:bg-white rounded-md transition-colors"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-[#191c1d] text-white flex items-center justify-center font-bold text-xs">
                AO
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
