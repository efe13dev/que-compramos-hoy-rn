import { Store } from '../types';

export const INITIAL_STORES: Store[] = [
  {
    id: 'mercadona',
    name: 'Mercadona',
    emoji: '🛒',
    accentColor: '#22d3ee',
    gradientColors: ['#0c4a6e', '#164e63'],
  },
  {
    id: 'consum',
    name: 'Consum',
    emoji: '🛍️',
    accentColor: '#f97316',
    gradientColors: ['#3b0a02', '#5c1408'],
  },
  {
    id: 'ekoprix',
    name: 'Ekoprix',
    emoji: '🏪',
    accentColor: '#4ade80',
    gradientColors: ['#052e16', '#14532d'],
  },
];

export const STORAGE_KEY = '@lista_compras_v1';
