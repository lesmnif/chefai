import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/24/outline'
import Loader from './Loader'
import { toast } from 'react-hot-toast'
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ModalRecipes({
  userId,
  system,
  open,
  setOpen,
  recipes,
  language,
  selectedRecipe,
  handleCookRecipe,
  setSelectedRecipe,
  generatingRecipe,
  query,
}) {
  const handleStartCooking = () => {
    if (!selectedRecipe && selectedRecipe !== 0) {
      return toast.error(language === 'es-ES' ? 'Debes selecionar una receta' : 'You must select a recipe')
    }
    console.log(recipes[selectedRecipe].recipeName)
    const recipeName = recipes[selectedRecipe].recipeName
    handleCookRecipe(recipeName, language, system, userId)
  }

  const handleModalClose = () => {
    // Do nothing when called
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleModalClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div>
                  <div className="mx-auto flex items-center justify-center">
                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900 text-center">
                      {language === 'es-ES'
                        ? 'Aquí tienes un par de recetas, escoge una! '
                        : 'Here are some recipe ideas, choose one!'}{' '}
                      <p className=" font-normal mt-4"> {query}</p>
                    </Dialog.Title>
                  </div>
                  {recipes.length !== 4 && (
                    <p className="flex text-center items-center justify-center mt-5">
                      <Loader language={language} />
                    </p>
                  )}
                  <div className="mt-3 text-center sm:mt-5 ">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {recipes.map((recipe, index) => (
                        <div
                          onClick={() => setSelectedRecipe(index)}
                          key={index}
                          className={
                            selectedRecipe === index
                              ? 'relative flex hover:cursor-pointer items-center space-x-3 rounded-lg border border-gray-300 bg-indigo-200 px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400'
                              : 'relative flex hover:cursor-pointer items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400'
                          }
                        >
                          <div className="min-w-0 flex-1">
                            <a className="focus:outline-none">
                              <span className="absolute inset-0" aria-hidden="true" />
                              <p className="text-sm font-medium text-gray-900">{recipe.recipeName}</p>
                              <p className="truncate text-sm text-gray-500">{recipe.cookingTime} ⏱️</p>
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {recipes.length === 4 && (
                    <div className="mt-10 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                      <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                        onClick={() => handleStartCooking()}
                      >
                        {language === 'es-ES' ? 'Empezar a cocinar' : 'Start Cooking'}
                      </button>
                      <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                        onClick={() => setOpen(false)}
                      >
                        {language === 'es-ES' ? 'Probar otra idea' : 'Try another idea'}
                      </button>
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
