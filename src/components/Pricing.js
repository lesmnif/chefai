import { CheckIcon } from '@heroicons/react/20/solid'
import { checkout } from '../functions/checkout'

const tiers = [
  {
    name: 'Premium',
    nameEs: 'Premium',
    id: 'tier-premium',
    priceMonthly: '$5',
    priceMonthlyEs: '5€',
    description: 'Unlimited recipe access and enhanced features.',
    descriptionEs: 'Acceso ilimitado a recetas y funciones mejoradas.',
    features: [
      'Access to unlimited recipes',
      'Recipes based on cooking preferences, dietary restrictions or ingredients at hand',
      'Hands-free voice assistant',
      'Save unlimited recipes for later',
      'Share recipes with friends and family',
    ],
    featuresEs: [
      'Acceso a un número ilimitado de recetas',
      'Recetas personalizadas según preferencias culinarias, restricciones dietéticas o ingredientes disponibles',
      'Asistente de voz manos libres',
      'Guarda un número ilimitado de recetas para más tarde',
      'Comparte recetas con amigos y familiares',
    ],
    featured: true,
  },
  {
    name: 'Basic',
    nameEs: 'Básico',
    id: 'tier-basic',
    priceMonthly: 'Free',
    priceMonthlyEs: 'Gratis',
    description: 'Limited recipe acces and basic fetures.',
    descriptionEs: 'Acceso limitado a recetas y funciones básicas.',
    features: [
      '2 recipes per month',
      'Hands-free voice assistant',
      'Recipes based on cooking preferences, dietary restrictions or ingredients at hand.',
    ],
    featuresEs: [
      '2 recetas por mes',
      'Asistente de voz manos libres',
      'Recetas personalizadas según preferencias de cocina, restricciones dietéticas o ingredientes disponibles',
    ],
    featured: false,
  },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Pricing({ language }) {
  return (
    <div className="relative isolate bg-white px-6 py-12 sm:py-20 lg:px-8">
      <div className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl" aria-hidden="true">
        <div
          className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-sky-400 to-blue-600 opacity-30"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
      <div className="mx-auto max-w-2xl text-center lg:max-w-4xl">
        {/* <h2 className="text-base font-semibold leading-7 text-indigo-600">Pricing</h2> */}
        <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          {/* The right price for you, whoever you are */}
          {language === 'es-ES' ? 'Precio asequible para todos.' : 'Affordable price for everyone.'}
        </p>
      </div>
      <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
        {language === 'es-ES'
          ? 'Recetas personalizadas y asistencia manos libres mientras cocinas.'
          : 'Personalized recipes, and Hands-free assistance while cooking.'}
        <br />
        {language === 'es-ES'
          ? 'Sorprende a todos llevando tu cocina al siguiente nivel.'
          : 'Amaze everyone by taking your culinary skills to the next level.'}
      </p>
      <div className="mx-auto mt-12 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-16 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
        {tiers.map((tier, tierIdx) => (
          <div
            key={tier.id}
            className={classNames(
              tier.featured ? 'relative bg-gray-900 shadow-2xl' : 'bg-white/60 sm:mx-8 lg:mx-0',
              tier.featured
                ? ''
                : tierIdx === 0
                ? 'rounded-t-3xl sm:rounded-b-none lg:rounded-tr-none lg:rounded-bl-3xl'
                : 'sm:rounded-t-none lg:rounded-tr-3xl lg:rounded-bl-none',
              'rounded-3xl p-8 ring-1 ring-gray-900/10 sm:p-10'
            )}
          >
            <h3
              id={tier.id}
              className={classNames(
                tier.featured ? 'text-indigo-400' : 'text-indigo-600',
                'text-base font-semibold leading-7'
              )}
            >
              {language === 'es-ES' ? tier.nameEs : tier.name}
            </h3>
            <p className="mt-4 flex items-baseline gap-x-2">
              <span
                className={classNames(
                  tier.featured ? 'text-white' : 'text-gray-900',
                  'text-5xl font-bold tracking-tight'
                )}
              >
                {language === 'es-ES' ? tier.priceMonthlyEs : tier.priceMonthly}
              </span>
              {tier.featured && (
                <span className={classNames(tier.featured ? 'text-gray-400' : 'text-gray-500', 'text-base')}>
                  {language === 'es-ES' ? '/mes' : '/month'}
                </span>
              )}
            </p>
            <p className={classNames(tier.featured ? 'text-gray-300' : 'text-gray-600', 'mt-6 text-base leading-7')}>
              {language === 'es-ES' ? tier.descriptionEs : tier.description}
            </p>
            <ul
              role="list"
              className={classNames(
                tier.featured ? 'text-gray-300' : 'text-gray-600',
                'mt-8 space-y-3 text-sm leading-6 sm:mt-10'
              )}
            >
              {tier.features.map((feature, index) => (
                <li key={feature} className="flex gap-x-3">
                  <CheckIcon
                    className={classNames(tier.featured ? 'text-indigo-400' : 'text-indigo-600', 'h-6 w-5 flex-none')}
                    aria-hidden="true"
                  />
                  {language === 'es-ES' ? tier.featuresEs[index] : feature}
                </li>
              ))}
            </ul>
            {tier.featured && (
              <p
                onClick={() => {
                  checkout({
                    lineItems:[
                      {
                        price: "price_1N6ijGJmDxNp2tRinvsM3quj",
                        quantity: 1
                      }
                    ]
                  })}}
                aria-describedby={tier.id}
                className={classNames(
                  tier.featured
                    ? 'bg-indigo-500 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-indigo-500 hover:cursor-pointer'
                    : 'text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300 focus-visible:outline-indigo-600 hover:cursor-pointer',
                  'mt-8 block rounded-md py-2.5 px-3.5 text-center text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10'
                )}
              >
                {language === 'es-ES' ? 'Empieza hoy' : 'Get started today'}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
