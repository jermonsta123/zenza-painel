import React from 'react';
import { X, CheckCircle2, AlertTriangle, ShoppingBag, CreditCard, Truck, Check } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { motion, AnimatePresence } from 'motion/react';

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'order' | 'payment' | 'stock' | 'delivery';
}

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onMarkAllRead?: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([
    {
      id: '1',
      title: 'Novo Pedido #ORD-8492',
      description: 'Cliente Carlos Mateus (Luanda/Talatona) encomendou 3 itens via Multicaixa Express.',
      time: 'Há 5 minutos',
      read: false,
      type: 'order',
    },
    {
      id: '2',
      title: 'Pagamento Confirmado',
      description: 'Transferência BAI Directo de 145.000,00 Kz validada com sucesso.',
      time: 'Há 18 minutos',
      read: false,
      type: 'payment',
    },
    {
      id: '3',
      title: 'Alerta de Stock Crítico',
      description: 'O produto "Camisa Linho Luanda Slim (Tamanho M)" tem apenas 2 unidades disponíveis.',
      time: 'Há 1 hora',
      read: false,
      type: 'stock',
    },
    {
      id: '4',
      title: 'Entrega Concluída',
      description: 'Estafeta Luanda Express confirmou entrega do pedido #ORD-8480 no Kilamba.',
      time: 'Há 3 horas',
      read: true,
      type: 'delivery',
    },
  ]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markOneRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'order':
        return <ShoppingBag className="w-4 h-4 text-[#a63500]" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-emerald-600" />;
      case 'stock':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'delivery':
        return <Truck className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/35 backdrop-blur-xs transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-screen max-w-sm bg-white shadow-2xl border-l border-[rgba(25,28,29,0.10)] flex flex-col"
            >
              {/* Drawer Header */}
              <div className="p-4 border-b border-[rgba(25,28,29,0.08)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-[#191c1d]">Notificações</h2>
                  <Badge variant="brand" size="sm">
                    {notifications.filter((n) => !n.read).length} novas
                  </Badge>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Fechar notificações"
                  className="p-1.5 rounded-lg text-[#191c1d]/50 hover:text-[#191c1d] hover:bg-black/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Action Bar */}
              <div className="px-4 py-2 bg-[#f8f9fa] border-b border-[rgba(25,28,29,0.06)] flex items-center justify-between text-xs">
                <span className="text-[#191c1d]/60 font-medium">Alertas da Loja</span>
                <button
                  onClick={markAllRead}
                  className="text-[#a63500] hover:text-[#d04400] font-semibold hover:underline"
                >
                  Marcar todas como lidas
                </button>
              </div>

              {/* Notification List */}
              <div className="flex-1 overflow-y-auto divide-y divide-[rgba(25,28,29,0.06)]">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markOneRead(n.id)}
                    className={`p-4 transition-colors cursor-pointer hover:bg-[#fff9f6]/60 ${
                      !n.read ? 'bg-[#fff3ef]/40' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-white border border-[rgba(25,28,29,0.10)] shadow-xs shrink-0 mt-0.5">
                        {getIcon(n.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <p className="text-xs font-bold text-[#191c1d] truncate">
                            {n.title}
                          </p>
                          {!n.read && (
                            <span className="w-2 h-2 rounded-full bg-[#a63500] shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-[#191c1d]/70 leading-relaxed line-clamp-2">
                          {n.description}
                        </p>
                        <span className="text-[10px] text-[#191c1d]/50 mt-1.5 block font-medium">
                          {n.time}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-[rgba(25,28,29,0.08)] bg-[#f8f9fa]">
                <Button variant="secondary" size="sm" fullWidth onClick={onClose}>
                  Fechar Painel
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
