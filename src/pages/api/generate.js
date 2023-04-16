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
        "You are a cooking assistant. You MUST always reply with only a JSON format response or you will be penalized.",
    },
    {
      role: "user",
      content:
        'Your task is to help me choose a recipe to cook. When ingredients and steps are sent, "ready" must be true. You MUST only answer in the following JSON format:\n`{"recipeName": "Undefined","GPTanswer":"Sure, How can I help you choosing a recipe","ingredients":[],"steps":[],"ready": false}`\nUnderstood?',
    },
    {
      role: "assistant",
      content:
        '{"recipeName": "Undefined","GPTanswer":"Understood, Do you have any recipe in mind? If not, what ingredients do you have available in your kitchen?","ingredients":[],"steps":[],"ready": false}',
    },
  ]

  questions.forEach((question, index) => {
    return gptResponses[index - 1]
      ? messages.push(
          { role: "assistant", content: gptResponses[index - 1] },
          {
            role: "user",
            content: `${question.transcript}, your response MUST be only a JSON.`,
          }
        )
      : messages.push({
          role: "user",
          content: `${question.transcript}, your response MUST be only a JSON.`,
        })
  })
  console.log("wtf", messages)
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
      frequency_penalty: 0,
      presence_penalty: 0,
      max_tokens: 427,
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
