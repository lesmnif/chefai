import Head from "next/head"
import { useEffect, useState } from "react"
import Link from "next/link"
import dynamic from "next/dynamic"
import Loader from "../components/Loader"
import GetTimers from "../functions/GetTimers"
import MainBox from "../components/MainBox"
import { examples } from "../../examples"
import ParseRecipe from "../functions/ParseRecipe"

const RecipeSelection = dynamic(() => import("../components/RecipeSelected"), {
  ssr: false,
})

export default function Home({ supabaseClient }) {
  const [result, setResult] = useState()
  const [query, setQuery] = useState("")
  const [gettingResponse, setGettingResponse] = useState(false)
  const [recipe, setRecipe] = useState(null)
  const [recipeInfo, setRecipeInfo] = useState(null)

  async function handleSubmitButton(query) {
    if (query.length < 5) {
      return alert("Your request must have at least 5 characters.")
    }
    try {
      setGettingResponse(true)
      const response = await fetch("/api/singleRecipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: query }),
      })

      const data = await response.json()
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        )
      }
      console.log("Everything went smoothly!", data.result)
      const recipe = ParseRecipe(data.result)
      setRecipeInfo(data.result)
      setRecipe(recipe)
      console.log("this is my recipe", recipe)
    } catch (error) {
      setGettingResponse(false)
      // Consider implementing your own error handling logic here
      console.error(error)
      alert(error.message)
    }
  }

  return (
    <div>
      <Head>
        <title>ChefAI</title>
      </Head>
      {recipe ? (
        <RecipeSelection
          ingredients={recipe.ingredients}
          steps={recipe.instructions}
          recipeInfo={recipeInfo}
          language={"en-US"}
        />
      ) : (
        <div className=" py-28 px-24">
          <header className="absolute inset-x-0 top-0 z-50">
            <nav
              className="flex items-center justify-between p-6 lg:px-8"
              aria-label="Global"
            >
              {/* <div className="flex lg:flex-1">
                <a href="#" className="-m-1.5 p-1.5">
                  <span className="sr-only">Your Company</span>
                  <img
                    className="h-8 w-auto"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                    alt=""
                  />
                </a>
              </div> */}
              <div className="flex lg:hidden">
                <button
                  type="button"
                  className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                  onClick={() => setMobileMenuOpen(true)}
                >
                  <span className="sr-only">Open main menu</span>
                </button>
              </div>
              <div className="hidden lg:flex lg:gap-x-12"></div>
              <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                <button
                  onClick={() => {
                    supabaseClient.auth.signOut()
                  }}
                  className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-500"
                >
                  Log out <span aria-hidden="true">&rarr;</span>
                </button>
              </div>
            </nav>
          </header>
          {/* <h1 className=" mb-10 text-lg font-bold tracking-tight text-gray-900 sm:text-lg">
            If you know what you want to cook just tell me and I can start
            helping you
          </h1>
          <div>
            <div className="mt-2">
              <p className="flex mb-10">
                <input
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
              </p>
            </div>
          </div>
          <h1 className=" mb-10 text-lg font-bold tracking-tight text-gray-900 sm:text-lg">
            Or else
          </h1>
          <Link href={"transcribe/en-US"}>
            <button className="rounded-full  bg-blue-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-blue-600">
              Help me choose a recipe
            </button>
          </Link> */}
          <MainBox
            query={query}
            setQuery={setQuery}
            handleSubmitButton={handleSubmitButton}
            setGettingResponse={setGettingResponse}
            gettingResponse={gettingResponse}
          />
        </div>
      )}
    </div>
  )
}
