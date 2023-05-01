import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import {
  ArrowPathIcon,
  Bars3Icon,
  CloudArrowUpIcon,
  FingerPrintIcon,
  LockClosedIcon,
  XMarkIcon,
  MicrophoneIcon,
  LifebuoyIcon,
  PuzzlePieceIcon,
  ChatBubbleBottomCenterIcon,
  ChatBubbleLeftEllipsisIcon,
  ChatBubbleBottomCenterTextIcon,
} from '@heroicons/react/24/outline'
import { CheckIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'
import getFirstTwoChars from '../functions/firstTwoChars'

const features = [
  {
    name: 'Personalized Recipe Suggestions',
    nameEs: 'Sugerencias de recetas personalizadas',
    href: '#',
    descriptionEs: `Cuéntanos tus preferencias y los ingredientes disponibles, y te sugeriremos recetas especialmente para ti.`,
    description: "Tell us your preferences and available ingredients and we'll suggest recipes just for you.",
    icon: PuzzlePieceIcon,
  },
  {
    name: 'Step-by-Step Guidance',
    nameEs: 'Guía Paso a Paso',
    href: '#',
    descriptionEs: `Obtén instrucciones claras y guía mientras cocinas, para que puedas concentrarte en crear comidas deliciosas.`,
    description: 'Get clear instructions and guidance while you cook, so you can focus on making delicious meals.',
    icon: ChatBubbleBottomCenterTextIcon,
  },
  {
    name: 'Real Time Assistance',
    nameEs: 'Asistencia en Tiempo Real',
    href: '#',
    descriptionEs:
      'Nuestra asistente de cocina impulsada por inteligencia artificial está siempre disponible para ayudar, sin importar lo que estés cocinando.',
    description: "Our AI-powered cooking assistant is always available to help, no matter what you're making.",
    icon: MicrophoneIcon,
  },
]

export default function Landing({ supabaseClient, session }) {
  const language = getFirstTwoChars(navigator.language)

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="bg-white">
      {/* Header */}
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
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
          <div className="lg:flex lg:flex-1 lg:justify-end">
            <Link href="/signin" className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-500">
              {language === 'es' ? 'Inicia sesión' : 'Log in'}{' '}
              <span className="ml-0.5" aria-hidden="true">
                &rarr;
              </span>
            </Link>
          </div>
        </nav>
      </header>

      <main className="isolate lg:py-5 py-10">
        {/* Hero section */}
        <div className="relative pt-14">
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
          <div className="my-7">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-2xl text-center">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                  {language === 'es'
                    ? `IA manos libres para cocinar platos deliciosos.
`
                    : 'Hands-free AI that helps you cook tasty food.'}
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  {language === 'es'
                    ? ' ¡Dile adiós a las recetas aburridas y hola a Cheffy AI!'
                    : 'Say goodbye to boring recipes and hello to Cheffy AI!'}
                  <br />{' '}
                  {language === 'es'
                    ? `Un asistente de cocina en tiempo real que te ayuda a no volver a quedarte sin ideas de comidas. Con la guía de manos libres, cocinar nunca ha sido tan fácil.`
                    : `A real-time cooking assistant that helps you never run out of meal ideas again. With hands-free
                  guidance, cooking has never been easier.`}{' '}
                  🙌
                </p>
                <div className=" flex items-center justify-center gap-x-6">
                  <Link
                    href="/signup"
                    className="rounded-md bg-gradient-to-r from-blue-500 via-blue-700 to-gray-600 opacity-90 text-white  px-3.5 py-2.5 my-8 text-sm font-semibold shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 hover:from-blue-600 hover:via-blue-800 hover:to-gray-700"
                  >
                    {language === 'es' ? 'Regístrate' : 'Get started and sign up'}
                  </Link>
                  {/* <a
                    href="/transcribe/en-US"
                    className="text-sm font-semibold leading-6 text-gray-900"
                  >
                    Learn more <span aria-hidden="true">→</span>
                  </a> */}
                </div>
              </div>
            </div>
          </div>
          <div
            className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-r from-sky-400 to-blue-500 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
            />
          </div>
        </div>
        <section
          className="relative z-10 mx-auto mt-8 max-w-md px-6 sm:max-w-3xl lg:max-w-7xl lg:px-8"
          aria-labelledby="contact-heading"
        >
          <div className="grid grid-cols-1 gap-y-20 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-0">
            {features.map((link) => (
              <div key={link.name} className="flex flex-col rounded-2xl bg-white shadow-xl">
                <div className="relative flex-1 px-6 pb-8 pt-16 md:px-8">
                  <div className="absolute top-0 inline-block -translate-y-1/2 transform rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 p-5 shadow-lg">
                    <link.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-medium text-slate-900">{language === 'es' ? link.nameEs : link.name}</h3>
                  <p className="mt-4 text-base text-slate-500">
                    {language === 'es' ? link.descriptionEs : link.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
