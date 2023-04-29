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

  const questions = req.body.questions || []
  const gptResponses = req.body.gptResponses || []
  const error = req.body.error || false

  if (questions.length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid question",
      },
    })
    return
  }
  const messages = [
    {
      role: "system",
      content:
        "You are a cooking assistant. You must assist me in choosing a recipe.",
    },
    {
      role: "user",
      content:
        'Your task is to help me choose a recipe to cook. You must ask me about my preferences and ingredients that I have available in my kitchen. When the recipe is given you MUST give the ingredients and instructions with the word followed by ":" like "Ingredients:". Also if Ingredients are provided Instructions MUST always be provided. ',
    },
    {
      role: "assistant",
      content:
        "Hi, I'm here to help you cook tasty food! Do you have any recipe in mind? If not, any preferences or available ingredients in your kitchen?",
    },
  ]

  questions.forEach((question, index) => {
    return gptResponses[index - 1]
      ? messages.push(
          { role: "assistant", content: gptResponses[index - 1] },
          {
            role: "user",
            content: `${question.transcript}`,
          }
        )
      : messages.push({
          role: "user",
          content:`${question.transcript}`,
        })
  })
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
