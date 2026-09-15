import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { DataTable, Column } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { formatKz } from '../theme/tokens';
import { useToast } from '../context/ToastContext';
import { 
  Users, 
  Search, 
  Phone, 
  MapPin, 
  ShoppingBag, 
  Eye, 
  Download, 
  ShieldCheck,
  Mail,
  Calendar,
  Lock
} from 'lucide-react';

interface CustomerRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  totalOrders: number;
  totalSpentKz: number;
  lastOrderDate: string;
  status: 'active' | 'inactive';
}

const initialCustomers: CustomerRecord[] = [
  {
    id: 'cust-001',
    name: 'Carlos Mateus',
    phone: '+244 923 456 789',
    email: 'carlos.mateus@gmail.com',
    city: 'Luanda (Talatona)',
    address: 'Condomínio Belas Business Park, Bloco 3',
    totalOrders: 6,
    totalSpentKz: 284000,
    lastOrderDate: 'Hoje, às 10:24',
    status: 'active',
  },
  {
    id: 'cust-002',
    name: 'Ana Beatriz Afonso',
    phone: '+244 912 884 120',
    email: 'ana.afonso@hotmail.com',
    city: 'Luanda (Kilamba)',
    address: 'Edifício K12, Apartamento 402',
    totalOrders: 12,
    totalSpentKz: 640000,
    lastOrderDate: 'Hoje, às 09:45',
    status: 'active',
  },
  {
    id: 'cust-003',
    name: 'Domingos Gaspar',
    phone: '+244 945 112 334',
    email: 'domingos.gaspar@outlook.com',
    city: 'Benguela (Zona Comercial)',
    address: 'Avenida 10 de Fevereiro, Porta 45',
    totalOrders: 3,
    totalSpentKz: 96000,
    lastOrderDate: 'Hoje, às 08:30',
    status: 'active',
  },
  {
    id: 'cust-004',
    name: 'Maria Helena Silva',
    phone: '+244 931 776 543',
    email: 'helena.silva@sapo.ao',
    city: 'Luanda (Maianga)',
    address: 'Rua Amílcar Cabral, Nº 88',
    totalOrders: 9,
    totalSpentKz: 412500,
    lastOrderDate: '14 Set, às 17:15',
    status: 'active',
  },
  {
    id: 'cust-005',
    name: 'João Kuanza',
    phone: '+244 928 333 111',
    email: 'joao.kuanza@gmail.com',
    city: 'Huambo (Centro)',
    address: 'Largo da Liberdade, Prédio BFA',
    totalOrders: 2,
    totalSpentKz: 30800,
    lastOrderDate: '14 Set, às 15:40',
    status: 'active',
  },
  {
    id: 'cust-006',
    name: 'Teresa Capemba',
    phone: '+244 922 990 011',
    email: 'teresa.capemba@gmail.com',
    city: 'Luanda (Viana - Zango)',
    address: 'Zango 3, Quadra 14, Casa 22',
    totalOrders: 5,
    totalSpentKz: 185000,
    lastOrderDate: '14 Set, às 14:10',
    status: 'active',
  },
];

