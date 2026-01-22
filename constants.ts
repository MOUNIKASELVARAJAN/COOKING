
import { Ingredient } from './types';

export const INGREDIENTS: Ingredient[] = [
  { id: '1', name: 'Steak', emoji: '🥩', category: 'protein', color: 'bg-red-200' },
  { id: '2', name: 'Egg', emoji: '🥚', category: 'protein', color: 'bg-yellow-50' },
  { id: '3', name: 'Shrimp', emoji: '🍤', category: 'protein', color: 'bg-pink-100' },
  { id: '4', name: 'Tomato', emoji: '🍅', category: 'vegetable', color: 'bg-red-100' },
  { id: '5', name: 'Broccoli', emoji: '🥦', category: 'vegetable', color: 'bg-green-100' },
  { id: '6', name: 'Mushroom', emoji: '🍄', category: 'vegetable', color: 'bg-amber-100' },
  { id: '7', name: 'Chili', emoji: '🌶️', category: 'spice', color: 'bg-red-300' },
  { id: '8', name: 'Garlic', emoji: '🧄', category: 'spice', color: 'bg-gray-100' },
  { id: '9', name: 'Cheese', emoji: '🧀', category: 'misc', color: 'bg-yellow-200' },
  { id: '10', name: 'Chocolate', emoji: '🍫', category: 'misc', color: 'bg-amber-800' },
  { id: '11', name: 'Pineapple', emoji: '🍍', category: 'misc', color: 'bg-yellow-100' },
  { id: '12', name: 'Bread', emoji: '🍞', category: 'misc', color: 'bg-orange-100' },
];

export const HEAT_SETTINGS = {
  low: { color: 'text-orange-400', intensity: 1, label: 'Gentle Warmth' },
  medium: { color: 'text-orange-600', intensity: 2, label: 'Steady Sizzle' },
  high: { color: 'text-red-600', intensity: 3, label: 'Inferno Roast' },
};
