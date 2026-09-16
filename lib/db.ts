import fs from 'fs';
import path from 'path';

export type OrderStatus = 'INICIADA' | 'ABANDONADA' | 'PENDENTE' | 'PAGO' | 'CANCELADO';

export interface OrderCustomer {
  nome: string;
  sobrenome?: string;
  email: string;
  telefone: string;
  cpf: string;
}

export interface OrderAddress {
  cep: string;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export interface OrderCartItem {
  kitName: string;
  vehicle: string;
  colorName?: string;
  price: number;
}

export interface OrderRecord {
  id: string; // ID único interno
  externalRef?: string;
  transactionId?: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  customer: OrderCustomer;
  camouflaged?: {
    email: string;
    telefone: string;
  };
  address?: OrderAddress;
  cart?: OrderCartItem[];
  amount: number;
  paymentMethod?: 'pix' | 'card' | 'credit_card' | string;
  pix?: {
    code?: string;
    qrCodeBase64?: string;
    expiresAt?: string;
  };
  notes?: string;
}

const DB_FILE_PATH = path.join(process.cwd(), 'data', 'orders.json');

// Garante que o arquivo existe
function ensureDbFile(): void {
  const dir = path.dirname(DB_FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE_PATH)) {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify([], null, 2), 'utf-8');
  }
}

// Leitura atômica
export async function getAllOrders(): Promise<OrderRecord[]> {
  try {
    ensureDbFile();
    const data = await fs.promises.readFile(DB_FILE_PATH, 'utf-8');
    if (!data.trim()) return [];
    return JSON.parse(data) as OrderRecord[];
  } catch (err) {
    console.error('[DB] Erro ao ler banco de dados:', err);
    return [];
  }
}

// Gravação atômica via arquivo temporário
async function writeAllOrders(orders: OrderRecord[]): Promise<void> {
  ensureDbFile();
  const tempPath = `${DB_FILE_PATH}.tmp.${Date.now()}.${Math.random().toString(36).substring(2, 6)}`;
  await fs.promises.writeFile(tempPath, JSON.stringify(orders, null, 2), 'utf-8');
  await fs.promises.rename(tempPath, DB_FILE_PATH);
}

// Cria ou atualiza um pedido/lead
export async function upsertOrder(order: Partial<OrderRecord> & { id: string }): Promise<OrderRecord> {
  const orders = await getAllOrders();
  const index = orders.findIndex(o => o.id === order.id || (order.transactionId && o.transactionId === order.transactionId));

  const now = new Date().toISOString();

  if (index >= 0) {
    const existing = orders[index];
    const updated: OrderRecord = {
      ...existing,
      ...order,
      // Não sobreescreve campos com undefined
      customer: {
        ...existing.customer,
        ...(order.customer || {}),
      },
      address: order.address ? { ...existing.address, ...order.address } : existing.address,
      camouflaged: order.camouflaged || existing.camouflaged,
      pix: order.pix || existing.pix,
      updatedAt: now,
    };
    orders[index] = updated;
    await writeAllOrders(orders);
    return updated;
  } else {
    const newRecord: OrderRecord = {
      id: order.id,
      externalRef: order.externalRef || `AC-${Date.now()}`,
      transactionId: order.transactionId,
      status: order.status || 'INICIADA',
      createdAt: now,
      updatedAt: now,
      customer: order.customer || {
        nome: '',
        email: '',
        telefone: '',
        cpf: '',
      },
      camouflaged: order.camouflaged,
      address: order.address,
      cart: order.cart || [],
      amount: order.amount || 0,
      paymentMethod: order.paymentMethod,
      pix: order.pix,
      notes: order.notes,
    };
    // Adiciona no topo
    orders.unshift(newRecord);
    await writeAllOrders(orders);
    return newRecord;
  }
}

// Atualiza o status por ID ou Transaction ID da Blackcat
export async function updateOrderStatus(
  identifier: string,
  status: OrderStatus,
  extraData?: Partial<OrderRecord>
): Promise<OrderRecord | null> {
  const orders = await getAllOrders();
  const index = orders.findIndex(o => o.id === identifier || o.transactionId === identifier || o.externalRef === identifier);

  if (index === 0 || index > 0) {
    const existing = orders[index];
    const updated: OrderRecord = {
      ...existing,
      ...extraData,
      status,
      updatedAt: new Date().toISOString(),
    };
    orders[index] = updated;
    await writeAllOrders(orders);
    return updated;
  }

  return null;
}

// Exclui um pedido
export async function deleteOrder(id: string): Promise<boolean> {
  const orders = await getAllOrders();
  const filtered = orders.filter(o => o.id !== id && o.transactionId !== id);
  if (filtered.length !== orders.length) {
    await writeAllOrders(filtered);
    return true;
  }
  return false;
}

// Calcula métricas para o painel
export async function getOrderMetrics() {
  const orders = await getAllOrders();

  let totalRevenue = 0;
  let paidCount = 0;
  let pendingCount = 0;
  let pendingAmount = 0;
  let initiatedCount = 0;
  let abandonedCount = 0;

  // Consideramos abandonada: status 'ABANDONADA' ou 'INICIADA' há mais de 25 minutos
  const now = Date.now();
  const ABANDON_TIMEOUT_MS = 25 * 60 * 1000;

  orders.forEach(order => {
    const orderAge = now - new Date(order.createdAt).getTime();

    if (order.status === 'PAGO') {
      paidCount++;
      totalRevenue += Number(order.amount) || 0;
    } else if (order.status === 'PENDENTE') {
      pendingCount++;
      pendingAmount += Number(order.amount) || 0;
    } else if (order.status === 'INICIADA') {
      if (orderAge > ABANDON_TIMEOUT_MS) {
        abandonedCount++;
      } else {
        initiatedCount++;
      }
    } else if (order.status === 'ABANDONADA') {
      abandonedCount++;
    }
  });

  const totalLeads = orders.length;
  const abandonRate = totalLeads > 0 ? Math.round((abandonedCount / totalLeads) * 100) : 0;

  return {
    totalRevenue,
    paidCount,
    pendingCount,
    pendingAmount,
    initiatedCount,
    abandonedCount,
    totalLeads,
    abandonRate,
  };
}
