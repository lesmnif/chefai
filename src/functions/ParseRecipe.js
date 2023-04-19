export default function parseRecipe(text) {
  const recipe = {
    ingredients: [],
    instructions: [],
    intro: "",
  }

  let currentSection = ""
  const lines = text.split("\n")
  let introFound = false
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!introFound) {
      recipe.intro += line
    }

    if (line.endsWith(":")) {
      currentSection = line.slice(0, -1).toLowerCase()
    } else {
      if (currentSection === "ingredients") {
        introFound = true
        recipe.ingredients.push(line)
      } else if (currentSection === "instructions") {
        recipe.instructions.push(line)
      }
    }
  }
  const recipeParts = recipe.intro.split(":")

  // Return the first part of the recipe text
  recipe.intro = recipeParts[0]
  return recipe
}