import React, { useEffect, useState } from "react"
import useSpeechToText from "react-hook-speech-to-text"

export default function Recipe({
  ingredients,
  steps,
  recipeName,
  language,
  base64,
}) {
  const [gptResults, setGptResults] = useState([])
  const [gettingResponse, setGettingResponse] = useState(false)
  const [conversationPlaying, setConversationPlaying] = useState(false)
  const [introMessage, setIntroMessage] = useState(null)

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
      const utterance = new SpeechSynthesisUtterance(data.result)
      utterance.onend = () => startSpeechToText()
      console.log("wtf", utterance)
      speechSynthesis.speak(utterance)
      let r = setInterval(() => {
        if (!speechSynthesis.speaking) {
          clearInterval(r)
        } else {
          speechSynthesis.pause()
          speechSynthesis.resume()
        }
      }, 14000)
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
    const utterance = new SpeechSynthesisUtterance(message)
    utterance.onend = () => startSpeechToText()
    speechSynthesis.speak(utterance)
    let r = setInterval(() => {
      if (!speechSynthesis.speaking) {
        clearInterval(r)
      } else {
        speechSynthesis.pause()
        speechSynthesis.resume()
      }
    }, 14000)
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

  return (
    <div className="bg-white">
      <div className="mx-auto grid max-w-2xl grid-cols-1 items-center gap-x-8 gap-y-16 px-4 py-24 sm:px-6 sm:py-32 lg:max-w-7xl lg:grid-cols-2 lg:px-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {recipeName}
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
                  · {ingredient}
                </dd>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-4">
              <dt className="font-medium text-gray-900">Steps</dt>
              {/*  */}
              {steps.map((step) => (
                <dd key={step} className="mt-2 text-sm text-gray-500">
                  · {step}
                </dd>
              ))}
            </div>
          </dl>
        </div>
        <div className="">
          <img
            alt="recipePhoto"
            src={"data:image/png;base64," + base64}
            className="rounded-lg bg-gray-100"
          />
          {/* <img
            src="https://tailwindui.com/img/ecommerce-images/product-feature-03-detail-01.jpg"
            alt="Walnut card tray with white powder coated steel divider and 3 punchout holes."
            
          /> */}
        </div>
      </div>
    </div>
  )
}
