import Head from "next/head"
import { useEffect, useState } from "react"
import styles from "../styles/Home.module.css"
import Link from "next/link"
import dynamic from "next/dynamic"
import Loader from "../components/Loader"
import GetTimers from "../functions/GetTimers"

const Recipe = dynamic(() => import("../components/Recipe"), {
  ssr: false,
})

export default function Home() {
  const [question, setQuestion] = useState("")
  const [result, setResult] = useState()
  const [query, setQuery] = useState("")
  const [gettingResponse, setGettingResponse] = useState(false)
  const [base64, setBase64img] = useState(null)

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
      const json = JSON.parse(data.result)
      setResult(json)
      fetchImage(json.recipeName)
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
      {result ? (
        <Recipe
          steps={result.steps}
          ingredients={result.ingredients}
          recipeName={result.recipeName}
          base64={base64}
          language={"en-US"}
        />
      ) : (
        <main className={styles.main}>
          <h1 className=" mb-10 text-lg font-bold tracking-tight text-gray-900 sm:text-lg">
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
          </Link>
        </main>
      )}
    </div>
  )
}
