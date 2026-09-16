'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Shield,
  Lock,
  Search,
  RefreshCw,
  LogOut,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ShoppingCart,
  MessageCircle,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Phone,
  Mail,
  MapPin,
  Car,
  Download,
} from 'lucide-react';
import { formatMoney } from '@/data/config';
import { OrderRecord, OrderStatus } from '@/lib/db';

interface Metrics {
  totalRevenue: number;
  paidCount: number;
  pendingCount: number;
  pendingAmount: number;
  initiatedCount: number;
  abandonedCount: number;
  totalLeads: number;
  abandonRate: number;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Painel data
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [activeFilter, setActiveFilter] = useState<'todos' | 'pagos' | 'pendentes' | 'iniciadas' | 'abandonadas'>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [showCamouflageDetails, setShowCamouflageDetails] = useState(true);

  // Checa autenticação inicial
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/auth');
        const data = await res.json();
        setIsAuthenticated(Boolean(data.authenticated));
      } catch {
        setIsAuthenticated(false);
      }
    }
    checkAuth();
  }, []);

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setPasswordInput('');
      } else {
        setLoginError(data.error || 'Senha incorreta. Acesso negado.');
      }
    } catch {
      setLoginError('Erro ao tentar conectar ao servidor.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    setIsAuthenticated(false);
  };

  // Carrega pedidos
  const loadOrders = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const query = new URLSearchParams();
      if (activeFilter !== 'todos') query.set('filter', activeFilter);
      if (searchTerm) query.set('search', searchTerm);

      const res = await fetch(`/api/admin/orders?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
        setMetrics(data.metrics || null);
      } else if (res.status === 401) {
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, activeFilter, searchTerm]);

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
    }
  }, [isAuthenticated, loadOrders]);

  // Auto-refresh a cada 15 segundos
  useEffect(() => {
    if (!isAuthenticated || !autoRefresh) return;
    const timer = setInterval(() => {
      loadOrders();
    }, 15000);
    return () => clearInterval(timer);
  }, [isAuthenticated, autoRefresh, loadOrders]);

  // Copiar para clipboard com feedback
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Atualizar status
  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
      if (res.ok) {
        loadOrders();
      }
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
    }
  };

  // Excluir pedido
  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Tem certeza que deseja excluir este registro do painel?')) return;
    try {
      const res = await fetch(`/api/admin/orders?id=${encodeURIComponent(orderId)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        loadOrders();
      }
    } catch (err) {
      console.error('Erro ao excluir pedido:', err);
    }
  };

  // Gerar link de WhatsApp para recuperação
  const getWhatsAppLink = (order: OrderRecord) => {
    const rawPhone = order.customer.telefone.replace(/\D/g, '');
    const phoneWithCountry = rawPhone.startsWith('55') ? rawPhone : `55${rawPhone}`;
    const firstName = order.customer.nome.split(' ')[0];
    const vehicle = order.cart?.[0]?.vehicle || 'seu veículo';

    let message = '';
    if (order.status === 'PENDENTE') {
      message = `Olá ${firstName}! Tudo bem? Aqui é da equipe AlfaCarbon. Vi que você gerou o Pix para o seu Kit de Tapetes (${vehicle}), mas ainda não identificamos o pagamento. Gostaria de ajuda para concluir ou tem alguma dúvida?`;
    } else if (order.status === 'INICIADA' || order.status === 'ABANDONADA') {
      message = `Olá ${firstName}! Notamos que você iniciou o pedido do seu Kit AlfaCarbon para o ${vehicle}. Posso liberar um cupom especial de frete prioritário para você concluir agora?`;
    } else {
      message = `Olá ${firstName}! Equipe AlfaCarbon falando sobre o seu pedido #${order.id.slice(-6)}. Como posso te ajudar hoje?`;
    }

    return `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(message)}`;
  };

  // Exportar CSV
  const exportCsv = () => {
    if (orders.length === 0) return;
    const headers = ['Data', 'ID', 'Status', 'Cliente', 'CPF', 'Email_Real', 'WhatsApp_Real', 'Veiculo', 'Valor', 'Metodo', 'Email_Gateway_Camuflado', 'Telefone_Gateway_Camuflado'];
    const rows = orders.map(o => [
      new Date(o.createdAt).toLocaleString('pt-BR'),
      o.id,
      o.status,
      `"${o.customer.nome} ${o.customer.sobrenome || ''}"`,
      o.customer.cpf,
      o.customer.email,
      o.customer.telefone,
      `"${o.cart?.[0]?.vehicle || ''}"`,
      o.amount,
      o.paymentMethod || '',
      o.camouflaged?.email || '',
      o.camouflaged?.telefone || '',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `pedidos_alfacarbon_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Loading screen
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#0A0B0E] flex items-center justify-center text-[#A9B0BA]">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-5 h-5 animate-spin text-[#E8B10C]" />
          <span>Verificando acesso seguro...</span>
        </div>
      </div>
    );
  }

  // Tela de Login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#07080A] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#111317] border border-[#282E38] rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#E8B10C] to-transparent" />
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-[#1A1D24] border border-[#373E4D] flex items-center justify-center mx-auto mb-4 text-[#E8B10C] shadow-lg">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-extrabold text-[#F4F6F8] tracking-tight">Painel de Controle</h1>
            <p className="text-sm text-[#7E8691] mt-1">AlfaCarbon Brasil · Gestão Restrita</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {loginError && (
              <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#A9B0BA] mb-2">
                Senha de Acesso Exclusiva
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7E8691]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={e => setPasswordInput(e.target.value)}
                  placeholder="Digite sua senha de administrador..."
                  className="w-full pl-10 pr-4 py-3 bg-[#0A0B0E] border border-[#282E38] rounded-xl text-white text-sm focus:outline-none focus:border-[#E8B10C] transition-colors"
                  required
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 bg-[#E8B10C] hover:bg-[#D9A307] text-[#0A0B0E] font-bold text-sm rounded-xl transition-all shadow-lg hover:shadow-yellow-500/20 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Validando Chave...</span>
                </>
              ) : (
                <>
                  <span>Entrar no Painel</span>
                  <span>&rarr;</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#1C2028] text-center">
            <p className="text-xs text-[#525966]">
              Acesso protegido por autenticação segura e criptografia de ponta a ponta.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Helper status badge
  const renderStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'PAGO':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            PAGO
          </span>
        );
      case 'PENDENTE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Clock className="w-3.5 h-3.5" />
            PENDENTE (PIX)
          </span>
        );
      case 'INICIADA':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
            <ShoppingCart className="w-3.5 h-3.5" />
            INICIADA
          </span>
        );
      case 'ABANDONADA':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <AlertTriangle className="w-3.5 h-3.5" />
            ABANDONADA
          </span>
        );
      case 'CANCELADO':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-500/15 text-gray-400 border border-gray-500/30">
            CANCELADO
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-500/15 text-gray-400 border border-gray-500/30">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#07080A] text-[#F4F6F8]">
      {/* Top Header */}
      <header className="border-b border-[#1C2028] bg-[#0E1015]/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E8B10C] to-[#B38304] flex items-center justify-center text-[#07080A] font-black shadow-lg">
              AC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold tracking-tight text-white">AlfaCarbon</h1>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#E8B10C]/15 text-[#E8B10C] border border-[#E8B10C]/30 rounded-md">
                  Painel de Controle
                </span>
              </div>
              <p className="text-xs text-[#7E8691]">Gestão Privada de Vendas e Leads</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
                autoRefresh
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-[#16181E] border-[#282E38] text-[#7E8691]'
              }`}
              title="Alternar atualização automática a cada 15s"
            >
              <span className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-emerald-400 animate-pulse' : 'bg-gray-600'}`} />
              <span>Auto 15s</span>
            </button>

            <button
              onClick={() => loadOrders()}
              disabled={isLoading}
              className="p-2 rounded-lg bg-[#16181E] border border-[#282E38] text-[#CBD5E1] hover:text-white hover:border-[#373E4D] transition-colors cursor-pointer"
              title="Atualizar agora"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#E8B10C]' : ''}`} />
            </button>

            <button
              onClick={exportCsv}
              disabled={orders.length === 0}
              className="px-3 py-2 rounded-lg bg-[#16181E] border border-[#282E38] text-xs font-semibold text-[#CBD5E1] hover:text-white hover:border-[#373E4D] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exportar CSV</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
              title="Sair do painel"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner de Proteção / Camuflagem Ativa */}
        <div className="bg-[#111317] border border-[#232832] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#19C25A]/15 border border-[#19C25A]/30 flex items-center justify-center text-[#19C25A] shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white">Camuflagem de Gateway Ativada</h2>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 rounded">
                  Segurança 100%
                </span>
              </div>
              <p className="text-xs text-[#8F98A6] mt-0.5">
                Os dados sensíveis (e-mail e telefone) são automaticamente mascarados ao enviar para a Blackcat. Os dados reais ficam salvos somente aqui.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowCamouflageDetails(!showCamouflageDetails)}
            className="text-xs font-semibold text-[#E8B10C] hover:underline flex items-center gap-1 shrink-0 self-start sm:self-center"
          >
            {showCamouflageDetails ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showCamouflageDetails ? 'Ocultar colunas técnicas' : 'Ver colunas de camuflagem'}</span>
          </button>
        </div>

        {/* Métricas KPI Cards */}
        {metrics && (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {/* Card Faturamento Pago */}
            <div className="col-span-2 lg:col-span-1 bg-[#111317] border border-[#232832] rounded-2xl p-4 sm:p-5 relative overflow-hidden">
              <div className="text-xs font-bold uppercase tracking-wider text-[#7E8691]">Faturamento Aprovado</div>
              <div className="text-2xl font-black text-emerald-400 mt-2">
                {formatMoney(metrics.totalRevenue)}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#8F98A6] mt-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>{metrics.paidCount} {metrics.paidCount === 1 ? 'pedido pago' : 'pedidos pagos'}</span>
              </div>
            </div>

            {/* Card Pedidos Pendentes */}
            <div className="bg-[#111317] border border-[#232832] rounded-2xl p-4 sm:p-5">
              <div className="text-xs font-bold uppercase tracking-wider text-[#7E8691]">Aguardando Pix</div>
              <div className="text-2xl font-black text-amber-400 mt-2">
                {formatMoney(metrics.pendingAmount)}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#8F98A6] mt-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{metrics.pendingCount} pendentes</span>
              </div>
            </div>

            {/* Card Pagos Count */}
            <div className="bg-[#111317] border border-[#232832] rounded-2xl p-4 sm:p-5">
              <div className="text-xs font-bold uppercase tracking-wider text-[#7E8691]">Pedidos Pagos</div>
              <div className="text-2xl font-black text-white mt-2">
                {metrics.paidCount}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Concluídos</span>
              </div>
            </div>

            {/* Card Compras Iniciadas */}
            <div className="bg-[#111317] border border-[#232832] rounded-2xl p-4 sm:p-5">
              <div className="text-xs font-bold uppercase tracking-wider text-[#7E8691]">Iniciadas no Funil</div>
              <div className="text-2xl font-black text-blue-400 mt-2">
                {metrics.initiatedCount}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#8F98A6] mt-1.5">
                <ShoppingCart className="w-3.5 h-3.5 text-blue-400" />
                <span>Leads recentes</span>
              </div>
            </div>

            {/* Card Carrinhos Abandonados */}
            <div className="bg-[#111317] border border-[#232832] rounded-2xl p-4 sm:p-5">
              <div className="text-xs font-bold uppercase tracking-wider text-[#7E8691]">Abandonadas</div>
              <div className="text-2xl font-black text-rose-400 mt-2">
                {metrics.abandonedCount}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-rose-400/80 mt-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{metrics.abandonRate}% taxa abandono</span>
              </div>
            </div>
          </div>
        )}

        {/* Filtros e Busca */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Abas */}
          <div className="flex items-center gap-1.5 p-1 bg-[#111317] border border-[#232832] rounded-xl overflow-x-auto">
            {(
              [
                { id: 'todos', label: 'Todos', count: metrics?.totalLeads },
                { id: 'pagos', label: 'Pagos', count: metrics?.paidCount },
                { id: 'pendentes', label: 'Pendentes', count: metrics?.pendingCount },
                { id: 'iniciadas', label: 'Iniciadas', count: metrics?.initiatedCount },
                { id: 'abandonadas', label: 'Abandonadas', count: metrics?.abandonedCount },
              ] as const
            ).map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  activeFilter === tab.id
                    ? 'bg-[#E8B10C] text-[#07080A] shadow-md shadow-yellow-500/10'
                    : 'text-[#A9B0BA] hover:text-white hover:bg-[#1A1D24]'
                }`}
              >
                <span>{tab.label}</span>
                {typeof tab.count === 'number' && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                      activeFilter === tab.id ? 'bg-[#07080A]/20 text-[#07080A]' : 'bg-[#1C2028] text-[#8F98A6]'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Busca */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#7E8691] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome, e-mail, fone, CPF..."
              className="w-full pl-10 pr-4 py-2 bg-[#111317] border border-[#232832] rounded-xl text-xs text-white placeholder-[#525966] focus:outline-none focus:border-[#E8B10C] transition-colors"
            />
          </div>
        </div>

        {/* Tabela de Pedidos / Leads */}
        <div className="bg-[#111317] border border-[#232832] rounded-2xl overflow-hidden shadow-xl">
          {orders.length === 0 ? (
            <div className="py-20 text-center text-[#7E8691]">
              <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30 text-[#E8B10C]" />
              <p className="text-base font-bold text-[#CBD5E1]">Nenhum pedido ou lead encontrado</p>
              <p className="text-xs text-[#525966] mt-1">
                {searchTerm ? 'Tente ajustar os termos de busca' : 'Novos leads e pedidos aparecerão automaticamente aqui'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#232832] bg-[#0E1015]/60 text-[#7E8691] uppercase tracking-wider font-semibold">
                    <th className="py-3.5 px-4">Status & Data</th>
                    <th className="py-3.5 px-4">Cliente (Dados Reais)</th>
                    <th className="py-3.5 px-4">Contato Direto</th>
                    <th className="py-3.5 px-4">Veículo & Kit</th>
                    <th className="py-3.5 px-4">Valor</th>
                    {showCamouflageDetails && <th className="py-3.5 px-4">Gateway (Camuflado)</th>}
                    <th className="py-3.5 px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1C2028]">
                  {orders.map(order => {
                    const isExpanded = expandedRow === order.id;
                    const dateFormatted = new Date(order.createdAt).toLocaleString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    return (
                      <React.Fragment key={order.id}>
                        <tr className="hover:bg-[#161820]/60 transition-colors group">
                          {/* Status & Data */}
                          <td className="py-4 px-4 align-top whitespace-nowrap">
                            <div className="flex flex-col gap-1.5">
                              <div>{renderStatusBadge(order.status)}</div>
                              <span className="text-[11px] text-[#7E8691] font-mono">{dateFormatted}</span>
                              <span className="text-[10px] text-[#525966] font-mono">#{order.id.slice(-6)}</span>
                            </div>
                          </td>

                          {/* Cliente Real */}
                          <td className="py-4 px-4 align-top">
                            <div className="font-bold text-white text-[13px]">
                              {order.customer.nome} {order.customer.sobrenome || ''}
                            </div>
                            {order.customer.cpf && (
                              <div className="text-[11px] text-[#8F98A6] font-mono mt-0.5">
                                CPF: {order.customer.cpf}
                              </div>
                            )}
                            {order.address?.cidade && (
                              <div className="text-[11px] text-[#7E8691] flex items-center gap-1 mt-1">
                                <MapPin className="w-3 h-3 text-[#E8B10C]" />
                                <span>{order.address.cidade}/{order.address.estado}</span>
                              </div>
                            )}
                          </td>

                          {/* Contato Direto */}
                          <td className="py-4 px-4 align-top">
                            {/* WhatsApp Real */}
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="font-semibold text-white font-mono text-[12px]">
                                {order.customer.telefone || 'Sem telefone'}
                              </span>
                              {order.customer.telefone && (
                                <a
                                  href={getWhatsAppLink(order)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-bold text-[10px] transition-colors"
                                  title="Abrir WhatsApp para recuperação"
                                >
                                  <MessageCircle className="w-3 h-3" />
                                  <span>Recuperar</span>
                                </a>
                              )}
                            </div>

                            {/* Email Real */}
                            <div className="flex items-center gap-1.5 text-[11px] text-[#A9B0BA]">
                              <Mail className="w-3 h-3 text-[#7E8691] shrink-0" />
                              <span className="truncate max-w-[160px]" title={order.customer.email}>
                                {order.customer.email}
                              </span>
                              <button
                                onClick={() => handleCopy(order.customer.email, `email-${order.id}`)}
                                className="text-[#7E8691] hover:text-[#E8B10C] transition-colors p-0.5"
                                title="Copiar e-mail"
                              >
                                {copiedId === `email-${order.id}` ? (
                                  <Check className="w-3 h-3 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          </td>

                          {/* Veículo & Kit */}
                          <td className="py-4 px-4 align-top">
                            {order.cart && order.cart[0] ? (
                              <div>
                                <div className="font-semibold text-white flex items-center gap-1">
                                  <Car className="w-3.5 h-3.5 text-[#E8B10C] shrink-0" />
                                  <span>{order.cart[0].vehicle}</span>
                                </div>
                                <div className="text-[11px] text-[#8F98A6] mt-0.5 truncate max-w-[200px]">
                                  {order.cart[0].kitName}
                                </div>
                                {order.cart[0].colorName && (
                                  <div className="text-[10px] text-[#7E8691] mt-0.5">
                                    Cor: {order.cart[0].colorName}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-[#525966]">-</span>
                            )}
                          </td>

                          {/* Valor */}
                          <td className="py-4 px-4 align-top whitespace-nowrap">
                            <div className="font-extrabold text-white text-[13px]">
                              {formatMoney(order.amount)}
                            </div>
                            <div className="text-[10px] text-[#7E8691] uppercase tracking-wider mt-0.5 font-bold">
                              {order.paymentMethod === 'card' ? 'Cartão de Crédito' : 'PIX'}
                            </div>
                          </td>

                          {/* Coluna de Camuflagem */}
                          {showCamouflageDetails && (
                            <td className="py-4 px-4 align-top">
                              {order.camouflaged ? (
                                <div className="space-y-1 font-mono text-[10px] bg-[#0A0B0E] p-2 rounded-lg border border-[#1C2028]">
                                  <div className="text-[#8F98A6] truncate max-w-[150px]" title={order.camouflaged.email}>
                                    <span className="text-[#525966]">Email: </span>
                                    <span className="text-[#E8B10C]">{order.camouflaged.email}</span>
                                  </div>
                                  <div className="text-[#8F98A6]">
                                    <span className="text-[#525966]">Fone: </span>
                                    <span className="text-[#E8B10C]">{order.camouflaged.telefone}</span>
                                  </div>
                                  {order.transactionId && (
                                    <div className="text-[#525966] truncate max-w-[150px]">
                                      ID: {order.transactionId}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-[#525966] text-[10px]">Lead local</span>
                              )}
                            </td>
                          )}

                          {/* Ações */}
                          <td className="py-4 px-4 align-top text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Botão de mudar status */}
                              <select
                                value={order.status}
                                onChange={e => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                                className="bg-[#0A0B0E] border border-[#282E38] text-[11px] rounded-lg px-2 py-1 text-[#CBD5E1] focus:outline-none focus:border-[#E8B10C] cursor-pointer"
                              >
                                <option value="INICIADA">Iniciada</option>
                                <option value="PENDENTE">Pendente</option>
                                <option value="PAGO">Pago</option>
                                <option value="ABANDONADA">Abandonada</option>
                                <option value="CANCELADO">Cancelado</option>
                              </select>

                              {/* Ver detalhes */}
                              <button
                                onClick={() => setExpandedRow(isExpanded ? null : order.id)}
                                className="p-1.5 rounded-lg bg-[#16181E] border border-[#282E38] text-[#8F98A6] hover:text-white transition-colors cursor-pointer"
                                title="Ver detalhes completos"
                              >
                                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                              </button>

                              {/* Excluir */}
                              <button
                                onClick={() => handleDeleteOrder(order.id)}
                                className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
                                title="Excluir do painel"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Detalhes Expansíveis */}
                        {isExpanded && (
                          <tr className="bg-[#0C0D11] border-b border-[#232832]">
                            <td colSpan={showCamouflageDetails ? 7 : 6} className="p-5">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
                                {/* Endereço Completo */}
                                <div className="bg-[#111317] p-4 rounded-xl border border-[#232832]">
                                  <div className="font-bold uppercase tracking-wider text-[#E8B10C] mb-2 flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5" />
                                    <span>Endereço de Entrega</span>
                                  </div>
                                  {order.address ? (
                                    <div className="space-y-1 text-[#CBD5E1]">
                                      <div><b>Rua:</b> {order.address.rua}, {order.address.numero}</div>
                                      {order.address.complemento && <div><b>Compl:</b> {order.address.complemento}</div>}
                                      <div><b>Bairro:</b> {order.address.bairro}</div>
                                      <div><b>Cidade/UF:</b> {order.address.cidade} - {order.address.estado}</div>
                                      <div><b>CEP:</b> {order.address.cep}</div>
                                    </div>
                                  ) : (
                                    <span className="text-[#525966]">Endereço ainda não preenchido pelo cliente.</span>
                                  )}
                                </div>

                                {/* Dados da Transação e Gateway */}
                                <div className="bg-[#111317] p-4 rounded-xl border border-[#232832]">
                                  <div className="font-bold uppercase tracking-wider text-[#E8B10C] mb-2 flex items-center gap-1.5">
                                    <Shield className="w-3.5 h-3.5" />
                                    <span>Auditoria de Gateway</span>
                                  </div>
                                  <div className="space-y-1 text-[#CBD5E1]">
                                    <div><b>Ref Externa:</b> <span className="font-mono">{order.externalRef || '-'}</span></div>
                                    <div><b>ID Blackcat:</b> <span className="font-mono">{order.transactionId || 'Ainda não gerado'}</span></div>
                                    <div><b>Email Gateway:</b> <span className="font-mono text-[#E8B10C]">{order.camouflaged?.email || '-'}</span></div>
                                    <div><b>Fone Gateway:</b> <span className="font-mono text-[#E8B10C]">{order.camouflaged?.telefone || '-'}</span></div>
                                    <div><b>Criado em:</b> {new Date(order.createdAt).toLocaleString('pt-BR')}</div>
                                    <div><b>Atualizado:</b> {new Date(order.updatedAt).toLocaleString('pt-BR')}</div>
                                  </div>
                                </div>

                                {/* Pix Copia e Cola / Ações Rápidas */}
                                <div className="bg-[#111317] p-4 rounded-xl border border-[#232832]">
                                  <div className="font-bold uppercase tracking-wider text-[#E8B10C] mb-2 flex items-center gap-1.5">
                                    <MessageCircle className="w-3.5 h-3.5" />
                                    <span>Recuperação de Venda</span>
                                  </div>
                                  <p className="text-[#8F98A6] mb-3 text-[11px]">
                                    Envie uma mensagem direta para o WhatsApp com apenas um clique:
                                  </p>
                                  <a
                                    href={getWhatsAppLink(order)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-2 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-black font-bold flex items-center justify-center gap-2 transition-colors mb-2"
                                  >
                                    <MessageCircle className="w-4 h-4" />
                                    <span>Abrir WhatsApp do Cliente</span>
                                  </a>
                                  {order.pix?.code && (
                                    <button
                                      onClick={() => handleCopy(order.pix?.code || '', `pix-${order.id}`)}
                                      className="w-full py-2 px-3 rounded-lg bg-[#1C2028] hover:bg-[#282E38] text-white font-medium flex items-center justify-center gap-2 transition-colors text-[11px]"
                                    >
                                      {copiedId === `pix-${order.id}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                      <span>Copiar Pix Copia e Cola</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
