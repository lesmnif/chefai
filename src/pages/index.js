import Head from "next/head"
import { useState } from "react"
import styles from "../styles/Home.module.css"
import Link from "next/link"
import dynamic from "next/dynamic"

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

  const Loader = () => {
    return (
      <div className="flex">
        <svg
          aria-hidden="true"
          role="status"
          className="inline w-5 h-5 mt-0.5 mr-3 text-gray-200 animate-spin dark:text-gray-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="#1C64F2"
          />
        </svg>
        Loading...
      </div>
    )
  }

  return (
    <div>
      <Head>
        <title>ChefAI</title>
      </Head>
      {base64 ? (
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
          {/* <Link href={"transcribe/en-US"}>
            <button className="rounded-full  bg-blue-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-blue-600">
              Help me choose a recipe
            </button>
          </Link> */}
        </main>
      )}
    </div>
  )
}
