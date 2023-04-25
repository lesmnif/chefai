import React, { useEffect, useState } from 'react'
import useSpeechToText from '../hooks/speech-to-text/speech-to-text'
import RecipeSelection from './RecipeSelected'
import ParseRecipe from '../functions/ParseRecipe'
import { speak } from '../functions/text-to-speech'

export default function Transcriber({ language }) {
  const [gptResults, setGptResults] = useState([])
  const [gettingResponse, setGettingResponse] = useState(false)
  const [conversationPlaying, setConversationPlaying] = useState(false)
  const [introMessage, setIntroMessage] = useState(null)
  const [recipe, setRecipe] = useState(null)
  const [recipeInfo, setRecipeInfo] = useState(null)
  const [isReady, setIsReady] = useState(false)
  const [isChoosenRecipe, setIsChoosenRecipe] = useState(false)

  async function gptResponse(questions, error) {
    try {
      setGettingResponse(true)
      const response = await fetch('/api/testing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questions: questions,
          gptResponses: gptResults,
          error: error,
        }),
      })

      const data = await response.json()
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`)
      }
      const recipe = ParseRecipe(data.result)
      console.log('what is going on', recipe, data.result)
      if (recipe.ingredients.length !== 0 && recipe.instructions.length !== 0) {
        setIsChoosenRecipe(true)
        setRecipeInfo(data.result)
        setRecipe(recipe)
        setConversationPlaying(false)
        await speak(recipe.intro, language)
      } else {
        setIsChoosenRecipe(true)
        await speak(data.result, language)
        startSpeechToText()
      }
      setGptResults(gptResults.concat(data.result))
      setGettingResponse(false)
    } catch (error) {
      if (error.name === 'SyntaxError') {
        console.log('U got in here :)))')
        return gptResponse(results, true)
      }
      // Consider implementing your own error handling logic here
      alert(error.message)
    }
  }

  const firstMessage = () => {
    const message =
      "Hi, I'm here to help you cook tasty food! Do you have any recipe in mind? If not, any preferences or available ingredients in your kitchen?"
    setIntroMessage(
      "Hi, I'm here to help you cook tasty food! Do you have any recipe in mind? If not, any preferences or available ingredients in your kitchen?"
    )
    speak(message, language).then(startSpeechToText)
    setConversationPlaying(true)
  }

  const pauseConversation = () => {
    console.log('pause conv triggered')
    stopSpeechToText()
    return setConversationPlaying(false)
  }

  const playConversation = () => {
    console.log('play conv triggered')
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

  const { error, interimResult, isRecording, results, startSpeechToText, stopSpeechToText } = useSpeechToText({
    timeout: 25000,
    continuous: false,
    crossBrowser: true,
    speechRecognitionProperties: {
      interimResults: true,
      lang: language,
    },
    useOnlyGoogleCloud: language === 'es-ES' ? true : false,
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

  if (error) return <p>{JSON.stringify(error)}Web Speech API is not available in this browser 🤷‍</p>

  return (
    <main className="text-center">
      {isReady ? (
        <RecipeSelection
          language={'en-US'}
          ingredients={recipe.ingredients}
          steps={recipe.instructions}
          recipeInfo={recipeInfo}
        />
      ) : (
        <div>
          <h1 className="mb-5 px-3.5 pt-14">
            <p className=" mx-10">{language === 'es-ES' ? 'ESPAÑOL' : 'ENGLISH'} </p>
            {recipe && (
              <button
                className={
                  'rounded-full  bg-red-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-blue-600'
                }
                onClick={() => setIsReady(true)}
              >
                I'm ready to cook this recipe
              </button>
            )}
          </h1>
          <h1 className="text-3xl font-bold underline px-3.5">
            {isRecording && 'Listening...'}
            {gettingResponse && 'Getting response'}
          </h1>
          <button
            className={
              !conversationPlaying
                ? 'rounded-full  bg-blue-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-blue-600'
                : 'rounded-full  bg-red-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-red-600'
            }
            onClick={handleButtonClick}
            disabled={gettingResponse}
          >
            {conversationPlaying
              ? 'Pause conversation'
              : results.length !== 0
              ? 'Resume Conversation'
              : 'Start Conversation'}
          </button>
          {introMessage && <p> ASSISTANT: {introMessage}</p>}
          {results.map((result, index) => (
            <div key={result.timestamp}>
              <p>QUESTION: {result.transcript}</p>
              {gptResults[index] && <p> ASSISTANT: {recipe && isChoosenRecipe ? recipe.intro : gptResults[index]}</p>}
            </div>
          ))}
          {interimResult && <p>{interimResult}</p>}
          {recipe && (
            <div>
              <dl className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-16 lg:gap-x-8">
                <div className="border-t border-gray-200 pt-4">
                  <dt className="font-medium text-gray-900">Ingredients</dt>
                  {recipe.ingredients?.map((ingredient) => (
                    <dd key={ingredient} className="mt-2 text-sm text-gray-500">
                      {ingredient}
                    </dd>
                  ))}
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <dt className="font-medium text-gray-900">Steps</dt>
                  {recipe.instructions?.map((step) => (
                    <dd key={step} className="mt-2 text-sm text-gray-500">
                      {step}
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
