import React, { useEffect, useState } from "react"
import useSpeechToText from '../hooks/speech-to-text/speech-to-text'
import Loader from "./Loader"
import GetTimers from "../functions/GetTimers"
import TimersButtons from "./TimersButtons"
import { speak } from "../functions/text-to-speech"

export default function Recipe({ ingredients, steps, recipeInfo, language }) {
  const [base64, setBase64] = useState("")
  const [gptResults, setGptResults] = useState([])
  const [gettingResponse, setGettingResponse] = useState(false)
  const [conversationPlaying, setConversationPlaying] = useState(false)
  const [introMessage, setIntroMessage] = useState(null)
  const [recipeName, setRecipeName] = useState(null)
  const [timers, setTimers] = useState([])

  const fetchImage = async (recipeName) => {
    const res = await fetch("/api/text-to-image", {
      method: "POST",
      body: JSON.stringify({
        prompt: `A tasty ${recipeName} dish`,
      }),
    })

    const data = await res.json()
    console.log("data", data)
    setBase64(data.base64)
  }

  async function firstRender(recipeInfo) {
    console.log("recipeInfo is that: ", recipeInfo)
    try {
      const response = await fetch("/api/recipeName", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipeInfo: recipeInfo,
        }),
      })

      const data = await response.json()
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        )
      }
      setRecipeName(data.result)
    } catch (error) {
      return console.log("My error is:", error)
    }
  }

  async function gptResponse(questions) {
    try {
      setGettingResponse(true)
      const response = await fetch("/api/cooking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questions: questions,
          gptResponses: gptResults,
          recipeName: recipeName,
          steps: JSON.stringify(steps),
        }),
      })

      const data = await response.json()
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        )
      }

      setGettingResponse(false)

      setGptResults(gptResults.concat(data.result))
      await speak(data.result, language)
      startSpeechToText()
    } catch (error) {
      // Consider implementing your own error handling logic here

      alert("ask again please")
    }
  }

  const firstMessage = () => {
    const message = `We're going to start cooking ${recipeName}. Make sure to ask any doubts that you may have, ready to start?`
    setIntroMessage(
      `We're going to start cooking ${recipeName}. Make sure to ask any doubts that you may have!`
    )
    speak(message, language).then(startSpeechToText)
    setConversationPlaying(true)
  }

  const pauseConversation = () => {
    console.log("im going in here")
    stopSpeechToText()
    return setConversationPlaying(false)
  }

  const playConversation = () => {
    console.log("im going on the paly part")
    startSpeechToText()
    return setConversationPlaying(true)
  }

  const handleButtonClick = () => {
    if (results.length === 0 && !conversationPlaying && !introMessage) {
      return firstMessage()
    }
    if (conversationPlaying && !isRecording) {
      speechSynthesis.cancel()
      return setConversationPlaying(false)
    }
    return isRecording ? pauseConversation() : playConversation()
  }

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    timeout: 20000,
    continuous: false,
    crossBrowser: true,
    useOnlyGoogleCloud: language === "es-ES" ? true : false,
    googleCloudRecognitionConfig: {
      languageCode: language,
    },
    googleApiKey: process.env.GOOGLE_CLOUD_API_KEY,
    useLegacyResults: false,
  })

  useEffect(() => {
    console.log("XD", results)
    speechSynthesis.cancel()
    if (results.length === 0) {
      return
    }
    gptResponse(results)
  }, [results])

  useEffect(() => {
    if (recipeInfo) {
      firstRender(recipeInfo)
      return
    }
  }, [])

  useEffect(() => {
    if (steps) {
      const timers = GetTimers(steps)
      setTimers(timers)
    }
    if (recipeName) {
      fetchImage(recipeName)
      return
    }
  }, [recipeName])

  return (
    <div className="bg-white">
      <div className="mx-auto grid max-w-2xl grid-cols-1 items-center gap-x-8 gap-y-16 px-4 py-24 sm:px-6 sm:py-32 lg:max-w-7xl lg:grid-cols-2 lg:px-8">
        <div>
          <TimersButtons timers={timers} />
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {recipeName && recipeName}
            <button
              className={
                !conversationPlaying
                  ? "rounded-full  bg-blue-500 px-3.5 ml-10 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-blue-600"
                  : "rounded-full  bg-red-500 px-3.5 ml-10 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-red-600"
              }
              onClick={handleButtonClick}
            >
              {conversationPlaying
                ? "Pause Cooking"
                : results.length !== 0
                ? "Resume Cooking"
                : "Start Cooking"}
            </button>
          </h2>
          {/* <p className="mt-4 text-gray-500">
            The walnut wood card tray is precision milled to perfectly fit a
            stack of Focus cards. The powder coated steel divider separates
            active cards from new ones, or can be used to archive important task
            lists.
          </p> */}
          <p className="text-xl font-semibold mt-5">
            {isRecording && "Listening..."}
            {gettingResponse && "Getting response"}
          </p>
          <dl className="mt-16 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-16 lg:gap-x-8">
            <div className="border-t border-gray-200 pt-4">
              <dt className="font-medium text-gray-900">Ingredients</dt>
              {/*  */}
              {ingredients.map((ingredient) => (
                <dd key={ingredient} className="mt-2 text-sm text-gray-500">
                  {ingredient}
                </dd>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-4">
              <dt className="font-medium text-gray-900">Steps</dt>
              {/*  */}
              {steps.map((step) => (
                <dd key={step} className="mt-2 text-sm text-gray-500">
                  {step}
                </dd>
              ))}
            </div>
          </dl>
        </div>
        <div className="flex justify-center items-center">
          {base64 ? (
            <img
              alt="recipePhoto"
              src={"data:image/png;base64," + base64}
              className="rounded-lg bg-gray-100"
            />
          ) : (
            <Loader cooking={true} />
          )}
          {/* <img
            src="https://tailwindui.com/img/ecommerce-images/product-feature-03-detail-01.jpg"
            alt="Walnut card tray with white powder coated steel divider and 3 punchout holes."
            
          /> */}
        </div>
      </div>
    </div>
  )
}