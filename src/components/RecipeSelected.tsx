import React, { use, useEffect, useState } from 'react'
import useSpeechToText from '../hooks/speech-to-text/speech-to-text'
import Loader from './Loader'
import { speak } from '../functions/text-to-speech'
import { Tooltip } from '@material-tailwind/react'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import { toast } from 'react-hot-toast'
import Timer from '../components/Timer'
import { track } from '@amplitude/analytics-node'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'

const timerToast = () =>
  toast.custom(
    <CountdownCircleTimer
      isPlaying
      duration={7}
      colors={['#004777', '#F7B801', '#A30000', '#A30000']}
      colorsTime={[7, 5, 2, 0]}
    >
      {({ remainingTime }) => remainingTime}
    </CountdownCircleTimer>
  )

function findMinutes(text) {
  const regex = /(\d+)\s*(mins?|minutes?|min)/gi // modified regular expression to match different patterns for minutes
  const match = regex.exec(text) // search for a match in the text
  if (match) {
    const value = parseInt(match[1]) // extract the number of minutes from the match
    return value // return the value in minutes
  } else {
    return null // return null if no match is found
  }
}

const fetchImage = async (recipeName: string) => {
  const res = await fetch('/api/text-to-image', {
    method: 'POST',
    body: JSON.stringify({
      prompt: `${recipeName}, Editorial Photography, Photography, Shot on 70mm lens, Depth of Field, Bokeh, DOF, Tilt Blur, Shutter Speed 1/1000, F/22, White Balance, 32k, Super-Resolution, white background`,
    }),
  })

  const data = await res.json()
  return data.base64
}

const fetchRecipeName = async (recipeInfo) => {
  try {
    const response = await fetch('/api/recipeName', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipeInfo: recipeInfo,
      }),
    })

    const data = await response.json()
    if (response.status !== 200) {
      throw data.error || new Error(`Request failed with status ${response.status}`)
    }
    return data.result
  } catch (error) {
    toast.error('Something went wrong generating your recipee. Try again later or contact support.')
    return console.log('My error is:', error)
  }
}

const fetchGPTResponse = async ({
  questions,
  gptResults,
  recipeName,
  steps,
  language,
  userId,
}: {
  questions: string[]
  gptResults: string[]
  steps: string[]
  language: string
  recipeName: string
  userId: string
}) => {
  const response = await fetch('/api/cooking', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      questions: questions,
      gptResponses: gptResults,
      recipeName: recipeName,
      steps: JSON.stringify(steps),
      language: language,
      userId: userId,
    }),
  })

  const data = await response.json()
  if (response.status !== 200) {
    throw data.error || new Error(`Request failed with status ${response.status}`)
  }

  return data.result
}

const handleTimers = (time, language) => {
  return toast((t) => <Timer time={time} toastId={t.id} language={language} />, {
    position: 'top-right',
    duration: Infinity,
  })
}

const getIntroMessage = (language: string, recipeName: string) => {
  switch (language) {
    case 'es-ES':
      return `Vamos a empezar a cocinar ${recipeName}. Asegúrate de preguntar cualquier duda que puedas tener, ¿listo para empezar?`
    case 'en-US':
    default:
      return `We're going to start cooking ${recipeName}. Make sure to ask any doubts that you may have, ready to start?`
  }
}

