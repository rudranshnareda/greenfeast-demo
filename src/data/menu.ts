import type { Meal, Plan, AddOn } from '../types';

export const MEALS: Meal[] = [
  {
    id: 'thai-zen-bowl',
    name: 'Thai Zen Bowl',
    category: 'bowl',
    description: 'A Thai-inspired medley with chilli tofu, crunchy veggies, and peanut crunch all on a bed of brown rice and bok choy.',
    price: 329, kcal: 550, protein: 25, carbs: 42, fat: 15,
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&fit=crop',
  },
  {
    id: 'italian-harvest-bowl',
    name: 'Italian Harvest Bowl',
    category: 'bowl',
    description: 'Rustic and hearty herbed pasta, grilled veggies, parmesan, and creamy pesto yogurt dressing bring Italy to your bowl.',
    price: 329, kcal: 560, protein: 22, carbs: 45, fat: 16,
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&fit=crop',
  },
  {
    id: 'umami-soba-bowl',
    name: 'Umami Soba Bowl',
    category: 'bowl',
    description: 'A bold Asian bowl with soba noodles, tofu, crunchy veg, and creamy peanut dressing. Umami in every bite.',
    price: 329, kcal: 540, protein: 24, carbs: 44, fat: 14,
    imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&fit=crop',
  },
  {
    id: 'mexican-fiesta-bowl',
    name: 'Mexican Fiesta Bowl',
    category: 'bowl',
    description: "It's a party in a bowl! Smoky beans, rice, corn, salsa, nachos, and avocado all with our spicy chipotle dressing.",
    price: 329, kcal: 580, protein: 23, carbs: 48, fat: 17,
    imageUrl: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=400&fit=crop',
  },
  {
    id: 'mediterranean-bliss-bowl',
    name: 'Mediterranean Bliss Bowl',
    category: 'bowl',
    description: 'Rich mix of chickpeas, couscous, roasted veggies, feta, hummus & tahini loaded with good fats and good vibes.',
    price: 329, kcal: 570, protein: 24, carbs: 45, fat: 18,
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&fit=crop',
  },
  {
    id: 'avo-protein-bowl',
    name: 'Avo Protein Bowl',
    category: 'bowl',
    description: 'A clean, green power bowl with tofu, quinoa, sweet potato, avocado, walnuts & honey mustard dressing.',
    price: 329, kcal: 530, protein: 25, carbs: 40, fat: 16,
    imageUrl: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&fit=crop',
  },
  {
    id: 'quinoa-buddha-bowl',
    name: 'Quinoa Buddha Bowl',
    category: 'bowl',
    description: 'Light, bright, and balanced — a superfood-packed bowl with quinoa, chickpeas, paneer, roasted veg, and sweet mango dressing.',
    price: 329, kcal: 540, protein: 26, carbs: 42, fat: 14,
    imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&fit=crop',
  },
  {
    id: 'smoky-chipotle-wrap',
    name: 'Smoky Chipotle Wrap',
    category: 'wrap',
    description: 'Tex-Mex style with beans, corn, paneer, avocado, jalapeños, cheddar, and chipotle spread in our signature pink tortilla.',
    price: 299, kcal: 520, protein: 22, carbs: 38, fat: 15,
    imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&fit=crop',
  },
  {
    id: 'bbq-protein-wrap',
    name: 'BBQ Protein Wrap',
    category: 'wrap',
    description: 'Tandoori paneer, bell peppers, cucumber, and spiced onion masala with creamy tandoori dressing.',
    price: 299, kcal: 510, protein: 24, carbs: 36, fat: 14,
    imageUrl: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&fit=crop',
  },
  {
    id: 'pesto-bliss-wrap',
    name: 'Pesto Bliss Wrap',
    category: 'wrap',
    description: 'Grilled paneer, pickled onion, bell peppers, cheddar, and fresh greens with in-house pesto.',
    price: 299, kcal: 500, protein: 22, carbs: 35, fat: 14,
    imageUrl: 'https://images.unsplash.com/photo-1592415486689-125cbbfcbee2?w=400&fit=crop',
  },
  {
    id: 'cajun-fusion-wrap',
    name: 'Cajun Fusion Wrap',
    category: 'wrap',
    description: 'Peri peri tofu, caramelized onion, tomato confit, mozzarella, and cajun dressing in a soft tortilla.',
    price: 299, kcal: 510, protein: 23, carbs: 36, fat: 15,
    imageUrl: 'https://images.unsplash.com/photo-1600335895229-6e75511892c8?w=400&fit=crop',
  },
  {
    id: 'peri-peri-panini',
    name: 'Peri Peri Panini Sandwich',
    category: 'wrap',
    description: 'Our in-house soft multigrain beetroot panini pressed with smoky peri peri paneer layered with tomato, cucumber, feta cheese and our in-house creamy sauce.',
    price: 299, kcal: 540, protein: 24, carbs: 40, fat: 16,
    imageUrl: 'https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=400&fit=crop',
  },
  {
    id: 'tropical-fruit-salad',
    name: 'Tropical Fruit Salad',
    category: 'salad',
    description: 'A refreshing burst of seasonal fruits, mint, and caramelized almonds with a citrusy lemon-honey dressing.',
    price: 299, kcal: 320, protein: 8, carbs: 38, fat: 10,
    imageUrl: 'https://images.unsplash.com/photo-1564093497595-593b96d80180?w=400&fit=crop',
    tags: ['Gluten-Free', 'Jain'],
  },
  {
    id: 'tandoori-paneer-avocado-salad',
    name: 'Tandoori Paneer Avocado Salad',
    category: 'salad',
    description: 'Smoky paneer, creamy avocado, and crisp greens tossed with crunchy seeds and a bold Asian dressing.',
    price: 299, kcal: 380, protein: 18, carbs: 25, fat: 12,
    imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&fit=crop',
    tags: ['Gluten-Free'],
  },
  {
    id: 'caesar-salad',
    name: 'Caesar Salad',
    category: 'salad',
    description: 'The classic — crunchy romaine, croutons, cherry tomatoes, parmesan, and our creamy Caesar dressing.',
    price: 299, kcal: 350, protein: 16, carbs: 28, fat: 11,
    imageUrl: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?w=400&fit=crop',
  },
  {
    id: 'jain-glow-bowl',
    name: 'Jain Glow Bowl',
    category: 'salad',
    description: 'A light and sattvic salad with couscous, kaju, tomato confit, and honey-lemon dressing.',
    price: 299, kcal: 340, protein: 12, carbs: 30, fat: 10,
    imageUrl: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=400&fit=crop',
    tags: ['Jain'],
  },
  {
    id: 'avocado-feta-toast',
    name: 'Avocado Feta Toast',
    category: 'toast',
    description: 'Guacamole, feta, pomegranate, tomato confit, microgreens, and seeds.',
    price: 279, kcal: 280, protein: 9, carbs: 27, fat: 13,
    imageUrl: 'https://images.unsplash.com/photo-1603046891744-76e6300f82ef?w=400&fit=crop',
  },
  {
    id: 'earthy-hummus-toast',
    name: 'Earthy Hummus Toast',
    category: 'toast',
    description: 'Hummus topped with sautéed mushrooms, parmesan, olives, and herbs.',
    price: 279, kcal: 260, protein: 10, carbs: 27, fat: 13,
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&fit=crop',
  },
  {
    id: 'berry-banana-protein',
    name: 'Berry Banana Protein',
    category: 'smoothie',
    description: 'A creamy smoothie powered by banana, blueberries, almond milk, and our homemade nut-based protein blend.',
    price: 199, kcal: 220, protein: 18, carbs: 30, fat: 7,
    imageUrl: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&fit=crop',
  },
  {
    id: 'watermelon-mint-chia',
    name: 'Watermelon Mint Chia',
    category: 'smoothie',
    description: 'A cooling, hydrating blend of fresh watermelon, mint, and chia. Your perfect summer refresher.',
    price: 149, kcal: 90, protein: 2, carbs: 15, fat: 1,
    imageUrl: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400&fit=crop',
  },
  {
    id: 'coconut-chaach',
    name: 'Coconut Chaach',
    category: 'smoothie',
    description: 'A light buttermilk-style drink infused with coconut, roasted cumin, and curry leaves. Soothing and digestion-friendly.',
    price: 149, kcal: 90, protein: 3, carbs: 10, fat: 5,
    imageUrl: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=400&fit=crop',
  },
];

