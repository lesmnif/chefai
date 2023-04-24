const { Deepgram } = require("@deepgram/sdk");
const fs = require('fs')

const deepgram = new Deepgram(process.env.DEEPGRAM_API_KEY)

export default async function (req, res) {
  if (req.method !== 'POST') {
    return res.status(400).json({ error: 'Method not supported' })
  }

  const body = JSON.parse(req.body)

  if (!body) {
    return res.status(400).json({ error: 'Missing body.' })
  }

  const transcription = await deepgram.transcription.preRecorded({
    buffer: Buffer.from(body.audio.content, 'base64'),
    mimetype: 'audio/wav'
  }, {
    punctuate: true,
		// model: 'nova',
    model: 'general',
    language: 'es',
  })

  console.log('transcription', transcription)

  res.status(200).json(transcription)
}