export const CustomersView: React.FC = () => {
  const { info } = useToast();
  const [customers] = useState<CustomerRecord[]>(initialCustomers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q)
      );
    });
  }, [customers, searchQuery]);

  const columns: Column<CustomerRecord>[] = [
    {
      key: 'name',
      header: 'Nome do Cliente',
      priority: 'high',
      render: (item) => (
        <div className="flex flex-col">
          <span className="font-bold text-xs text-[#191c1d]">{item.name}</span>
          <span className="text-[10px] text-[#191c1d]/50 flex items-center gap-1">
            <Mail className="w-3 h-3 text-[#191c1d]/40" />
            {item.email}
          </span>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Contacto Móvel',
      priority: 'high',
      render: (item) => (
        <span className="text-xs font-medium text-[#191c1d] flex items-center gap-1">
          <Phone className="w-3 h-3 text-[#a63500]" />
          {item.phone}
        </span>
      ),
    },
    {
      key: 'city',
      header: 'Localização / Província',
      priority: 'medium',
      render: (item) => (
        <span className="text-xs text-[#191c1d]/75 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-[#a63500]" />
          {item.city}
        </span>
      ),
    },
    {
      key: 'totalOrders',
      header: 'Total Pedidos',
      align: 'center',
      priority: 'medium',
      render: (item) => (
        <Badge variant="brand" size="sm">
          {item.totalOrders} pedidos
        </Badge>
      ),
    },
    {
      key: 'totalSpentKz',
      header: 'Volume Compras (Kz)',
      align: 'right',
      priority: 'high',
      render: (item) => (
        <span className="font-bold text-xs text-[#191c1d]">
          {formatKz(item.totalSpentKz)}
        </span>
      ),
    },
    {
      key: 'lastOrderDate',
      header: 'Última Compra',
      priority: 'low',
      render: (item) => (
        <span className="text-[11px] text-[#191c1d]/60">{item.lastOrderDate}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Ações',
      align: 'right',
      priority: 'high',
      render: (item) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedCustomer(item)}
          leftIcon={<Eye className="w-3.5 h-3.5" />}
        >
          Perfil
        </Button>
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
              Base de Clientes Zenza
            </Badge>
            <Badge variant="emerald" size="sm" withDot>
              {customers.length} Registados
            </Badge>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#191c1d] tracking-tight">
            Clientes & Histórico de Consumo
          </h1>
          <p className="text-xs text-[#191c1d]/60 mt-0.5">
            Gestão de perfis, contactos e histórico de encomendas com proteção estrita de dados privados.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={() => info('Exportação', 'A gerar lista anónima para auditoria de vendas...')}
          >
            Exportar Lista
          </Button>
        </div>
      </div>

      {/* Privacy Notice Banner */}
      <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center justify-between gap-3 text-xs text-blue-950">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            <strong>Classificação de Dados: Privados.</strong> Endereços, telefones e emails nunca são expostos em logs públicos ou partilhados em caches.
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-xl border border-[rgba(25,28,29,0.10)] flex items-center gap-3 shadow-xs">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Pesquisar por nome, telefone (+244), email ou cidade..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftElement={<Search className="w-4 h-4 text-[#191c1d]/40" />}
            inputSize="sm"
          />
        </div>
      </div>

      {/* Customers Table */}
      <DataTable
        columns={columns}
        data={filteredCustomers}
        keyExtractor={(item) => item.id}
        currentPage={currentPage}
        totalPages={Math.ceil(filteredCustomers.length / pageSize)}
        totalItems={filteredCustomers.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />

      {/* Customer Detail Profile Modal */}
      {selectedCustomer && (
        <Modal
          isOpen={Boolean(selectedCustomer)}
          onClose={() => setSelectedCustomer(null)}
          title={`Perfil do Cliente: ${selectedCustomer.name}`}
          description={`ID: ${selectedCustomer.id} • Cliente Zenza Shop Angola`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-[#f8f9fa] rounded-xl border border-[rgba(25,28,29,0.08)] grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#191c1d]/50 block">Contacto Telefónico</span>
                <span className="font-bold text-[#191c1d]">{selectedCustomer.phone}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#191c1d]/50 block">Correio Eletrónico</span>
                <span className="font-semibold text-[#191c1d]">{selectedCustomer.email}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#191c1d]/50 block">Província / Município</span>
                <span className="font-semibold text-[#191c1d]">{selectedCustomer.city}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#191c1d]/50 block">Total Gasto</span>
                <span className="font-bold text-[#a63500]">{formatKz(selectedCustomer.totalSpentKz)}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-[#191c1d]/50 block mb-1">
                Morada de Entrega Registada
              </span>
              <p className="p-3 bg-white border border-[rgba(25,28,29,0.10)] rounded-xl text-[#191c1d]">
                {selectedCustomer.address}
              </p>
            </div>

            <div className="flex justify-end pt-3 border-t border-[rgba(25,28,29,0.08)]">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setSelectedCustomer(null)}
              >
                Fechar Perfil
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