export const PLANS: Plan[] = [
  { id: 'trial', name: '5-Meal Trial', mealsTotal: 5, daysPerWeek: 5, basePrice: 1499 },
  { id: 'plan15', name: '15-Meal Plan', mealsTotal: 15, daysPerWeek: 3, basePrice: 4050 },
  { id: 'plan30', name: '30-Meal Plan', mealsTotal: 30, daysPerWeek: 6, basePrice: 7499 },
];

export const ADD_ONS: AddOn[] = [
  { id: 'extra-protein', name: 'Extra Protein', pricePerMeal: 45, description: '8–10g per meal' },
  { id: 'extra-cheese', name: 'Extra Cheese', pricePerMeal: 30, description: 'Feta / Parmesan / Cheddar' },
  { id: 'exotic-fruits', name: 'Exotic Cut Fruits', pricePerMeal: 99 },
];

export const ALLERGENS = ['Peanuts', 'Gluten', 'Dairy', 'Tree nuts', 'Sesame', 'Other'];

export const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const TIME_WINDOWS = [
  'Before 1:00 PM',
  'Around 2:30 PM',
  'After 5:00 PM',
];

export const DEFAULT_BOWL_ROTATION = [
  'thai-zen-bowl',
  'mexican-fiesta-bowl',
  'mediterranean-bliss-bowl',
  'umami-soba-bowl',
  'italian-harvest-bowl',
  'avo-protein-bowl',
];
