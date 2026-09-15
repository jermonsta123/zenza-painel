import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { NotificationDrawer } from './NotificationDrawer';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Search, Package, ShoppingBag, Users, ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getNavInfo, VIEW_TO_PATH, BreadcrumbItem } from '../../lib/navigation';

export interface AdminLayoutProps {
  currentView?: string;
  onSelectView?: (viewId: string) => void;
  title?: string;
  breadcrumbs?: BreadcrumbItem[];
  children: React.ReactNode;
  onQuickAction?: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentView: propCurrentView,
  onSelectView,
  title: propTitle,
  breadcrumbs: propBreadcrumbs,
  children,
  onQuickAction,
}) => {
  const router = useRouter();
  const pathname = usePathname() || '/';
  const navInfo = getNavInfo(pathname);

  const currentView = propCurrentView || navInfo.currentView;
  const title = propTitle || navInfo.title;
  const breadcrumbs = propBreadcrumbs || navInfo.breadcrumbs;

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleNavigate = (viewId: string) => {
    onSelectView?.(viewId);
    const targetPath = VIEW_TO_PATH[viewId] || `/${viewId}`;
    router.push(targetPath);
  };

  const handleQuickAction = () => {
    if (onQuickAction) {
      onQuickAction();
    } else {
      router.push('/produtos?novo=true');
    }
  };

  // Keyboard shortcut ⌘K / Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f8f9fa] text-[#191c1d]">
      {/* Desktop Fixed/Collapsible Sidebar */}
      <div className="hidden lg:block h-full shrink-0">
        <Sidebar
          currentView={currentView}
          onSelectView={handleNavigate}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl z-10"
            >
              <Sidebar
                currentView={currentView}
                onSelectView={handleNavigate}
                isCollapsed={false}
                onCloseMobile={() => setIsMobileMenuOpen(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Header */}
        <Header
          title={title}
          breadcrumbs={breadcrumbs}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onQuickAction={handleQuickAction}
          onSearchClick={() => setIsSearchOpen(true)}
        />

        {/* Scrollable Main Content Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>

      {/* Notifications Drawer */}
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      {/* Global Quick Search Modal (⌘K) */}
      <Modal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        size="md"
        showCloseButton={false}
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 border-b border-[rgba(25,28,29,0.1)] pb-3">
            <Search className="w-5 h-5 text-[#a63500] shrink-0" />
            <input
              type="text"
              autoFocus
              placeholder="Pesquisar pedido (#ORD-...), produto, cliente ou tela..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none text-sm text-[#191c1d] placeholder:text-[#191c1d]/40 focus:outline-none"
            />
            <kbd className="text-[10px] bg-neutral-100 border rounded px-1.5 py-0.5 text-neutral-500 font-mono">
              ESC
            </kbd>
          </div>

          {/* Quick results suggestions */}
          <div className="py-2 space-y-1 text-xs">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#191c1d]/45 px-2">
              Navegação Rápida
            </span>
            <button
              onClick={() => {
                handleNavigate('pedidos');
                setIsSearchOpen(false);
              }}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#fff3ef] hover:text-[#a63500] transition-colors text-left"
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#a63500]" />
                <span className="font-semibold">Gerir Pedidos & Faturas</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 opacity-50" />
            </button>
            <button
              onClick={() => {
                handleNavigate('produtos');
                setIsSearchOpen(false);
              }}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#fff3ef] hover:text-[#a63500] transition-colors text-left"
            >
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-[#a63500]" />
                <span className="font-semibold">Catálogo de Produtos & Stock</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 opacity-50" />
            </button>
            <button
              onClick={() => {
                handleNavigate('design-system');
                setIsSearchOpen(false);
              }}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#fff3ef] hover:text-[#a63500] transition-colors text-left"
            >
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-[#a63500] text-white flex items-center justify-center text-[9px] font-bold">DS</div>
                <span className="font-semibold">Guia do Design System Zenza</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 opacity-50" />
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
