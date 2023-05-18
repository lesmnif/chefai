import { Configuration, OpenAIApi } from 'openai'
import { track } from '@amplitude/analytics-node'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: 'OpenAI API key not configured, please follow instructions in README.md',
      },
    })
    return
  }

  const questions = req.body.questions || []
  const gptResponses = req.body.gptResponses || []
  const recipeName = req.body.recipeName
  const steps = req.body.steps || []
  const language = req.body.language || 'en-US'
  const event = req.body.event
  const userId = req.body.userId

  if (questions.length === 0) {
    res.status(400).json({
      error: {
        message: 'Please enter a valid question',
      },
    })
    return
  }

  const messages =
    language === 'es-ES'
      ? [
          {
            role: 'system',
            content: `You are a cooking assistant. You're going to help me cook on the phone step by step. You MUST always respond in Spanish`,
          },
          {
            role: 'user',
            content: `Tu tarea es ayudarme a cocinar la siguiente receta de ${recipeName}: ${steps}. DEBES ir paso a paso y DEBES dar respuestas concisas y no continuar hasta que estés seguro de que he terminado el paso anterior.`,
          },
          {
            role: 'assistant',
            content: `Claro, te ayudaré a cocinar esta receta paso a paso con respuestas concisas, ¿estás listo para comenzar?`,
          },
        ]
      : [
          {
            role: 'system',
            content: `You are a cooking assistant. You're going to help me cook on the phone step by step.`,
          },
          {
            role: 'user',
            content: `Your task is to help me cook the following ${recipeName} recipe: ${steps}. You MUST go step by step and MUST give concise answers and dont keep going until you're sure I have finished the previous step.`,
          },
          {
            role: 'assistant',
            content: `Sure, I'm going to help you cook this recipe step by step with concise answers, are you ready to start?`,
          },
        ]

  questions.forEach((question, index) => {
    return gptResponses[index - 1]
      ? messages.push(
          { role: 'assistant', content: gptResponses[index - 1] },
          {
            role: 'user',
            content: question.transcript,
          }
        )
      : messages.push({
          role: 'user',
          content: question.transcript,
        })
  })
  try {
    console.log('Calling OpenAI with prompt', messages)
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: messages,
      frequency_penalty: 0,
      presence_penalty: 0,
      max_tokens: 100,
      top_p: 1,
      temperature: 0.7,
    })
    track(
      'UserSentMessage',
      {
        language: language,
      },
      {
        user_id: userId,
      }
    )
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
          message: 'An error occurred during your request.',
        },
      })
    }
  }
}
