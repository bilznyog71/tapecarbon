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

export interface TextureOption {
  id: string;
  name: string;
  image: string;
  description: string;
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
  customersServed: '5.000+',
  reviewCount: 1284,
  ratingAvg: 4.9,
  stockUnits: 23,
  offerHours: 24,

  /* ---- Kits ---- */
  kits: [
    {
      id: 'carro_sem',
      name: 'Kit Tapetes Interno',
      sub: 'Sem porta-malas — Melhor Preço',
      priceOld: 267.97,
      price: 146.83,
      tag: 'Melhor Preço',
      features: [
        '3 tapetes bandeja sob medida para o habitáculo (2 dianteiros + 1 traseiro)',
        'Traseiro de peça inteiriça com cobertura completa do túnel central',
        'Borda elevada anti-vazamento de água e barro',
        'Encaixe original nos pinos de fábrica do veículo'
      ]
    },
    {
      id: 'carro_com',
      name: 'Kit Tapetes Interno + Porta-Malas',
      sub: 'Kit completo habitáculo + bandeja porta-malas',
      priceOld: 327.97,
      price: 189.65,
      tag: 'Mais Vendido',
      features: [
        '3 tapetes bandeja sob medida para o habitáculo (2 dianteiros + 1 traseiro)',
        'Traseiro de peça inteiriça com cobertura completa do túnel central',
        'Bandeja do porta-malas sob medida com bordas elevadas de contenção',
        'Encaixe original nos pinos de fábrica do veículo'
      ]
    }
  ] as Kit[],

  /* ---- Cores ---- */
  colors: [
    { id: 'preto', name: 'Preto', hex: '#15171B' },
    { id: 'cinza', name: 'Cinza', hex: '#63666A' },
    { id: 'bege',  name: 'Bege',  hex: '#D1C2A5' }
  ] as ColorOption[],

  /* ---- Texturas ---- */
  textures: [
    {
      id: 'textura-a',
      name: 'Textura A',
      image: '/images/foto3.jpg',
      description: 'Acabamento esportivo com trama em relevo 3D de alta aderência'
    },
    {
      id: 'textura-b',
      name: 'Textura B',
      image: '/images/txt1.png',
      description: 'Padrão colmeia em relevo com retenção micrométrica de poeira e líquidos'
    },
    {
      id: 'textura-c',
      name: 'Textura C',
      image: '/images/txt2.png',
      description: 'Linhas anatômicas refinadas com toque fosco e fácil higienização'
    }
  ] as TextureOption[]
};

export const formatMoney = (amount: number): string => {
  return `R$ ${amount.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

export const formatInstallment = (amount: number, count: number = CONFIG.installments): string => {
  const value = (amount / count).toFixed(2).replace('.', ',');
  return `${count}x de R$ ${value}`;
};
