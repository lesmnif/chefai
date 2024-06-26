const { Deepgram } = require('@deepgram/sdk')
const fs = require('fs')

const deepgram = new Deepgram(process.env.DEEPGRAM_API_KEY)
const googleApiKey = process.env.GOOGLE_CLOUD_API_KEY

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

export default async function (req, res) {
  if (req.method !== 'POST') {
    return res.status(400).json({ error: 'Method not supported' })
  }

  // const body = JSON.parse(req.body)
  const body = req.body

  if (!body) {
    return res.status(400).json({ error: 'Missing body.' })
  }

  const googleCloudRes = await fetch(`https://speech.googleapis.com/v1/speech:recognize?key=${googleApiKey}`, {
    method: 'POST',
    body: body,
  })

  const googleCloudJson = await googleCloudRes.json()

  // const transcription = await deepgram.transcription.preRecorded({
  //   buffer: Buffer.from(body.audio.content, 'base64'),
  //   mimetype: 'audio/wav'
  // }, {
  //   punctuate: true,
  // 	// model: 'nova',
  //   model: 'general',
  //   language: 'es',
  // })

  // console.log('transcription', transcription)

  res.status(200).json(googleCloudJson)
}
