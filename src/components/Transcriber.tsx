import React, { useEffect, useState } from "react"
import useSpeechToText from "react-hook-speech-to-text"
import styles from "../styles/Home.module.css"
import Recipe from "./Recipe"

export default function Transcriber({ language }) {
  const [gptResults, setGptResults] = useState([])
  const [gettingResponse, setGettingResponse] = useState(false)
  const [conversationPlaying, setConversationPlaying] = useState(false)
  const [introMessage, setIntroMessage] = useState(null)
  const [ingredients, setIngredients] = useState([])
  const [steps, setSteps] = useState([])
  const [isReady, setIsReady] = useState(false)
  const [recipeName, setRecipeName] = useState("")
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

      setGettingResponse(false)
      console.log("lol", data.result)
      const json = JSON.parse(data.result) || undefined

      console.log("wtfxd", json, data.result)
      setGptResults(gptResults.concat(json.GPTanswer))
      setRecipeName(json.recipeName)
      setIngredients(json.ingredients)
      setSteps(json.steps)
      setIsReady(json.ready)
      const utterance = new SpeechSynthesisUtterance(json.GPTanswer)
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
      console.error(error)
      alert("ask again please")
    }
  }

  const firstMessage = () => {
    const message =
      "Hi, I'm here to help you cook tasty food! Do you have any recipe in mind? If not, what ingredients do you have available in your kitchen?"
    setIntroMessage(
      "Hi, I'm here to help you cook tasty food! Do you have any recipe in mind? If not, what ingredients do you have available in your kitchen?"
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
      <div>
        <h1 className="mb-5 px-3.5">
          <p className=" mx-10">
            {language === "es-ES" ? "ESPAÑOL" : "ENGLISH"}{" "}
          </p>
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
        {/* {isReady && <Recipe/>} */}
      </div>
    </main>
  )
}
