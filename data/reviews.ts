export interface ReviewItem {
  id: string;
  name: string;
  city: string;
  state: string;
  vehicle: string;
  photo?: string;
  rating: number;
  date: string;
  text: string;
  verified: boolean;
}

export const REVIEWS_DATA: ReviewItem[] = [
  {
    id: '1',
    name: 'César Píriz',
    city: 'Curitiba',
    state: 'PR',
    vehicle: 'VW Polo 2022',
    photo: 'rev-delantero.webp',
    rating: 5,
    date: 'Há 3 dias',
    text: 'Vejam a foto, assim chegou e assim ficou. A borda é bem alta, derrubei café inteiro na estrada e não caiu uma única gota no carpete de baixo. Nada a ver com os tapetes universais que eu usava antes.',
    verified: true
  },
  {
    id: '2',
    name: 'Gabriela Techera',
    city: 'Florianópolis',
    state: 'SC',
    vehicle: 'Fiat Cronos 2023',
    photo: 'rev-piso.webp',
    rating: 5,
    date: 'Há 5 dias',
    text: 'Tenho duas crianças pequenas e o carro virava uma bagunça todo dia. Agora eu tiro, passo a mangueira e em dois minutos tá pronto de novo. Os ilhoses travam nos pinos originais e não desliza nada.',
    verified: true
  },
  {
    id: '3',
    name: 'Marcos Oliveira',
    city: 'Ribeirão Preto',
    state: 'SP',
    vehicle: 'Toyota Hilux 2021',
    photo: 'rev-pickup.webp',
    rating: 5,
    date: 'Há 1 semana',
    text: 'Uso na fazenda, entra barro todo santo dia. Já lavei mais de trinta vezes e continua firme do mesmo jeito, não deforma nem desbota. A foto foi tirada semana passada, o produto é bruto de verdade.',
    verified: true
  },
  {
    id: '4',
    name: 'Cláudia Souza',
    city: 'Belo Horizonte',
    state: 'MG',
    vehicle: 'Hyundai Creta 2023',
    photo: 'rev-baul.webp',
    rating: 5,
    date: 'Há 1 semana',
    text: 'Essa do porta-malas na foto é a minha. Cobre de ponta a ponta e as bordas sobem pelas laterais. Compras de mercado, bolsa de praia, carrinho de bebê... Só sacudir e tá limpo. Já recomendei pra várias amigas.',
    verified: true
  },
  {
    id: '5',
    name: 'Diego Cabrera',
    city: 'Porto Alegre',
    state: 'RS',
    vehicle: 'Chevrolet Tracker 2022',
    photo: 'rev-trasero.webp',
    rating: 5,
    date: 'Há 2 semanas',
    text: 'Aqui no Sul chove muito e sempre entrava água e barro atrás. O traseiro é peça inteiriça, sem emenda, e cobre até o túnel central. Desde que instalei acabou a dor de cabeça.',
    verified: true
  },
  {
    id: '6',
    name: 'Karina Domingues',
    city: 'Campinas',
    state: 'SP',
    vehicle: 'Jeep Renegade 2023',
    photo: 'rev-suv.webp',
    rating: 5,
    date: 'Há 2 semanas',
    text: 'Tenho cachorro e o carro ficava tomado de pelos e terra. Agora tiro em 10 segundos, sacudo lá fora e acabou. Parece acessório genuíno de concessionária, encaixe perfeito na soleira da porta.',
    verified: true
  },
  {
    id: '7',
    name: 'Alexandre Ferreira',
    city: 'Londrina',
    state: 'PR',
    vehicle: 'Renault Duster 2020',
    photo: 'rev-asiento.webp',
    rating: 5,
    date: 'Há 3 semanas',
    text: 'Pedi o kit completo com porta-malas. A bandeja traseira salva demais quando carrego ferramentas e caixas pesadas. Chegou rápido e muito bem embalado.',
    verified: true
  },
  {
    id: '8',
    name: 'Mariana Rossi',
    city: 'Santos',
    state: 'SP',
    vehicle: 'Peugeot 208 2024',
    rating: 5,
    date: 'Há 3 semanas',
    text: 'Volto da praia com os pés cheios de areia molhada e não me preocupo. Só sacudir e tá zerado. Indispensável para quem usa o carro no litoral.',
    verified: true
  },
  {
    id: '9',
    name: 'Fernando Silva',
    city: 'Goiânia',
    state: 'GO',
    vehicle: 'Caoa Chery Tiggo 5X 2023',
    rating: 5,
    date: 'Há 1 mês',
    text: 'No começo fiquei com receio pelo valor promocional, mas a espessura e densidade do TPE são excelentes. Muito superior aos tapetes de borracha comuns.',
    verified: true
  },
  {
    id: '10',
    name: 'Lorena Machado',
    city: 'São Paulo',
    state: 'SP',
    vehicle: 'Suzuki Jimny 2022',
    rating: 5,
    date: 'Há 1 mês',
    text: 'O atendimento pelo WhatsApp tirou todas as dúvidas. Confirmaram a versão exata antes do envio e chegou dentro do prazo previsto.',
    verified: true
  },
  {
    id: '11',
    name: 'Bruno Echegaray',
    city: 'Rio de Janeiro',
    state: 'RJ',
    vehicle: 'Fiat Toro 2021',
    rating: 5,
    date: 'Há 1 mês',
    text: 'O travamento nos pinos originais do assoalho é milimétrico. Não corre pra frente nem freando brusco. Produto de altíssimo nível.',
    verified: true
  },
  {
    id: '12',
    name: 'Silvana Nunes',
    city: 'Brasília',
    state: 'DF',
    vehicle: 'VW Gol 2019',
    rating: 5,
    date: 'Há 1 mês',
    text: 'Meu carro já tem alguns anos de uso e o interior ficou com cara de carro zero km recém-tirado da loja. Vale cada centavo investido.',
    verified: true
  }
];
