import { Configuration, OpenAIApi } from "openai"

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    })
    return
  }

  const recipeInfo = req.body.recipeInfo || ""

  if (recipeInfo.length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid recipeName",
      },
    })
    return
  }
  const messages = [
    {
      role: "system",
      content: `Your task is to name a recipe using text.`,
    },
    {
      role: "user",
      content: `Your answer MUST be only the recipe name of the following recipe: Got it! Here's a recipe for you:

      Ingredients:
      - 1 pound spaghetti
      - 1 tablespoon olive oil
      - 1 pound shrimp, peeled and deveined
      - 3 cloves garlic, minced
      - 1 cup heavy cream
      - 1/2 cup grated parmesan cheese
      - Salt and pepper
      - Fresh parsley, chopped
      
      Instructions:
      1. Cook spaghetti according to package instructions in a pot of salted boiling water. Drain the pasta and set aside.
      2. In a large skillet, heat olive oil over medium-high heat. Add shrimp and cook until pink and opaque, about 2-3 minutes per side. Remove the shrimp from the skillet and set aside.
      3. Add garlic to the same skillet and cook until fragrant, about 1 minute.
      4. Reduce heat to low and add heavy cream to the skillet. Simmer the cream until it thickens, about 5 minutes.
      5. Stir in parmesan cheese and continue to cook until cheese is melted and sauce is smooth.
      6. Add cooked spaghetti to the skillet and toss with the sauce. Season with salt and pepper to taste.
      7. Add shrimp back to the skillet and cook for another minute or so until everything is heated through.
      8. Garnish with chopped parsley and serve hot.
      
      Enjoy your delicious shrimp pasta with creamy garlic sauce!`,
    },
    {
      role: "assistant",
      content: `Creamy Garlic Shrimp Pasta`,
    },
    {
      role: "user",
      content: `Your answer MUST be only the recipe name of the following recipe: ${recipeInfo}`,
    },
  ]

  console.log("wtf", messages)
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
      frequency_penalty: 0,
      presence_penalty: 0,
      max_tokens: 150,
      top_p: 1,
      temperature: 0.7,
    })
    res.status(200).json({ result: completion.data.choices[0].message.content })
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data)
      res.status(error.response.status).json(error.response.data)
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`)
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      })
    }
  }
}
