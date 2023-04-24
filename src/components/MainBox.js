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
import { CalendarDaysIcon, HandRaisedIcon } from "@heroicons/react/24/outline"
import RandomQuery from "../functions/RandomQuery"
import { useEffect, useState } from "react"
import Link from "next/link"
import Loader from "./Loader"

export default function MainBox({
  query,
  setQuery,
  handleSubmitButton,
  gettingResponse,
  setGettingResponse,
}) {
  const [placeholder, setPlaceholder] = useState("")
  useEffect(() => {
    setPlaceholder(RandomQuery())
  }, [])

  return (
    <div className="relative isolate overflow-hidden bg-gray-900 py-16 sm:py-24 lg:py-32 rounded-lg">
      <div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-r from-sky-400 to-blue-500 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
          <div className="max-w-xl lg:max-w-lg">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              If you know what to cook
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-300">
              Let's make it a reality. Create a recipe with just the name of the
              dish or a sentence and I'll guide you through it.
            </p>
            <div className="mt-6 flex max-w-4xl gap-x-4">
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              {/* <input
                  type="text"
                  name="food"
                  disabled={gettingResponse}
                  onChange={(e) => setQuery(e.target.value)}
                  value={query}
                  id="food"
                  className="block w-full rounded-md border-0 py-1.5  text-gray-900 shadow-sm ring-1 ring-inset pl-7 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Spaghetti Carbonara"
                />
                <button
                  type="button"
                  onClick={() => handleSubmitButton(query)}
                  className="rounded inline-flex bg-white px-2 py-1.5 ml-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  {gettingResponse ? <Loader /> : "Submit"}
                </button>
              </p> */}
              <textarea
                rows={2}
                aria-disabled={gettingResponse}
                onChange={(e) => setQuery(e.target.value)}
                value={query}
                className=" resize-none flex-auto rounded-md border-0 bg-white/5 px-2.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                placeholder={placeholder}
              />
              <div className="items-center justify-center flex">
                <button
                  type="button"
                  onClick={() => handleSubmitButton(query)}
                  className="flex-none rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  {gettingResponse ? <Loader /> : "Let's cook"}
                </button>
              </div>
            </div>
            <button
              onClick={() => {
                setQuery(RandomQuery())
              }}
              className="flex-none ml-36 mt-5 rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Show me an example
            </button>
          </div>
          <dl className="ml-7 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-1 lg:pt-2">
            <div className="flex flex-col items-start">
              <dt className="mt-4 font-semibold text-white">
                If you don't have a clear idea, no worries!
              </dt>
              <dd className="mt-2 leading-7 text-gray-400">
                I'll help you choose a recipe from scratch that fits all your
                needs.
              </dd>
              <Link href={"transcribe/en-US"}>
                <button
                  type="button"
                  className="rounded-md mt-5 bg-white/10 px-3 py-2.5 text-base font-semibold text-white shadow-sm hover:bg-white/20"
                >
                  Cook from scratch
                </button>
              </Link>
            </div>

            <div className="flex flex-col items-start"></div>
          </dl>
        </div>
      </div>
      <div
        className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl xl:-top-6"
        aria-hidden="true"
      >
        <div
          className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-sky-400 to-blue-500 opacity-30"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
    </div>
  )
}
