import React, { useState } from 'react';
import { Breadcrumb } from '../ui/FeedbackStates';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { DropdownMenu } from '../ui/NavigationControls';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { 
  Search, 
  Bell, 
  Menu, 
  Plus, 
  User, 
  LogOut, 
  Shield, 
  Store, 
  Check, 
  Clock, 
  MapPin,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

interface HeaderProps {
  title: string;
  breadcrumbs: { label: string; onClick?: () => void }[];
  onOpenMobileMenu: () => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount?: number;
  onQuickAction?: () => void;
  onSearchClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  breadcrumbs,
  onOpenMobileMenu,
  onOpenNotifications,
  unreadNotificationsCount = 3,
  onQuickAction,
  onSearchClick,
}) => {
  const [storeLocation] = useState('Luanda - Sede Talatona');
  const { currentUser, currentRole, setRole } = useAuth();

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-[rgba(25,28,29,0.10)] px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle + Breadcrumb & Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          aria-label="Abrir menu de navegação"
          className="lg:hidden p-2 rounded-lg text-[#191c1d]/70 hover:text-[#191c1d] hover:bg-black/5 transition-colors focus:outline-none focus:ring-2 focus:ring-[#a63500]"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col min-w-0">
          <Breadcrumb items={breadcrumbs} />
          <h1 className="text-lg sm:text-xl font-bold text-[#191c1d] tracking-tight truncate mt-0.5">
            {title}
          </h1>
        </div>
      </div>

      {/* Center/Right Search & Actions */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        {/* Search Bar / Trigger */}
        <button
          onClick={onSearchClick}
          className="hidden md:flex items-center gap-2.5 px-3 py-1.5 bg-[#f8f9fa] border border-[rgba(25,28,29,0.12)] hover:border-[rgba(25,28,29,0.25)] rounded-lg text-xs text-[#191c1d]/50 transition-colors w-44 lg:w-64"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="truncate">Pesquisar pedidos, produtos...</span>
          <kbd className="hidden lg:inline-block ml-auto text-[10px] bg-white border border-[rgba(25,28,29,0.15)] rounded px-1.5 py-0.5 font-mono text-[#191c1d]/60">
            ⌘K
          </kbd>
        </button>

        {/* Mobile Search Icon */}
        <button
          onClick={onSearchClick}
          aria-label="Pesquisar"
          className="md:hidden p-2 rounded-lg text-[#191c1d]/60 hover:text-[#191c1d] hover:bg-black/5"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Store Location Badge (Desktop) */}
        <div className="hidden xl:flex items-center gap-1.5 text-xs text-[#191c1d]/70 bg-[#f8f9fa] px-2.5 py-1.5 rounded-lg border border-[rgba(25,28,29,0.08)]">
          <MapPin className="w-3.5 h-3.5 text-[#a63500]" />
          <span className="font-semibold">{storeLocation}</span>
        </div>

        {/* Notification Bell */}
        <button
          onClick={onOpenNotifications}
          aria-label={`Notificações (${unreadNotificationsCount} não lidas)`}
          className="relative p-2 rounded-lg text-[#191c1d]/60 hover:text-[#191c1d] hover:bg-black/5 transition-colors focus:outline-none focus:ring-2 focus:ring-[#a63500]"
        >
          <Bell className="w-5 h-5" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#a63500] ring-2 ring-white" />
          )}
        </button>

        {/* Primary Action Button */}
        {onQuickAction && (
          <Button
            size="sm"
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={onQuickAction}
            className="hidden sm:inline-flex"
          >
            Novo Registo
          </Button>
        )}

        {/* Active Role Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-[#fff3ef] border border-[#ffb59c] rounded-lg">
          <Shield className="w-3.5 h-3.5 text-[#a63500]" />
          <span className="text-[11px] font-bold text-[#a63500]">
            {currentUser.roleLabel}
          </span>
        </div>

        {/* User Profile Menu */}
        <DropdownMenu
          trigger={
            <button
              aria-label="Menu do utilizador"
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-black/5 transition-colors focus:outline-none focus:ring-2 focus:ring-[#a63500]"
            >
              <div className="w-8 h-8 rounded-full bg-[#fff3ef] text-[#a63500] border border-[#ffb59c] flex items-center justify-center font-bold text-xs">
                {currentUser.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold text-[#191c1d] leading-none">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-[#191c1d]/50 mt-0.5">
                  {currentUser.roleLabel}
                </span>
              </div>
              <ChevronDown className="w-3 h-3 text-[#191c1d]/40 hidden md:block" />
            </button>
          }
          items={[
            {
              id: 'profile',
              label: `${currentUser.name} (${currentUser.department})`,
              icon: <User className="w-4 h-4" />,
            },
            {
              id: 'role-admin',
              label: 'Mudar Papel: Administrador',
              icon: <Shield className="w-4 h-4 text-[#a63500]" />,
              badge: currentRole === 'admin' ? 'Ativo' : undefined,
              onClick: () => setRole('admin'),
            },
            {
              id: 'role-cat',
              label: 'Mudar Papel: Catálogo',
              icon: <Shield className="w-4 h-4 text-blue-600" />,
              badge: currentRole === 'catalog_operator' ? 'Ativo' : undefined,
              onClick: () => setRole('catalog_operator'),
            },
            {
              id: 'role-ord',
              label: 'Mudar Papel: Pedidos',
              icon: <Shield className="w-4 h-4 text-emerald-600" />,
              badge: currentRole === 'orders_operator' ? 'Ativo' : undefined,
              onClick: () => setRole('orders_operator'),
            },
            {
              id: 'role-view',
              label: 'Mudar Papel: Leitor/Auditor',
              icon: <Shield className="w-4 h-4 text-gray-500" />,
              badge: currentRole === 'viewer' ? 'Ativo' : undefined,
              onClick: () => setRole('viewer'),
            },
            {
              id: 'store-front',
              label: 'Ver Loja Pública Zenza',
              icon: <ExternalLink className="w-4 h-4" />,
            },
            {
              id: 'logout',
              label: 'Terminar Sessão',
              icon: <LogOut className="w-4 h-4" />,
              destructive: true,
            },
          ]}
        />
      </div>
    </header>
  );
};
