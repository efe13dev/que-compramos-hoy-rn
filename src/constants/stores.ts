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
    id: 'lidl',
    name: 'Lidl',
    emoji: '🏪',
    accentColor: '#facc15',
    gradientColors: ['#1e1b4b', '#312e81'],
  },
  {
    id: 'carrefour',
    name: 'Carrefour',
    emoji: '🏬',
    accentColor: '#a855f7',
    gradientColors: ['#1a0533', '#2d1048'],
  },
];

export const STORAGE_KEY = '@lista_compras_v1';
