import { init, track } from '@amplitude/analytics-node'

export default async function (req, res) {
  const language = req.body.language || 'en'
  const event = req.body.event
  const userId = req.body.userId

  try {
    track(
      event,
      {
        language: language,
      },
      {
        user_id: userId,
      }
    )
    res.status(200).json({ result: 'Succeed' })
  } catch (error) {
    res.status(418).json({ errorTeapot: 'AdBlock' })
  }
}
