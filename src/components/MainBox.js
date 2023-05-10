/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
import { CalendarDaysIcon, HandRaisedIcon } from '@heroicons/react/24/outline'
import RandomQuery from '../functions/RandomQuery'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Loader from './Loader'

export default function MainBox({ query, setQuery, handleSubmitButton, gettingResponse, language }) {
  const [placeholder, setPlaceholder] = useState('')

  useEffect(() => {
    setPlaceholder(RandomQuery(language))
  }, [language])

  return (
    <div className="relative isolate overflow-hidden bg-gray-900 py-8 sm:py-12 lg:py-24 rounded-lg">
      <div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-r from-sky-400 to-blue-500 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
      <div className="">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              {language === 'es-ES' ? 'Tienes una idea en mente?' : 'Do you have an idea in mind?'}
            </h1>
            <p className="mt-6 text-lg leading-8 text-white">
              {language === 'es-ES'
                ? 'Hagámoslo realidad. Crea una receta con solo el nombre del plato, tus ingredientes o una frase y te guiaré a través de ella.'
                : `Let's make it a reality. Create a recipe with just the name of the dish, your ingredients or a sentence and I'll guide you
              through it.`}
            </p>
            <div className="mt-5 flex items-center justify-center gap-x-6">
              <textarea
                rows={2}
                aria-disabled={gettingResponse}
                onChange={(e) => setQuery(e.target.value)}
                value={query}
                className="resize-none flex-auto rounded-md border-0 bg-white/5 px-2.5 py-2 text-white shadow-sm ring-1 ring-inset lg:h-16 h-24 ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                placeholder={placeholder}
              />
            </div>
            <div className='flex justify-around'>
              <button
                onClick={() => {
                  setQuery(RandomQuery(language))
                }}
                className="flex-none  rounded-md bg-white px-3.5 py-2.5 mt-6 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {language === 'es-ES' ? 'Dame un ejemplo' : 'Show me an example'}
              </button>
              <button
                type="button"
                disabled={gettingResponse}
                onClick={() => handleSubmitButton(query)}
                className="flex-none rounded-md bg-indigo-500 mt-6 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                {gettingResponse ? <Loader /> : language === 'es-ES' ? 'Vamos a cocinar' : "Let's cook"}
              </button>
            </div>
          </div>
        </div>
        <div className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl xl:-top-6" aria-hidden="true">
          <div
            className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-sky-400 to-blue-500 opacity-30"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
      </div>
    </div>
  )
}
