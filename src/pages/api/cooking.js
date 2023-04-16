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
  const recipeName = req.body.recipeName
  const steps = req.body.steps || []
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
      content: `You are a cooking assistant. You're going to help me cook on the phone step by step.`,
    },
    {
      role: "user",
      content: `Your task is to help me cook the following ${recipeName} recipe: ${steps}. You MUST go step by step and MUST give concise answers and dont keep going until you're sure I have finished the previous step.`,
    },
    {
      role: "assistant",
      content: `Sure, I'm going to help you cook this recipe step by step with concise answers, are you ready to start?`,
    },
  ]

  questions.forEach((question, index) => {
    return gptResponses[index - 1]
      ? messages.push(
          { role: "assistant", content: gptResponses[index - 1] },
          {
            role: "user",
            content: question.transcript,
          }
        )
      : messages.push({
          role: "user",
          content: question.transcript,
        })
  })
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