import React, { useEffect, useState } from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'

export default function Dictaphone() {
  const [message, setMessage] = useState(null)
  const [domLoaded, setDomLoaded] = useState(false)

  useEffect(() => {
    setDomLoaded(true)
  }, [])

  const commands = [
    {
      command: 'okay alexa',
      callback: () => resetTranscript(),
    },
    {
      command: 'reset',
      callback: () => resetTranscript(),
      isFuzzyMatch: true,
    },
    {
      command: 'Beijing',
      callback: (command, spokenPhrase, similarityRatio) =>
        setMessage(`${command} and ${spokenPhrase} are ${similarityRatio * 100}% similar`),
      // If the spokenPhrase is "Benji", the message would be "Beijing and Benji are 40% similar"
      isFuzzyMatch: true,
      fuzzyMatchingThreshold: 0.2,
    },
    {
      command: 'shut up',
      callback: () => setMessage("I wasn't talking."),
    },
    {
      command: 'Hello',
      callback: () => setMessage('Hi there!'),
    },
  ]
  const { transcript, interimTranscript, finalTranscript, resetTranscript, listening } = useSpeechRecognition({
    commands,
  })

  useEffect(() => {
    if (finalTranscript !== '') {
      console.log('Got final result:', finalTranscript)
    }
  }, [interimTranscript, finalTranscript])

  // if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
  //   return null
  // }

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    console.log('Your browser does not support speech recognition software! Try Chrome desktop, maybe?')
  }
  const listenContinuously = () => {
    SpeechRecognition.startListening({
      continuous: true,
      language: 'en-US',
    })
  }
  console.log("fafuc", transcript)

  return (
    <>
      {domLoaded && (
        <div className="text-black">
          <div>
            <div className="text-black">HELLO</div>
            <p>listening: {listening ? 'on' : 'off'}</p>
            <div>
              <button type="button" onClick={resetTranscript}>
                Reset
              </button>
              <button type="button" onClick={listenContinuously}>
                Listen
              </button>
              <button type="button" onClick={SpeechRecognition.stopListening}>
                Stop
              </button>
            </div>
          </div>
          {message && <div>{message}</div>}
          <div>
            <span>{transcript}</span>
          </div>
        </div>
      )}
    </>
  )
}
