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
import UseAnimations from 'react-useanimations'
import microphone2 from 'react-useanimations/lib/microphone2'
import SilencedMicrophone from '/mic_silenced.svg'
import useSound from 'use-sound'
import GoogleCloudSpeechRecognition from '../functions/GoogleCloudPolyfill3'

// SpeechRecognition.applyPolyfill(GoogleCloudSpeechRecognition)

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

export default function Recipe({ ingredients, steps, recipeInfo, language, userId, recipeName, recipeCookingTime }) {
  const [base64, setBase64] = useState('')
  const [gptResults, setGptResults] = useState([])
  const [isFetchingGPT, setIsFetchingGPT] = useState(false)
  const [isConversationActive, setIsConversationActive] = useState(false)
  const [introMessageSent, setIntroMessageSent] = useState(false)
  const [minutes, setMinutes] = useState({})
  const [transcriptionResults, setTranscriptionResults] = useState([])
  const [isCheffySpeaking, setIsCheffySpeaking] = useState(false)
  const [commandFound, setCommandFound] = useState(false)

  const handleOkayCheffy = () => {
    resetTranscript()
    setIsConversationActive(true)
  }

  const handleTimersCommand = async (minutes) => {
    console.log('those are my mins lol', minutes)
    if (isNaN(minutes)) {
      console.log('lmaoXD', minutes)
      resetTranscript()
      return
    }
    setCommandFound(true)
    handleTimers(minutes * 60, 'en-US')
    setIsConversationActive(false)
    await speak(`${minutes} minutes timer set!`, 'en-US')
    resetTranscript()
    setCommandFound(false)
  }

  const commands = [
    {
      command: 'okay cheffy',
      callback: (command, spokenPhrase, similarityRatio) => {
        if (introMessageSent) {
          handleOkayCheffy()
        }
      },
      // If the spokenPhrase is "Benji", the message would be "Beijing and Benji are 40% similar"
      isFuzzyMatch: true,
      fuzzyMatchingThreshold: 0.2,
    },
    {
      command: 'stop',
      callback: () => pauseConversation(),
    },
    {
      command: 'shut up',
      callback: () => pauseConversation(),
    },
    {
      command: [
        ':minutes minutes',
        'set :minutes minutes timer',
        'put :minutes minutes timer',
        ':minutes minute timer',
        ':minutes minutes timer',
      ],
      callback: (minutes) => handleTimersCommand(minutes),
    },
  ]

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition, finalTranscript } =
    useSpeechRecognition({ commands })

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

  const handleStopSpeech = (toastId) => {
    speechSynthesis.cancel()
    setIsCheffySpeaking(false)
    playConversation()
    resetTranscript()
    toast.dismiss(toastId)
  }

  const generateImage = async (recipeName) => {
    const base64Data = await fetchImage(recipeName)
    setBase64(base64Data)
  }

  async function generateGptResponse(questions) {
    console.log('IS FETCHING GPT???', isFetchingGPT)
    try {
      if (isFetchingGPT) {
        return
      }
      setIsFetchingGPT(true)
      setIsConversationActive(false)
      const loadingToastId = toast.loading('Loading...', {
        iconTheme: {
          primary: '#fff',
          secondary: '#000',
        },
      })
      const gptResponse = await fetchGPTResponse({ questions, gptResults, recipeName, steps, language, userId })
      toast.dismiss(loadingToastId)
      setGptResults(gptResults.concat(gptResponse))
      setIsFetchingGPT(false)
      setIsCheffySpeaking(true)
      const toastId = speakingToast()
      await speak(gptResponse, language)
      toast.dismiss(toastId)
      setIsCheffySpeaking(false)
      resetTranscript()
      setIsConversationActive(true)
      setTimeout(() => {
        setIsConversationActive(false)
      }, 5000)
    } catch (error) {
      if (error.error === 'interrupted') {
        return
      }
      // Consider implementing your own error handling logic here
      console.log(error)
      toast.dismiss()
      toast.error('Something went wrong, try again or contact support')
      await speak('Error', language)
      setIsCheffySpeaking(false)
      setIsConversationActive(false)
      setIsFetchingGPT(false)
    }
  }

  const speakingToast = () => {
    const toastId = toast(
      (t) => (
        <div>
          <div className="flex flex-col items-center justify-center">
            <div className="justify-center text-center flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="blue"
                className="w-6 h-6 animate-bounce mt-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
                />
              </svg>
            </div>
            <div className="flex items-center mt-4">
              <span className="isolate inline-flex rounded-md shadow-sm">
                <button
                  type="button"
                  onClick={() => handleStopSpeech(t.id)}
                  className="relative -ml-px inline-flex items-center rounded-r-md rounded-l-md  bg-white px-2 py-1 text-xs font-medium text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                >
                  {language === 'es-ES' ? 'Parar' : 'Dismiss'}
                  {/* {language === 'es-ES' ? 'Borrar' : 'Dismiss'} */}
                </button>
              </span>
            </div>
          </div>
        </div>
      ),
      {
        duration: Infinity,
      }
    )
    return toastId
  }

  const startConversation = async () => {
    setIntroMessageSent(true)
    setIsCheffySpeaking(true)
    const message = getIntroMessage(language, recipeName)
    const toastId = speakingToast()
    await speak(message, language)
    setIsConversationActive(true)
    resetTranscript()
    setIsCheffySpeaking(false)
    toast.dismiss(toastId)
  }

  const pauseConversation = () => {
    speechSynthesis.cancel()
    resetTranscript()
    setIsConversationActive(false)
    return
  }

  const playConversation = () => {
    if (!isFetchingGPT) {
      setIsConversationActive(true)
    }
  }

  const toggleConversationActive = () => {
    if (transcriptionResults.length === 0 && !isConversationActive) {
      return startConversation()
    }
    return isConversationActive ? pauseConversation() : playConversation()
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

  console.log('what', finalTranscript, 'and this is my transcript', transcript)

  useEffect(() => {
    startListening()
  }, [])

  useEffect(() => {
    if (!isConversationActive) {
      console.log('you shouldnt be going in here')
      resetTranscript()
      return
    }
    if (!finalTranscript) {
      console.log('what the actual fuck??????')
      return
    }
    if (commandFound) {
      return
    }
    console.log(' u should be going in here!')
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
          <div className="flex items-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {recipeName && recipeName}
            </h2>
            {isConversationActive && introMessageSent && (
              <audio src="/audio/start.mp3" autoPlay>
                Your browser does not support the <code>audio</code> element.
              </audio>
            )}
            {!isConversationActive && introMessageSent && !isCheffySpeaking && (
              <audio src="/audio/stop.mp3" autoPlay>
                Your browser does not support the <code>audio</code> element.
              </audio>
            )}

            <p className="inline-flex">
              <button
                onClick={toggleConversationActive}
                disabled={isCheffySpeaking || isFetchingGPT}
                className={
                  isConversationActive
                    ? 'ml-3 rounded-full px-3.5 py-2 m-1 overflow-hidden relative group cursor-pointer border-2 font-medium border-indigo-600 text-indigo-600 animate-wave'
                    : 'ml-3 rounded-full px-3.5 py-2 m-1 overflow-hidden relative group cursor-pointer border-2 font-medium border-red-600 text-red-600 '
                }
              >
                <span
                  className={
                    isConversationActive
                      ? 'absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-indigo-600 top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease'
                      : 'absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-red-600 top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease'
                  }
                ></span>
                <span
                  className={
                    isConversationActive
                      ? 'relative text-indigo-600 transition duration-300 group-hover:text-white ease'
                      : 'relative text-red-600 transition duration-300 group-hover:text-white ease'
                  }
                >
                  {!isConversationActive ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      view-box="0 0 24 24"
                      className="w-6 h-6"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 19L17.591 17.591L5.409 5.409L4 4" />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 18.75C13.5913 18.75 15.1174 18.1179 16.2426 16.9926C17.3679 15.8674 18 14.3413 18 12.75V11.25M12 18.75C10.4087 18.75 8.88258 18.1179 7.75736 16.9926C6.63214 15.8674 6 14.3413 6 12.75V11.25M12 18.75V22.5M8.25 22.5H15.75M12 15.75C11.2044 15.75 10.4413 15.4339 9.87868 14.8713C9.31607 14.3087 9 13.5456 9 12.75V4.5C9 3.70435 9.31607 2.94129 9.87868 2.37868C10.4413 1.81607 11.2044 1.5 12 1.5C12.7956 1.5 13.5587 1.81607 14.1213 2.37868C14.6839 2.94129 15 3.70435 15 4.5V12.75C15 13.5456 14.6839 14.3087 14.1213 14.8713C13.5587 15.4339 12.7956 15.75 12 15.75Z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
                      />
                    </svg>
                  )}
                </span>
              </button>
            </p>
          </div>
          {/* <button
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
          </button> */}
          <p className="text-xl font-semibold mt-5">
            {/* {isListening && (language === 'es-ES' ? 'Escuchando...' : 'Listening for commands...')}
            {isConversationActive && 'Listening to give response'}
            {isFetchingGPT && (language === 'es-ES' ? 'Obteniendo respuesta' : 'Getting response')} */}
          </p>
          <dl className="mt-16 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-16 lg:gap-x-8">
            <div className="border-t border-gray-200 pt-4">
              <dt className="font-medium text-gray-900">{language === 'es-ES' ? 'Ingredientes' : 'Ingredients'}</dt>
              {/*  */}
              {ingredients.map((ingredient, index) => (
                <dd key={index} className="mt-2 text-sm text-gray-500">
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
                    key={index}
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
                  <dd onClick={handleClick} key={index} className={className}>
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
            <Loader cooking={true} language={language} />
          )}
        </div>
      </div>
    </div>
  )
}
