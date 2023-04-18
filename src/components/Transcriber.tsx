import React, { useEffect, useState } from "react"
import useSpeechToText from "react-hook-speech-to-text"
import styles from "../styles/Home.module.css"
import Recipe from "./Recipe"

export default function Transcriber({ language }) {
  const [gptResults, setGptResults] = useState([])
  const [gettingResponse, setGettingResponse] = useState(false)
  const [conversationPlaying, setConversationPlaying] = useState(false)
  const [introMessage, setIntroMessage] = useState(null)
  const [errorsCounter, setErrorsCounter] = useState(0)
  const [ingredients, setIngredients] = useState([])
  const [steps, setSteps] = useState([])
  const [recipeName, setRecipeName] = useState([])
  const [isReady, setIsReady] = useState(false)
  const [base64, setBase64img] = useState("")

  const fetchImage = async (recipeName) => {
    const res = await fetch("/api/text-to-image", {
      method: "POST",
      body: JSON.stringify({
        prompt: `A tasty ${recipeName} dish`,
      }),
    })

    const data = await res.json()
    console.log("data", data)
    setBase64img(data.base64)
  }

  async function gptResponse(questions, error) {
    try {
      setGettingResponse(true)
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questions: questions,
          gptResponses: gptResults,
          error: error,
        }),
      })

      const data = await response.json()
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        )
      }

      console.log("lol", data.result)
      const json = JSON.parse(data.result) || undefined
      console.log("wtfxd", json, data.result)
      setGptResults(gptResults.concat(json.GPTanswer))
      setRecipeName(json.recipeName)
      setIngredients(json.ingredients)
      setSteps(json.steps)
      setGettingResponse(false)
      setErrorsCounter(0)
      const utterance = new SpeechSynthesisUtterance(json.GPTanswer)
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
    } catch (error) {
      if (errorsCounter >= 5) {
        return window.location.reload()
      }
      if (error.name === "SyntaxError") {
        console.log("U got in here :)))")
        console.log(errorsCounter)
        setErrorsCounter(errorsCounter + 1)
        return gptResponse(results, true)
      }
      // Consider implementing your own error handling logic here
      alert(error.message)
    }
  }

  const handleReadyButton = () => {
    fetchImage(recipeName)
    return setIsReady
  }

  const firstMessage = () => {
    const message =
      "Hi, I'm here to help you cook tasty food! Do you have any recipe in mind? If not, any preferences or available ingredients in your kitchen?"
    setIntroMessage(
      "Hi, I'm here to help you cook tasty food! Do you have any recipe in mind? If not, any preferences or available ingredients in your kitchen?"
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
    console.log("pause conv triggered")
    stopSpeechToText()
    return setConversationPlaying(false)
  }

  const playConversation = () => {
    console.log("play conv triggered")
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
    timeout: 25000,
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
    speechSynthesis.cancel()
    if (results.length === 0) {
      return
    }
    gptResponse(results, false)
  }, [results])

  if (error)
    return (
      <p>
        {JSON.stringify(error)}Web Speech API is not available in this browser
        🤷‍
      </p>
    )

  return (
    <main className="h-screen text-center my-20">
      {isReady ? (
        <Recipe
          language={"en-US"}
          ingredients={ingredients}
          steps={steps}
          recipeName={recipeName}
          base64={base64}
        />
      ) : (
        <div>
          <h1 className="mb-5 px-3.5">
            <p className=" mx-10">
              {language === "es-ES" ? "ESPAÑOL" : "ENGLISH"}{" "}
            </p>
            {recipeName && ingredients.length !== 0 && steps.length !== 0 && (
              <button
                className={
                  "rounded-full  bg-red-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-blue-600"
                }
                onClick={() => setIsReady(true)}
              >
                I'm ready to cook this recipe
              </button>
            )}
          </h1>
          <h1 className="text-3xl font-bold underline px-3.5">
            {isRecording && "Listening..."}
            {gettingResponse && "Getting response"}
          </h1>
          <button
            className={
              !conversationPlaying
                ? "rounded-full  bg-blue-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-blue-600"
                : "rounded-full  bg-red-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-red-600"
            }
            onClick={handleButtonClick}
          >
            {conversationPlaying
              ? "Pause conversation"
              : results.length !== 0
              ? "Resume Conversation"
              : "Start Conversation"}
          </button>
          {introMessage && <p> ASSISTANT: {introMessage}</p>}
          {results.map((result, index) => (
            <div key={result.timestamp}>
              <p key={result.timestamp}>QUESTION: {result.transcript}</p>
              {gptResults[index] && <p> ASSISTANT: {gptResults[index]}</p>}
            </div>
          ))}
          {interimResult && <p>{interimResult}</p>}
          {ingredients?.length !== 0 && steps?.length !== 0 && (
            <div>
              <h2 className="text-xl mt-10 font-bold tracking-tight text-gray-900 sm:text-2xl">
                {recipeName && recipeName}
              </h2>
              <dl className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-16 lg:gap-x-8">
                <div className="border-t border-gray-200 pt-4">
                  <dt className="font-medium text-gray-900">Ingredients</dt>
                  {ingredients.map((ingredient) => (
                    <dd key={ingredient} className="mt-2 text-sm text-gray-500">
                      · {ingredient}
                    </dd>
                  ))}
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <dt className="font-medium text-gray-900">Steps</dt>
                  {steps.map((step) => (
                    <dd key={step} className="mt-2 text-sm text-gray-500">
                      · {step}
                    </dd>
                  ))}
                </div>
              </dl>
            </div>
          )}
        </div>
      )}
    </main>
  )
}
