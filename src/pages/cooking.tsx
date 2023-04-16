import dynamic from "next/dynamic"

const Recipe = dynamic(() => import("../components/Recipe"), {
  ssr: false,
})
export default function Cooking() {
  const steps = [
    "1. Cook the pasta according to package instructions until al dente.",
    "2. In a large skillet over medium heat, brown the ground beef. Add the onion, red pepper, green pepper, and garlic and cook until the vegetables are tender.",
    "3. Stir in the diced tomatoes, tomato sauce, basil, oregano, red pepper flakes, salt, and pepper. Simmer for 10-15 minutes.",
    "4. Serve the sauce over the cooked pasta, topped with grated Parmesan cheese.",
  ]
  const ingredients = [
    "1 lb. pasta",
    "1 lb. ground beef",
    "1 onion",
    "1 red pepper",
    "1 green pepper",
    "2 cloves garlic",
    "1 can diced tomatoes",
    "1 can tomato sauce",
    "1 tsp. dried basil",
    "1/2 tsp. dried oregano",
    "1/4 tsp. red pepper flakes",
    "salt and pepper to taste",
    "1/4 cup grated Parmesan cheese",
  ]

  return (
    <Recipe
      ingredients={ingredients}
      recipeName={"Spaghetti Roquefort"}
      steps={steps}
      language={"en-US"}
    />
  )
}
