interface GenerationResponse {
  artifacts: Array<{
    base64: string
    seed: number
    finishReason: string
  }>
}

const generateImage = async (prompt: string): Promise<GenerationResponse> => {
  const engineId = "stable-diffusion-v1-5"
  const apiHost = process.env.API_HOST ?? "https://api.stability.ai"
  const apiKey = process.env.STABLE_API_KEY

  if (!apiKey) throw new Error("Missing Stability API key.")

  const response = await fetch(
    `${apiHost}/v1/generation/${engineId}/text-to-image`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        text_prompts: [
          {
            text: prompt,
          },
        ],
        cfg_scale: 7,
        style_preset: "enhance",
        clip_guidance_preset: "SLOW",
        height: 512,
        width: 512,
        samples: 1,
        steps: 50,
      }),
    }
  )

  if (!response.ok) {
    throw new Error(`Non-200 response: ${await response.text()}`)
  }

  const responseJSON = (await response.json()) as GenerationResponse

  return responseJSON
}

export default async function (req, res) {
    console.log("this is my request body", req.body)
  if (req.method !== 'POST') {
    return res.status(400).json({ error: 'Method not supported' })
  }

  const { prompt } = JSON.parse(req.body)

  if (!prompt) {
    return res.status(400).json({ error: 'Missing "prompt" parameter.' })
  }

  const imageResponse = await generateImage(prompt)

  res.status(200).json({
    base64: imageResponse.artifacts[0].base64,
    message: 'all good!'
  })
}
