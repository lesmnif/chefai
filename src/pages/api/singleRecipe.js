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

  const query = req.body.query || []
  const language = req.body.language || 'en'
  const username = req.body.username || ''
  const system = req.body.system || ''
  const event = req.body.event
  const userId = req.body.userId
  if (query.length < 5) {
    res.status(400).json({
      error: {
        message: 'Please enter at least a 5 characters recipe',
      },
    })
    return
  }

  const messages =
    language === 'es'
      ? [
          {
            role: 'system',
            content: `You MUST give me a recipe from a sentence. And you MUST respond in Spanish.`,
          },
          {
            role: 'user',
            content: `Mi nombre es ${username}. DEBES darme una receta de una oración, dándole un nombre, ingredientes e instrucciones. DEBES dar los ingredientes y las instrucciones con la palabra seguida de ":" como "Ingredientes:". Tienes que darme los ingredientes en unidades ${
              system === 'imperial' ? 'imperiales' : 'métricas'
            }. DEBES añadir el paso de cortar los ingredientes en el correspondiente lugar de las instrucciones.`,
          },
          {
            role: 'assistant',
            content: `De acuerdo. Cuál es la frase?`,
          },
          {
            role: 'user',
            content: query,
          },
        ]
      : [
          {
            role: 'system',
            content: `You MUST give me a recipe from a sentence.`,
          },
          {
            role: 'user',
            content: `My name is ${username}. You MUST give me a recipe from one sentence, giving it a name, ingredients and instructions. You MUST give the ingredients and instructions with the word followed by ":" like "Ingredients:". You MUST give me the ingredients in ${system} units. You MUST add the chopping/cutting of the ingredientes in the following place in the instructions.`,
          },
          {
            role: 'assistant',
            content: `Understood. What's the sentence ?`,
          },
          {
            role: 'user',
            content: query,
          },
        ]

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: messages,
      frequency_penalty: 0,
      presence_penalty: 0,
      max_tokens: 600,
      top_p: 1,
      temperature: 0.7,
    })
    track(
      event,
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