export default function Recipe({ ingredients, steps, recipeInfo, language, userId }) {
  const [base64, setBase64] = useState('')
  const [gptResults, setGptResults] = useState([])
  const [isFetchingGPT, setIsFetchingGPT] = useState(false)
  const [isConversationActive, setIsConversationActive] = useState(false)
  const [introMessage, setIntroMessage] = useState(null)
  const [recipeName, setRecipeName] = useState(null)
  const [minutes, setMinutes] = useState({})
  const [transcriptionResults, setTranscriptionResults] = useState([])

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition, finalTranscript } = useSpeechRecognition()

  const isListening = listening

  useEffect(() => {
    toast(
      language === 'es-ES'
        ? 'Haz click en el texto resaltado para empezar el timer correspondiente!'
        : 'Click on the highlighted text to set the correspondent timer!',
      {
        icon: '⏱️',
      }
    )
  }, [])

  const generateImage = async (recipeName) => {
    const base64Data = await fetchImage(recipeName)
    setBase64(base64Data)
  }

  async function generateRecipeName(recipeInfo) {
    const recipeName = await fetchRecipeName(recipeInfo)
    if (recipeName) {
      setRecipeName(recipeName)
    }
  }

  async function generateGptResponse(questions) {
    console.log('IS FETCHING GPT???', isFetchingGPT)
    try {
      if (isFetchingGPT) {
        stopListening()
        return
      }
      stopListening()
      setIsFetchingGPT(true)
      const gptResponse = await fetchGPTResponse({ questions, gptResults, recipeName, steps, language, userId })
      SpeechRecognition.abortListening()
      setGptResults(gptResults.concat(gptResponse))
      setIsFetchingGPT(false)
      await speak(gptResponse, language)
      startListening()
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.log(error)
      toast.error('Something went wrong, try again or contact support')
      await speak('Error', language)
      setIsFetchingGPT(false)
    }
  }

  const startConversation = async () => {
    setIsConversationActive(true)
    const message = getIntroMessage(language, recipeName)
    await speak(message, language)
    startListening()
  }

  const pauseConversation = () => {
    stopListening()
    return setIsConversationActive(false)
  }

  const playConversation = () => {
    if (!isFetchingGPT) {
      startListening()
      return setIsConversationActive(true)
    }
  }

  const toggleConversationActive = () => {
    if (transcriptionResults.length === 0 && !isConversationActive) {
      return startConversation()
    }
    if (isConversationActive && !isListening) {
      speechSynthesis.cancel()
      return setIsConversationActive(false)
    }
    return isListening ? pauseConversation() : playConversation()
  }

  const startListening = () => {
    if (!isFetchingGPT) {
      console.log('STARTING LISTENING -- SPEECH TO TEXT')
      SpeechRecognition.startListening({
        continuous: true,
        language: language,
      })
    }
  }

  const stopListening = () => {
    SpeechRecognition.stopListening()
  }

  useEffect(() => {
    setTranscriptionResults([])
  }, [])

  useEffect(() => {
    if (!finalTranscript) {
      return
    }
    console.log(finalTranscript)
    setTranscriptionResults((res) => [...res, { transcript: finalTranscript }])
    resetTranscript()
  }, [finalTranscript])

  // const { error, isRecording, results, startSpeechToText, stopSpeechToText } = useSpeechToText({
  //   timeout: 20000,
  //   continuous: false,
  //   speechRecognitionProperties: {
  //     interimResults: true,
  //     lang: language,
  //   },
  //   crossBrowser: true,
  //   useOnlyGoogleCloud: language === 'es-ES' ? true : false,
  //   googleCloudRecognitionConfig: {
  //     languageCode: language,
  //   },
  //   googleApiKey: process.env.GOOGLE_CLOUD_API_KEY,
  //   useLegacyResults: false,
  // })

  useEffect(() => {
    speechSynthesis.cancel()
    if (transcriptionResults.length === 0) {
      return
    }
    generateGptResponse(transcriptionResults)
  }, [transcriptionResults])

  useEffect(() => {
    console.log('this is my listening', listening)
  }, [listening])

  useEffect(() => {
    if (recipeInfo) {
      generateRecipeName(recipeInfo)
    }

    return () => {
      speechSynthesis.cancel()
    }
  }, [])

  useEffect(() => {
    if (recipeName) {
      generateImage(recipeName)
    }
  }, [recipeName])

  useEffect(() => {
    // Call the findMinutes function for each step
    const newMinutes = {}
    for (const step of steps) {
      const value = findMinutes(step)
      newMinutes[step] = value
    }
    setMinutes(newMinutes)
  }, [])

  return (
    <div className="bg-white">
      <div className="mx-auto grid max-w-2xl grid-cols-1 items-center gap-x-8 gap-y-16 px-4 py-24 sm:px-6 sm:py-32 lg:max-w-7xl lg:grid-cols-2 lg:px-8">
        <div>
          <button onClick={() => SpeechRecognition.stopListening()}> click me to stop speechtotext</button>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {recipeName && recipeName}
            <button
              className={
                !isConversationActive
                  ? 'rounded-full  bg-blue-500 px-3.5 ml-10 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-blue-600'
                  : 'rounded-full  bg-red-500 px-3.5 ml-10 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-red-600'
              }
              onClick={() => toggleConversationActive()}
            >
              {isConversationActive
                ? 'Pause Cooking'
                : transcriptionResults.length !== 0
                ? 'Resume Cooking'
                : 'Start Cooking'}
            </button>
          </h2>
          <p className="text-xl font-semibold mt-5">
            {isListening && (language === 'es-ES' ? 'Escuchando...' : 'Listening...')}
            {isFetchingGPT && (language === 'es-ES' ? 'Obteniendo respuesta' : 'Getting response')}
          </p>
          <dl className="mt-16 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-16 lg:gap-x-8">
            <div className="border-t border-gray-200 pt-4">
              <dt className="font-medium text-gray-900">{language === 'es-ES' ? 'Ingredientes' : 'Ingredients'}</dt>
              {/*  */}
              {ingredients.map((ingredient) => (
                <dd key={ingredient} className="mt-2 text-sm text-gray-500">
                  {ingredient}
                </dd>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-4">
              <dt className="font-medium text-gray-900">{language === 'es-ES' ? 'Pasos' : 'Steps'}</dt>
              {/*  */}
              {steps.map((step, index) => {
                const className =
                  minutes[step] === null
                    ? 'mt-2 text-sm text-gray-500'
                    : 'mt-2 text-sm text-blue-700 hover:cursor-pointer'
                const handleClick = minutes[step] !== null ? () => handleTimers(minutes[step] * 60, language) : () => {}
                return minutes[step] !== null ? (
                  <Tooltip
                    key={step}
                    content={`Click to set a ${minutes[step]} minutes timer`}
                    className="inline-flex items-center rounded border border-transparent bg-[#304483] px-2.5 py-0.5 text-xs font-medium text-white shadow-sm "
                    animate={{
                      mount: { scale: 1.2, y: 0 },
                      unmount: { scale: 0, y: 25 },
                    }}
                  >
                    <dd onClick={handleClick} className={className}>
                      {step}
                    </dd>
                  </Tooltip>
                ) : (
                  <dd onClick={handleClick} key={step} className={className}>
                    {step}
                    {minutes[step]}
                  </dd>
                )
              })}
            </div>
          </dl>
        </div>
        <div className="flex justify-center items-center">
          {base64 ? (
            <img alt="recipePhoto" src={'data:image/png;base64,' + base64} className="rounded-lg bg-gray-100" />
          ) : (
            <Loader cooking={true} />
          )}
        </div>
      </div>
    </div>
  )
}
