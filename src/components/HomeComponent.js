import Head from 'next/head'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import Loader from '../components/Loader'
import GetTimers from '../functions/GetTimers'
import MainBox from '../components/MainBox'
import { examples } from '../../examples'
import ParseRecipe from '../functions/ParseRecipe'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { Dialog } from '@headlessui/react'
import { useUser } from '@supabase/auth-helpers-react'
import { toast } from 'react-hot-toast'
import getFirstTwoChars from '../functions/firstTwoChars'


const RecipeSelection = dynamic(() => import('../components/RecipeSelected'), {
  ssr: false,
})

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const navigation = []
export default function Home({ supabaseClient, session }) {
  const [result, setResult] = useState()
  const [query, setQuery] = useState('')
  const [language, setLanguage] = useState(null)
  const [system, setSystem] = useState(null)
  const [trueUsername, setTrueUsername] = useState('')
  const [gettingResponse, setGettingResponse] = useState(false)
  const [recipe, setRecipe] = useState(null)
  const [recipeInfo, setRecipeInfo] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedCheckboxLanguage, setSelectedCheckboxLanguage] = useState(null)
  const [selectedCheckboxSystem, setSelectedCheckboxSystem] = useState(null)
  const [username, setUsername] = useState('')

  console.log('here', language, system)

  useEffect(() => {
    getProfile()
  }, [session])

  async function updateUsername(username) {
    try {
      const updates = {
        id: session.user.id,
        username: username,
        updated_at: new Date().toISOString(),
      }

      let { data, error } = await supabaseClient.from('profiles').upsert(updates)
      if (error) throw error
      toast.success(language === 'es' ? 'Nombre actualizado' : 'Name updated!')
      setTimeout(function () {
        window.location.reload()
      }, 1000)
    } catch (error) {
      alert(language === 'es' ? 'Error actualizando' : 'Error updating the data!')
      console.log(error)
    }
  }
  async function updateLanguage(language) {
    try {
      const updates = {
        id: session.user.id,
        language: language,
        updated_at: new Date().toISOString(),
      }

      let { error } = await supabaseClient.from('profiles').upsert(updates)
      if (error) throw error
      toast.success(language === 'es' ? 'Idioma actualizado' : 'Language updated!')
      setTimeout(function () {
        window.location.reload()
      }, 1000)
    } catch (error) {
      alert(language === 'es' ? 'Error actualizando' : 'Error updating the data!')
      console.log(error)
    }
  }

  async function updateSystem(system) {
    try {
      const updates = {
        id: session.user.id,
        system: system,
        updated_at: new Date().toISOString(),
      }

      let { error } = await supabaseClient.from('profiles').upsert(updates)
      if (error) throw error
      toast.success(
        language === 'es' ? 'Medidas de los ingredientes actualizadas' : 'Ingredients measure system updated!'
      )
      setTimeout(function () {
        window.location.reload()
      }, 1000)
    } catch (error) {
      alert(language === 'es' ? 'Error actualizando' : 'Error updating the data!')
      console.log(error)
    }
  }

  async function getProfile() {
    try {
      let { data, error, status } = await supabaseClient
        .from('profiles')
        .select(`username, language, system`)
        .eq('id', session?.user?.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setTrueUsername(data.username)
        setSelectedCheckboxLanguage(data.language)
        setLanguage(data.language)
        setSystem(data.system)
        setSelectedCheckboxSystem(data.system)
      }
    } catch (error) {
      console.log(error)
    } finally {
    }
  }

  const handleCheckboxChangeLanguage = (event) => {
    setSelectedCheckboxLanguage(event.target.value)
  }

  const handleCheckboxChangeSystem = (event) => {
    setSelectedCheckboxSystem(event.target.value)
  }

  async function handleSubmitButton(query) {
    if (query.length < 5) {
      return alert(
        language === 'es'
          ? 'Su solicitud debe tener al menos 5 caracteres.'
          : 'Your request must have at least 5 characters.'
      )
    }
    try {
      setGettingResponse(true)
      const response = await fetch('/api/singleRecipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query, language: language, system: system, username: trueUsername }),
      })

      const data = await response.json()
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`)
      }
      console.log('Everything went smoothly!', data.result)
      const recipe = ParseRecipe(data.result, language)
      setRecipeInfo(data.result)
      setRecipe(recipe)
      console.log('this is my recipe', recipe)
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
          language={language === 'es' ? 'es-ES' : 'en-US'}
        />
      ) : (
        language && (
          <div className="lg:py-24 lg:px-20 py-20">
            <header className="absolute inset-x-0 top-0 z-50">
              <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
                <div className="flex lg:flex-1">
                  {' '}
                  <Link href="https://ko-fi.com/bogdan_codes" className="-m-1.5 p-1.5 font-bold text-lg ">
                   
                      <button
                        type="button"
                        className="transition transform hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:transform-none inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 mt-1 px-1.5  text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        <img title="ko-fi" src="/ko-fi.png" className="h-8 w-8" />
                        {language === 'es' ? '¡Apóyame en Ko-Fi!' : 'Support me on Ko-Fi!'}
                      </button>
                  </Link>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                    onClick={() => setMobileMenuOpen(true)}
                  >
                    <span className="sr-only">Open main menu</span>
                    <Bars3Icon className="h-6 w-6 hover:text-indigo-600" aria-hidden="true" />
                  </button>
                </div>
                <div className="hidden lg:flex lg:gap-x-12"></div>
                {/* <SlideOver/> */}
              </nav>
              <Dialog as="div" className="" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
                <div className="fixed inset-0 z-50" />
                <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                  <div className="flex items-center justify-end">
                    {/* <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <img
                  className="h-8 w-auto"
                  src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                  alt=""
                />
              </a> */}
                    <button
                      type="button"
                      className="-m-2.5 rounded-md p-2.5 text-gray-700"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon className="h-6 w-6 hover:text-indigo-600" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="mt-6 flow-root">
                    <div className="-my-6 divide-y divide-gray-500/10">
                      <div className="space-y-2 py-3 font-extrabold text-lg">Settings</div>
                      <div className="py-6 flex-col">
                        <div>
                          <h1 className="font-bold">{language === 'es' ? 'Nombre:' : 'Name:'}</h1>
                          <div className="relative flex items-start my-3 ml-5">
                            <div>
                              <div className=" flex rounded-md shadow-sm">
                                <div className="relative flex flex-grow items-stretch focus-within:z-10">
                                  <input
                                    type="text"
                                    name="username"
                                    id="username"
                                    value={username}
                                    onChange={(event) => setUsername(event.target.value)}
                                    className="block w-full rounded-none rounded-l-md border-0 py-1.5 pl-5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    placeholder="John Smith"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => updateUsername(username)}
                                  className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-white bg-indigo-600  hover:bg-indigo-500 ring-1 ring-inset "
                                >
                                  {language === 'es' ? 'Guardar' : 'Update'}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h1 className="font-bold">{language === 'es' ? 'Idioma' : 'Language:'}</h1>
                          <div className="relative flex items-start my-3 ml-5">
                            <div className="flex h-6 items-center">
                              <input
                                id="spanish"
                                aria-describedby="language-spanish"
                                name="spanish"
                                value="es"
                                type="checkbox"
                                checked={selectedCheckboxLanguage === 'es'}
                                onChange={handleCheckboxChangeLanguage}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 hover:cursor-pointer"
                              />
                            </div>
                            <div className="ml-3 text-sm leading-6">
                              <label htmlFor="spanish" className="font-medium text-gray-900">
                                {language === 'es' ? 'Español' : 'Spanish'}
                              </label>{' '}
                            </div>
                          </div>
                          <div className="relative flex items-start mt-2 ml-5">
                            <div className="flex h-6 items-center">
                              <input
                                id="english"
                                aria-describedby="language-english"
                                name="english"
                                value="en"
                                type="checkbox"
                                checked={selectedCheckboxLanguage === 'en'}
                                onChange={handleCheckboxChangeLanguage}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 hover:cursor-pointer"
                              />
                            </div>
                            <div className="ml-3 text-sm leading-6">
                              <label htmlFor="english" className="font-medium text-gray-900">
                                {language === 'es' ? 'Inglés' : 'English'}
                              </label>{' '}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => updateLanguage(selectedCheckboxLanguage)}
                            className="rounded bg-indigo-600 px-2 py-1 mt-5 ml-5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          >
                            {language === 'es' ? 'Guardar' : 'Update'}
                          </button>
                        </div>
                        <div className="">
                          <h1 className="font-bold mt-7">
                            {' '}
                            {language === 'es' ? 'Medidas de los ingredientes:' : 'Ingredients Measures:'}
                          </h1>
                          <div className="relative flex items-start my-3 ml-5">
                            <div className="flex h-6 items-center">
                              <input
                                id="metric"
                                aria-describedby="metric-system"
                                name="metric"
                                value="metric"
                                type="checkbox"
                                checked={selectedCheckboxSystem === 'metric'}
                                onChange={handleCheckboxChangeSystem}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 hover:cursor-pointer"
                              />
                            </div>
                            <div className="ml-3 text-sm leading-6">
                              <label htmlFor="metric" className="font-medium text-gray-900">
                                {language === 'es' ? 'Sistema métrico (15 gramos)' : 'Metric System (15 grams)'}
                              </label>{' '}
                            </div>
                          </div>
                          <div className="relative flex items-start mt-2 ml-5">
                            <div className="flex h-6 items-center">
                              <input
                                id="imperial"
                                aria-describedby="imperial-system"
                                name="imperial"
                                value="imperial"
                                type="checkbox"
                                checked={selectedCheckboxSystem === 'imperial'}
                                onChange={handleCheckboxChangeSystem}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 hover:cursor-pointer"
                              />
                            </div>
                            <div className="ml-3 text-sm leading-6">
                              <label htmlFor="imperial" className="font-medium text-gray-900">
                                {language === 'es' ? 'Sistema imperial (1/2 onzas)' : 'Imperial System (1/2 ounces) '}
                              </label>{' '}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => updateSystem(selectedCheckboxSystem)}
                            className="rounded bg-indigo-600 px-2 py-1 mt-5 ml-5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          >
                            {language === 'es' ? 'Guardar' : 'Update'}
                          </button>
                        </div>
                        <div className="absolute left-8 bottom-10">
                          <p className="font-bold"> Support, feedback or bugs: </p>
                          <p>
                            <a href="mailto:support@cheffyai.com" className="hover:text-indigo-600">
                              support@cheffyai.com
                            </a>
                          </p>
                        </div>

                        <div>
                          <div className="absolute right-8 bottom-8">
                            <button
                              onClick={() => {
                                supabaseClient.auth.signOut()
                              }}
                              className="px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-100 hover:text-indigo-600 rounded-lg"
                            >
                              Log out
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Dialog>
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
            {language && (
              <MainBox
                language={language}
                query={query}
                setQuery={setQuery}
                handleSubmitButton={handleSubmitButton}
                setGettingResponse={setGettingResponse}
                gettingResponse={gettingResponse}
              />
            )}
          </div>
        )
      )}
    </div>
  )
}
