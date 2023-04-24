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

  const query = req.body.query || []

  if (query.length < 5) {
    res.status(400).json({
      error: {
        message: "Please enter at least a 5 characters recipe",
      },
    })
    return
  }
  const messages = [
    {
      role: "system",
      content: `You MUST give me a recipe from a sentence.`,
    },
    {
      role: "user",
      content: `You MUST give me a recipe from one sentence, giving it a name, ingredients and instructions. You MUST give the ingredients and instructions with the word followed by ":" like "Ingredients:".`,
    },
    {
      role: "assistant",
      content: `Understood. What's the sentence ?`,
    },
    {
      role: "user",
      content: query,
    },
  ]

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
      frequency_penalty: 0,
      presence_penalty: 0,
      max_tokens: 600,
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
