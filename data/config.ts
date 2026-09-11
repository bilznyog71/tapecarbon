export interface Kit {
  id: string;
  name: string;
  sub: string;
  priceOld: number;
  price: number;
  tag?: string;
  features: string[];
}

export interface ColorOption {
  id: string;
  name: string;
  hex: string;
}

export const CONFIG = {
  brand: 'AlfaCarbon',
  legalName: 'AlfaCarbon Brasil Comércio Automotivo Ltda',
  country: 'Brasil',
  domain: 'alfacarbon.shop',

  /* ---- Contato ---- */
  email: 'contato@alfacarbon.shop',
  whatsapp: '5563981077852',
  whatsappLabel: '(63) 98107-7852',
  hours: 'Segunda a sexta, das 9h às 18h',
  cnpj: '48.912.345/0001-89',
  address: 'São Paulo - SP, Brasil',

  /* ---- Comercial ---- */
  currency: 'R$',
  installments: 12,
  returnDays: 7,
  warrantyMonths: 12,
  customersServed: '9.400',
  reviewCount: 612,
  ratingAvg: 4.9,
  stockUnits: 23,
  offerHours: 24,

  /* ---- Kits ---- */
  kits: [
    {
      id: 'full',
      name: 'Kit Completo (Interior + Porta-Malas)',
      sub: 'Interior completo + bandeja do porta-malas',
      priceOld: 499,
      price: 247,
      tag: 'Mais Vendido',
      features: [
        '3 tapetes bandeja sob medida para o habitáculo (2 dianteiros + 1 traseiro)',
        'Traseiro de peça inteiriça com cobertura completa do túnel central',
        'Bandeja do porta-malas sob medida com bordas elevadas de contenção',
        'Chaveiro réplica miniatura de brinde exclusivo'
      ]
    },
    {
      id: 'interior',
      name: 'Kit Tapetes Interior',
      sub: 'Apenas habitáculo, sem porta-malas',
      priceOld: 399,
      price: 197,
      tag: '',
      features: [
        '3 tapetes bandeja sob medida para o habitáculo (2 dianteiros + 1 traseiro)',
        'Traseiro de peça inteiriça com cobertura completa do túnel central',
        'Chaveiro réplica miniatura de brinde exclusivo'
      ]
    }
  ] as Kit[],

  /* ---- Cores ---- */
  colors: [
    { id: 'negro', name: 'Preto', hex: '#15171B' },
    { id: 'gris',  name: 'Cinza Grafite', hex: '#787E88' },
    { id: 'beige', name: 'Bege Areia', hex: '#C8B291' }
  ] as ColorOption[]
};

export const formatMoney = (amount: number): string => {
  return `R$ ${amount.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

export const formatInstallment = (amount: number, count: number = CONFIG.installments): string => {
  const value = (amount / count).toFixed(2).replace('.', ',');
  return `${count}x de R$ ${value}`;
};
