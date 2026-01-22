
export interface Ingredient {
  id: string;
  name: string;
  emoji: string;
  category: 'protein' | 'vegetable' | 'spice' | 'misc';
  color: string;
}

export type HeatLevel = 'low' | 'medium' | 'high';

export interface CookingResult {
  dishName: string;
  critique: string;
  score: number;
  rating: string;
}

export interface AppState {
  selectedIngredients: Ingredient[];
  isCooking: boolean;
  heatLevel: HeatLevel;
  timer: number;
  result: CookingResult | null;
  loading: boolean;
}
