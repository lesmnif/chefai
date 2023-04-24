export default function getRandomRecipeQuery() {
    const recipeQueries = [
      "I want to make a romantic dinner for two tonight.",
      "I'm craving something spicy and flavorful for dinner.",
      "I need a quick and easy breakfast recipe for busy mornings.",
      "I want to impress my friends with a fancy dessert recipe.",
      "I'm in the mood for comfort food, something warm and filling.",
      "I want to make a healthy and nutritious meal for my family tonight.",
      "I'm hosting a party and need some appetizer ideas.",
      "I'm on a budget and need some cheap meal ideas.",
      "I'm a vegetarian and need some new recipe ideas for protein-rich meals.",
      "I have a bunch of tomatoes, cauliflower, potato and cucumber that I want to use up.",
      "I want to make a dish inspired by a different culture, but I'm not sure where to start.",
      "I'm trying to cut down on carbs and need some low-carb recipe ideas.",
      "I want to make a special birthday cake for my friend, who loves chocolate.",
      "I'm trying to incorporate more seafood into my diet and need some recipe ideas.",
      "I want to make a homemade pizza from scratch, but need a recipe for the dough.",
      "I'm trying to eat more plant-based meals and need some vegan recipe ideas.",
      "I'm on a low-fat diet and need some recipe ideas that are still flavorful.",
      "I want to make a recipe that can easily be meal prepped for the week ahead.",
      "I want to make a classic French onion soup, but I don't have any beef broth.",
      "I'm craving a chicken tikka masala, but I don't have any yogurt for the marinade.",
      "I want to make a traditional pad thai, but I don't have tamarind paste.",
      "I'm in the mood for a hearty beef stew, but I don't have any red wine.",
      "I want to make a delicious hummus, but I don't have tahini paste."
    ];
    
    const randomIndex = Math.floor(Math.random() * recipeQueries.length);
    console.log(randomIndex)
    return recipeQueries[randomIndex];
}