import { OpenAI } from 'openai-streams'

export default async function (req, res) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('query')
  console.log('this is my query :)', query)
  const language = req.body.language || 'english'

  console.log('what the fucj', query, language)

  const messages = [
    {
      role: 'system',
      content: 'You are my cooking assistant. You MUST respond in spanish',
    },
    {
      role: 'user',
      content:
        'You must give me 4 diferent recipes based on the text that I give you, you MUST respond in spanish. You MUST ALWAYS reply with the following format:\n\nGreat! Here are four recipe ideas for a romantic dinner:\n\n1. Grilled Ribeye Steak with Balsamic Reduction - 25 minutes\n2. Lobster Linguine with White Wine Sauce - 30 minutes\n3. Pan-Seared Scallops with Garlic Butter - 15 minutes\n4. Beef Wellington with Red Wine Sauce - 45 minutes\n\nEnjoy your romantic dinner!',
    },
    {
      role: 'assistant',
      content: "Understood, what's your text to generate recipes from ?",
    },
    {
      role: 'user',
      content: "I'm on a low-fat diet and need some recipe ideas that are still flavorful.",
    },
  ]

  const stream = await OpenAI('chat', {
    model: 'gpt-3.5-turbo',
    max_tokens: 500,
    messages: messages,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 600,
    top_p: 1,
    temperature: 0.7,
  })

  return new Response(stream)
}

export const config = {
  runtime: 'edge',
}
