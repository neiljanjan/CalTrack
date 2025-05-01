// lib/nutritionix.ts
const APP_ID = 'a0ccf007';
const APP_KEY = '0e37dd0376f863770fb1019fe11a7ca3';

export const searchFoods = async (query: string) => {
  const res = await fetch(
    `https://trackapi.nutritionix.com/v2/search/instant?query=${encodeURIComponent(query)}`,
    {
      headers: {
        'x-app-id': APP_ID,
        'x-app-key': APP_KEY,
      },
    }
  );
  const data = await res.json();
  return data.common; // you can also use branded
};

export const getNutritionDetails = async (foodName: string) => {
  const res = await fetch(`https://trackapi.nutritionix.com/v2/natural/nutrients`, {
    method: 'POST',
    headers: {
      'x-app-id': APP_ID,
      'x-app-key': APP_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: foodName }),
  });

  const data = await res.json();
  return data.foods[0];
};
