export interface ReviewItem {
  id: string;
  name: string;
  avatar: string;
  verified: boolean;
  rating: number;
  text: string;
  video?: string;
  poster?: string;
  photo?: string;
  vehicle?: string;
  city?: string;
  state?: string;
  date?: string;
}

export const REVIEWS_DATA: ReviewItem[] = [
  {
    id: 'rev-1',
    name: 'Lucas Almeida',
    avatar: '/images/homem1.jpg',
    photo: '1.jpg',
    vehicle: 'Fiat Toro 2023',
    city: 'Curitiba',
    state: 'PR',
    date: 'Há 2 dias',
    verified: true,
    rating: 5.0,
    text: 'Tapete de excelente qualidade, encaixou perfeitamente no carro.',
    video: '/media/depo1.mp4',
    poster: '/media/poster-depo1.webp'
  },
  {
    id: 'rev-2',
    name: 'Mariana Costa',
    avatar: '/images/mulher1.jpg',
    photo: '2.jpg',
    vehicle: 'VW Nivus 2024',
    city: 'Florianópolis',
    state: 'SC',
    date: 'Há 4 dias',
    verified: true,
    rating: 5.0,
    text: 'Deu outra cara pro interior do carro, material muito bonito.',
    video: '/media/depo2.mp4',
    poster: '/media/poster-depo2.webp'
  },
  {
    id: 'rev-3',
    name: 'Rafael Nogueira',
    avatar: '/images/homem2.jpg',
    photo: '3.jpg',
    vehicle: 'Toyota Hilux 2022',
    city: 'Ribeirão Preto',
    state: 'SP',
    date: 'Há 1 semana',
    verified: true,
    rating: 5.0,
    text: 'Produto muito bem acabado e chegou rápido.',
    video: '/media/depo3.mp4',
    poster: '/media/poster-depo3.webp'
  },
  {
    id: 'rev-4',
    name: 'Ana Paula Ribeiro',
    avatar: '/images/mulher1.webp',
    photo: '4.png',
    vehicle: 'Hyundai Creta 2023',
    city: 'Belo Horizonte',
    state: 'MG',
    date: 'Há 1 semana',
    verified: true,
    rating: 5.0,
    text: 'Ficou lindo no carro, super recomendo.',
    video: '/media/depo4.mp4',
    poster: '/media/poster-depo4.webp'
  }
];
