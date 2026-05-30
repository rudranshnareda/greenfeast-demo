export type MealCategory = 'bowl' | 'wrap' | 'salad' | 'toast' | 'smoothie';

export interface Meal {
  id: string;
  name: string;
  category: MealCategory;
  description: string;
  price: number;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  imageUrl: string;
  tags?: string[];
}

export interface Plan {
  id: 'trial' | 'plan15' | 'plan30';
  name: string;
  mealsTotal: number;
  daysPerWeek: number;
  basePrice: number;
}

export interface AddOn {
  id: string;
  name: string;
  pricePerMeal: number;
  description?: string;
}

export interface DietaryProfile {
  allergens: { name: string; severity: 'mild' | 'severe' }[];
  freeText: string;
}

export interface Address {
  label: string;
  type: 'office' | 'residence';
  line1: string;
  city: string;
  pincode: string;
  landmark?: string;
  timeWindow: string;
}

export interface WeeklyMealPlan {
  [day: string]: string;
}

export interface User {
  onboarded: boolean;
  phone: string;
  name: string;
  plan: Plan | null;
  mealsPerDay: number;
  selectedDays: string[];
  weeklyMealPlan: WeeklyMealPlan;
  dietary: DietaryProfile;
  addOns: { id: string; selected: boolean; subOption?: string }[];
  address: Address | null;
  wallet: number;
  subscriptionStartDate: string;
  deliveriesRemaining: number;
  mealPricePerMeal?: number;
  healthProfile?: { age: string; weight: string; height: string; goal: string };
  dietaryPreference?: string;
  deliveryMode?: 'opt-in' | 'opt-out';
}
